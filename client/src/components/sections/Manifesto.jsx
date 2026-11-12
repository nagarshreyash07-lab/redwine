import Reveal from "../ui/Reveal";
import styles from "./Manifesto.module.css";

const words = ["Innovate", "While curious", "Build", "Explore"];

export default function Manifesto() {
  return (
    <section className={`section ${styles.section}`} aria-label="The RÉDWÍNE mindset">
      <div className={styles.glow} />
      <div className="container">
        <Reveal><span className={styles.label}><i /> 04 — The RÉDWÍNE mindset</span></Reveal>
        <div className={styles.words}>
          {words.map((w, i) => (
            <Reveal key={w} delay={i * 0.08} y={50}><h2>{w}<span>.</span></h2></Reveal>
          ))}
        </div>
        <Reveal delay={0.2}><p className={styles.tag}>Never stop questioning what could be.</p></Reveal>
      </div>
    </section>
  );
}
