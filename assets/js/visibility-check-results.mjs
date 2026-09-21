export const areas = [
  {
    id: "use",
    label: "Where AI is used",
    next: "Ask two team leads which AI tools people use in recurring work. Compare their answers with what people doing the work describe.",
  },
  {
    id: "work",
    label: "Work affected",
    next: "Choose one recurring task and map where AI contributes, what happens before and after it, and who receives the output.",
  },
  {
    id: "data",
    label: "Information entered",
    next: "Take one real workflow and ask what information goes into the AI tool, including customer, colleague and commercially sensitive details.",
  },
  {
    id: "review",
    label: "Human review and judgement",
    next: "For one output used by others, agree who checks it, what they check and when a person makes the final judgement.",
  },
  {
    id: "consistency",
    label: "Ways of working across teams",
    next: "Compare how two people or teams handle the same AI-assisted task. Keep what works and discuss differences that affect quality or review.",
  },
  {
    id: "managers",
    label: "Manager visibility",
    next: "Ask managers for recent examples of AI-assisted work, including a correction or exception. Notice which answers are based on direct observation.",
  },
  {
    id: "capacity",
    label: "Time and capacity",
    next: "For one recurring task, compare time saved with checking and rework, then decide where any freed capacity should go.",
  },
];

export const statusLabels = {
  visible: "Visible",
  partial: "Partly visible",
  unclear: "Unclear",
};

export function buildResult(answers) {
  if (
    !answers ||
    areas.some(({ id }) => !Object.hasOwn(statusLabels, answers[id]))
  ) {
    throw new Error("Complete each question before viewing your result.");
  }

  const groups = { visible: [], partial: [], unclear: [] };
  for (const area of areas) groups[answers[area.id]].push(area);

  const priority = [
    "data",
    "review",
    "work",
    "use",
    "managers",
    "consistency",
    "capacity",
  ];
  const ordered = ["unclear", "partial"].flatMap((status) =>
    priority
      .map((id) => groups[status].find((area) => area.id === id))
      .filter(Boolean),
  );
  const next = ordered.slice(0, 4);
  if (next.length < 3) {
    next.push(
      ...areas.filter((area) => !next.includes(area)).slice(0, 3 - next.length),
    );
  }

  return { groups, next };
}
