const tokenPattern = /^[0-9a-f]{96}$/;
const checkPath = "/workplace-ai-visibility-check/check/";
const redemptionPath = "/api/visibility-check/redeem";
const timeoutMs = 20000;

const title = document.querySelector("#access-title");
const message = document.querySelector("#access-message");
const action = document.querySelector("#access-action");
const status = document.querySelector("#access-status");
const requestLink = document.querySelector("#access-request-link");
const token = new URLSearchParams(location.search).get("token") || "";

const showInactive = () => {
  title.textContent = "This access link is no longer active.";
  message.textContent =
    "The link may be invalid, expired or already used. Request a new link if you still need the Workplace AI Visibility Check.";
  action.hidden = true;
  requestLink.hidden = false;
  status.textContent = "";
};

if (!tokenPattern.test(token)) {
  showInactive();
} else {
  title.textContent = "Your Workplace AI Visibility Check is ready.";
  message.textContent =
    "Continue when you are ready. This link works once and expires seven days after your request.";
  action.hidden = false;
}

action.addEventListener("click", async () => {
  if (!tokenPattern.test(token) || action.disabled) return;

  action.disabled = true;
  status.textContent = "Opening your check…";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(redemptionPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      credentials: "same-origin",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Redemption request failed");
    const result = await response.json();
    if (result && result.ok === true) {
      location.assign(checkPath);
      return;
    }
    if (result && result.ok === false) {
      showInactive();
      return;
    }
    throw new Error("Unexpected redemption response");
  } catch (_) {
    action.disabled = false;
    status.textContent = "Access could not be confirmed. Please try again.";
  } finally {
    clearTimeout(timeout);
  }
});
