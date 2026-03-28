export const PREDEFINED_SKILLS = [
  "Patient Care",
  "Medical Documentation",
  "Clinical Knowledge",
  "Vital Signs Monitoring",
  "Medication Administration",
  "IV Therapy",
  "Diagnosis & Treatment",
  "Patient Consultation",
  "Telemedicine",
  "Drug Dispensing",
  "Pharmacology",
  "Inventory Management",
  "Laboratory Testing",
  "Pathology",
  "Microbiology",
  "Infection Control",
  "Emergency Response",
  "Case Management"
];

export const skillOptions = PREDEFINED_SKILLS.map(skill => ({
  value: skill,
  label: skill
}));
