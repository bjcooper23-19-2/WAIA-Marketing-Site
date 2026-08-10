(() => {
  const sourceParam = "s";
  const storageKey = "waia:source";
  const approvedSources = new Set(["ap", "gm", "19", "li"]);
  const tallyOrigin = "https://tally.so";
  const tallyPath = "/r/gDgbQP";

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
  const incomingSource = new URLSearchParams(window.location.search).get(
    sourceParam,
  );
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

  if (!source) return;

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    try {
      const url = new URL(href, window.location.href);

      if (url.origin === tallyOrigin && url.pathname === tallyPath) {
        url.searchParams.set(sourceParam, source);
        link.setAttribute("href", url.toString());
      }
    } catch {
      // Leave malformed or non-standard href values untouched.
    }
  });
})();
