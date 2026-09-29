export const profile = {
  name: "Bibhu Prasad Mahapatra",
  shortName: "M VIBHU PRASAD",
  initials: "BP",
  role: "Full-Stack Developer",
  roles: [
    "Software Developer",
    "MERN Stack Developer",
    "Next.js Developer",
    "Healthcare Technology Developer",
    "AI-Integrated Application Developer",
  ],
  positioning:
    "Full-Stack Developer focused on building real-world software systems, SaaS platforms, healthcare applications, business management systems, multi-service platforms, AI-integrated applications and modern interactive web experiences.",
  experience: "1+ year professional experience",
  email: "mbibhuprasad2003@gmail.com",
  location: "Bhubaneswar, Odisha, India",
  github: "https://github.com/Mbibhuprasad",
  // TODO: LinkedIn profile URL could not be verified — replace with your public URL (https://www.linkedin.com/in/<handle>/).
  linkedin: "https://www.linkedin.com/",
  // TODO: add /public/resume.pdf
  resume: "/resume.pdf",
  // Small identity marker in the hero. Add a real photo at /public/profile.jpg and set this to "/profile.jpg".
  // While null, a monogram is shown instead (no generated portrait).
  avatar: "",
};
console.log(profile.avatar);

export const navLinks = [
  { label: "WORK", href: "#work" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "STACK", href: "#stack" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
] as const;

export const footerLinks = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Tech Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
] as const;
