import { useState } from 'react';
import FadeIn from '../components/FadeIn';
import { PageHero, Heading } from '../components/Shared';
import { Icon } from '../components/Icons';
import VizBoard from '../components/VizBoard';
import { aiChat, hasKey } from '../ai/provider';
import {
  INSIGHT_LABELS, INSIGHT_ROWS, PUBLIC_SIGNALS, insightSummary,
} from '../data/insights';
import { SITE, REVIEWS } from '../data/site';

const BRIEF_PROMPT = `You are a business analyst writing a short internal briefing for ${SITE.name}, a Pretoria facilities-management company.
Service lines: Landscaping & Gardening, Commercial & Estate Cleaning, Landscape Installations, Caretaker Services (+ indoor greenery). Client types: residential estates, sectional title complexes, commercial properties, developers, managing agents.
Given the indicative data below, write 3 short sections: (1) Where the service focus sits, (2) What to watch, (3) One practical next step per service line. Plain text, short paragraphs, no hype, no invented figures.`;

function exportReport(briefing) {
  const svcRows = INSIGHT_ROWS.map((r) => `<tr><td>${r.service}</td><td>${r.sectors}</td><td>${r.note}</td></tr>`).join('');
  const pubRows = PUBLIC_SIGNALS.map((p) => `<tr><td>${p.label}</td><td>${p.value}</td></tr>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Devine service report</title>
<style>body{font-family:Georgia,serif;max-width:760px;margin:40px auto;color:#1c2420;padding:0 20px}h1{font-size:28px}h2{font-size:18px;margin-top:32px;border-bottom:2px solid #1e3d2f;padding-bottom:6px}table{width:100%;border-collapse:collapse;font-size:14px;font-family:Arial,sans-serif}td,th{padding:8px 10px;border-bottom:1px solid #ddd;text-align:left}th{background:#e2ecdc}.note{font-size:12px;color:#666;font-family:Arial,sans-serif;margin-top:24px}</style></head><body>
<h1>${SITE.name} — service report</h1>
<p>Generated ${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })} · Indicative positioning data, not audited market intelligence.</p>
<h2>Service lines</h2><table><tr><th>Service</th><th>Best-fit sectors</th><th>Note</th></tr>${svcRows}</table>
<h2>Public signals</h2><table>${pubRows}</table>
${briefing ? `<h2>AI briefing</h2><p style="white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px">${briefing}</p>` : ''}
<p class="note">${SITE.name} · ${SITE.postalAddress} · ${SITE.website}</p></body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'devine-service-report.html';
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function Insights() {
  const [briefing, setBriefing] = useState('');
  const [busy, setBusy] = useState(false);

  const genBriefing = async () => {
    setBusy(true);
    try {
      const out = await aiChat([
        { role: 'system', content: BRIEF_PROMPT },
        { role: 'user', content: insightSummary() },
      ]);
      setBriefing(out);
    } catch {
      setBriefing('Briefing generation failed — try again.');
    }
    setBusy(false);
  };

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Insights' }]}
        title={<>Service <em>insights.</em></>}
        lead="An internal view of where Devine's service focus sits — service-line positioning, client-type fit and the company's public signals. Indicative data, not audited market intelligence."
        tags={[{ label: 'Internal view', icon: 'doc' }, { label: 'Indicative data', icon: 'shield' }]}
      />
      <section className="section white">
        <div className="container">
          <FadeIn>
            <div className="heading">
              <div>
                <div className="eyebrow dark">Across the services</div>
                <h2>Where the focus <em>sits.</em></h2>
              </div>
              <button className="btn ghost" onClick={() => exportReport(briefing)}>
                <Icon name="doc" /> Export report
              </button>
            </div>
          </FadeIn>
          <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="admin-table" style={{ width: '100%' }}>
              <thead>
                <tr><th>Service line</th><th>Best-fit sectors</th><th>Positioning note</th></tr>
              </thead>
              <tbody>
                {INSIGHT_ROWS.map((r) => (
                  <tr key={r.service}>
                    <td><b>{r.service}</b></td>
                    <td style={{ fontSize: 13 }}>{r.sectors}</td>
                    <td style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container content-grid">
          <FadeIn>
            <div>
              <div className="eyebrow dark">Client types</div>
              <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 'clamp(28px,4vw,42px)', margin: '10px 0 18px', letterSpacing: '-0.015em' }}>Who we <em style={{ color: 'var(--clay)', fontStyle: 'normal' }}>serve.</em></h2>
              <p style={{ color: 'var(--ink-soft)', maxWidth: 520 }}>
                Devine's model is built for shared-space properties — places where
                landscaping, cleaning and caretaking decisions affect many
                stakeholders at once. The chart scores below are editorial
                positioning estimates, not measured demand.
              </p>
              <div className="chip-row">
                {INSIGHT_LABELS.filter((l) => !['Landscaping & Gardening', 'Commercial & Estate Cleaning', 'Landscape Installations', 'Caretaker Services'].includes(l)).map((c) => (
                  <span className="chip" key={c}><Icon name="users" /> {c}</span>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div>
              <div className="panel">
                <h3>Public signals</h3>
                <div className="kv">
                  {PUBLIC_SIGNALS.map((p) => (
                    <div className="kv-row" key={p.label}>
                      <Icon name="check" />
                      <span><b>{p.label}</b>{p.value}</span>
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: 12 }}>
                  Rating is directory-sourced ({REVIEWS.source}) — not independently verified.
                </p>
              </div>
              {hasKey() && (
                <div className="panel">
                  <h3>AI service briefing</h3>
                  <p>Generate a short analyst read of this data for internal discussion.</p>
                  <button className="btn" onClick={genBriefing} disabled={busy}>
                    <Icon name="sparkles" /> {busy ? 'Generating…' : 'Generate briefing'}
                  </button>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
        {briefing && (
          <div className="container" style={{ marginTop: 28 }}>
            <FadeIn>
              <div className="panel" style={{ maxWidth: 820, margin: '0 auto' }}>
                <h3>AI briefing</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{briefing}</p>
              </div>
            </FadeIn>
          </div>
        )}
      </section>

      <section className="section">
        <div className="container">
          <Heading
            eyebrow="Visualised"
            title="Charts, chosen by the model."
            aside="The model picks which chart types best report this data; an eval gate validates every spec before it renders."
          />
          <VizBoard />
          <p className="note">
            Scores are editorial positioning estimates plus public directory
            signals — for internal discussion, not audited market intelligence.
          </p>
        </div>
      </section>
    </>
  );
}
