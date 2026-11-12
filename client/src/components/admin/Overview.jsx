import { useEffect, useState } from "react";
import { FolderKanban, Newspaper, Inbox, MailWarning, Users } from "lucide-react";
import { apiRequest } from "../../services/api";
import styles from "../../pages/Admin.module.css";

const cards = [
  ["projects", "Projects", FolderKanban], ["insights", "Insights", Newspaper],
  ["messages", "Messages", Inbox], ["unread", "Unread", MailWarning], ["users", "Accounts", Users]
];

export default function Overview({ go }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { apiRequest("/admin/stats").then(setData).catch((e) => setError(e.message)); }, []);

  return (
    <>
      <h2 className={styles.h2}>Overview</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.stats}>
        {cards.map(([key, label, Icon]) => (
          <div className={styles.stat} key={key}>
            <Icon size={20} /><strong>{data ? data[key] : "–"}</strong><span>{label}</span>
          </div>
        ))}
      </div>
      <p className={styles.hint}>
        Add or edit <button className={styles.inline} onClick={() => go("projects")}>projects</button> and{" "}
        <button className={styles.inline} onClick={() => go("insights")}>insights</button> — they appear on the public site instantly.
        New enquiries land in <button className={styles.inline} onClick={() => go("messages")}>messages</button>.{" "}
        Review <button className={styles.inline} onClick={() => go("people")}>signed-in accounts</button> in People.
      </p>
    </>
  );
}
