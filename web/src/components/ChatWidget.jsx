import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiChat, hasKey } from '../ai/provider';
import { SITE, PEOPLE, PRIMARY_CONTACT, REVIEWS, mailto } from '../data/site';
import { SERVICES } from '../data/services';
import { Icon } from './Icons';

const SUGGESTIONS = [
  'What services do you offer?',
  'Do you work on sectional title complexes?',
  'How is the client portal different?',
  'How do I request a quote?',
];

const FAQ = [
  {
    match: /service|offer|do you do|landscap|clean|garden|caretaker|plant/i,
    answer: `Devine offers four services across Pretoria and greater Tshwane: ${SERVICES.map((s) => s.name).join(', ')} — plus indoor plant solutions. All for estates, sectional title complexes, commercial properties and developers.`,
    link: { to: '/services', label: 'See all services' },
  },
  {
    match: /portal|dashboard|report|client|evidence|track/i,
    answer: `The client portal is a demo of how estate and property clients see their site cared for: scheduled tasks, photo-documented work logs, an issue register and a monthly service report. It's a working example — ask us to set one up for your property.`,
    link: { to: '/portal', label: 'See the portal demo' },
  },
  {
    match: /estate|complex|sectional|commercial|developer|agent|area|where|pretoria|tshwane|cover/i,
    answer: `Devine works across Pretoria and greater Tshwane — residential estates, sectional title complexes, commercial properties, property developers and managing agents. ${SITE.postalAddress}.`,
    link: { to: '/about', label: 'About the company' },
  },
  {
    match: /quote|price|cost|enquire|contact|call|email|speak/i,
    answer: `Request a quote through the contact page or call ${PRIMARY_CONTACT.phoneDisplay} / email ${PRIMARY_CONTACT.email}. Site assessments are the usual first step — tell us the property and services you need.`,
    link: { to: '/contact', label: 'Contact page' },
  },
  {
    match: /review|rating|testimonial|trust|experience|years|long/i,
    answer: `Devine states it has been operating for ${SITE.established} years. Public directory listings show a ${REVIEWS.rating}★ rating across ${REVIEWS.count} reviews. One published testimonial comes from a trustee at iQ Whistling Thorn estate.`,
    link: { to: '/about', label: 'About the company' },
  },
];

const FALLBACK = `I can help with Devine's services, service area, the client portal demo and how to request a quote. For anything else, email ${PRIMARY_CONTACT.email} or call ${PRIMARY_CONTACT.phoneDisplay}.`;

const SYSTEM = `You are the website assistant for ${SITE.name}, a Pretoria facilities-management company (${SITE.established} years in operation per the company's own site). Services: landscaping & garden maintenance, commercial & estate cleaning, landscape installations, caretaker services, and indoor plant solutions — for residential estates, sectional title complexes, commercial properties, developers and managing agents across Pretoria/greater Tshwane.
Contacts: ${PEOPLE.map((p) => `${p.name} (${p.phoneDisplay}, ${p.email})`).join('; ')}. Postal: ${SITE.postalAddress}.
The site includes a working demo of a client-reporting portal (/portal) — scheduled tasks, work logs with photo evidence, issue register, monthly report — labelled as illustrative sample data.
Public directory listings show ${REVIEWS.rating}★ across ${REVIEWS.count} reviews.
Never invent prices, certifications, registrations, staff names beyond the two contacts, or service claims not listed here. Keep answers short and plain; if unsure, point to the contact page.`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: `Hi — I'm the ${SITE.short} assistant. Ask me about our services, service area, or the client portal demo.` },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || busy) return;
    setInput('');
    setMsgs((m) => [...m, { from: 'user', text: q }]);
    setBusy(true);
    const faq = FAQ.find((f) => f.match.test(q));
    let reply = null;
    if (hasKey()) {
      try {
        reply = await aiChat([
          { role: 'system', content: SYSTEM },
          { role: 'user', content: q },
        ]);
      } catch { reply = null; }
    }
    if (!reply) reply = faq ? faq.answer : FALLBACK;
    setMsgs((m) => [...m, { from: 'bot', text: reply, link: faq?.link }]);
    setBusy(false);
  };

  return (
    <>
      <button
        className="chat-fab"
        aria-label={open ? 'Close assistant' : 'Chat with the Devine assistant'}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? 'close' : 'sparkles'} />
      </button>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Devine assistant">
          <div className="chat-head">
            <b>Devine assistant</b>
            <span>{hasKey() ? 'AI-powered' : 'Quick answers'}</span>
          </div>
          <div className="chat-body">
            {msgs.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                <p>{m.text}</p>
                {m.link && (
                  <Link className="chat-link" to={m.link.to}>{m.link.label} →</Link>
                )}
              </div>
            ))}
            {busy && <div className="chat-msg bot"><p className="chat-typing">Thinking…</p></div>}
            <div ref={bottomRef} />
          </div>
          <div className="chat-sugg">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} disabled={busy}>{s}</button>
            ))}
          </div>
          <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our services…"
              aria-label="Message"
            />
            <button type="submit" aria-label="Send" disabled={busy}>
              <Icon name="arrowRight" />
            </button>
          </form>
          <a className="chat-mail" href={mailto('Website enquiry — Devine Facilities Management')}>
            Prefer email? {PRIMARY_CONTACT.email}
          </a>
        </div>
      )}
    </>
  );
}
