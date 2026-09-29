import Hero from "@/components/hero/Hero";
import About from "@/components/About";
import Galaxy from "@/components/Galaxy";
import Projects from "@/components/projects/Projects";
import Architecture from "@/components/Architecture";
import Timeline from "@/components/Timeline";
import Services from "@/components/Services";
import Profile from "@/components/Profile";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import SceneStack from "@/components/SceneStack";

export default function Home() {
  return (
    <main id="top" className="relative">
      <Hero />
      <SceneStack>
        <Profile />
        <About />
      </SceneStack>
      <Galaxy />
      <Projects />
      <Timeline />
      <Services />
      <Architecture />
      <Contact />
      <Education />
    </main>
  );
}
