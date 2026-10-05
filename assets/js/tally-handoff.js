(() => {
  const sources = new Set(["ap", "gm", "19", "li"]);
  const safeContentPattern = /^[a-z0-9][a-z0-9-]{0,63}$/;
  const match = window.location.pathname.match(/^\/go\/see-waia\/([^/]+)\/$/);
  const source = match && sources.has(match[1]) ? match[1] : null;
  const params = new URLSearchParams(window.location.search);
  const contentValues = params.getAll("c");
  const content =
    contentValues.length === 1 && safeContentPattern.test(contentValues[0])
      ? contentValues[0]
      : null;
  const destination = new URL("https://tally.so/r/objzGM");
  destination.searchParams.set("product", "WAIA");
  destination.searchParams.set(
    "enquiry_type",
    params.get("enquiry_type") === "procurement" ? "procurement" : "walkthrough",
  );
  if (source) destination.searchParams.set("s", source);
  if (content) destination.searchParams.set("c", content);

  let forwarded = false;
  let observer;
  let timeout;
  const forward = () => {
    if (forwarded) return;
    forwarded = true;
    clearTimeout(timeout);
    observer?.disconnect();
    window.location.replace(destination.toString());
  };
  const isAnalyticsRequest = (entry) => {
    const url = new URL(entry.name, window.location.href);
    return (
      ["xmlhttprequest", "fetch", "beacon"].includes(entry.initiatorType) &&
      url.pathname === "/cdn-cgi/rum" &&
      [window.location.origin, "https://cloudflareinsights.com"].includes(
        url.origin,
      )
    );
  };

  // Wait for the existing beacon's request, not merely its script download.
  // Analytics blockers/network failures must never trap an enquiry.
  timeout = setTimeout(forward, 1500);
  try {
    observer = new PerformanceObserver((list) => {
      if (list.getEntries().some(isAnalyticsRequest)) forward();
    });
    observer.observe({ type: "resource", buffered: true });
  } catch {
    // Older browsers use the same bounded fail-open path.
  }
  document
    .querySelector("[data-cf-beacon]")
    ?.addEventListener("error", forward);
})();
