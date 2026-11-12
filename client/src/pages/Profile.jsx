import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import styles from "./Profile.module.css";

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(date);
}

export default function Profile() {
  const { user, isAdmin, profileLoading, profileError, logout } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const name = user?.displayName || user?.email?.split("@")[0] || "RÉDWÍNE member";
  const providers = user?.providerData.map(({ providerId }) =>
    providerId === "google.com" ? "Google" : providerId === "password" ? "Email and password" : providerId
  ).join(", ") || "Not available";

  async function handleSignOut() {
    setError("");
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (signOutError) {
      setError(signOutError.message || "Unable to sign out. Please try again.");
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>YOUR ACCOUNT</p>
        <h1>Your profile<span>.</span></h1>
        <p className={styles.intro}>Manage your RÉDWÍNE account and workspace access.</p>

        <div className={styles.card}>
          <div className={styles.identity}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className={styles.avatar} referrerPolicy="no-referrer" />
            ) : (
              <div className={styles.avatarFallback} aria-hidden="true"><UserRound size={25} /></div>
            )}
            <div className={styles.nameBlock}>
              <h2>{name}</h2>
              <p>{user?.email || "No email address"}</p>
            </div>
            {isAdmin && <span className={styles.adminBadge}><ShieldCheck size={15} /> Admin</span>}
          </div>

          <dl className={styles.details}>
            <div><dt>Email status</dt><dd>{user?.emailVerified ? "Verified" : "Not verified"}</dd></div>
            <div><dt>Sign-in method</dt><dd>{providers}</dd></div>
            <div><dt>Account created</dt><dd>{formatDate(user?.metadata?.creationTime)}</dd></div>
            <div><dt>Last sign in</dt><dd>{formatDate(user?.metadata?.lastSignInTime)}</dd></div>
          </dl>

          {profileLoading && <p className={styles.notice} role="status">Checking workspace access…</p>}
          {profileError && <p className={styles.notice} role="status">Workspace access could not be checked. {profileError}</p>}
          {error && <p className={styles.error} role="alert">{error}</p>}

          <div className={styles.actions}>
            {isAdmin && (
              <Link to="/admin" className={styles.primary}>Open workspace <ArrowUpRight size={16} /></Link>
            )}
            <button type="button" className={styles.secondary} onClick={handleSignOut}>
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
