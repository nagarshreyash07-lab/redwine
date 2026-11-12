import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";
import ParticleField from "../graphics/ParticleField";
import Reveal from "../ui/Reveal";
import Button from "../ui/Button";
import { sendContact } from "../../services/api";
import { trackAnalyticsEvent } from "../../services/analytics";
import styles from "./Contact.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const empty = { name: "", email: "", message: "", company: "" }; // `company` is a honeypot

function validate(v) {
  const errors = {};
  if (v.name.trim().length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL.test(v.email.trim())) errors.email = "Enter a valid email address.";
  if (v.message.trim().length < 10) errors.message = "A few more words, please (10+ characters).";
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [serverError, setServerError] = useState("");

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setStatus("sending"); setServerError("");
    try {
      await sendContact(values);
      trackAnalyticsEvent("contact_submit", "/", "contact").catch((error) => {
        console.error("Unable to record contact form activity:", error);
      });
      setStatus("sent"); setValues(empty);
    } catch (error) {
      setServerError(error.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section className={`section ${styles.section}`} id="contact">
      <div className={styles.bg}><ParticleField density={20000} color="235,190,200" /></div>
      <div className={`container ${styles.grid}`}>
        <div>
          <Reveal><span className={styles.label}><i /> 07 — Start a conversation</span></Reveal>
          <Reveal delay={0.08}><h2 className={styles.title}>Have a possibility<br />worth <em>exploring?</em></h2></Reveal>
          <Reveal delay={0.16}><p className={styles.lead}>Tell us what you're curious about. We read every message and reply personally.</p></Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className={styles.card}>
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div key="sent" className={styles.sent} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <span className={styles.check}><Check size={28} /></span>
                  <h3>Message received.</h3>
                  <p>Thanks for reaching out — we'll be in touch soon.</p>
                  <button className={styles.again} data-analytics-event="ui_interaction" data-analytics-target="send_another" onClick={() => setStatus("idle")}>Send another</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Honeypot — hidden from people and assistive tech */}
                  <div className={styles.hp} aria-hidden="true">
                    <label>Company<input tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} /></label>
                  </div>

                  <label className={styles.field}>
                    <span>Your name</span>
                    <input value={values.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} />
                    {errors.name && <em id="e-name" role="alert">{errors.name}</em>}
                  </label>
                  <label className={styles.field}>
                    <span>Email address</span>
                    <input type="email" value={values.email} onChange={set("email")} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "e-email" : undefined} />
                    {errors.email && <em id="e-email" role="alert">{errors.email}</em>}
                  </label>
                  <label className={styles.field}>
                    <span>What's on your mind?</span>
                    <textarea rows={5} value={values.message} onChange={set("message")} maxLength={2000} aria-invalid={!!errors.message} aria-describedby={errors.message ? "e-msg" : undefined} />
                    {errors.message && <em id="e-msg" role="alert">{errors.message}</em>}
                  </label>

                  {status === "error" && <p className={styles.error} role="alert">{serverError}</p>}

                  <Button type="submit" variant="light" arrow={false} disabled={status === "sending"} className={styles.submit}>
                    {status === "sending" ? <><Loader2 size={16} className={styles.spin} /> Sending…</> : <>Send message <Send size={15} /></>}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
