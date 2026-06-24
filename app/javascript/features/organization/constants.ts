export const KEY_ACTIONS: string[] = ["KA1", "KA2", "KA3"];

export const EXPERTISES: string[] = [
  "youth",
  "sport",
  "digital",
  "inclusion",
  "environment",
  "culture",
  "education",
  "health",
  "entrepreneurship",
  "rural",
];

export const PROJECT_TYPES: [string, string][] = [
  ["youth_exchange", "Youth exchange"],
  ["training_course", "Training course"],
  ["job_shadowing", "Job shadowing"],
  ["strategic_partnership", "Strategic partnership"],
  ["other", "Other"],
];

export const projectTypeLabel = (type: string): string =>
  PROJECT_TYPES.find(([t]) => t === type)?.[1] ?? type.replace(/_/g, " ");
