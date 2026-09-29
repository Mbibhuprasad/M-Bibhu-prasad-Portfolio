export type Certification = {
  title: string;
  issuer: string;
  /** null when no issue date is on record */
  issued: string | null;
  /** only set when a real credential ID / URL exists — never invented */
  credentialId?: string;
  url?: string;
};

export const certifications: Certification[] = [
  { title: "HTML and CSS: Building a Single-Page Website", issuer: "Coursera Project Network", issued: "Mar 2025" },
  { title: "Introduction to Generative AI", issuer: "Google Cloud", issued: "Mar 2025" },
  { title: "JavaScript Algorithms and Data Structures", issuer: "freeCodeCamp", issued: "Feb 2024" },
  { title: "Responsive Web Design", issuer: "freeCodeCamp", issued: "Jan 2024" },
  { title: "Java Full Stack Development Internship / Advanced Program", issuer: "Anudip Foundation", issued: null },
];

/** Additional learning referenced on the resume. */
export const learning = ["Generative AI Specialization", "Data Structures & Algorithms", "Responsive Web Design", "Web Development"];
