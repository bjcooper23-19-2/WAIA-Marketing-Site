import { areas } from "./visibility-check-results.mjs";

const form = document.querySelector("#visibility-form");
const steps = [...form.querySelectorAll("[data-step]")];
const progress = document.querySelector("#check-progress");
const progressBar = document.querySelector("#check-progress-bar");
const error = document.querySelector("#check-error");
let current = 0;

function showStep(index, focusHeading = false) {
  current = index;
  steps.forEach((step, stepIndex) => {
    step.hidden = stepIndex !== index;
  });
  progress.textContent = `Step ${index + 1} of ${steps.length}`;
  progressBar.value = index + 1;
  error.hidden = true;
  if (focusHeading) steps[index].querySelector("h2").focus();
}

function validateStep() {
  for (const fieldset of steps[current].querySelectorAll(
    "fieldset[data-question]",
  )) {
    if (!fieldset.querySelector("input:checked")) {
      error.textContent =
        "Choose an answer for each question before continuing.";
      error.hidden = false;
      fieldset.querySelector("input").focus();
      return false;
    }
  }
  return true;
}

form.addEventListener("click", (event) => {
  const next = event.target.closest("[data-next]");
  const back = event.target.closest("[data-back]");
  if (next && validateStep()) showStep(current + 1, true);
  if (back) showStep(current - 1, true);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateStep()) return;
  if (current < steps.length - 1) {
    showStep(current + 1, true);
    return;
  }
  const data = new FormData(form);
  const answers = Object.fromEntries(areas.map(({ id }) => [id, data.get(id)]));
  // Only answer categories and optional work notes stay in this browser tab.
  try {
    sessionStorage.setItem(
      "waia:visibility-check",
      JSON.stringify({
        answers,
        example: String(data.get("example") || "")
          .trim()
          .slice(0, 180),
        focus: String(data.get("focus") || "")
          .trim()
          .slice(0, 180),
      }),
    );
  } catch {
    error.textContent =
      "Your browser could not keep this result for the next page. Please allow session storage and try again.";
    error.hidden = false;
    error.focus();
    return;
  }
  location.assign("/workplace-ai-visibility-check/results/");
});

showStep(0);
