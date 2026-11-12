import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Counter from "../ui/Counter";
import Reveal from "../ui/Reveal";
import { stats } from "../../data/content";
import styles from "./About.module.css";

const words = [
  ..."We believe meaningful progress begins with".split(" ").map((t) => ({ t })),
  ...["better", "questions."].map((t) => ({ t, accent: true }))
];

function Word({ word, range, progress }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }} className={word.accent ? styles.accent : undefined}>{word.t} </motion.span>;
}

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });

  return (
    <section className={`section ${styles.about}`} id="about">
      <div className={`container ${styles.grid}`}>
        <Reveal><span className={styles.label}><i /> 01 — Our mindset</span></Reveal>
        <div>
          <Reveal><p className={styles.kicker}>Technology is a tool. Curiosity is the catalyst.</p></Reveal>
          <h2 ref={ref} className={styles.statement} aria-label="We believe meaningful progress begins with better questions.">
            {words.map((w, i) => <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />)}
          </h2>
          <Reveal><p className={styles.body}>RÉDWÍNE is a technology company driven by the desire to understand what is possible — and the discipline to turn promising ideas into something real.</p></Reveal>

          <div className={styles.stats}>
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1} className={styles.stat}>
                <strong><Counter to={s.value} suffix={s.suffix} /></strong>
                <span>{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
