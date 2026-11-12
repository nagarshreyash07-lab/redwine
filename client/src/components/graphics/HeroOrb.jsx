import styles from "./HeroOrb.module.css";

const rings = [
  { inset: "2%",  rot: "48deg",  dur: "26s", dir: "normal" },
  { inset: "13%", rot: "-25deg", dur: "18s", dir: "reverse" },
  { inset: "24%", rot: "12deg",  dur: "12s", dir: "normal" }
];

/** Pure-CSS 3D orb: glowing core, tilted rings, orbiting satellites. */
export default function HeroOrb() {
  return (
    <div className={styles.orb} aria-hidden="true">
      <div className={styles.halo} />
      <div className={styles.float}>
        <div className={styles.core} />
        {rings.map((r, i) => (
          <div key={i} className={styles.tilt} style={{ inset: r.inset, "--rot": r.rot }}>
            <div className={styles.ring} style={{ "--dur": r.dur, "--dir": r.dir }}>
              <span className={styles.dot} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
