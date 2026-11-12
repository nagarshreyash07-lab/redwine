import { ArrowUpRight, Clock } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import useContent from "../../hooks/useContent";
import { insights as fallback } from "../../data/content";
import styles from "./Insights.module.css";

export default function Insights() {
  const { items } = useContent("/insights", fallback);

  return (
    <section className={`section ${styles.section}`} id="insights">
      <div className="container">
        <SectionHeading light label="06 — Insights" title={<>Thinking, <em>out loud.</em></>} intro="Notes on technology, design and the habits of curious teams." />
        <div className={styles.list}>
          {items.map((a, i) => {
            const Row = a.url ? "a" : "div";
            return (
              <Reveal key={a._id || a.slug || a.title} delay={i * 0.08}>
                <Row className={styles.row} data-analytics-event="content_click" data-analytics-target="insight" {...(a.url ? { href: a.url, target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <span className={styles.cat}>{a.category}</span>
                  <div className={styles.main}>
                    <h3>{a.title}</h3>
                    <p>{a.excerpt}</p>
                  </div>
                  <span className={styles.time}><Clock size={13} /> {a.readTime} min</span>
                  <span className={styles.go}><ArrowUpRight size={20} /></span>
                </Row>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
