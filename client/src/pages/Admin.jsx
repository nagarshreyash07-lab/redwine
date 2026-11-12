import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, LayoutDashboard, FolderKanban, Newspaper, Inbox, LogOut, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Overview from "../components/admin/Overview";
import AnalyticsDashboard from "../components/admin/AnalyticsDashboard";
import ResourceManager from "../components/admin/ResourceManager";
import MessagesInbox from "../components/admin/MessagesInbox";
import UserDirectory from "../components/admin/UserDirectory";
import styles from "./Admin.module.css";

const projectFields = [
  { name: "title", label: "Title", required: true },
  { name: "category", label: "Category", default: "Software & Engineering" },
  { name: "summary", label: "Summary", type: "textarea", required: true, max: 400 },
  { name: "tags", label: "Tags (comma separated)", type: "tags" },
  { name: "year", label: "Year", type: "number", default: new Date().getFullYear() },
  { name: "accent", label: "Cover colour", type: "color", default: "#762d40" },
  { name: "link", label: "Link (optional)", type: "url", placeholder: "https://" },
  { name: "order", label: "Sort order (lower first)", type: "number", default: 0 },
  { name: "published", label: "Published", type: "checkbox", default: true }
];

const insightFields = [
  { name: "title", label: "Title", required: true },
  { name: "category", label: "Category", default: "Thinking" },
  { name: "excerpt", label: "Excerpt", type: "textarea", required: true, max: 400 },
  { name: "readTime", label: "Read time (minutes)", type: "number", default: 4 },
  { name: "publishedAt", label: "Publish date", type: "date" },
  { name: "url", label: "Link (optional)", type: "url", placeholder: "https://" },
  { name: "published", label: "Published", type: "checkbox", default: true }
];

const tabs = [
  ["analytics", "Analytics", Activity], ["overview", "Overview", LayoutDashboard], ["people", "People", Users], ["projects", "Projects", FolderKanban],
  ["insights", "Insights", Newspaper], ["messages", "Messages", Inbox]
];
const tabLabels = Object.fromEntries(tabs.map(([id, label]) => [id, label]));

export default function Admin() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("analytics");

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <Link to="/" className={styles.logo}>RÉDWÍNE<span>.</span></Link>
        <p className={styles.sideLabel}>MANAGEMENT</p>
        <nav aria-label="Workspace">
          {tabs.map(([id, label, Icon]) => (
            <button key={id} className={tab === id ? styles.on : ""} aria-pressed={tab === id} onClick={() => setTab(id)}><Icon size={17} /> {label}</button>
          ))}
        </nav>
        <div className={styles.account}>
          <span>{user?.email}</span>
          <button onClick={logout}><LogOut size={15} /> Sign out</button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div><span className={styles.breadcrumb}>Workspace <i>/</i> {tabLabels[tab]}</span><strong>{tabLabels[tab]}</strong></div>
          <div className={styles.adminIdentity}><span className={styles.onlineDot} /> Admin console <span className={styles.adminEmail}>{user?.email}</span></div>
        </header>
        {tab === "analytics" && <AnalyticsDashboard />}
        {tab === "overview" && <Overview go={setTab} />}
        {tab === "people" && <UserDirectory />}
        {tab === "projects" && <ResourceManager title="Projects" endpoint="/admin/projects" fields={projectFields} />}
        {tab === "insights" && <ResourceManager title="Insights" endpoint="/admin/insights" fields={insightFields} />}
        {tab === "messages" && <MessagesInbox />}
      </main>
    </div>
  );
}
