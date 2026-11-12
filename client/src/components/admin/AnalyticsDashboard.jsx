import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, Eye, MousePointer2, RefreshCw, ShieldAlert, Trash2, Users } from "lucide-react";
import { apiRequest } from "../../services/api";
import styles from "./AnalyticsDashboard.module.css";

const ranges = [7, 30, 90, 365];
const sectionLabels = {
  about: "About",
  capabilities: "Capabilities",
  projects: "Projects",
  manifesto: "Manifesto",
  process: "Process",
  insights: "Insights",
  contact: "Contact"
};
const actionLabels = {
  contact: "Contact",
  discover: "Discover RÉDWÍNE",
  projects: "See our work"
};

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function ActivityChart({ daily, days }) {
  const series = useMemo(() => {
    const records = new Map(daily.map((item) => [item.date, item]));
    return Array.from({ length: days }, (_, index) => {
      const date = new Date(Date.now() - (days - index - 1) * 86400000);
      const key = dateKey(date);
      return { date: key, events: records.get(key)?.events || 0, visitors: records.get(key)?.visitors || 0 };
    });
  }, [daily, days]);
  const max = Math.max(1, ...series.map((item) => Math.max(item.events, item.visitors)));
  const point = (value, index) => {
    const x = series.length === 1 ? 360 : 16 + (index * 688) / (series.length - 1);
    const y = 176 - (value / max) * 150;
    return `${x},${y}`;
  };
  const eventPoints = series.map((item, index) => point(item.events, index)).join(" ");
  const visitorPoints = series.map((item, index) => point(item.visitors, index)).join(" ");
  const labels = [series[0], series[Math.floor((series.length - 1) / 2)], series.at(-1)];

  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartLegend}>
        <span><i className={styles.eventDot} /> Events</span>
        <span><i className={styles.visitorDot} /> Visitors</span>
      </div>
      <svg className={styles.chart} viewBox="0 0 720 200" role="img" aria-label={`Daily events and visitors over the last ${days} days`}>
        {[26, 76, 126, 176].map((y) => <line key={y} x1="12" x2="708" y1={y} y2={y} className={styles.gridLine} />)}
        <polyline points={eventPoints} className={styles.eventLine} />
        <polyline points={visitorPoints} className={styles.visitorLine} />
      </svg>
      <div className={styles.chartLabels}>
        {labels.map((item, index) => <time key={`${item.date}-${index}`} dateTime={item.date}>{new Date(`${item.date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</time>)}
      </div>
    </div>
  );
}

function formatPath(path) {
  return path === "/" ? "Home" : "Other pages";
}

function formatTarget(value, labels) {
  return labels[value] || value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AnalyticsDashboard() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await apiRequest(`/admin/analytics?days=${days}`));
    } catch (requestError) {
      setError(requestError.message || "Unable to load site analytics.");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  async function clearActivity() {
    if (!window.confirm("Delete all recorded analytics activity? Visitor consent preferences will remain saved.")) return;
    setClearing(true);
    setError("");
    setNotice("");
    try {
      const result = await apiRequest("/admin/analytics/events", { method: "DELETE" });
      setNotice(`${result.deleted} activity records deleted.`);
      await load();
    } catch (requestError) {
      setError(requestError.message || "Unable to delete analytics activity.");
    } finally {
      setClearing(false);
    }
  }

  const cards = data ? [
    { label: "Unique visitors", value: data.uniqueVisitors, Icon: Users, note: `Last ${days} days` },
    { label: "Sessions", value: data.uniqueSessions, Icon: Activity, note: `Last ${days} days` },
    { label: "Page views", value: data.pageViews, Icon: Eye, note: `Last ${days} days` },
    { label: "Contact submissions", value: data.contactSubmissions, Icon: MousePointer2, note: `Last ${days} days` }
  ] : [];
  const visibleData = data?.rangeDays === days ? data : null;
  const funnel = visibleData?.sessionFunnel || { pageViewSessions: 0, ctaSessions: 0, contactSessions: 0 };
  const funnelSteps = [
    { label: "Visited a page", value: funnel.pageViewSessions },
    { label: "Clicked a call to action", value: funnel.ctaSessions },
    { label: "Submitted the contact form", value: funnel.contactSessions }
  ];
  const maxSections = Math.max(1, ...(visibleData?.topSections || []).map((item) => item.views));
  const maxActions = Math.max(1, ...(visibleData?.ctaPerformance || []).map((item) => item.clicks));

  return (
    <section className={styles.dashboard} aria-labelledby="analytics-heading">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>SITE PERFORMANCE</p>
          <h1 id="analytics-heading">Activity analytics</h1>
          <p className={styles.subtitle}>Anonymous activity from visitors who opted in. No form contents or personal identifiers.</p>
        </div>
        <div className={styles.toolbar}>
          <label className={styles.range}>
            <span>Period</span>
            <select value={days} onChange={(event) => setDays(Number(event.target.value))}>
              {ranges.map((range) => <option value={range} key={range}>Last {range} days</option>)}
            </select>
          </label>
          <button type="button" className={styles.iconButton} onClick={load} disabled={loading} aria-label="Refresh analytics">
            <RefreshCw size={16} className={loading ? styles.spinning : ""} /> Refresh
          </button>
          <button type="button" className={styles.deleteButton} onClick={clearActivity} disabled={clearing}>
            <Trash2 size={16} /> {clearing ? "Deleting…" : "Delete activity"}
          </button>
        </div>
      </div>

      {error && <div className={styles.error} role="alert"><ShieldAlert size={18} /> {error} <button type="button" onClick={load}>Try again</button></div>}
      {notice && <p className={styles.notice} role="status">{notice}</p>}

      {loading && !visibleData ? (
        <p className={styles.empty}>Loading analytics…</p>
      ) : (
        <>
          <div className={styles.metrics}>
            {(visibleData ? cards : []).map(({ label, value, Icon, note }) => (
              <article className={styles.metric} key={label}>
                <span className={styles.metricIcon}><Icon size={18} /></span>
                <span className={styles.metricLabel}>{label}</span>
                <strong>{value.toLocaleString()}</strong>
                <span className={styles.metricNote}>{note}</span>
              </article>
            ))}
          </div>

          <div className={styles.grid}>
            <article className={styles.panel}>
              <div className={styles.panelHeading}>
                <div><h2>Traffic over time</h2><p>{visibleData?.totalEvents.toLocaleString() || 0} total events in this period</p></div>
              </div>
              {visibleData?.daily?.length ? <ActivityChart daily={visibleData.daily} days={days} /> : <p className={styles.empty}>No opted-in activity for this period yet.</p>}
            </article>

            <article className={styles.panel}>
              <div className={styles.panelHeading}><div><h2>Top pages</h2><p>Most viewed pages</p></div></div>
              {visibleData?.topPages?.length ? (
                <ol className={styles.pageList}>
                  {visibleData.topPages.map((page, index) => (
                    <li key={page.path}>
                      <span className={styles.rank}>{String(index + 1).padStart(2, "0")}</span>
                      <span className={styles.pageName}>{formatPath(page.path)}</span>
                      <strong>{page.views.toLocaleString()}<small> views</small></strong>
                    </li>
                  ))}
                </ol>
              ) : <p className={styles.empty}>No page views recorded yet.</p>}
            </article>

            <article className={styles.panel}>
              <div className={styles.panelHeading}><div><h2>Visitor journey</h2><p>Opted-in sessions progressing through key actions</p></div></div>
              {funnel.pageViewSessions ? (
                <ol className={styles.funnel}>
                  {funnelSteps.map((step, index) => {
                    const rate = index === 0 ? 100 : Math.round((step.value / funnel.pageViewSessions) * 100);
                    return (
                      <li key={step.label} className={styles.funnelStep}>
                        <div className={styles.funnelInfo}>
                          <span><i>{String(index + 1).padStart(2, "0")}</i>{step.label}</span>
                          <strong>{step.value.toLocaleString()} <small>{rate}%</small></strong>
                        </div>
                        <span className={styles.funnelTrack}><i style={{ width: `${rate}%` }} /></span>
                      </li>
                    );
                  })}
                </ol>
              ) : <p className={styles.empty}>No opted-in page-view sessions to measure yet.</p>}
              <p className={styles.panelFootnote}>Percentages are measured against sessions with a page view.</p>
            </article>

            <article className={styles.panel}>
              <div className={styles.panelHeading}><div><h2>Content & calls to action</h2><p>See what visitors engage with most</p></div></div>
              <div className={styles.engagementGrid}>
                <section className={styles.insightGroup} aria-label="Most viewed sections">
                  <h3>Most viewed sections</h3>
                  {visibleData?.topSections?.length ? (
                    <ol className={styles.rankList}>
                      {visibleData.topSections.slice(0, 5).map((item) => (
                        <li key={item.section}>
                          <span>{formatTarget(item.section, sectionLabels)}</span>
                          <strong>{item.views.toLocaleString()}<small> views</small></strong>
                          <span className={styles.rankTrack}><i style={{ width: `${(item.views / maxSections) * 100}%` }} /></span>
                        </li>
                      ))}
                    </ol>
                  ) : <p className={styles.miniEmpty}>No section views recorded yet.</p>}
                </section>
                <section className={styles.insightGroup} aria-label="Call-to-action performance">
                  <h3>Call-to-action clicks</h3>
                  {visibleData?.ctaPerformance?.length ? (
                    <ol className={styles.rankList}>
                      {visibleData.ctaPerformance.slice(0, 5).map((item) => (
                        <li key={item.action}>
                          <span>{formatTarget(item.action, actionLabels)}</span>
                          <strong>{item.clicks.toLocaleString()}<small> clicks</small></strong>
                          <span className={styles.rankTrack}><i style={{ width: `${(item.clicks / maxActions) * 100}%` }} /></span>
                        </li>
                      ))}
                    </ol>
                  ) : <p className={styles.miniEmpty}>No call-to-action clicks recorded yet.</p>}
                </section>
              </div>
            </article>
          </div>
          <p className={styles.retention}>Analytics is opt-in. Activity has no automatic expiry; deleting activity removes all recorded events. Consent preferences are retained so opted-in visitors do not need to choose again.</p>
        </>
      )}
    </section>
  );
}
