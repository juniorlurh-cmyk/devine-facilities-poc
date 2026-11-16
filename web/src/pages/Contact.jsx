import { useState } from 'react';
import FadeIn from '../components/FadeIn';
import { Icon } from '../components/Icons';
import { PageHero, Heading } from '../components/Shared';
import LeadModal from '../components/LeadModal';
import { SITE, PEOPLE, PRIMARY_CONTACT, mailto } from '../data/site';
import { SERVICES } from '../data/services';

const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const MAP_QUERY = encodeURIComponent('Devine Facilities Management, Pretoria, Gauteng');

export default function Contact() {
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <>
      <PageHero
        title={<>Let's talk about<br /><em>your property.</em></>}
        lead="Questions, quote requests, site assessments — reach the team directly or send an enquiry through the form."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        image={img('photo-1465146344425-f00d5f5c8f07')}
        tags={[{ icon: 'phone', label: PRIMARY_CONTACT.phoneDisplay }, { icon: 'pin', label: 'Pretoria & Tshwane' }]}
      />

      <section className="section">
        <div className="container contact-layout">
          <FadeIn>
            <div className="eyebrow dark">Get in touch</div>
            <h2>Contact details</h2>
            <div className="copy" style={{ marginTop: 16 }}>
              <p>
                {PRIMARY_CONTACT.name} is the primary public contact, with{' '}
                {PEOPLE[1].name} also listed on the company\u2019s website. Both
                are reachable by phone or email.
              </p>
            </div>
            <div className="panel">
              <h3>Direct contacts</h3>
              <div className="kv">
                {PEOPLE.map((p) => (
                  <div className="kv-row" key={p.email}>
                    <Icon name="user" />
                    <div>
                      <b>{p.name}</b>
                      <span>
                        <a href={`tel:${p.phoneTel}`}>{p.phoneDisplay}</a> ·{' '}
                        <a href={mailto(`Website enquiry — ${p.name}`)}>{p.email}</a>
                      </span>
                    </div>
                  </div>
                ))}
                <div className="kv-row">
                  <Icon name="pin" />
                  <div><b>Postal address</b><span>{SITE.postalAddress}</span></div>
                </div>
                <div className="kv-row">
                  <Icon name="clock" />
                  <div><b>Service area</b><span>{SITE.serviceAreaNote}</span></div>
                </div>
              </div>
            </div>
            <div className="panel">
              <h3>Send an enquiry</h3>
              <p>The form opens a structured enquiry — service, property details and preferred contact.</p>
              <button className="btn" onClick={() => setLeadOpen(true)}>
                <Icon name="send" /> Send an enquiry
              </button>
              <p className="note" style={{ marginTop: 12 }}>
                Prefer email? <a href={mailto('Website enquiry — Devine Facilities Management')} style={{ color: 'var(--pine-2)', fontWeight: 600 }}>{PRIMARY_CONTACT.email}</a>
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <LeadModal
              open={leadOpen}
              onClose={() => setLeadOpen(false)}
              service="General"
              type="enquiry"
              title="Send an enquiry"
            />
            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const body = [
                  `Name: ${fd.get('name')}`,
                  `Contact: ${fd.get('contact')}`,
                  `Service interest: ${fd.get('service') || 'General'}`,
                  `Property/site: ${fd.get('property') || '—'}`,
                  '',
                  fd.get('message'),
                ].join('\n');
                window.location.href = mailto(
                  `Website enquiry — ${fd.get('name')} — ${fd.get('service') || 'General'}`,
                  body
                );
              }}
            >
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="ct-name">Your name</label>
                  <input id="ct-name" name="name" required placeholder="Full name" autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="ct-contact">Email or phone</label>
                  <input id="ct-contact" name="contact" required placeholder="How we reach you" />
                </div>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="ct-service">Service of interest</label>
                  <select id="ct-service" name="service" defaultValue="">
                    <option value="">General enquiry</option>
                    {SERVICES.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                    <option value="Multiple / not sure">Multiple services / not sure</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="ct-property">Property / site (optional)</label>
                  <input id="ct-property" name="property" placeholder="Estate, complex or company name" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="ct-msg">Message</label>
                <textarea id="ct-msg" name="message" required placeholder="What does the property need? Services, frequency, timing…" />
              </div>
              <button className="btn" type="submit">
                <Icon name="send" /> Send via email
              </button>
              <p className="form-note">
                This opens your email app addressed to {PRIMARY_CONTACT.email}. For faster handling use "Send an enquiry" on the left.
              </p>
            </form>
          </FadeIn>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Heading eyebrow="Find us" title="Service area" aside="Devine is Pretoria-based and serves Pretoria and the greater Tshwane region." />
          <div className="map-wrap">
            <iframe
              title="Devine Facilities Management — Pretoria service area"
              src={`https://maps.google.com/maps?q=${MAP_QUERY}&z=11&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="map-bar">
              <div>
                <b>Pretoria &amp; greater Tshwane</b>
                <span>{SITE.serviceAreaNote} · {SITE.postalAddress}</span>
              </div>
              <a
                className="btn ghost small"
                href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Maps <Icon name="external" />
              </a>
            </div>
          </div>
          <p className="note">
            Map shows the general Pretoria service area — Devine\u2019s registered street address isn\t confirmed publicly; the postal address above is the verified one.
          </p>
        </div>
      </section>
    </>
  );
}
