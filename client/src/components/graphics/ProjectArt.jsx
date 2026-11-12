import styles from "./ProjectArt.module.css";

/** Generative cover art driven by the project's accent colour — no image uploads needed. */
export default function ProjectArt({ accent = "#762d40", variant = 0 }) {
  const v = variant % 3;
  return (
    <div className={styles.art} style={{ "--a": accent }}>
      <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {v === 0 && [30, 60, 95, 135, 180].map((r, i) => (
          <circle key={r} cx="290" cy="105" r={r} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1" opacity={1 - i * 0.14} />
        ))}
        {v === 1 && Array.from({ length: 16 }, (_, i) => (
          <line key={i} x1={i * 34 - 60} y1="260" x2={i * 34 + 120} y2="-10" stroke="rgba(255,255,255,.2)" strokeWidth="1" />
        ))}
        {v === 2 && (
          <>
            {Array.from({ length: 6 }, (_, r) => Array.from({ length: 11 }, (_, c) => (
              <circle key={`${r}-${c}`} cx={22 + c * 36} cy={26 + r * 40} r="1.8" fill="rgba(255,255,255,.35)" />
            )))}
            <circle cx="300" cy="120" r="78" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.3)" />
          </>
        )}
      </svg>
    </div>
  );
}
