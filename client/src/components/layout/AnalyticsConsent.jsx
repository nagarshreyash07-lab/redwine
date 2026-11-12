import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getAnalyticsConsent, saveAnalyticsConsent } from "../../services/analytics";
import styles from "./AnalyticsConsent.module.css";

const OPEN_SETTINGS_EVENT = "redwine:open-privacy-settings";

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState(getAnalyticsConsent);
  const [open, setOpen] = useState(choice === "unset");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [revocationPending, setRevocationPending] = useState(false);

  useEffect(() => {
    const openSettings = () => {
      setChoice(getAnalyticsConsent());
      setError("");
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
  }, []);

  async function choose(consent) {
    setError("");
    setBusy(true);
    try {
      if (consent || choice === "accepted") {
        await saveAnalyticsConsent(consent);
      } else {
        window.localStorage.setItem("redwine-analytics-consent", "rejected");
      }
      setChoice(consent ? "accepted" : "rejected");
      setRevocationPending(false);
      if (consent) window.dispatchEvent(new Event("redwine:analytics-enabled"));
      setOpen(false);
    } catch (saveError) {
      setError(consent
        ? "Your choice could not be saved. Analytics remains off until consent is recorded."
        : "Analytics has been disabled in this browser, but saved activity could not be deleted. Please try again.");
      console.error("Unable to update analytics consent:", saveError);
      setOpen(true);
    } finally {
      setBusy(false);
    }
  }

  async function revoke() {
    setError("");
    setBusy(true);
    try {
      const visitorId = window.localStorage.getItem("redwine-analytics-visitor");
      window.localStorage.setItem("redwine-analytics-consent", "rejected");
      window.dispatchEvent(new Event("redwine:analytics-disabled"));
      if (visitorId) await saveAnalyticsConsent(false);
      else window.sessionStorage.removeItem("redwine-analytics-session");
      setChoice("rejected");
      setRevocationPending(false);
      setOpen(false);
    } catch (revokeError) {
      setChoice("rejected");
      setRevocationPending(true);
      setError("Analytics is disabled in this browser, but saved activity could not be deleted. Please try again.");
      console.error("Unable to delete analytics activity after consent was withdrawn:", revokeError);
      setOpen(true);
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  const accepted = choice === "accepted";
  const rejected = choice === "rejected";

  return (
    <aside className={styles.panel} role="dialog" aria-label="Privacy and analytics settings">
      {choice !== "unset" && (
        <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close privacy settings">
          <X size={18} />
        </button>
      )}
      <p className={styles.eyebrow}>YOUR PRIVACY</p>
      <h2>{accepted ? "Anonymous analytics is on" : rejected ? "Analytics is off" : "Help us improve the site"}</h2>
      <p className={styles.description}>
        We measure page visits, sections viewed, navigation and content clicks, and contact form submissions only after you opt in.
        We do not collect form contents, credentials, names, email addresses, IP addresses, content titles, or full URLs.
        Activity is kept until an administrator deletes it. You can change this choice at any time.
      </p>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.actions}>
        {accepted ? (
          <>
            <button type="button" className={styles.primary} onClick={() => setOpen(false)}>Keep analytics on</button>
            <button type="button" className={styles.secondary} onClick={revoke} disabled={busy}>
              {busy ? "Updating…" : "Turn off and delete my activity"}
            </button>
          </>
        ) : rejected ? (
          <>
            <button type="button" className={styles.primary} onClick={revocationPending ? revoke : () => choose(true)} disabled={busy}>
              {busy ? "Saving…" : revocationPending ? "Retry deletion of my activity" : "Allow anonymous analytics"}
            </button>
            <button type="button" className={styles.secondary} onClick={() => setOpen(false)}>{revocationPending ? "Continue with analytics off" : "Keep analytics off"}</button>
          </>
        ) : (
          <>
            <button type="button" className={styles.primary} onClick={() => choose(true)} disabled={busy}>
              {busy ? "Saving…" : "Allow anonymous analytics"}
            </button>
            <button type="button" className={styles.secondary} onClick={() => choose(false)} disabled={busy}>
              Decline optional analytics
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
