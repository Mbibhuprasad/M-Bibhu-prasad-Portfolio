/**
 * primary   — daily production stack
 * secondary — used regularly / supporting tools
 * ai        — LLM & AI integration
 * exploring — actively learning; not claimed as production experience
 */
export type Tier = "primary" | "secondary" | "ai" | "exploring";

export type SkillGroup = "Core" | "Frontend" | "Backend" | "Database" | "Auth" | "Cloud" | "AI" | "3D" | "Advanced Web";

export type Tech = {
  id: string;
  name: string;
  tier: Tier;
  group: SkillGroup;
  category: string;
  usedIn: string[];
  experience: string;
  /** shown in the Technology Galaxy: on every screen, or desktop only. Omitted = data only. */
  orbit?: "all" | "desktop";
};

export const skillGroups: SkillGroup[] = ["Core", "Frontend", "Backend", "Database", "Auth", "Cloud", "AI", "3D", "Advanced Web"];

const IHS = "Indian Health System";
const BE = "Biryani Express";
const SEA = "Seafarers Association";
const SELF = "This portfolio";

export const technologies: Tech[] = [
  // ── Frontend
  { id: "react", name: "React.js", tier: "primary", group: "Frontend", category: "Frontend Development", usedIn: [BE, IHS, "Omniorra", SEA], experience: "1+ year", orbit: "all" },
  { id: "next", name: "Next.js", tier: "primary", group: "Frontend", category: "Full-Stack Framework", usedIn: [IHS, SELF], experience: "1+ year", orbit: "all" },
  { id: "html", name: "HTML5", tier: "secondary", group: "Frontend", category: "Markup", usedIn: ["All projects"], experience: "1+ year" },
  { id: "css", name: "CSS3", tier: "secondary", group: "Frontend", category: "Styling", usedIn: ["All projects"], experience: "1+ year" },
  { id: "tailwind", name: "Tailwind CSS", tier: "secondary", group: "Frontend", category: "Utility-first Styling", usedIn: [BE, "QuizChronicle", SELF], experience: "1+ year", orbit: "desktop" },
  { id: "responsive", name: "Responsive Design", tier: "secondary", group: "Frontend", category: "Mobile-first Interfaces", usedIn: ["All projects"], experience: "1+ year" },
  { id: "rn", name: "React Native", tier: "secondary", group: "Frontend", category: "Mobile Development", usedIn: ["Mobile experiments"], experience: "Working knowledge", orbit: "desktop" },

  // ── Core
  { id: "js", name: "JavaScript", tier: "secondary", group: "Core", category: "Core Language", usedIn: ["All projects"], experience: "1+ year", orbit: "all" },
  { id: "ts", name: "TypeScript", tier: "secondary", group: "Core", category: "Typed Language", usedIn: [SELF], experience: "Growing", orbit: "all" },
  { id: "python", name: "Python", tier: "secondary", group: "Core", category: "Scripting & AI tooling", usedIn: ["AI experiments"], experience: "Working knowledge", orbit: "desktop" },

  // ── Backend
  { id: "node", name: "Node.js", tier: "primary", group: "Backend", category: "Backend Runtime", usedIn: [IHS, BE, "Omniorra", "Spanco Tek", SEA], experience: "1+ year", orbit: "all" },
  { id: "express", name: "Express.js", tier: "primary", group: "Backend", category: "API & Server Framework", usedIn: [IHS, BE, "Omniorra", "Spanco Tek", SEA], experience: "1+ year", orbit: "all" },
  { id: "rest", name: "REST APIs", tier: "secondary", group: "Backend", category: "API Design", usedIn: ["Omniorra", IHS, BE, SEA], experience: "1+ year", orbit: "all" },
  { id: "websockets", name: "WebSockets", tier: "secondary", group: "Backend", category: "Real-time Communication", usedIn: ["Real-time features"], experience: "Working knowledge" },

  // ── Database
  { id: "mongodb", name: "MongoDB", tier: "primary", group: "Database", category: "Document Database", usedIn: [BE, "Omniorra", "Spanco Tek", SEA, "QuizChronicle"], experience: "1+ year", orbit: "all" },
  { id: "mysql", name: "MySQL", tier: "primary", group: "Database", category: "Relational Database", usedIn: [IHS], experience: "1+ year", orbit: "all" },
  { id: "sequelize", name: "Sequelize", tier: "secondary", group: "Database", category: "SQL ORM", usedIn: [IHS], experience: "1+ year", orbit: "desktop" },
  { id: "mongoose", name: "Mongoose", tier: "secondary", group: "Database", category: "MongoDB ODM", usedIn: ["MongoDB projects"], experience: "1+ year" },

  // ── Auth
  { id: "jwt", name: "JWT", tier: "secondary", group: "Auth", category: "Authentication", usedIn: [IHS, BE, "Omniorra", SEA], experience: "1+ year", orbit: "all" },
  { id: "rbac", name: "Role-Based Access Control", tier: "secondary", group: "Auth", category: "Authorisation", usedIn: [SEA, "Omniorra", BE], experience: "1+ year" },
  { id: "authz", name: "Authentication / Authorization", tier: "secondary", group: "Auth", category: "Security", usedIn: ["All full-stack projects"], experience: "1+ year" },

  // ── Cloud / deployment
  { id: "aws", name: "AWS", tier: "secondary", group: "Cloud", category: "Cloud & Deployment", usedIn: ["Production deployments"], experience: "Working knowledge", orbit: "all" },
  { id: "vercel", name: "Vercel", tier: "secondary", group: "Cloud", category: "Frontend Hosting", usedIn: [BE, "Daily Expenditure"], experience: "Working knowledge" },
  { id: "cloudinary", name: "Cloudinary", tier: "secondary", group: "Cloud", category: "Media Storage & Delivery", usedIn: [IHS], experience: "1+ year", orbit: "desktop" },
  { id: "github", name: "GitHub", tier: "secondary", group: "Cloud", category: "Version Control & CI", usedIn: ["All projects"], experience: "1+ year", orbit: "all" },
  { id: "cicd", name: "CI/CD", tier: "secondary", group: "Cloud", category: "Delivery Pipelines", usedIn: ["Concepts"], experience: "Concepts" },

  // ── AI
  { id: "openai", name: "OpenAI API", tier: "ai", group: "AI", category: "LLM Integration", usedIn: [`${IHS} (AI features)`], experience: "Applied", orbit: "all" },
  { id: "gemini", name: "Gemini API", tier: "ai", group: "AI", category: "LLM Integration", usedIn: [`${IHS} (AI features)`], experience: "Applied", orbit: "all" },
  { id: "rag", name: "RAG", tier: "ai", group: "AI", category: "Retrieval-Augmented Generation", usedIn: [`${IHS} (AI features)`], experience: "Applied", orbit: "all" },
  { id: "agents", name: "AI Agents", tier: "ai", group: "AI", category: "Agentic Workflows", usedIn: ["AI experiments"], experience: "Exploring", orbit: "all" },
  { id: "genai", name: "Generative AI", tier: "ai", group: "AI", category: "Generative Models", usedIn: ["Google Cloud — Introduction to Generative AI"], experience: "Applied" },
  { id: "aidev", name: "AI-assisted Development", tier: "ai", group: "AI", category: "Developer Workflow", usedIn: ["Daily workflow"], experience: "Applied" },

  // ── 3D / creative development
  { id: "three", name: "Three.js", tier: "secondary", group: "3D", category: "3D on the Web", usedIn: [SELF], experience: "Growing", orbit: "desktop" },
  { id: "r3f", name: "React Three Fiber", tier: "secondary", group: "3D", category: "Declarative 3D for React", usedIn: [SELF], experience: "Growing" },
  { id: "drei", name: "@react-three/drei", tier: "secondary", group: "3D", category: "R3F Helpers", usedIn: [SELF], experience: "Growing" },
  { id: "gsap", name: "GSAP", tier: "secondary", group: "3D", category: "Timeline Animation", usedIn: [SELF], experience: "Growing" },
  { id: "scrolltrigger", name: "GSAP ScrollTrigger", tier: "secondary", group: "3D", category: "Scroll-driven Animation", usedIn: [SELF], experience: "Growing" },
  { id: "motion", name: "Motion", tier: "secondary", group: "3D", category: "UI Animation", usedIn: ["QuizChronicle", SELF], experience: "Growing" },
  { id: "lenis", name: "Lenis", tier: "secondary", group: "3D", category: "Smooth Scrolling", usedIn: [SELF], experience: "Growing" },
  { id: "swiper", name: "Swiper", tier: "secondary", group: "3D", category: "Touch Sliders", usedIn: [SELF], experience: "Growing" },
  { id: "postprocessing", name: "Postprocessing", tier: "exploring", group: "3D", category: "Bloom, Glow & Depth Effects", usedIn: ["Learning & experiments"], experience: "Exploring" },

  // ── Advanced web — exploring, not claimed as production experience
  { id: "wasm", name: "WebAssembly", tier: "exploring", group: "Advanced Web", category: "Near-native Code in the Browser (WASM)", usedIn: ["Learning & experiments"], experience: "Exploring", orbit: "all" },
  { id: "webgl", name: "WebGL", tier: "exploring", group: "Advanced Web", category: "GPU Graphics API", usedIn: [`${SELF} (via Three.js)`], experience: "Exploring", orbit: "all" },
  { id: "glsl", name: "GLSL", tier: "exploring", group: "Advanced Web", category: "Shader Concepts", usedIn: ["Learning & experiments"], experience: "Exploring", orbit: "desktop" },
  { id: "canvas", name: "Canvas", tier: "exploring", group: "Advanced Web", category: "2D Drawing API", usedIn: [`${SELF} (generated glow textures)`], experience: "Exploring", orbit: "desktop" },
  { id: "gpu", name: "GPU-accelerated Graphics", tier: "exploring", group: "Advanced Web", category: "Rendering Performance", usedIn: ["Learning & experiments"], experience: "Exploring" },
  { id: "workers", name: "Web Workers", tier: "exploring", group: "Advanced Web", category: "Off-main-thread Work", usedIn: ["Learning & experiments"], experience: "Exploring", orbit: "desktop" },
];
