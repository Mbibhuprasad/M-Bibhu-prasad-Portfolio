// Case-study copy is a draft built from the verified feature lists — confirm wording per project before publishing.

export type ProjectTheme = "health" | "restaurant" | "booking" | "lab" | "maritime" | "ai" | "finance" | "property" | "quiz";

export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  theme: ProjectTheme;
  accent: string;
  /** primary work vs earlier / secondary projects */
  featured: boolean;
  /** client / company, when this was client work */
  client?: string;
  /** live product URL — only verified links */
  live?: string;
  /** public repository — only verified links */
  repo?: string;
  summary: string;
  /** short list for the project slider */
  features: string[];
  /** full, grouped feature map for the case study */
  modules?: { label: string; items: string[] }[];
  /** empty when the stack has not been confirmed */
  stack: string[];
  caseStudy: {
    problem: string;
    solution: string;
    challenges: string[];
    contribution: string[];
    services: string[];
    /** omitted when not confirmed — hides the architecture diagram */
    database?: string;
  };
};

export const projects: Project[] = [
  {
    slug: "indian-health-system",
    number: "01",
    title: "Indian Health System",
    category: "AI-Integrated Healthcare Platform",
    theme: "ai",
    accent: "#22d3ee",
    featured: true,
    live: "https://indiahealthsystem.com",
    summary:
      "A full-stack healthcare ecosystem connecting patients, doctors, clinics and digital healthcare services — from doctor discovery and appointments to digital prescriptions and secure medical records.",
    features: ["Doctor discovery", "Clinics", "Appointments", "Video consultation", "Digital prescriptions", "Medical records", "Medicine stores", "AI features"],
    modules: [
      { label: "Doctors & patients", items: ["Doctor management", "Patient management", "Doctor discovery — by symptom, specialty, name or city", "Verified doctors & clinics", "Admin management"] },
      { label: "Care", items: ["Appointments — online or pay-at-clinic", "Video consultation", "Digital prescriptions", "Secure medical records", "Multi-clinic support"] },
      { label: "Services", items: ["Clinic discovery", "Medicine stores", "Healthcare map", "Healthcare services"] },
      { label: "Platform", items: ["AI-based features", "Web & mobile ecosystem", "Digital healthcare"] },
      { label: "In development (announced on the live site)", items: ["Hospitals", "Diagnostic labs", "Ambulance / emergency services", "Blood banks"] },
    ],
    stack: ["Next.js", "React", "Node.js", "Express.js", "MySQL", "Sequelize", "Cloudinary", "JWT", "AI Integration"],
    caseStudy: {
      problem:
        "Finding the right doctor, booking a visit and keeping prescriptions and records together still means juggling calls, paper and disconnected tools — for patients and clinics alike.",
      solution:
        "One platform with role-based portals for patients, doctors and administrators: verified doctor and clinic discovery, appointments, video consultation, digital prescriptions and secure records on a relational data model, with AI-based features layered in.",
      challenges: [
        "Modelling relational medical data cleanly with Sequelize",
        "Role-based access for doctors, patients and admins",
        "Handling medical media uploads reliably",
        "Integrating AI features safely into a medical context",
      ],
      contribution: [
        "Full-stack feature development across frontend and API",
        "REST endpoints and database models",
        "JWT authentication and authorisation flows",
        "Dashboard and portal UI",
        "AI feature integration",
      ],
      services: ["Cloudinary", "JWT", "REST APIs", "AI APIs"],
      database: "MySQL",
    },
  },
  {
    slug: "omniorra",
    number: "02",
    title: "Omniorra",
    category: "Multi-Service Booking & Business Platform",
    theme: "booking",
    accent: "#8b5cf6",
    featured: true,
    summary: "One platform for e-commerce, hotel booking, vehicle rental, food ordering and events — with vendor, user and admin management behind it.",
    features: ["Hotel booking", "Vehicle rental", "Food ordering", "Event management", "E-commerce", "Vendor management"],
    modules: [
      { label: "Services", items: ["E-commerce", "Hotel booking", "Vehicle rental", "Food ordering", "Event management"] },
      { label: "Business", items: ["Vendor management", "User management", "Admin management", "Booking workflows", "Business management"] },
      { label: "Platform", items: ["Role-based authentication", "REST APIs"] },
    ],
    stack: ["React", "Node.js", "Express.js", "MongoDB", "REST APIs", "JWT"],
    caseStudy: {
      problem: "Users had to switch between separate apps for stays, travel, food and events, and vendors had no single place to manage their business.",
      solution: "A modular multi-service platform where every service shares accounts, role-based access and a common booking workflow, with vendor and admin management built in.",
      challenges: ["A shared data model across very different services", "Availability and booking conflicts", "Keeping a large UI consistent"],
      contribution: ["Service modules for booking flows", "REST API design", "Role-based authentication with JWT", "Reusable UI components"],
      services: ["JWT", "REST APIs"],
      database: "MongoDB",
    },
  },
  {
    slug: "seafarers-association",
    number: "03",
    title: "Seafarers Association",
    category: "Maritime / Seafarer Management Platform",
    theme: "maritime",
    accent: "#38bdf8",
    featured: true,
    live: "https://seafarersassociation.com",
    summary: "A digital platform for the maritime ecosystem — seafarer and crew records, medical certificates, shipping companies, training colleges and vendors.",
    features: ["Crew management", "Medical certificates", "Shipping companies", "Maritime colleges", "Blogs", "Vendor approval"],
    modules: [
      { label: "Seafarers & crew", items: ["Seafarer management", "Crew management", "Crew grading / ranking", "Medical information", "Medical certificate management", "Certificate downloads", "Maritime records"] },
      { label: "Directory & content", items: ["Shipping company directory", "Maritime blogs", "College / training listings"] },
      { label: "Administration", items: ["User authentication", "Admin authentication", "Vendor workflows", "Vendor approval", "Company approval", "Notifications", "Admin dashboard", "Inventory / data management"] },
    ],
    stack: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "REST APIs", "RBAC"],
    caseStudy: {
      problem: "Seafarer records, medical certificates, company details and training information were scattered and hard to verify.",
      solution: "A central platform for crew and seafarer records, certificates, company and college directories and content, with separate user, vendor and admin roles and approval workflows.",
      challenges: ["Document and certificate management at scale", "Secure, role-based access to sensitive records", "Approval workflows for vendors and companies"],
      contribution: ["Seafarer, crew and certificate modules", "Vendor and company approval workflows", "Blog / content module", "JWT-secured, role-based APIs"],
      services: ["JWT", "REST APIs"],
      database: "MongoDB",
    },
  },
  {
    slug: "biryani-express",
    number: "04",
    title: "Biryani Express",
    category: "Restaurant Management & Ordering System",
    theme: "restaurant",
    accent: "#f5a524",
    featured: true,
    live: "https://restaurant-management-sepia.vercel.app",
    summary: "End-to-end restaurant operations: online and QR ordering, POS billing, kitchen display, inventory and recipe costing, daily closing and growth tools.",
    features: ["POS billing", "QR table ordering", "Kitchen display", "Inventory & recipes", "Sales & expenses", "Loyalty & offers"],
    modules: [
      { label: "Customer", items: ["Online food ordering", "Product categories & details", "Favourites & cart", "Registration / login", "Order management", "Offers & coupons", "Loyalty, referral & subscription", "Customer reviews", "Notifications", "QR-based table ordering"] },
      { label: "Admin / manager", items: ["Dashboard", "Product, category & location management", "Order & booking management", "Sales & payment tracking", "Cash / card / online payments", "Daily sales & daily expenses", "Closing & cash reconciliation", "Profit tracking", "Reports & data export"] },
      { label: "Inventory / kitchen", items: ["Inventory management", "Food components & product recipes", "Food costing", "Food waste tracking", "Low-stock alerts", "Kitchen Display System", "Real-time order updates", "QR table orders"] },
      { label: "POS", items: ["POS billing", "Invoice generation", "PDF invoice & print support", "Thermal printer support", "Payment-mode tracking"] },
      { label: "Business management", items: ["Staff management & attendance", "Role-based access", "Customer management", "Owner dashboard", "Business performance"] },
      { label: "Growth", items: ["Customer segmentation", "Personalised offers", "Loyalty, coupons & referral", "Subscription", "WhatsApp / customer communication"] },
    ],
    stack: ["React", "Node.js", "Express.js", "MongoDB", "JavaScript", "Tailwind CSS", "JWT"],
    caseStudy: {
      problem: "Orders, stock and daily finances were tracked by hand, causing mistakes during rush hours and making the end-of-day close slow.",
      solution: "A restaurant platform with customer ordering and QR table orders, POS billing, a kitchen display, recipe-level inventory, daily closing and reports — plus loyalty and offer tools for growth.",
      challenges: ["Keeping orders in sync between tables, kitchen and counter", "Inventory that updates with each order and recipe", "Simple UI for fast-paced staff", "Accurate daily closing and cash reconciliation"],
      contribution: ["POS, invoicing and order flow", "QR ordering experience", "Inventory, recipe costing, sales and expense modules", "API and MongoDB schema design"],
      services: ["JWT", "REST APIs", "QR"],
      database: "MongoDB",
    },
  },
  {
    slug: "daily-expenditure",
    number: "05",
    title: "Daily Expenditure",
    category: "Business Expense & Financial Tracking Platform",
    theme: "finance",
    accent: "#2dd4bf",
    featured: true,
    live: "https://daily-expenditure-tracking.vercel.app",
    summary: "A money tracker for income, expenses and financial activity across several businesses — each tracked separately and rolled up into reports.",
    features: ["Daily expenses", "Income tracking", "Business-wise tracking", "Expense categories", "Reports", "Dashboard"],
    modules: [
      { label: "Tracking", items: ["Daily expenses", "Income tracking", "Expense categories", "Business-wise tracking"] },
      { label: "Insight", items: ["Dashboard", "Financial overview", "Reports"] },
      { label: "Business areas", items: ["Resort / Farm", "G5 House", "Clinic", "DG Shipping"] },
    ],
    stack: [],
    caseStudy: {
      problem: "Income and expenses for several different businesses were recorded in different places, so no one had a clear daily picture of each business.",
      solution: "A single tracker where every entry belongs to a business area and a category, with a dashboard and reports for a financial overview per business.",
      challenges: ["Keeping multiple business areas separate but comparable", "Fast daily entry for non-technical users"],
      contribution: ["Expense and income tracking", "Business-wise categorisation", "Dashboard and reports"],
      services: [],
    },
  },
  {
    slug: "plot-selling-platform",
    number: "06",
    title: "Plot Selling Platform",
    category: "Real Estate / Plot Management Application",
    theme: "property",
    accent: "#a3e635",
    featured: true,
    summary: "A digital platform for managing and presenting plots and property information, with search and customer enquiries.",
    features: ["Plot listings", "Property information", "Search", "Customer enquiries", "Admin management", "Property presentation"],
    stack: [],
    caseStudy: {
      problem: "Plot and property details were shared manually, making it hard for buyers to compare and for the seller to track enquiries.",
      solution: "A platform that presents plot listings and property information clearly, lets customers search and enquire, and gives admins one place to manage it all.",
      challenges: ["Presenting property information clearly", "Tracking customer enquiries"],
      contribution: ["Plot listings and property pages", "Search", "Enquiry flow", "Admin management"],
      services: [],
    },
  },
  {
    slug: "spanco-tek",
    number: "07",
    title: "Spanco Tek",
    category: "Laboratory Equipment Management System",
    theme: "lab",
    accent: "#34d399",
    featured: true,
    client: "Spanco Tek",
    summary: "Client project: product catalogue, equipment and inventory management and enquiry handling for a laboratory equipment company.",
    features: ["Product catalogue", "Equipment management", "Inventory", "Enquiries", "Admin management", "Business operations"],
    stack: ["React", "Node.js", "Express.js", "MongoDB"],
    caseStudy: {
      problem: "Product information and customer enquiries for lab equipment lived in spreadsheets and email.",
      solution: "A product catalogue with an admin panel for equipment and inventory and a structured enquiry pipeline.",
      challenges: ["Flexible product specifications", "Admin workflows for non-technical staff"],
      contribution: ["Catalogue and product pages", "Admin panel", "Enquiry management", "API and database"],
      services: ["REST APIs"],
      database: "MongoDB",
    },
  },
  {
    slug: "healthcare-management-system",
    number: "08",
    title: "Healthcare Management System",
    category: "Client Healthcare Project",
    theme: "health",
    accent: "#fb7185",
    featured: true,
    client: "Ortho Spine Care, Bhubaneswar",
    summary: "Client project: healthcare management software for real-world medical operations — patients, doctors, records and day-to-day clinic workflows.",
    features: ["Patient management", "Doctor management", "Medical records", "Healthcare workflows", "Digital medical operations"],
    stack: [],
    caseStudy: {
      problem: "Day-to-day clinic operations depended on paper and scattered records.",
      solution: "Healthcare management software that brings patient and doctor management, medical records and clinic workflows into one digital system.",
      challenges: ["Protecting sensitive patient information", "Fitting software to existing clinic workflows"],
      contribution: ["Patient and doctor modules", "Medical records", "Workflow screens"],
      services: [],
    },
  },
  {
    slug: "quizchronicle",
    number: "09",
    title: "QuizChronicle",
    category: "MERN Stack Application",
    theme: "quiz",
    accent: "#facc15",
    featured: false,
    summary: "An earlier MERN project: quizzes with score tracking, live news, weather forecasts and a discussion zone behind user and admin authentication.",
    features: ["Quiz module", "Score tracking", "Live news", "Weather forecast", "Debate zone", "User & admin auth"],
    stack: ["MongoDB", "Express.js", "React", "Node.js", "Tailwind CSS", "Framer Motion", "JWT", "Bcrypt", "News API", "Weather API"],
    caseStudy: {
      problem: "A learning project: combine several third-party APIs and an interactive quiz into one authenticated app.",
      solution: "A MERN application with user and admin authentication, a quiz module with score tracking, live news, weather forecasting and a debate zone, animated with Framer Motion.",
      challenges: ["Integrating multiple external APIs", "Secure authentication with JWT and Bcrypt"],
      contribution: ["Quiz and scoring module", "News and weather API integration", "Auth flows", "Responsive, animated UI"],
      services: ["JWT", "News API", "Weather API"],
      database: "MongoDB",
    },
  },
];
