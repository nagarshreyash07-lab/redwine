import { Code2, Layers, FlaskConical, ArrowUpRight, Check } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { capabilities } from "../../data/content";
import styles from "./Capabilities.module.css";

const icons = { Code2, Layers, FlaskConical };

// Cursor-following spotlight: update CSS variables on the hovered card.
const spotlight = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

export default function Capabilities() {
  return (
    <section className={`section ${styles.section}`} id="capabilities">
      <div className="container">
        <div className={styles.top}>
          <SectionHeading light label="02 — What drives us" title={<>Ideas into <em>possibility.</em></>} />
          <Reveal delay={0.2}><p className={styles.lead}>We bring curiosity, technology and thoughtful execution together to move ideas forward.</p></Reveal>
        </div>

        <div className={styles.grid}>
          {capabilities.map((c, i) => {
            const Icon = icons[c.icon] || Code2;
            return (
              <Reveal key={c.id} delay={i * 0.12} className={styles.cardWrap}>
                <article className={styles.card} onMouseMove={spotlight}>
                  <div className={styles.cardTop}>
                    <span className={styles.icon}><Icon size={22} strokeWidth={1.6} /></span>
                    <span className={styles.num}>{c.id}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <ul>{c.points.map((p) => <li key={p}><Check size={14} /> {p}</li>)}</ul>
                  <ArrowUpRight className={styles.arrow} />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
