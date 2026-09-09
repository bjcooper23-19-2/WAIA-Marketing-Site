(() => {
  const sourceParam = "s";
  const storageKey = "waia:source";
  const approvedSources = new Set(["ap", "gm", "19", "li"]);
  const tallyOrigin = "https://tally.so";
  const tallyPath = "/r/objzGM";

  const getSessionStorage = () => {
    try {
      const storage = window.sessionStorage;
      const testKey = `${storageKey}:test`;
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return storage;
    } catch {
      return null;
    }
  };

  const isApprovedSource = (value) => approvedSources.has(value);
  const storage = getSessionStorage();
  const incomingValues = new URLSearchParams(window.location.search).getAll(
    sourceParam,
  );
  const incomingSource = incomingValues.length === 1 ? incomingValues[0] : null;
  let source = null;

  if (isApprovedSource(incomingSource)) {
    source = incomingSource;
    storage?.setItem(storageKey, source);
  } else if (storage) {
    const storedSource = storage.getItem(storageKey);

    if (isApprovedSource(storedSource)) {
      source = storedSource;
    } else if (storedSource) {
      storage.removeItem(storageKey);
    }
  }

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
