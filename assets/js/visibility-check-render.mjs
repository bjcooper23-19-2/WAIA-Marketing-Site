import { buildResult, statusLabels } from "./visibility-check-results.mjs";

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
}

if (result) {
  const summary = document.createElement("p");
  summary.className = "result-intro";
  summary.textContent = result.groups.unclear.length
    ? "Some parts of current AI use remain unclear. Start with the questions below, then compare what managers know with what happens in the work."
    : result.groups.partial.length
      ? "You have a working picture in several areas. The partly visible areas are useful places to check real examples with teams."
      : "You have described a clear working picture across these areas. Keep checking it against real work as practices change.";
  root.append(summary);
  const groupsRoot = document.createElement("div");
  groupsRoot.className = "result-groups";
  root.append(groupsRoot);

  for (const status of ["visible", "partial", "unclear"]) {
    const section = document.createElement("section");
    section.className = `result-group status-${status}`;
    const heading = document.createElement("h2");
    heading.textContent = statusLabels[status];
    section.append(heading);
    const context = document.createElement("p");
    context.textContent = {
      visible:
        "You can describe recent examples here. Check that people doing the work recognise the same picture.",
      partial:
        "You have some examples, but the picture may vary by task or team.",
      unclear: "You need a real example before deciding what to change.",
    }[status];
    section.append(context);
    const list = document.createElement("ul");
    if (result.groups[status].length) {
      for (const area of result.groups[status]) {
        const item = document.createElement("li");
        item.textContent = area.label;
        list.append(item);
      }
    } else {
      const item = document.createElement("li");
      item.textContent = "No areas in this group from your answers.";
      list.append(item);
    }
    section.append(list);
    groupsRoot.append(section);
  }

  const next = document.querySelector("#next-questions");
  for (const area of result.next) {
    const item = document.createElement("li");
    item.textContent = area.next;
    next.append(item);
  }
  for (const key of ["example", "focus"]) {
    if (!notes[key]) continue;
    const destination = document.querySelector(`#note-${key}`);
    destination.textContent = notes[key];
    destination.closest(".result-note").hidden = false;
  }
}

document
  .querySelector("#print-result")
  .addEventListener("click", () => window.print());
