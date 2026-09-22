const endpointPath = "/api/visibility-check/redeem";
const tokenPattern = /^[0-9a-f]{96}$/;
const appsScriptPattern =
  /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;

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
      redirect: "follow",
    });
  } catch (_) {
    return jsonResponse(false, 502);
  }
  if (!upstream.ok) return jsonResponse(false, 502);

  const responseLength = Number(upstream.headers.get("content-length") || 0);
  if (responseLength > 1000) return jsonResponse(false, 502);

  let result;
  try {
    result = await upstream.json();
  } catch (_) {
    return jsonResponse(false, 502);
  }
  if (!result || typeof result !== "object" || typeof result.ok !== "boolean") {
    return jsonResponse(false, 502);
  }
  return jsonResponse(result.ok);
}

export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  },
};
