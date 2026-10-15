(() => {
  // A saved objection prevents the Cloudflare script from being requested.
  // If storage cannot be read, leave analytics off.
  try {
    if (window.localStorage.getItem("waia:analytics-objection") === "1") return;
  } catch {
    return;
  }

  const beacon = document.createElement("script");
  beacon.type = "module";
  beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
  beacon.dataset.cfBeacon = JSON.stringify({
    token: "9fa2711aed53428980734989cf03178a",
  });
  document.body.appendChild(beacon);
})();
