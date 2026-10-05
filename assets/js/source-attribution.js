(() => {
  const sourceParam = "s";
  const contentParam = "c";
  const sourceStorageKey = "waia:source";
  const contentStorageKey = "waia:content";
  const approvedSources = new Set(["ap", "gm", "19", "li"]);
  const safeContentPattern = /^[a-z0-9][a-z0-9-]{0,63}$/;
  const tallyOrigin = "https://tally.so";
  const tallyPath = "/r/objzGM";

  const getSessionStorage = () => {
    try {
      const storage = window.sessionStorage;
      const testKey = `${sourceStorageKey}:test`;
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return storage;
    } catch {
      return null;
    }
  };

  const isApprovedSource = (value) => approvedSources.has(value);
  const isSafeContent = (value) =>
    typeof value === "string" && safeContentPattern.test(value);

  const storage = getSessionStorage();
  const params = new URLSearchParams(window.location.search);
  const incomingSourceValues = params.getAll(sourceParam);
  const incomingContentValues = params.getAll(contentParam);
  const incomingSource =
    incomingSourceValues.length === 1 ? incomingSourceValues[0] : null;
  const incomingContent =
    incomingContentValues.length === 1 ? incomingContentValues[0] : null;
  let source = null;
  let content = null;

  if (isApprovedSource(incomingSource)) {
    source = incomingSource;
    storage?.setItem(sourceStorageKey, source);

    if (isSafeContent(incomingContent)) {
      content = incomingContent;
      storage?.setItem(contentStorageKey, content);
    } else {
      storage?.removeItem(contentStorageKey);
    }
  } else if (storage) {
    const storedSource = storage.getItem(sourceStorageKey);
    const storedContent = storage.getItem(contentStorageKey);

    if (isApprovedSource(storedSource)) {
      source = storedSource;
      if (isSafeContent(storedContent)) {
        content = storedContent;
      } else if (storedContent) {
        storage.removeItem(contentStorageKey);
      }
    } else {
      if (storedSource) storage.removeItem(sourceStorageKey);
      if (storedContent) storage.removeItem(contentStorageKey);
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
        if (content) route.searchParams.set(contentParam, content);
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
