import { useEffect, useState } from 'react';
import { PageHero } from '../components/Shared';
import FadeIn from '../components/FadeIn';
import { Icon } from '../components/Icons';
import { fetchOps, hasBackend } from '../lib/api';
import {
  DEMO_SITE, DEMO_TASKS, DEMO_WORKLOGS, DEMO_ISSUES, DEMO_MONTHLY,
} from '../data/ops';

// Client-reporting portal — a working demo of how estate/complex clients
// see their site cared for: schedule, work logs with photo evidence,
// issue register and a monthly report. Live data replaces the bundled
// demo data when the Apps Script backend is configured.

const STATUS_LABEL = { scheduled: 'Scheduled', open: 'Open', 'in-progress': 'In progress', resolved: 'Resolved', done: 'Done' };

function DemoBanner({ live }) {
  return (
    <div className="portal-banner">
      <Icon name="eye" />
      <div>
        {live ? (
          <><b>Live portal data.</b> This is real data from the connected backend — shown here as the client view.</>
        ) : (
          <><b>Demo data.</b> Everything on this page is illustrative sample data showing how a client portal works — it is not a real Devine client site. When the backend is connected, live site data appears here.</>
        )}
      </div>
    </div>
  );
}

export default function Portal() {
  const [ops, setOps] = useState(null);
  const [tab, setTab] = useState('overview'); // overview | schedule | logs | issues | report
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let live = true;
    fetchOps().then((d) => { if (live && d && Array.isArray(d.sites) && d.sites.length) setOps(d); });
    return () => { live = false; };
  }, []);

  const live = !!ops;
  const site = ops?.sites?.[0] || DEMO_SITE;
  const tasks = ops?.tasks || DEMO_TASKS;
  const worklogs = ops?.worklogs || DEMO_WORKLOGS;
  const issues = ops?.issues || DEMO_ISSUES;
  const monthly = DEMO_MONTHLY; // report template is always illustrative for now

  const upcoming = tasks.filter((t) => t.status !== 'done').slice(0, 5);
  const openIssues = issues.filter((i) => i.status !== 'resolved');

  const tabs = [
    ['overview', 'Overview'],
    ['schedule', 'Schedule'],
    ['logs', 'Work logs'],
    ['issues', 'Issues'],
    ['report', 'Monthly report'],
  ];

  return (
    <>
      <PageHero
        title={<>Client portal —<br /><em>see the work, not just hear about it.</em></>}
        lead="A demo of how Devine keeps estate and property clients informed: what's scheduled, what was done, what's outstanding and what comes next."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Client portal' }]}
        tags={[
          { icon: 'calendar', label: 'Live schedule' },
          { icon: 'camera', label: 'Photo evidence' },
          { icon: 'doc', label: 'Monthly reports' },
        ]}
      />

      <section className="section">
        <div className="container">
          <DemoBanner live={live && hasBackend()} />

          {/* site header */}
          <FadeIn>
            <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span className="tag dev">Client view</span>
                <h3 style={{ margin: '8px 0 4px' }}>{site.property || site.client}</h3>
                <p style={{ margin: 0, fontSize: 13.5, color: 'var(--muted)' }}>
                  {site.serviceScope} · Supervisor: {site.supervisor}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="status-pill scheduled">Active site</span>
              </div>
            </div>
          </FadeIn>

          {/* tabs */}
          <div className="admin-tabs" style={{ position: 'static', margin: '22px auto 0', borderRadius: 8, border: '1px solid var(--line)', maxWidth: 'none' }}>
            {tabs.map(([k, label]) => (
              <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{label}</button>
            ))}
          </div>

          {/* ---------- overview ---------- */}
          {tab === 'overview' && (
            <>
              <div className="dash-grid">
                <div className="dash-card"><b>{tasks.length}</b><span>Scheduled tasks</span><small>{upcoming.length} upcoming</small></div>
                <div className="dash-card"><b>{worklogs.length}</b><span>Recent work logs</span><small>with photo evidence</small></div>
                <div className="dash-card"><b>{openIssues.length}</b><span>Open issues</span><small>{issues.length - openIssues.length} resolved</small></div>
                <div className="dash-card"><b>{monthly.stats[0].value}</b><span>Tasks on time</span><small>{monthly.period}</small></div>
              </div>

              <div className="dash-cols">
                <div className="dash-panel">
                  <h3>Coming up</h3>
                  <div className="dash-list">
                    {upcoming.map((t) => (
                      <div className="dash-row" key={t.id}>
                        <div className="dash-main">
                          <b>{t.task}</b>
                          <small>{t.freq} · last done {t.lastDone}</small>
                        </div>
                        <div className="dash-meta">
                          <span className="status-pill scheduled">{STATUS_LABEL[t.status] || t.status}</span>
                          <small>due {t.nextDue}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="dash-panel">
                  <h3>Needs attention</h3>
                  <div className="dash-list">
                    {openIssues.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>No open issues — all clear.</p>}
                    {openIssues.map((i) => (
                      <div className="dash-row" key={i.id}>
                        <div className="dash-main">
                          <b>{i.title}</b>
                          <small>raised {i.raised} · due {i.due}</small>
                        </div>
                        <div className="dash-meta">
                          <span className={`status-pill ${i.status === 'in-progress' ? 'progress' : 'open'}`}>{STATUS_LABEL[i.status]}</span>
                          <small className={`pri-${i.priority}`}>{i.priority}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ---------- schedule ---------- */}
          {tab === 'schedule' && (
            <div className="dash-panel">
              <h3>Recurring task schedule</h3>
              <div className="dash-list">
                {tasks.map((t) => (
                  <div className="dash-row" key={t.id}>
                    <div className="dash-main">
                      <b>{t.task}</b>
                      <small>{t.freq}</small>
                    </div>
                    <div className="dash-meta">
                      <small>last {t.lastDone}</small>
                      <small>next {t.nextDue}</small>
                      <span className="status-pill scheduled">{STATUS_LABEL[t.status] || t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- work logs ---------- */}
          {tab === 'logs' && (
            <div className="dash-panel">
              <h3>Completed work — with evidence</h3>
              <div className="dash-list">
                {worklogs.map((w, i) => (
                  <div className="dash-row" key={i} style={{ alignItems: 'flex-start' }}>
                    <div className="dash-main">
                      <b>{w.task}</b>
                      <small>{w.date} · {w.by}</small>
                      <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--ink-soft)' }}>{w.notes}</p>
                      {w.photo && (
                        <button
                          className="gallery-tile"
                          style={{ marginTop: 10, maxWidth: 220, aspectRatio: '16/10' }}
                          onClick={() => setLightbox({ src: w.photo, alt: w.photoAlt })}
                        >
                          <img src={w.photo} alt={w.photoAlt} loading="lazy" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="note">Photos are representative placeholders — real client portals show the crew's own site photos.</p>
            </div>
          )}

          {/* ---------- issues ---------- */}
          {tab === 'issues' && (
            <div className="dash-panel">
              <h3>Issue register</h3>
              <div className="dash-list">
                {issues.map((i) => (
                  <div className="dash-row" key={i.id}>
                    <div className="dash-main">
                      <b>{i.title}</b>
                      <small>{i.detail}</small>
                      <small>owner: {i.owner}</small>
                    </div>
                    <div className="dash-meta">
                      <span className={`status-pill ${i.status === 'in-progress' ? 'progress' : i.status === 'resolved' ? 'resolved' : 'open'}`}>{STATUS_LABEL[i.status]}</span>
                      <small className={`pri-${i.priority}`}>{i.priority} priority</small>
                      <small>due {i.due}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- monthly report ---------- */}
          {tab === 'report' && (
            <div className="dash-panel">
              <h3>Monthly service report — {monthly.period}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>{monthly.site}</p>
              <div className="dash-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', margin: '18px 0' }}>
                {monthly.stats.map((s) => (
                  <div className="dash-card" key={s.label}><b>{s.value}</b><span>{s.label}</span><small>{s.note}</small></div>
                ))}
              </div>
              <h4 style={{ marginTop: 8 }}>Highlights</h4>
              <ul className="checklist">
                {monthly.highlights.map((h) => <li key={h}><Icon name="check" /> {h}</li>)}
              </ul>
              <p className="note">Sample report format — the real version is generated from the site's actual task, log and issue data.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <div className="panel" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{ fontSize: 26 }}>Want this for your property?</h2>
            <p style={{ color: 'var(--muted)' }}>
              The portal is part of how Devine manages sites — scheduled tasks, documented work and a monthly report your trustees or managing agent can read. Ask us to set one up when we scope your services.
            </p>
            <a className="btn lime" href="/contact">Request a quote <Icon name="arrowRight" /></a>
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" aria-label="Close" onClick={() => setLightbox(null)}>
            <Icon name="close" />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.alt} />
            <figcaption>{lightbox.alt}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
