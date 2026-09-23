const endpointPath = "/api/visibility-check/redeem";
const tokenPattern = /^[0-9a-f]{96}$/;
const appsScriptPattern =
  /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
const contentPath = "/macros/echo";

const responseLocation = (response) => {
  try {
    const url = new URL(response.url);
    if (url.hostname === "script.google.com" && /\/exec$/.test(url.pathname))
      return { hostname: "script.google.com", path_category: "apps-script-exec" };
    if (url.hostname === "script.googleusercontent.com" && url.pathname === contentPath)
      return { hostname: "script.googleusercontent.com", path_category: "content-service-echo" };
  } catch (_) {
    // Mock responses and failed fetches may not have a URL.
  }
  return { hostname: "other-or-unknown", path_category: "other-or-unknown" };
};

const logUpstreamFailure = (category, response, length = null) => {
  const location = response ? responseLocation(response) : {
    hostname: "unavailable",
    path_category: "unavailable",
  };
  const mimeType = response?.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  console.warn("visibility-check redemption upstream failure", {
    error_category: category,
    status: response?.status ?? null,
    ...location,
    content_type: mimeType && /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/.test(mimeType)
      ? mimeType
      : "other-or-unknown",
    response_length: length ?? (Number(response?.headers.get("content-length")) || null),
  });
};

const jsonResponse = (ok, status = 200, extraHeaders = {}) =>
  Response.json(
    { ok },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        ...extraHeaders,
      },
    },
  );

const validConfiguration = (env) =>
  typeof env.APPS_SCRIPT_REDEMPTION_URL === "string" &&
  appsScriptPattern.test(env.APPS_SCRIPT_REDEMPTION_URL) &&
  typeof env.APPS_SCRIPT_PROXY_SECRET === "string" &&
  env.APPS_SCRIPT_PROXY_SECRET.length >= 32;

export async function handleRequest(request, env, fetchUpstream = fetch) {
  const url = new URL(request.url);
  if (url.pathname !== endpointPath) return jsonResponse(false, 404);
  if (request.method !== "POST") {
    return jsonResponse(false, 405, { Allow: "POST" });
  }
  if (
    !/^application\/json(?:\s*;|$)/i.test(
      request.headers.get("content-type") || "",
    )
  ) {
    return jsonResponse(false, 400);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 1000) return jsonResponse(false, 400);

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return jsonResponse(false, 400);
  }
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    typeof body.token !== "string" ||
    !tokenPattern.test(body.token)
  ) {
    return jsonResponse(false, 400);
  }
  if (!validConfiguration(env)) return jsonResponse(false, 503);

  let upstream;
  try {
    const upstreamUrl = new URL(env.APPS_SCRIPT_REDEMPTION_URL);
    upstreamUrl.searchParams.set("action", "redeem");
    upstream = await fetchUpstream(upstreamUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: body.token,
        proxy_secret: env.APPS_SCRIPT_PROXY_SECRET,
      }),
      redirect: "manual",
    });
  } catch (_) {
    logUpstreamFailure("post_fetch_failed");
    return jsonResponse(false, 502);
  }

  if (upstream.status !== 302 && upstream.status !== 303) {
    logUpstreamFailure("unexpected_post_status", upstream);
    return jsonResponse(false, 502);
  }

  let contentUrl;
  try {
    contentUrl = new URL(upstream.headers.get("location"));
    if (
      contentUrl.protocol !== "https:" ||
      contentUrl.hostname !== "script.googleusercontent.com" ||
      contentUrl.pathname !== contentPath ||
      contentUrl.port ||
      contentUrl.username ||
      contentUrl.password
    ) throw new Error("Unexpected ContentService redirect");
  } catch (_) {
    logUpstreamFailure("invalid_redirect", upstream);
    return jsonResponse(false, 502);
  }

  try {
    upstream = await fetchUpstream(contentUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      redirect: "manual",
    });
  } catch (_) {
    logUpstreamFailure("content_fetch_failed");
    return jsonResponse(false, 502);
  }
  if (upstream.status !== 200) {
    logUpstreamFailure("unexpected_content_status", upstream);
    return jsonResponse(false, 502);
  }
  if (!/^application\/json(?:\s*;|$)/i.test(upstream.headers.get("content-type") || "")) {
    logUpstreamFailure("unexpected_content_type", upstream);
    return jsonResponse(false, 502);
  }

  const responseLength = Number(upstream.headers.get("content-length") || 0);
  if (responseLength > 1000) {
    logUpstreamFailure("content_too_large", upstream, responseLength);
    return jsonResponse(false, 502);
  }

  let result;
  let responseText;
  try {
    responseText = await upstream.text();
    if (responseText.length > 1000) throw new Error("Content too large");
    result = JSON.parse(responseText);
  } catch (_) {
    logUpstreamFailure("invalid_content_body", upstream, responseText?.length ?? null);
    return jsonResponse(false, 502);
  }
  if (
    !result ||
    typeof result !== "object" ||
    Array.isArray(result) ||
    Object.keys(result).length !== 1 ||
    typeof result.ok !== "boolean"
  ) {
    logUpstreamFailure("invalid_content_shape", upstream, responseText.length);
    return jsonResponse(false, 502);
  }
  return jsonResponse(result.ok);
}

export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  },
};
