import { useEffect, useState } from 'react';
import { SITE, mailto } from '../data/site';
import { hasBackend, submitLead } from '../lib/api';
import { Icon } from './Icons';

const TYPE_LABELS = {
  enquiry: 'Enquiry',
  quote_request: 'Quote request',
  site_assessment: 'Site assessment request',
  feedback: 'Feedback',
};

// Lead capture modal — posts to the Apps Script backend (Leads sheet).
// Without a backend configured it falls back to a pre-filled email so the
// site never loses an enquiry.
export default function LeadModal({ open, onClose, service = 'General', type = 'enquiry', title, ref, preferred }) {
  const [form, setForm] = useState({ name: '', contact: '', message: '', preferred: preferred || '', website: '' });
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, preferred: preferred || f.preferred }));
      setState('idle');
    }
  }, [open, preferred]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const showPreferred = type === 'site_assessment' || type === 'quote_request';

  const submit = async (e) => {
    e.preventDefault();
    if (state === 'sending') return;

    if (!hasBackend()) {
      // No backend yet — hand off to email so nothing is lost.
      const body = [
        `Name: ${form.name}`,
        `Contact: ${form.contact}`,
        `Service: ${service}`,
        `Type: ${TYPE_LABELS[type] || type}`,
        ref ? `Property/site: ${ref}` : null,
        form.preferred ? `Preferred date: ${form.preferred}` : null,
        '',
        form.message,
      ].filter(Boolean).join('\n');
      window.location.href = mailto(
        `Website ${TYPE_LABELS[type] || 'enquiry'} — ${service} — ${form.name}`,
        body
      );
      onClose?.();
      return;
    }

    setState('sending');
    const res = await submitLead({
      division: service,
      type,
      name: form.name,
      contact: form.contact,
      message: form.message,
      ref: ref || '',
      preferred: form.preferred || '',
      website: form.website, // honeypot
    }).catch(() => ({ error: 'network' }));

    if (res && res.ok) {
      setState('sent');
      setTimeout(() => onClose?.(), 1600);
    } else {
      setState('error');
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title || 'Send an enquiry'} onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" />
        </button>
        {state === 'sent' ? (
          <div className="modal-done">
            <span className="modal-done-icon"><Icon name="check" /></span>
            <h3>Enquiry sent</h3>
            <p>The team will be in touch{hasBackend() ? ' shortly' : ''}.</p>
          </div>
        ) : (
          <>
            <div className="eyebrow dark">{service}</div>
            <h3 style={{ margin: '6px 0 4px' }}>{title || `${TYPE_LABELS[type] || 'Enquiry'} — ${service}`}</h3>
            <p className="modal-sub">
              {hasBackend()
                ? 'This goes straight to the team\u2019s lead inbox.'
                : `This opens your email app addressed to ${SITE.email}.`}
            </p>
            <form onSubmit={submit}>
              {ref && <div className="lead-ref"><Icon name="building" /> {ref}</div>}
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="lm-name">Your name</label>
                  <input id="lm-name" required value={form.name} onChange={set('name')} placeholder="Full name" autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="lm-contact">Email or phone</label>
                  <input id="lm-contact" required value={form.contact} onChange={set('contact')} placeholder="How we reach you" autoComplete="email" />
                </div>
              </div>
              {showPreferred && (
                <div className="field">
                  <label htmlFor="lm-pref">Preferred date for a site visit / call</label>
                  <input id="lm-pref" type="datetime-local" value={form.preferred} onChange={set('preferred')} />
                </div>
              )}
              <div className="field">
                <label htmlFor="lm-msg">Message</label>
                <textarea
                  id="lm-msg"
                  required
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Tell us about the property and what you need — services, frequency, timing."
                />
              </div>
              {/* honeypot — hidden from humans */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={set('website')}
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
                aria-hidden="true"
              />
              {state === 'error' && (
                <p className="form-note" style={{ color: 'var(--clay-dark)' }}>
                  That didn't send — please email {SITE.email} directly.
                </p>
              )}
              <button className="btn" type="submit" disabled={state === 'sending'}>
                <Icon name="send" /> {state === 'sending' ? 'Sending…' : hasBackend() ? 'Send enquiry' : 'Compose email'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
