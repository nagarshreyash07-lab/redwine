import { useCallback, useEffect, useState } from "react";
import { Mail, Trash2, CheckCheck, Circle } from "lucide-react";
import { apiRequest } from "../../services/api";
import styles from "../../pages/Admin.module.css";

export default function MessagesInbox() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try { setItems((await apiRequest("/admin/messages")).items); setError(""); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggle = async (m) => {
    try { await apiRequest(`/admin/messages/${m._id}`, { method: "PATCH", body: JSON.stringify({ status: m.status === "new" ? "read" : "new" }) }); await load(); }
    catch (e) { setError(e.message); }
  };
  const remove = async (m) => {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    try { await apiRequest(`/admin/messages/${m._id}`, { method: "DELETE" }); await load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <>
      <h2 className={styles.h2}>Messages</h2>
      {error && <p className={styles.error}>{error}</p>}
      {loading ? <p className={styles.hint}>Loading…</p> : items.length === 0 ? <p className={styles.empty}>No messages yet.</p> : (
        <ul className={styles.messages}>
          {items.map((m) => (
            <li key={m._id} className={m.status === "new" ? styles.unread : ""}>
              <div className={styles.msgHead}>
                <div>
                  <strong>{m.name}</strong> <a href={`mailto:${m.email}`}>{m.email}</a>
                  <time>{new Date(m.createdAt).toLocaleString()}</time>
                </div>
                <div className={styles.rowActions}>
                  <a href={`mailto:${m.email}?subject=Re: your message to RÉDWÍNE`} aria-label="Reply"><Mail size={16} /></a>
                  <button onClick={() => toggle(m)} aria-label={m.status === "new" ? "Mark as read" : "Mark as unread"}>{m.status === "new" ? <CheckCheck size={16} /> : <Circle size={16} />}</button>
                  <button onClick={() => remove(m)} aria-label="Delete"><Trash2 size={16} /></button>
                </div>
              </div>
              <p>{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
