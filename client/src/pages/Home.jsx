import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Capabilities from "../components/sections/Capabilities";
import Projects from "../components/sections/Projects";
import Manifesto from "../components/sections/Manifesto";
import Process from "../components/sections/Process";
import Insights from "../components/sections/Insights";
import Contact from "../components/sections/Contact";


export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Capabilities />
      <Projects />
      <Manifesto />
      <Process />
      <Insights />
      <Contact />
    </>
  );
}
