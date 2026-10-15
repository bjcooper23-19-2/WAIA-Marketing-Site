(() => {
  const sourceParam = "s";
  const approvedSources = new Set(["ap", "gm", "19", "li"]);
  const tallyOrigin = "https://tally.so";
  const tallyPath = "/r/objzGM";

  const isApprovedSource = (value) => approvedSources.has(value);
  const params = new URLSearchParams(window.location.search);
  const incomingSourceValues = params.getAll(sourceParam);
  const incomingSource =
    incomingSourceValues.length === 1 ? incomingSourceValues[0] : null;
  const source = isApprovedSource(incomingSource) ? incomingSource : null;

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    try {
      const url = new URL(href, window.location.href);

      if (url.origin === tallyOrigin && url.pathname === tallyPath) {
        const route = new URL(
          `/go/see-waia/${source || "direct"}/`,
          window.location.origin,
        );
        if (url.searchParams.get("enquiry_type") === "procurement") {
          route.searchParams.set("enquiry_type", "procurement");
        }
        link.setAttribute("href", route.pathname + route.search);
      }
    } catch {
      // Leave malformed or non-standard href values untouched.
    }
  });
})();
