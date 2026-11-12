import { ArrowUpRight } from "lucide-react";
import styles from "./Button.module.css";

/** Renders <a> when `href` is given (use as={Link} + `to` for router links), else <button>. */
export default function Button({ as, href, variant = "primary", arrow = true, className = "", children, ...props }) {
  const Tag = as || (href ? "a" : "button");
  return (
    <Tag href={href} className={`${styles.btn} ${styles[variant]} ${className}`} {...props}>
      <span>{children}</span>
      {arrow && <ArrowUpRight size={17} className={styles.arrow} aria-hidden="true" />}
    </Tag>
  );
}
