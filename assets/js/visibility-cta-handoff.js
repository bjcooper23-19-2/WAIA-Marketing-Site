(() => {
  const destination = "/see-waia/";
  let forwarded = false;
  let observer;
  let timeout;
  const forward = () => {
    if (forwarded) return;
    forwarded = true;
    clearTimeout(timeout);
    observer?.disconnect();
    location.replace(destination);
  };

  // Use the existing Cloudflare page view for aggregate CTA measurement.
  timeout = setTimeout(forward, 1500);
  try {
    observer = new PerformanceObserver((list) => {
      if (
        list.getEntries().some((entry) => {
          const url = new URL(entry.name, location.href);
          return (
            ["xmlhttprequest", "fetch", "beacon"].includes(
              entry.initiatorType,
            ) &&
            url.pathname === "/cdn-cgi/rum" &&
            [location.origin, "https://cloudflareinsights.com"].includes(
              url.origin,
            )
          );
        })
      )
        forward();
    });
    observer.observe({ type: "resource", buffered: true });
  } catch {
    // Continue within the bounded delay if Resource Timing is unavailable.
  }
  document
    .querySelector("[data-cf-beacon]")
    ?.addEventListener("error", forward);
})();
