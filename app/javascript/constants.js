export const KEY_ACTIONS = ["KA1", "KA2", "KA3"];

export const EXPERTISES = [
  "youth", "sport", "digital", "inclusion", "environment",
  "culture", "education", "health", "entrepreneurship", "rural",
];

export const PROJECT_TYPES = [
  ["youth_exchange", "Youth exchange"],
  ["training_course", "Training course"],
  ["job_shadowing", "Job shadowing"],
  ["strategic_partnership", "Strategic partnership"],
  ["other", "Other"],
];

// Erasmus+ programme countries (partner countries can be added later)
export const COUNTRIES = [
  ["AT", "Austria"], ["BE", "Belgium"], ["BG", "Bulgaria"], ["HR", "Croatia"],
  ["CY", "Cyprus"], ["CZ", "Czechia"], ["DK", "Denmark"], ["EE", "Estonia"],
  ["FI", "Finland"], ["FR", "France"], ["DE", "Germany"], ["GR", "Greece"],
  ["HU", "Hungary"], ["IS", "Iceland"], ["IE", "Ireland"], ["IT", "Italy"],
  ["LV", "Latvia"], ["LI", "Liechtenstein"], ["LT", "Lithuania"], ["LU", "Luxembourg"],
  ["MT", "Malta"], ["NL", "Netherlands"], ["MK", "North Macedonia"], ["NO", "Norway"],
  ["PL", "Poland"], ["PT", "Portugal"], ["RO", "Romania"], ["RS", "Serbia"],
  ["SK", "Slovakia"], ["SI", "Slovenia"], ["ES", "Spain"], ["SE", "Sweden"],
  ["TR", "Türkiye"],
];

export const countryName = (code) => COUNTRIES.find(([c]) => c === code)?.[1] || code;
