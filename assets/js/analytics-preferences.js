(() => {
  const status = document.getElementById("analytics-status");
  const objectButton = document.getElementById("object-to-analytics");
  const allowButton = document.getElementById("allow-analytics");
  const key = "waia:analytics-objection";

  const show = (objected) => {
    status.textContent = objected
      ? "Analytics is off for this browser."
      : "Analytics is on for this browser.";
    objectButton.hidden = objected;
    allowButton.hidden = !objected;
  };

  try {
    show(window.localStorage.getItem(key) === "1");
  } catch {
    status.textContent =
      "Browser storage is unavailable, so analytics is off. This browser cannot save a preference.";
    objectButton.hidden = true;
    allowButton.hidden = true;
    return;
  }

  objectButton.addEventListener("click", () => {
    try {
      window.localStorage.setItem(key, "1");
      show(true);
    } catch {
      status.textContent =
        "This browser could not save your objection. Please allow site storage and try again.";
    }
  });

  allowButton.addEventListener("click", () => {
    try {
      window.localStorage.removeItem(key);
      show(false);
    } catch {
      status.textContent = "This browser could not update your preference.";
    }
  });
})();
