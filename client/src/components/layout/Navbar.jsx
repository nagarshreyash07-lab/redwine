import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useActiveSection from "../../hooks/useActiveSection";
import styles from "./Navbar.module.css";

const links = [["About", "about"], ["Capabilities", "capabilities"], ["Projects", "projects"], ["Insights", "insights"]];
const ids = links.map(([, id]) => id);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, loading, profileLoading } = useAuth();
  const { pathname } = useLocation();
  const active = useActiveSection(ids, pathname);
  const showWorkshop = Boolean(user && !loading && !profileLoading && isAdmin);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  // On the home page scroll smoothly in place; elsewhere let the router navigate to /#id.
  const goTo = (event, id) => {
    setOpen(false);
    if (pathname === "/") {
      event.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={styles.nav} aria-label="Primary">
        <Link to="/" className={styles.logo}>RÉDWÍNE<span>.</span></Link>

        <div className={styles.links}>
          {links.map(([label, id]) => (
            <Link key={id} to={`/#${id}`} onClick={(e) => goTo(e, id)} data-analytics-event="navigation" data-analytics-target={id} className={active === id ? styles.active : ""}>{label}</Link>
          ))}
        </div>

        <div className={styles.actions}>
          {user ? (
            <Link to="/profile" className={styles.signin}>Profile</Link>
          ) : (
            <Link to="/login" className={styles.signin}>Sign in</Link>
          )}
          {showWorkshop && <Link to="/admin" className={`${styles.signin} ${styles.workshop}`}>Workspace</Link>}
          <Link to="/#contact" onClick={(e) => goTo(e, "contact")} data-analytics-event="cta" data-analytics-target="contact" className={styles.cta}>Let's talk <ArrowUpRight size={15} /></Link>
          <button className={styles.menu} data-analytics-event="ui_interaction" data-analytics-target="mobile_menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div className={styles.sheet} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {links.map(([label, id], i) => (
              <motion.div key={id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.06, duration: 0.5 }}>
                <Link to={`/#${id}`} onClick={(e) => goTo(e, id)} data-analytics-event="navigation" data-analytics-target={id}>{label}</Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.5 }}>
              <Link to={user ? "/profile" : "/login"} className={styles.sheetMuted}>{user ? "Profile" : "Sign in"}</Link>
            </motion.div>
            {showWorkshop && (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.5 }}>
                <Link to="/admin" className={styles.sheetMuted}>Workspace</Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
