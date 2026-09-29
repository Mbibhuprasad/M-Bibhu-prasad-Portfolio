/**
 * Single entry point for site content. Each domain lives in src/data/* —
 * edit content there; components keep importing from "@/lib/data".
 */
export { profile, navLinks, footerLinks } from "@/data/profile";
export { projects, type Project, type ProjectTheme } from "@/data/projects";
export { experience, timeline, clientWork, type Experience } from "@/data/experience";
export { education } from "@/data/education";
export { certifications, learning, type Certification } from "@/data/certifications";
export { technologies, skillGroups, type Tech, type Tier, type SkillGroup } from "@/data/skills";

export const services = [
  { n: "01", title: "Full-Stack Web Applications", desc: "From interface to database, built as one coherent system." },
  { n: "02", title: "SaaS Platforms", desc: "Multi-role products with auth, dashboards and billing-ready structure." },
  { n: "03", title: "Healthcare Software", desc: "Patient, doctor and hospital workflows handled with care." },
  { n: "04", title: "Business Management Systems", desc: "POS, inventory, sales and operations tools for real teams." },
  { n: "05", title: "REST APIs & Backend Systems", desc: "Clean, secure Node.js + Express services and data models." },
  { n: "06", title: "AI-Powered Applications", desc: "LLM features, RAG and assistants integrated into products." },
  { n: "07", title: "Admin Dashboards", desc: "Dense data made readable, with roles and controls." },
  { n: "08", title: "Cloud Deployment", desc: "Shipping to production on AWS with media on Cloudinary." },
];
