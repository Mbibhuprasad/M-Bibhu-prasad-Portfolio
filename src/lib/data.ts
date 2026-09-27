export const profile = {
  name: "Bibhu Prasad Mahapatra",
  shortName: "BIBHU.PRASAD",
  role: "Full-Stack Developer",
  email: "mbibhuprasad2003@gmail.com",
  location: "Bhubaneswar, Odisha, India",
  // TODO: replace with real profile URLs and resume file (place resume at /public/resume.pdf)
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",
  resume: "/resume.pdf",
};

export const navLinks = [
  { label: "WORK", href: "#work" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "STACK", href: "#stack" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
] as const;

export type Tier = "primary" | "secondary" | "ai";

export type Tech = {
  id: string;
  name: string;
  tier: Tier;
  category: string;
  usedIn: string[];
  experience: string;
};

export const technologies: Tech[] = [
  { id: "react", name: "React.js", tier: "primary", category: "Frontend Development", usedIn: ["Biryani Express", "Indian Health Software", "Omniorra"], experience: "1+ year" },
  { id: "next", name: "Next.js", tier: "primary", category: "Full-Stack Framework", usedIn: ["Indian Health Software", "AI Healthcare SaaS"], experience: "1+ year" },
  { id: "node", name: "Node.js", tier: "primary", category: "Backend Runtime", usedIn: ["Indian Health Software", "Biryani Express", "Omniorra", "Spanco Tek", "DG Shipping"], experience: "1+ year" },
  { id: "express", name: "Express.js", tier: "primary", category: "API & Server Framework", usedIn: ["Indian Health Software", "Biryani Express", "Omniorra", "Spanco Tek", "DG Shipping"], experience: "1+ year" },
  { id: "mongodb", name: "MongoDB", tier: "primary", category: "Document Database", usedIn: ["Biryani Express", "Omniorra", "Spanco Tek", "DG Shipping"], experience: "1+ year" },
  { id: "mysql", name: "MySQL", tier: "primary", category: "Relational Database", usedIn: ["Indian Health Software", "AI Healthcare SaaS"], experience: "1+ year" },
  { id: "js", name: "JavaScript", tier: "secondary", category: "Core Language", usedIn: ["All projects"], experience: "1+ year" },
  { id: "ts", name: "TypeScript", tier: "secondary", category: "Typed Language", usedIn: ["This portfolio"], experience: "Growing" },
  { id: "rest", name: "REST APIs", tier: "secondary", category: "API Design", usedIn: ["Omniorra", "Indian Health Software", "Biryani Express"], experience: "1+ year" },
  { id: "jwt", name: "JWT", tier: "secondary", category: "Authentication", usedIn: ["Indian Health Software", "Biryani Express", "Omniorra", "DG Shipping"], experience: "1+ year" },
  { id: "aws", name: "AWS", tier: "secondary", category: "Cloud & Deployment", usedIn: ["Production deployments"], experience: "Working knowledge" },
  { id: "github", name: "GitHub", tier: "secondary", category: "Version Control & CI", usedIn: ["All projects"], experience: "1+ year" },
  { id: "rn", name: "React Native", tier: "secondary", category: "Mobile Development", usedIn: ["Mobile experiments"], experience: "Working knowledge" },
  { id: "python", name: "Python", tier: "secondary", category: "Scripting & AI tooling", usedIn: ["AI experiments"], experience: "Working knowledge" },
  { id: "openai", name: "OpenAI API", tier: "ai", category: "LLM Integration", usedIn: ["AI Healthcare SaaS"], experience: "Applied" },
  { id: "gemini", name: "Gemini API", tier: "ai", category: "LLM Integration", usedIn: ["AI Healthcare SaaS"], experience: "Applied" },
  { id: "rag", name: "RAG", tier: "ai", category: "Retrieval-Augmented Generation", usedIn: ["AI Healthcare SaaS"], experience: "Applied" },
  { id: "agents", name: "AI Agents", tier: "ai", category: "Agentic Workflows", usedIn: ["AI Healthcare SaaS"], experience: "Exploring" },
];

export type ProjectTheme = "health" | "restaurant" | "booking" | "lab" | "maritime" | "ai";

export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  theme: ProjectTheme;
  accent: string;
  summary: string;
  features: string[];
  stack: string[];
  caseStudy: {
    problem: string;
    solution: string;
    challenges: string[];
    contribution: string[];
    services: string[];
    database: string;
  };
};

export const projects: Project[] = [
  {
    slug: "indian-health-software",
    number: "01",
    title: "Indian Health Software",
    category: "Healthcare Management SaaS",
    theme: "health",
    accent: "#22d3ee",
    summary: "A healthcare management platform connecting doctors, patients and clinic operations in one system.",
    features: ["Doctor & patient portals", "Appointments", "Medical records", "Health analytics", "Media storage"],
    stack: ["Next.js", "React", "Node.js", "Express.js", "MySQL", "Sequelize", "Cloudinary", "JWT"],
    caseStudy: {
      problem: "Clinics were juggling patient data, appointments and records across disconnected tools, making care slower and data harder to trust.",
      solution: "A single SaaS platform with role-based portals for doctors, patients and administrators, backed by a relational data model and secure APIs.",
      challenges: ["Modelling relational medical data cleanly with Sequelize", "Role-based access for doctors, patients and admins", "Handling medical media uploads reliably"],
      contribution: ["Full-stack feature development across frontend and API", "REST endpoints and database models", "JWT authentication and authorisation flows", "Dashboard and portal UI"],
      services: ["Cloudinary", "AWS", "JWT", "REST APIs"],
      database: "MySQL",
    },
  },
  {
    slug: "biryani-express",
    number: "02",
    title: "Biryani Express",
    category: "Restaurant Management System",
    theme: "restaurant",
    accent: "#f5a524",
    summary: "End-to-end restaurant operations: point of sale, live orders, inventory, QR ordering and financials.",
    features: ["POS", "Live orders", "Inventory", "QR ordering", "Sales", "Expense tracking"],
    stack: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "QR Ordering"],
    caseStudy: {
      problem: "Orders, stock and daily finances were tracked by hand, causing mistakes during rush hours.",
      solution: "A restaurant dashboard with POS, table QR ordering, inventory tracking and sales & expense reports.",
      challenges: ["Keeping orders in sync between tables, kitchen and counter", "Inventory that updates with each order", "Simple UI for fast-paced staff"],
      contribution: ["POS and order flow", "QR ordering experience", "Inventory, sales and expense modules", "API and MongoDB schema design"],
      services: ["JWT", "REST APIs", "QR"],
      database: "MongoDB",
    },
  },
  {
    slug: "omniorra",
    number: "03",
    title: "Omniorra",
    category: "Multi-Service Booking Platform",
    theme: "booking",
    accent: "#8b5cf6",
    summary: "One platform for hotels, vehicle rentals, food ordering, events and e-commerce.",
    features: ["Hotel booking", "Vehicle rental", "Food ordering", "Event management", "E-commerce"],
    stack: ["React", "Node.js", "Express.js", "MongoDB", "REST APIs", "JWT"],
    caseStudy: {
      problem: "Users had to switch between separate apps for stays, travel, food and events.",
      solution: "A modular multi-service platform where each service shares accounts, payments flow and a common booking engine.",
      challenges: ["A shared data model across very different services", "Availability and booking conflicts", "Keeping a large UI consistent"],
      contribution: ["Service modules for booking flows", "REST API design", "Authentication with JWT", "Reusable UI components"],
      services: ["JWT", "REST APIs"],
      database: "MongoDB",
    },
  },
  {
    slug: "spanco-tek",
    number: "04",
    title: "Spanco Tek",
    category: "Lab Equipment Management System",
    theme: "lab",
    accent: "#34d399",
    summary: "Catalog, inventory and inquiry management for laboratory equipment.",
    features: ["Equipment catalog", "Inventory", "Product catalog", "Inquiries", "Administration"],
    stack: ["React", "Node.js", "Express.js", "MongoDB"],
    caseStudy: {
      problem: "Product information and customer inquiries for lab equipment lived in spreadsheets and email.",
      solution: "A product catalog with an admin panel for inventory and a structured inquiry pipeline.",
      challenges: ["Flexible product specifications", "Admin workflows for non-technical staff"],
      contribution: ["Catalog and product pages", "Admin panel", "Inquiry management", "API and database"],
      services: ["REST APIs"],
      database: "MongoDB",
    },
  },
  {
    slug: "dg-shipping",
    number: "05",
    title: "DG Shipping",
    category: "Maritime Management System",
    theme: "maritime",
    accent: "#38bdf8",
    summary: "Records, certificates, colleges and documents for the maritime domain.",
    features: ["Ship records", "Maritime records", "Medical certificates", "Maritime colleges", "Blogs", "Documents"],
    stack: ["React", "Node.js", "Express.js", "MongoDB", "JWT"],
    caseStudy: {
      problem: "Maritime records, certifications and documents were scattered and hard to verify.",
      solution: "A central system for maritime records, medical certificates, colleges, content and document management.",
      challenges: ["Document management at scale", "Secure access to sensitive records"],
      contribution: ["Record and certificate modules", "Document management", "Blog/content module", "JWT-secured APIs"],
      services: ["JWT", "REST APIs"],
      database: "MongoDB",
    },
  },
  {
    slug: "ai-healthcare-saas",
    number: "06",
    title: "AI Healthcare & Hospital Management SaaS",
    category: "AI-powered Hospital Platform",
    theme: "ai",
    accent: "#a78bfa",
    summary: "Hospital operations plus AI health tracking, diet planning and an AI assistant.",
    features: ["AI health tracking", "Diet planning", "Medical reports", "E-prescriptions", "Doctor/patient management", "Appointments", "Ambulance management", "AI assistant"],
    stack: ["Next.js", "React", "Node.js", "Express.js", "MySQL", "AI APIs"],
    caseStudy: {
      problem: "Hospitals need operations software, while patients want guidance between visits.",
      solution: "A hospital management SaaS combined with AI features for health tracking, diet plans and an assistant.",
      challenges: ["Integrating LLM APIs safely into a medical context", "Many roles and workflows in one product"],
      contribution: ["Hospital modules: appointments, prescriptions, ambulance", "AI assistant and diet planning integration", "Next.js frontend and Express APIs"],
      services: ["AI APIs", "JWT", "REST APIs", "AWS"],
      database: "MySQL",
    },
  },
];

export const timeline = [
  { year: "2025", role: "MERN Stack Intern", org: "Daya Consultancy Services Pvt. Ltd.", period: "Jun 2025 — Aug 2025", present: false, tags: ["MongoDB", "Express", "React", "Node.js"] },
  { year: "2025", role: "Software Developer", org: "Daya Consultancy Services Pvt. Ltd.", period: "Aug 2025 — Present", present: true, tags: ["Production systems", "Full-stack"] },
  { year: "2026", role: "Full-Stack Software Development", org: "Production Systems", period: "2026 →", present: false, tags: ["SaaS", "Healthcare", "Business Applications", "AI Integrations"] },
];

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

export const education = [
  { degree: "Master of Computer Application", school: "NIIS Institute of Business Administration", period: "2024 — 2026" },
  { degree: "B.Sc. Computer Science", school: "NIIS Institute of Information Science and Management", period: "2021 — 2024" },
];
