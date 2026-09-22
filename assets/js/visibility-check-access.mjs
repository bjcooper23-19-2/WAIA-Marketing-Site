import { redemptionEndpoint } from "./visibility-check-access-config.mjs";

const tokenPattern = /^[0-9a-f]{96}$/;
const checkPath = "/workplace-ai-visibility-check/check/";
const callbackName = "waiaVisibilityAccessCallback";
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

action.addEventListener("click", () => {
  if (!tokenPattern.test(token) || action.disabled) return;
  if (
    !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(
      redemptionEndpoint,
    )
  ) {
    status.textContent =
      "Access is temporarily unavailable. Please try again later.";
    return;
  }

  action.disabled = true;
  status.textContent = "Opening your check…";
  let script;
  const cleanup = () => {
    clearTimeout(timeout);
    delete window[callbackName];
    script?.remove();
  };
  const timeout = setTimeout(() => {
    cleanup();
    action.disabled = false;
    status.textContent = "Access could not be confirmed. Please try again.";
  }, timeoutMs);

  window[callbackName] = (result) => {
    cleanup();
    if (result && result.ok === true) {
      location.assign(checkPath);
      return;
    }
    showInactive();
  };

  const url = new URL(redemptionEndpoint);
  url.searchParams.set("action", "redeem");
  url.searchParams.set("token", token);
  url.searchParams.set("callback", callbackName);
  url.searchParams.set("_", Date.now().toString());
  script = document.createElement("script");
  script.src = url.href;
  script.referrerPolicy = "no-referrer";
  script.addEventListener("error", () => {
    cleanup();
    action.disabled = false;
    status.textContent = "Access could not be confirmed. Please try again.";
  });
  document.head.append(script);
});
