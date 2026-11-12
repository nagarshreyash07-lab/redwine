import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown } from "lucide-react";
import ParticleField from "../graphics/ParticleField";
import HeroOrb from "../graphics/HeroOrb";
import Button from "../ui/Button";
import styles from "./Hero.module.css";

const ease = [0.22, 1, 0.36, 1];
const headline = [["The", "future"], ["belongs", "to", "the", { em: "curious." }]];

export default function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 20 });
  const y = useSpring(my, { stiffness: 60, damping: 20 });

  const onMove = (e) => {
    mx.set((e.clientX / window.innerWidth - 0.5) * 36);
    my.set((e.clientY / window.innerHeight - 0.5) * 36);
  };

  let index = 0;
  return (
    <section className={styles.hero} onMouseMove={onMove} id="home">
      <div className={styles.particles}><ParticleField /></div>
      <div className={styles.vignette} />

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <motion.p className={styles.eyebrow} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span /> INDEPENDENT TECHNOLOGY COMPANY
          </motion.p>

          <h1 className={styles.title} aria-label="The future belongs to the curious.">
            {headline.map((line, li) => (
              <span className={styles.line} key={li} aria-hidden="true">
                {line.map((word, wi) => {
                  const isEm = typeof word === "object";
                  const delay = 0.15 + index++ * 0.08;
                  return (
                    <span className={styles.mask} key={wi}>
                      <motion.span className={isEm ? styles.em : undefined} initial={{ y: "115%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay, ease }}>
                        {isEm ? word.em : word}
                      </motion.span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p className={styles.intro} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}>
            We explore ideas, engineer possibilities and build technology with purpose.
          </motion.p>

          <motion.div className={styles.cta} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.8 }}>
            <Button href="#about" data-analytics-event="cta" data-analytics-target="discover" onClick={(e) => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }}>Discover RÉDWÍNE</Button>
            <Button variant="ghost" arrow={false} href="#projects" data-analytics-event="cta" data-analytics-target="projects" onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}>See our work</Button>
          </motion.div>
        </div>

        <motion.div className={styles.orbWrap} style={{ x, y }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: 0.3, ease }}>
          <HeroOrb />
        </motion.div>
      </div>

      <div className={`container ${styles.foot}`}>
        <span>INNOVATE WHILE CURIOUS</span>
        <a href="#about" data-analytics-event="navigation" data-analytics-target="about" onClick={(e) => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }}>
          SCROLL TO EXPLORE <ArrowDown size={13} />
        </a>
      </div>
    </section>
  );
}
