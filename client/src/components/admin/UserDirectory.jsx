import { useEffect, useState } from "react";
import { Search, UserRound, ChevronLeft, ChevronRight, ShieldCheck, MailCheck, MailX } from "lucide-react";
import { apiRequest } from "../../services/api";
import styles from "./UserDirectory.module.css";

const PAGE_SIZE = 20;

function formatDate(value) {
  if (!value) return "No sign-in recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "No sign-in recorded" : date.toLocaleString();
}

function providerLabel(provider) {
  if (provider === "google.com") return "Google";
  if (provider === "password") return "Email and password";
  return provider || "Not recorded";
}

export default function UserDirectory() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(query.trim());
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    apiRequest(`/admin/users?page=${page}&limit=${PAGE_SIZE}&search=${encodeURIComponent(search)}`)
      .then((result) => { if (active) setData(result); })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load user accounts."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, search]);

  const total = data?.total ?? 0;
  const pages = Math.max(1, data?.pages || 1);
  const first = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const last = Math.min(page * PAGE_SIZE, total);

  return (
    <section className={styles.directory} aria-labelledby="users-heading">
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>ACCOUNT DIRECTORY</p>
          <h1 id="users-heading">People</h1>
          <p className={styles.subtitle}>Accounts that have signed in to your website, ordered by most recent sign-in.</p>
        </div>
        <div className={styles.total}><strong>{total.toLocaleString()}</strong><span>accounts</span></div>
      </header>

      <label className={styles.search}>
        <Search size={17} aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or email" aria-label="Search users by name or email" />
      </label>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>Account</th><th>Last sign-in</th><th>Method</th><th>Email status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className={styles.empty}>Loading accounts…</td></tr>
            ) : data?.users.length ? data.users.map((account, index) => (
              <tr key={`${account.email || "account"}-${index}`}>
                <td>
                  <div className={styles.account}>
                    {account.photoURL ? (
                      <img src={account.photoURL} alt="" className={styles.avatar} referrerPolicy="no-referrer" />
                    ) : (
                      <span className={styles.avatarFallback} aria-hidden="true"><UserRound size={17} /></span>
                    )}
                    <span><strong>{account.displayName || "Unnamed account"}</strong><small>{account.email || "No email address"}</small></span>
                  </div>
                </td>
                <td><span className={styles.date}>{formatDate(account.lastSignInAt)}</span></td>
                <td><span className={styles.provider}>{providerLabel(account.signInProvider)}</span></td>
                <td>
                  <span className={`${styles.verification} ${account.emailVerified ? styles.verified : ""}`}>
                    {account.emailVerified ? <MailCheck size={15} /> : <MailX size={15} />}
                    {account.emailVerified ? "Verified" : "Unverified"}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className={styles.empty}>{search ? "No accounts match your search." : "No signed-in accounts recorded yet."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span>Showing {first}–{last} of {total} accounts</span>
        <div className={styles.pagination}>
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1 || loading} aria-label="Previous page"><ChevronLeft size={17} /></button>
          <span>Page {page} of {pages}</span>
          <button type="button" onClick={() => setPage((value) => Math.min(pages, value + 1))} disabled={page >= pages || loading} aria-label="Next page"><ChevronRight size={17} /></button>
        </div>
      </footer>
      <p className={styles.privacy}><ShieldCheck size={14} /> User details are visible only to authorized admins. This list shows accounts that have opened the site while signed in; it does not represent live online status.</p>
    </section>
  );
}
