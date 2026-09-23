export const areas = [
  { id: "use", label: "Where AI is used" },
  { id: "work", label: "Work affected" },
  { id: "data", label: "Information entered" },
  { id: "review", label: "Human review and judgement" },
  { id: "consistency", label: "Ways of working across teams" },
  { id: "managers", label: "Manager visibility" },
  { id: "capacity", label: "Time and capacity" },
];

const findings = {
  visibility: ["Management visibility is fragmented", "Your answers suggest managers have examples of AI use, but the picture varies by team or task. That makes it harder to see where support, review or shared practice would help most.", "Evidence for managers"],
  discovery: ["Start with the work people are doing", "You cannot yet reliably describe where AI enters recurring work. Without a real example, it is difficult to decide what needs checking or improving.", "Practical application in real work"],
  information: ["Information use needs a clearer picture", "Your answers do not yet establish what information enters AI tools across common tasks. Looking at one real workflow will show where clearer expectations would help.", "Consistent ways of working"],
  review: ["Review and judgement depend on local practice", "Some checking may happen, but your answers suggest the review point varies by person or task. This may make it harder to know when a human decision is needed.", "Human review and judgement"],
  consistency: ["Useful practice may stay within teams", "Teams appear to approach similar AI-assisted work differently without comparing the effect. Useful methods may remain local instead of becoming repeatable practice.", "Consistent ways of working"],
  capacity: ["Time saved is not yet deliberate value", "You have examples of time saved, but the net effect and destination of that capacity are less clear. Gains may disappear into general workload rather than improving chosen work.", "Turning AI-created capacity into useful work"],
  scaling: ["Turn strong examples into shared practice", "Your answers describe good visibility and review in current work. Comparing examples across teams can show what is worth repeating and where local differences still matter.", "Consistent ways of working"],
  value: ["Show what applied AI changes", "A clear picture of use is a strong foundation. The next question is which examples improve the work after checking and rework, and which are worth expanding.", "Practical application in real work"],
  managerDiscovery: ["Build a view managers can use", "Managers need direct examples from the people doing the work before they can describe AI use across teams. That evidence will help them choose where to look next.", "Evidence for managers"],
  informationDiscovery: ["Trace information in one task", "As you map a real workflow, note what information people enter into AI tools. That gives you a concrete basis for deciding where clearer expectations are needed.", "Consistent ways of working"],
  practice: ["Compare practice across teams", "Once review and capacity are clearer in one workflow, compare a similar task elsewhere. The comparison may reveal useful differences or a practice worth sharing.", "Consistent ways of working"],
  capacityOpportunity: ["Make capacity gains deliberate", "Even with a clear picture of AI use, test the net time gained after checking and rework. Decide which useful work that capacity should support before scaling the approach.", "Turning AI-created capacity into useful work"],
};

const unclearFinding = {
  review: ["The human review point is unclear", "Your answers cannot yet identify a reliable point of human review for AI-assisted work. This may make it harder to know when a person must check or decide before others use the output.", "Human review and judgement"],
  capacity: ["The effect on capacity is unclear", "You cannot yet tell whether AI saves net time after checking and rework, or where any freed capacity goes. That makes value harder to assess deliberately.", "Turning AI-created capacity into useful work"],
};

// Each pattern gives one conclusion and an ordered set of three operational findings.
const patterns = {
  limited: {
    headline: "You need a clearer picture of where AI is entering work.",
    interpretation: "Your answers suggest there is too little direct evidence to describe current AI use reliably. Start with one real workflow before deciding which wider practices to change.",
    meaning: "The immediate gap is discovery. A concrete example will give managers a sound basis for discussing information, review and value.",
    start: "Choose one recurring task and ask the people doing it where AI enters, what information they use and what happens to the output.",
    then: "Compare that account with what the manager understands today.",
    priorities: ["discovery", "managerDiscovery", "informationDiscovery"],
  },
  contrast: {
    headline: "You can see AI use, but have less clarity about what happens around it.",
    interpretation: "Your answers suggest tools and affected work are comparatively visible. The strongest contrast is weaker evidence of human review or what happens to time saved. This may make it harder to turn visible activity into dependable practice and value.",
    meaning: "Knowing where AI is used is a foundation. The missing link is how people check its contribution and decide what the resulting capacity is for.",
    start: "Take one visible AI-assisted workflow and document who checks the output, where human judgement sits and what happens to any time saved.",
    then: "Compare the account with another team doing similar work.",
    priorities: ["review", "capacity", "practice"],
  },
  fragmented: {
    headline: "You have activity, but not yet a consistent operating picture.",
    interpretation: "Your answers suggest AI is already part of work, but management visibility varies by team or workflow. Human review and useful ways of working may depend on local habits. That makes it harder to decide where to improve practice or deliberately use capacity gained.",
    meaning: "The issue is not a lack of AI activity. It is a lack of shared visibility and repeatability around that activity.",
    start: "Choose one recurring workflow where AI is already used. Document how AI contributes, who reviews the output, where human judgement sits and what happens to any time saved.",
    then: "Compare that workflow across two teams to see what differs.",
    priorities: ["visibility", "review", "capacity"],
  },
  underused: {
    headline: "You have useful controls, but less evidence of applied value.",
    interpretation: "Your answers suggest managers can see AI use and describe review, yet its contribution to recurring work is less clear. The next opportunity is to test where that capability improves a real task.",
    meaning: "Visibility and review create a sound base. Value becomes clearer when a specific workflow is compared before and after AI contributes.",
    start: "Choose one recurring task with a clear outcome. Compare the work with and without AI, including checking and rework.",
    then: "Share the useful approach with a second team.",
    priorities: ["value", "scaling", "capacityOpportunity"],
  },
  emerging: {
    headline: "You have the foundations of a more repeatable way of working.",
    interpretation: "Your answers suggest comparatively strong visibility and human review. The next test is whether useful approaches are shared across teams and whether time gained is put to deliberate use.",
    meaning: "A clearer operating picture creates room to scale what works. Real examples, comparison across teams and evidence of value will keep that picture current.",
    start: "Select one AI-assisted workflow with a useful outcome and compare how two teams carry it out, including review and the use of any time saved.",
    then: "Agree which parts should become common practice.",
    priorities: ["scaling", "value", "capacityOpportunity"],
  },
  visibility: {
    headline: "AI activity is ahead of management visibility.",
    interpretation: "Your answers suggest AI already affects work, while managers cannot yet describe its use consistently. That limits their ability to identify where review or shared practice matters most.",
    meaning: "Examples of use exist, but they have not become a dependable view of the work. Start with direct observation and make that picture shareable.",
    start: "Map one recurring AI-assisted workflow with the people doing it, then ask the manager to describe the same workflow and compare the two accounts.",
    then: "Record where review and information use need clearer expectations.",
    priorities: ["visibility", "review", "consistency"],
  },
  assurance: {
    headline: "AI is affecting work faster than review practice is settling.",
    interpretation: "Your answers suggest AI contributes to meaningful tasks, but checking and human judgement are less consistent. The practical gap is knowing where a person must review or decide before the work is used.",
    meaning: "The value of visible AI use depends on dependable human judgement at the points that matter.",
    start: "Choose one AI-assisted output used by others. Name who checks it, what they check and where a person makes the final decision.",
    then: "Compare that approach with another similar task.",
    priorities: ["review", "consistency", "capacity"],
  },
  inconsistent: {
    headline: "You can see AI use, but practice differs across teams.",
    interpretation: "Your answers suggest visible activity without a shared approach to similar work. Comparing real examples can reveal which differences are useful and which make quality or review harder to manage.",
    meaning: "Visibility becomes more useful when good local practice is tested, shared and repeated where appropriate.",
    start: "Compare two teams doing a similar AI-assisted task. Record differences in process, review and outcome, then agree what is worth repeating.",
    then: "Check whether managers can describe the agreed approach.",
    priorities: ["consistency", "review", "value"],
  },
  reinvestment: {
    headline: "AI may save time, but the value of that time is unclear.",
    interpretation: "Your answers suggest AI is used in work, while the net time gained and its destination are less visible. Without that decision, efficiency may be absorbed by the general workload.",
    meaning: "A time-saved example becomes useful evidence when checking, rework and the next use of capacity are considered together.",
    start: "Take one recurring task. Compare time saved with checking and rework, then decide where any freed capacity should go.",
    then: "Review whether that intended benefit happened.",
    priorities: ["capacity", "value", "consistency"],
  },
};

export function buildResult(answers) {
  if (!answers || areas.some(({ id }) => !["visible", "partial", "unclear"].includes(answers[id]))) {
    throw new Error("Complete each question before viewing your result.");
  }
  const count = (status) => areas.filter(({ id }) => answers[id] === status).length;
  const weak = (id) => answers[id] !== "visible";
  let pattern;
  if (count("unclear") >= 4 || ["use", "work"].every((id) => answers[id] === "unclear")) pattern = "limited";
  else if (["use", "work", "data"].filter((id) => answers[id] === "visible").length >= 2 && ["review", "capacity"].every((id) => answers[id] === "unclear")) pattern = "contrast";
  else if (count("partial") >= 4) pattern = "fragmented";
  else if (["use", "managers", "review"].every((id) => answers[id] === "visible") && weak("work")) pattern = "underused";
  else if (count("visible") >= 5) pattern = "emerging";
  else if (answers.work !== "unclear" && ["use", "managers"].some((id) => answers[id] === "unclear")) pattern = "visibility";
  else if (answers.work !== "unclear" && weak("review")) pattern = "assurance";
  else if (weak("consistency")) pattern = "inconsistent";
  else if (weak("capacity")) pattern = "reinvestment";
  else pattern = "emerging";
  const chosen = patterns[pattern];
  const priorityIds = pattern === "fragmented"
    ? [
        ["use", "managers"].some(weak) ? "visibility" : "practice",
        weak("review") ? "review" : "consistency",
        weak("capacity") ? "capacity" : weak("data") ? "information" : "value",
      ]
    : chosen.priorities;
  const priorities = [...new Set(priorityIds)].map((id) => {
    const copy = unclearFinding[id] && answers[id] === "unclear" ? unclearFinding[id] : findings[id];
    return { id, title: copy[0], body: copy[1], capability: copy[2] };
  });
  return {
    pattern,
    headline: chosen.headline,
    interpretation: chosen.interpretation,
    meaning: chosen.meaning,
    start: chosen.start,
    then: chosen.then,
    priorities,
    capabilities: [...new Set(priorities.map(({ capability }) => capability))].slice(0, 3),
  };
}
