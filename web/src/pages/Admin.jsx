import { useCallback, useEffect, useMemo, useState } from 'react';
import { SITE } from '../data/site';
import { SERVICES } from '../data/services';
import {
  hasBackend, adminLogin, adminLogout, isAdminAuthed, adminOp,
} from '../lib/api';
import { Icon } from '../components/Icons';

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'closed', 'spam'];
const ISSUE_STATUSES = ['open', 'in-progress', 'resolved'];
const CONTENT_KEYS = [
  { key: 'announcement', label: 'Announcement bar (site-wide; empty hides it)' },
  ...SERVICES.flatMap((s) => [
    { key: `service.${s.id}.tag`, label: `${s.name} — card tag` },
    { key: `service.${s.id}.card`, label: `${s.name} — card text` },
  ]),
];

function Login({ onOk }) {
  const [key, setKey] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const res = await adminLogin(key.trim()).catch(() => ({ error: 'network' }));
    setBusy(false);
    if (res.ok) onOk();
    else setErr(res.error === 'unauthorized' ? 'Wrong passphrase.' : 'Could not reach the backend — check the API URL is configured.');
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <span className="brand-mark" style={{ margin: '0 auto 14px' }}>D</span>
        <h2>Management access</h2>
        <p>Devine Facilities · leads, sites &amp; content</p>
        <div className="field">
          <label htmlFor="ad-key">Admin passphrase</label>
          <input
            id="ad-key" type="password" required autoFocus
            value={key} onChange={(e) => setKey(e.target.value)}
            placeholder="ADMIN_KEY"
          />
        </div>
        {err && <p className="admin-err">{err}</p>}
        <button className="btn" type="submit" disabled={busy}>
          <Icon name="lock" /> {busy ? 'Checking…' : 'Sign in'}
        </button>
        {!hasBackend() && (
          <p className="form-note">No backend configured — set VITE_SHEETS_API_URL (see backend/SETUP.md).</p>
        )}
      </form>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(isAdminAuthed());
  const [tab, setTab] = useState('overview');
  const [leads, setLeads] = useState([]);
  const [ops, setOps] = useState({ sites: [], tasks: [], worklogs: [], issues: [] });
  const [contentDraft, setContentDraft] = useState({});
  const [filter, setFilter] = useState({ division: '', status: '' });
  const [issueForm, setIssueForm] = useState({ siteId: '', title: '', detail: '', priority: 'medium' });
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const flash = (msg) => { setNotice(msg); setTimeout(() => setNotice(''), 3000); };

  const load = useCallback(async () => {
    if (!isAdminAuthed()) { setAuthed(false); return; }
    setLoading(true);
    const [l, o, c] = await Promise.all([
      adminOp('listLeads').catch(() => null),
      adminOp('listOps').catch(() => null),
      adminOp('listContent').catch(() => null),
    ]);
    if (l && l.leads) setLeads(l.leads);
    else if (l && l.error === 'unauthorized') { adminLogout(); setAuthed(false); }
    if (o && !o.error) {
      setOps({
        sites: o.sites || [],
        tasks: o.tasks || [],
        worklogs: o.worklogs || [],
        issues: o.issues || [],
      });
    }
    if (c && c.content) setContentDraft(c.content);
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  const filtered = useMemo(() => leads.filter((l) =>
    (!filter.division || l.division === filter.division) &&
    (!filter.status || l.status === filter.status)
  ), [leads, filter]);

  const stats = useMemo(() => {
    const byStatus = {};
    const byDivision = {};
    leads.forEach((l) => {
      byStatus[l.status || 'new'] = (byStatus[l.status || 'new'] || 0) + 1;
      byDivision[l.division || 'General'] = (byDivision[l.division || 'General'] || 0) + 1;
    });
    return { total: leads.length, byStatus, byDivision };
  }, [leads]);

  const openIssues = ops.issues.filter((i) => i.status !== 'resolved');
  const upcomingTasks = ops.tasks.filter((t) => t.status !== 'done').slice(0, 6);

  const setLeadStatus = async (row, status) => {
    await adminOp('setStatus', { row, status });
    setLeads((ls) => ls.map((l) => (l.row === row ? { ...l, status } : l)));
    flash('Status updated');
  };

  const setLeadNotes = async (row, notes) => {
    await adminOp('setNotes', { row, notes });
    setLeads((ls) => ls.map((l) => (l.row === row ? { ...l, notes } : l)));
    flash('Notes saved');
  };

  const completeTask = async (task) => {
    await adminOp('completeTask', { taskId: task.id, siteId: task.siteId });
    flash('Task logged — appears in work logs');
    load();
  };

  const addIssue = async (e) => {
    e.preventDefault();
    await adminOp('addIssue', issueForm);
    setIssueForm({ siteId: '', title: '', detail: '', priority: 'medium' });
    flash('Issue logged');
    load();
  };

  const setIssueStatus = async (row, status) => {
    await adminOp('setIssueStatus', { row, status });
    setOps((o) => ({ ...o, issues: o.issues.map((i) => (i.row === row ? { ...i, status } : i)) }));
    flash('Issue updated');
  };

  const saveContent = async (key) => {
    await adminOp('setContent', { key, value: contentDraft[key] ?? '' });
    flash('Saved — live on the site');
  };

  const exportCsv = () => {
    const head = ['Timestamp', 'Service', 'Type', 'Name', 'Contact', 'Ref', 'Preferred', 'Message', 'Status', 'Notes'];
    const rows = filtered.map((l) => [l.timestamp, l.division, l.type, l.name, l.contact, l.ref, l.preferred, l.message, l.status, l.notes]
      .map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(','));
    const blob = new Blob([[head.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `devine-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!authed) return <Login onOk={() => setAuthed(true)} />;

  const siteName = (id) => ops.sites.find((s) => s.id === id)?.property || id || '—';

  return (
    <div className="admin">
      <header className="admin-head">
        <div>
          <div className="eyebrow dark">Management</div>
          <h1>Devine dashboard</h1>
          <p>Leads · sites · content — {SITE.name}</p>
        </div>
        <div className="admin-head-actions">
          {notice && <span className="admin-notice">{notice}</span>}
          <button className="btn ghost" onClick={() => { adminLogout(); setAuthed(false); }}>
            <Icon name="logout" /> Sign out
          </button>
        </div>
      </header>

      <nav className="admin-tabs">
        {[['overview', 'Overview'], ['leads', `Leads (${leads.length})`], ['ops', 'Sites & ops'], ['content', 'Content']].map(([id, label]) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>
        ))}
      </nav>

      {loading && <p className="admin-loading">Loading…</p>}

      {tab === 'overview' && (
        <div className="admin-grid">
          <div className="panel admin-stat"><b>{stats.total}</b><span>Total leads</span></div>
          <div className="panel admin-stat"><b>{stats.byStatus.new || 0}</b><span>New / unread</span></div>
          <div className="panel admin-stat"><b>{ops.sites.length || '—'}</b><span>Sites on register</span></div>
          <div className="panel admin-stat"><b>{openIssues.length}</b><span>Open issues</span></div>
          <div className="panel" style={{ gridColumn: '1 / -1' }}>
            <h3>Leads by service</h3>
            <div className="chip-row">
              {Object.entries(stats.byDivision).map(([d, n]) => <span className="chip" key={d}>{d}: {n}</span>)}
              {!Object.keys(stats.byDivision).length && <span className="note">No leads yet.</span>}
            </div>
            <h3 style={{ marginTop: 22 }}>Leads by status</h3>
            <div className="chip-row">
              {LEAD_STATUSES.map((s) => <span className="chip" key={s}>{s}: {stats.byStatus[s] || 0}</span>)}
            </div>
          </div>
        </div>
      )}

      {tab === 'leads' && (
        <div>
          <div className="admin-toolbar">
            <select value={filter.division} onChange={(e) => setFilter((f) => ({ ...f, division: e.target.value }))}>
              <option value="">All services</option>
              {[...new Set(leads.map((l) => l.division))].map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filter.status} onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}>
              <option value="">All statuses</option>
              {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn ghost" onClick={load}><Icon name="refresh" /> Refresh</button>
            <button className="btn ghost" onClick={exportCsv}><Icon name="download" /> Export CSV</button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>When</th><th>Service</th><th>Type</th><th>Contact</th><th>Details</th><th>Status</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.row}>
                    <td className="nowrap">{new Date(l.timestamp).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{l.division}</td>
                    <td><span className="chip">{l.type}</span></td>
                    <td>
                      <b>{l.name}</b><br />
                      <a href={l.contact.includes('@') ? `mailto:${l.contact}` : `tel:${l.contact}`}>{l.contact}</a>
                      {l.preferred && <><br /><small>Prefers: {l.preferred}</small></>}
                    </td>
                    <td className="admin-msg">
                      {l.ref && <small><Icon name="building" /> {l.ref}</small>}
                      {l.message}
                    </td>
                    <td>
                      <select value={l.status} onChange={(e) => setLeadStatus(l.row, e.target.value)}>
                        {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <input
                        defaultValue={l.notes}
                        placeholder="Add note…"
                        onBlur={(e) => e.target.value !== l.notes && setLeadNotes(l.row, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan="7" className="admin-empty">{loading ? 'Loading…' : 'No leads match this filter.'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'ops' && (
        <div>
          <p className="note" style={{ marginBottom: 16 }}>
            Site register, task schedules, work logs and issue tracking — the same data the client portal reads. Sites flagged "demo/public" visibility appear on the portal.
          </p>

          {/* sites */}
          <h3 style={{ marginBottom: 12 }}>Site register</h3>
          <div className="admin-table-wrap" style={{ marginBottom: 28 }}>
            <table className="admin-table">
              <thead><tr><th>Site</th><th>Client</th><th>Scope</th><th>Supervisor</th><th>Visibility</th></tr></thead>
              <tbody>
                {ops.sites.map((s) => (
                  <tr key={s.id}>
                    <td><b>{s.property}</b></td>
                    <td>{s.client}</td>
                    <td style={{ fontSize: 12.5 }}>{s.serviceScope}</td>
                    <td>{s.supervisor}</td>
                    <td><span className="status-pill scheduled">{s.visibility || 'internal'}</span></td>
                  </tr>
                ))}
                {!ops.sites.length && <tr><td colSpan="5" className="admin-empty">{loading ? 'Loading…' : 'No sites yet — the Sites sheet seeds on first call.'}</td></tr>}
              </tbody>
            </table>
          </div>

          {/* upcoming tasks */}
          <h3 style={{ marginBottom: 12 }}>Upcoming tasks — mark complete to log work</h3>
          <div className="admin-table-wrap" style={{ marginBottom: 28 }}>
            <table className="admin-table">
              <thead><tr><th>Task</th><th>Site</th><th>Frequency</th><th>Next due</th><th></th></tr></thead>
              <tbody>
                {upcomingTasks.map((t) => (
                  <tr key={t.id}>
                    <td><b>{t.task}</b><br /><small>last {t.lastDone}</small></td>
                    <td>{siteName(t.siteId)}</td>
                    <td>{t.freq}</td>
                    <td className="nowrap">{t.nextDue}</td>
                    <td><button className="btn ghost small" onClick={() => completeTask(t)}><Icon name="check" /> Done</button></td>
                  </tr>
                ))}
                {!upcomingTasks.length && <tr><td colSpan="5" className="admin-empty">{loading ? 'Loading…' : 'No tasks scheduled.'}</td></tr>}
              </tbody>
            </table>
          </div>

          {/* issues */}
          <h3 style={{ marginBottom: 12 }}>Issue register</h3>
          <div className="admin-table-wrap" style={{ marginBottom: 28 }}>
            <table className="admin-table">
              <thead><tr><th>Issue</th><th>Site</th><th>Priority</th><th>Status</th><th>Due</th></tr></thead>
              <tbody>
                {ops.issues.map((i) => (
                  <tr key={i.row}>
                    <td><b>{i.title}</b><br /><small>{i.detail}</small></td>
                    <td>{siteName(i.siteId)}</td>
                    <td><span className={`pri-${i.priority}`}>{i.priority}</span></td>
                    <td>
                      <select value={i.status} onChange={(e) => setIssueStatus(i.row, e.target.value)}>
                        {ISSUE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="nowrap">{i.due}</td>
                  </tr>
                ))}
                {!ops.issues.length && <tr><td colSpan="5" className="admin-empty">{loading ? 'Loading…' : 'No issues logged.'}</td></tr>}
              </tbody>
            </table>
          </div>

          {/* add issue */}
          <div className="panel" style={{ maxWidth: 720 }}>
            <h3>Log a new issue</h3>
            <form onSubmit={addIssue}>
              <div className="form-grid">
                <div className="field">
                  <label>Site</label>
                  <select required value={issueForm.siteId} onChange={(e) => setIssueForm((f) => ({ ...f, siteId: e.target.value }))}>
                    <option value="">Select site…</option>
                    {ops.sites.map((s) => <option key={s.id} value={s.id}>{s.property}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Priority</label>
                  <select value={issueForm.priority} onChange={(e) => setIssueForm((f) => ({ ...f, priority: e.target.value }))}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Title</label>
                <input required value={issueForm.title} onChange={(e) => setIssueForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Irrigation leak — south lawn" />
              </div>
              <div className="field">
                <label>Detail</label>
                <textarea rows={2} value={issueForm.detail} onChange={(e) => setIssueForm((f) => ({ ...f, detail: e.target.value }))} placeholder="What was found, where, what needs doing" />
              </div>
              <button className="btn" type="submit"><Icon name="plus" /> Log issue</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'content' && (
        <div>
          <p className="note" style={{ marginBottom: 16 }}>
            Edit the text management controls. Leave a field empty to fall back to the built-in copy. Changes go live immediately — no code deploy needed.
          </p>
          <div className="admin-content">
            {CONTENT_KEYS.map(({ key, label }) => (
              <div className="field" key={key}>
                <label>{label} <code>{key}</code></label>
                {key === 'announcement' || key.endsWith('.tag') ? (
                  <input
                    value={contentDraft[key] ?? ''}
                    onChange={(e) => setContentDraft((d) => ({ ...d, [key]: e.target.value }))}
                    placeholder="(empty = hidden / default)"
                  />
                ) : (
                  <textarea
                    rows={key.endsWith('.card') ? 3 : 2}
                    value={contentDraft[key] ?? ''}
                    onChange={(e) => setContentDraft((d) => ({ ...d, [key]: e.target.value }))}
                    placeholder="(empty = default text)"
                  />
                )}
                <button className="btn ghost" style={{ marginTop: 8 }} onClick={() => saveContent(key)}>
                  <Icon name="check" /> Save
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
