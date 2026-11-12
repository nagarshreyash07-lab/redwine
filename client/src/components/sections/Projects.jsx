import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import ProjectArt from "../graphics/ProjectArt";
import useContent from "../../hooks/useContent";
import { projects as fallback } from "../../data/content";
import styles from "./Projects.module.css";

export default function Projects() {
  const { items } = useContent("/projects", fallback);

  return (
    <section className={`section ${styles.section}`} id="projects">
      <div className="container">
        <SectionHeading label="03 — Selected work" title={<>Built with <em>curiosity.</em></>} intro="A look at what happens when good questions meet careful engineering." />

        <div className={styles.grid}>
          {items.map((p, i) => {
            const Card = p.link ? "a" : "div";
            return (
              <Reveal key={p._id || p.slug || p.title} delay={(i % 2) * 0.12} className={styles.item}>
                <Card className={styles.card} data-analytics-event="content_click" data-analytics-target="project" {...(p.link ? { href: p.link, target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <div className={styles.cover}>
                    <ProjectArt accent={p.accent} variant={i} />
                    <span className={styles.badge}>{p.category}</span>
                    <span className={styles.go}><ArrowUpRight size={20} /></span>
                  </div>
                  <div className={styles.meta}>
                    <h3>{p.title}</h3><span>{p.year}</span>
                  </div>
                  <p>{p.summary}</p>
                  {p.tags?.length > 0 && <ul>{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
