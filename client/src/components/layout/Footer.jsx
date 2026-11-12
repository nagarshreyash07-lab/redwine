import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const openPrivacySettings = () => window.dispatchEvent(new Event("redwine:open-privacy-settings"));

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>RÉDWÍNE<span>.</span></Link>
          <p>Innovate while curious. Build what matters.</p>
        </div>
        <nav className={styles.cols} aria-label="Footer">
          <div>
            <h4>Explore</h4>
            <Link to="/#about">About</Link>
            <Link to="/#capabilities">Capabilities</Link>
            <Link to="/#projects">Projects</Link>
            <Link to="/#insights">Insights</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/#contact">Contact</Link>
            <Link to="/login">Team sign in</Link>
            <button className={styles.privacy} onClick={openPrivacySettings}>Privacy & analytics</button>
          </div>
        </nav>
      </div>
      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} RÉDWÍNE. All rights reserved.</span>
        <button data-analytics-event="ui_interaction" data-analytics-target="back_to_top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">Back to top <ArrowUp size={14} /></button>
      </div>
    </footer>
  );
}
