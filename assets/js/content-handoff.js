(() => {
  const routeMatch = window.location.pathname.match(
    /^\/go\/content\/([a-z0-9][a-z0-9-]{0,63})\/$/,
  );
  const contentId = routeMatch ? routeMatch[1] : null;
  const destinationPath = document.documentElement.dataset.destinationPath;
  const source = document.documentElement.dataset.source;

  const sourcePattern = /^(ap|gm|19|li)$/;
  const safeDestination =
    typeof destinationPath === "string" &&
    destinationPath.startsWith("/") &&
    !destinationPath.startsWith("//");

  const destination = new URL(
    safeDestination ? destinationPath : "/",
    window.location.origin,
  );

  if (sourcePattern.test(source || "")) destination.searchParams.set("s", source);
  if (contentId) destination.searchParams.set("c", contentId);

  let forwarded = false;
  let observer;
  let timeout;

  const forward = () => {
    if (forwarded) return;
    forwarded = true;
    clearTimeout(timeout);
    observer?.disconnect();
    window.location.replace(destination.pathname + destination.search);
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

  timeout = setTimeout(forward, 1500);

  try {
    observer = new PerformanceObserver((list) => {
      if (list.getEntries().some(isAnalyticsRequest)) forward();
    });
    observer.observe({ type: "resource", buffered: true });
  } catch {
    // Older browsers use the bounded fail-open path.
  }

  document
    .querySelector("[data-cf-beacon]")
    ?.addEventListener("error", forward);
})();
