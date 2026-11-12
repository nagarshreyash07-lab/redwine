import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { workflow } from "../../data/content";
import styles from "./Process.module.css";

export default function Process() {
  return (
    <section className={`section ${styles.section}`} id="process">
      <div className="container">
        <SectionHeading label="05 — How we work" title={<>From question to <em>reality.</em></>} />
        <ol className={styles.steps}>
          <motion.span className={styles.line} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} aria-hidden="true" />
          {workflow.map((s, i) => (
            <Reveal as="li" key={s.step} delay={0.15 + i * 0.12} className={styles.step}>
              <span className={styles.node}>{s.step}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
