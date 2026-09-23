import { buildResult } from "./visibility-check-results.mjs";

const root = document.querySelector("#results-content");
let result;
let notes;
try {
  notes = JSON.parse(sessionStorage.getItem("waia:visibility-check"));
  result = buildResult(notes.answers);
} catch {
  root.innerHTML = `<h2>Your result is not available in this tab.</h2><p>Complete the check to create a fresh result.</p><a class="btn primary dark-on-light" href="/workplace-ai-visibility-check/check/">Start the check</a>`;
  document.querySelector(".result-details").hidden = true;
  document.querySelector(".check-bridge").hidden = true;
  document.querySelector("#result-interpretation").textContent = "Your answers stay in the browser tab where you completed the check.";
}

if (result) {
  document.querySelector("#result-headline").textContent = result.headline;
  document.querySelector("#result-interpretation").textContent = result.interpretation;
  document.querySelector("#result-meaning").textContent = result.meaning;
  document.querySelector("#result-start").textContent = result.start;
  document.querySelector("#result-then").textContent = `Then: ${result.then}`;

  const list = document.querySelector("#priority-findings");
  for (const finding of result.priorities) {
    const item = document.createElement("li");
    const heading = document.createElement("h3");
    const body = document.createElement("p");
    heading.textContent = finding.title;
    body.textContent = finding.body;
    item.append(heading, body);
    list.append(item);
  }
  const capabilities = document.querySelector("#result-capabilities");
  for (const capability of result.capabilities) {
    const item = document.createElement("li");
    item.textContent = capability;
    capabilities.append(item);
  }
  for (const key of ["example", "focus"]) {
    if (!notes[key]) continue;
    const destination = document.querySelector(`#note-${key}`);
    destination.textContent = notes[key];
    destination.closest(".result-note").hidden = false;
  }
}

document.querySelector("#print-result").addEventListener("click", () => window.print());
