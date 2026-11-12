import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ParticleField from "../components/graphics/ParticleField";
import styles from "./Auth.module.css";

const friendly = (error) => {
  const code = error?.code || "";
  if (/invalid-credential|wrong-password|user-not-found/.test(code)) return "Email or password is incorrect.";
  if (code.includes("email-already-in-use")) return "An account with this email already exists.";
  if (code.includes("weak-password")) return "Choose a password with at least 6 characters.";
  if (code.includes("invalid-email")) return "Enter a valid email address.";
  if (code.includes("too-many-requests")) return "Too many attempts. Please wait a moment and try again.";
  if (code.includes("popup-closed")) return "";
  return error?.message || "Something went wrong. Please try again.";
};

export default function Login() {
  const { login, register, loginWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", ok: false });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const from = useLocation().state?.from || "/profile";
  const signup = mode === "signup";

  async function run(action) {
    setBusy(true); setMessage({ text: "", ok: false });
    try { await action(); navigate(from, { replace: true }); }
    catch (error) { setMessage({ text: friendly(error), ok: false }); }
    finally { setBusy(false); }
  }

  async function onReset() {
    if (!email) return setMessage({ text: "Enter your email address first.", ok: false });
    try { await resetPassword(email); setMessage({ text: "Password reset email sent.", ok: true }); }
    catch (error) { setMessage({ text: friendly(error), ok: false }); }
  }

  return (
    <main className={styles.page}>
      <aside className={styles.visual}>
        <div className={styles.particles}><ParticleField /></div>
        <Link to="/" className={styles.logo}>RÉDWÍNE<span>.</span></Link>
        <p className={styles.quote}>Never stop questioning <em>what could be.</em></p>
      </aside>

      <div className={styles.panelWrap}>
        <div className={styles.panel}>
          <p className={styles.eyebrow}>PRIVATE WORKSPACE</p>
          <h1>{signup ? <>Create your<br />account.</> : <>Welcome<br />back.</>}</h1>
          <p className={styles.sub}>{signup ? "Register to join the RÉDWÍNE workspace. Admin access is granted separately." : "Sign in to continue to the RÉDWÍNE workspace."}</p>

          <form onSubmit={(e) => { e.preventDefault(); run(() => (signup ? register(email, password) : login(email, password))); }}>
            <label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></label>
            <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={signup ? "new-password" : "current-password"} minLength={6} required /></label>
            <button className={styles.submit} disabled={busy}>{busy ? "Please wait…" : signup ? "Create account" : "Sign in"}</button>
          </form>

          <div className={styles.divider}>or</div>
          <button className={styles.google} disabled={busy} onClick={() => run(loginWithGoogle)}>Continue with Google</button>

          <div className={styles.links}>
            <button className={styles.link} onClick={() => { setMode(signup ? "signin" : "signup"); setMessage({ text: "", ok: false }); }}>
              {signup ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
            {!signup && <button className={styles.link} onClick={onReset}>Forgot password?</button>}
          </div>

          {message.text && <p className={`${styles.message} ${message.ok ? styles.ok : ""}`} role="status">{message.text}</p>}
          <Link to="/" className={styles.back}>← Back to website</Link>
        </div>
      </div>
    </main>
  );
}
