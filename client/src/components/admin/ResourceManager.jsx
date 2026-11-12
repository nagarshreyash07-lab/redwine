import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { apiRequest } from "../../services/api";
import styles from "../../pages/Admin.module.css";

const toForm = (item, fields) =>
  Object.fromEntries(fields.map((f) => {
    let v = item?.[f.name];
    if (f.type === "tags") v = (v || []).join(", ");
    else if (f.type === "date") v = v ? new Date(v).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    else if (f.type === "checkbox") v = v ?? f.default ?? false;
    else v = v ?? f.default ?? "";
    return [f.name, v];
  }));

const toPayload = (values, fields) =>
  Object.fromEntries(fields.map((f) => {
    const v = values[f.name];
    if (f.type === "tags") return [f.name, v.split(",").map((t) => t.trim()).filter(Boolean)];
    if (f.type === "number") return [f.name, Number(v) || 0];
    return [f.name, v];
  }));

export default function ResourceManager({ title, endpoint, fields }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | { item } (item undefined = new)
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try { setItems((await apiRequest(endpoint)).items); setError(""); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [endpoint]);
  useEffect(() => { load(); }, [load]);

  const open = (item) => { setValues(toForm(item, fields)); setEditing({ item }); setError(""); };

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const existing = editing.item;
      await apiRequest(existing ? `${endpoint}/${existing._id}` : endpoint, {
        method: existing ? "PATCH" : "POST", body: JSON.stringify(toPayload(values, fields))
      });
      setEditing(null); await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function remove(item) {
    if (!window.confirm(`Delete "${item.title}"? This can't be undone.`)) return;
    try { await apiRequest(`${endpoint}/${item._id}`, { method: "DELETE" }); await load(); }
    catch (err) { setError(err.message); }
  }

  const singular = title.replace(/s$/, "");

  return (
    <>
      <div className={styles.bar}>
        <h2 className={styles.h2}>{title}</h2>
        <button className={styles.primary} onClick={() => open(undefined)}><Plus size={16} /> New {singular.toLowerCase()}</button>
      </div>
      {error && !editing && <p className={styles.error}>{error}</p>}
      {loading ? <p className={styles.hint}>Loading…</p> : items.length === 0 ? (
        <p className={styles.empty}>No {title.toLowerCase()} yet. Create your first one — until then the website shows sample content.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item._id}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.category}{item.published === false && " · Draft"}</span>
              </div>
              <div className={styles.rowActions}>
                <button onClick={() => open(item)} aria-label={`Edit ${item.title}`}><Pencil size={16} /></button>
                <button onClick={() => remove(item)} aria-label={`Delete ${item.title}`}><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}>
          <form className={styles.drawer} onSubmit={save}>
            <div className={styles.drawerHead}>
              <h3>{editing.item ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}`}</h3>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close"><X size={18} /></button>
            </div>
            <div className={styles.drawerBody}>
              {fields.map((f) => (
                <label key={f.name} className={f.type === "checkbox" ? styles.check : styles.field}>
                  <span>{f.label}</span>
                  {f.type === "textarea" ? (
                    <textarea rows={4} value={values[f.name]} required={f.required} maxLength={f.max} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
                  ) : f.type === "checkbox" ? (
                    <input type="checkbox" checked={!!values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.checked })} />
                  ) : (
                    <input type={f.type === "tags" ? "text" : f.type || "text"} value={values[f.name]} required={f.required} placeholder={f.placeholder}
                      onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
                  )}
                </label>
              ))}
              {error && <p className={styles.error}>{error}</p>}
            </div>
            <div className={styles.drawerFoot}>
              <button type="button" className={styles.ghost} onClick={() => setEditing(null)}>Cancel</button>
              <button className={styles.primary} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
