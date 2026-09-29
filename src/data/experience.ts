export type Experience = {
  year: string;
  role: string;
  org: string;
  type: "Full-time" | "Internship" | "Freelance";
  location: string;
  period: string;
  present: boolean;
  tags: string[];
  responsibilities: string[];
  /** short lines shown on the timeline card */
  highlights: string[];
};

/** Chronological (oldest first) — the timeline reads left → right. */
export const experience: Experience[] = [
  {
    year: "2025",
    role: "MERN Stack Intern",
    org: "Daya Consultancy Services Pvt. Ltd.",
    type: "Internship",
    location: "Bhubaneswar, India",
    period: "Jun 2025 — Aug 2025",
    present: false,
    tags: ["MongoDB", "Express", "React", "Node.js"],
    responsibilities: [
      "Contributed to full-stack web application development.",
      "Worked with React.js and Node.js.",
      "Integrated APIs.",
      "Implemented frontend features.",
      "Built responsive interfaces.",
      "Debugged application issues.",
      "Collaborated with development teams.",
    ],
    highlights: ["Full-stack features with React.js & Node.js", "API integration & responsive UI"],
  },
  {
    year: "2025",
    role: "Software Developer",
    org: "Daya Consultancy Services Pvt. Ltd.",
    type: "Full-time",
    location: "Bhubaneswar, India",
    period: "Aug 2025 — Present",
    present: true,
    tags: ["Production systems", "Full-stack"],
    responsibilities: [
      "Developed responsive and scalable web applications.",
      "Built modern frontend interfaces using React.js and related technologies.",
      "Developed and integrated REST APIs.",
      "Worked with databases and backend services.",
      "Implemented authentication and role-based access.",
      "Improved application performance and user experience.",
      "Worked on real-world business and healthcare applications.",
    ],
    highlights: ["REST APIs, databases & role-based auth", "Business & healthcare applications"],
  },
];

/** Freelance / client work (dates not listed). */
export const clientWork = [
  { client: "Ortho Spine Care", location: "Bhubaneswar", work: "Healthcare Management Software", project: "healthcare-management-system" },
  { client: "Spanco Tek", location: null, work: "Laboratory Equipment / Lab Management System", project: "spanco-tek" },
];

/**
 * Shape consumed by the Timeline section: employment, then freelance / client work,
 * then the current (2026) stop. Individual client dates are not listed, so the
 * freelance entry uses the owner-provided 2025 — 2026 range; don't add finer dates without a source.
 */
export const timeline: Experience[] = [
  ...experience,
  {
    year: "2025",
    role: "Freelance / Client Projects",
    org: clientWork.map((c) => c.client).join(" · "),
    type: "Freelance",
    location: "—",
    period: "2025 — 2026",
    present: false,
    tags: ["Client work", "Healthcare", "Lab management"],
    responsibilities: clientWork.map((c) => `${c.work} — ${c.client}`),
    highlights: clientWork.map((c) => `${c.client} — ${c.work}`),
  },
  {
    year: "2026",
    role: "Full-Stack Development",
    org: "Daya Consultancy Services Pvt. Ltd.",
    type: "Full-time",
    location: "Bhubaneswar, India",
    period: "2026 — Present",
    present: true,
    tags: ["Full-stack", "Production systems"],
    responsibilities: [],
    highlights: ["Software Developer since Aug 2025", "SaaS, healthcare & business systems in production"],
  },
];
