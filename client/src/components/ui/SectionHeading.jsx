import Reveal from "./Reveal";
import styles from "./SectionHeading.module.css";

export default function SectionHeading({ label, title, intro, light = false, as: Tag = "h2" }) {
  return (
    <div className={`${styles.wrap} ${light ? styles.light : ""}`}>
      <Reveal><span className={styles.label}><i /> {label}</span></Reveal>
      <Reveal delay={0.08}><Tag className={styles.title}>{title}</Tag></Reveal>
      {intro && <Reveal delay={0.16}><p className={styles.intro}>{intro}</p></Reveal>}
    </div>
  );
}
