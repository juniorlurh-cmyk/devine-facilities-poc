import { useParams, Link } from 'react-router-dom';
import FadeIn from '../../components/FadeIn';
import { Icon } from '../../components/Icons';
import { PageHero, Heading, Steps, Faq } from '../../components/Shared';
import ServiceCallout from '../../components/ServiceCallout';
import { SERVICES } from '../../data/services';
import { PRIMARY_CONTACT, mailto } from '../../data/site';

const PROCESS = [
  { n: '01', t: 'Site assessment', d: 'We visit, measure the scope and agree what "done properly" looks like for this property.' },
  { n: '02', t: 'Schedule agreed', d: 'Frequency, team and service days are set per site — weekly, fortnightly, monthly or as needed.' },
  { n: '03', t: 'Supervised delivery', d: 'Work happens on schedule with supervision and clear communication to the agent or board.' },
  { n: '04', t: 'Reporting', d: 'Completed work is logged with evidence; issues are tracked; monthly summaries go to the client.' },
];

const EXTRA_FAQS = {
  'landscaping-gardening': [
    { q: 'How often is garden maintenance done?', a: 'Frequency is agreed per site — typically weekly or fortnightly for mowing, weeding and bed care, with seasonal deep-cleans as needed.' },
    { q: 'Do you work in winter?', a: 'Yes — pruning, bed preparation, irrigation checks and planting continue through winter; schedules adjust to the season.' },
  ],
  'commercial-estate-cleaning': [
    { q: 'What areas do you clean?', a: 'Communal areas, walkways, staircases, entrances, lobbies, shared facilities and refuse areas — the spaces residents and visitors share.' },
    { q: 'Can cleaning be combined with gardening?', a: 'Yes — many sites run both on the same schedule under one point of contact, which simplifies management for trustees and agents.' },
  ],
  'landscape-installations': [
    { q: 'Do you handle large or unusual projects?', a: 'Yes — the company\u2019s published projects include elevated landscape installations on multi-storey developments using crane lifting and custom planters.' },
    { q: 'Do you maintain what you install?', a: 'Handover typically includes a care plan; ongoing maintenance can continue under the landscaping service.' },
  ],
  'caretaker': [
    { q: 'Full-time or part-time caretakers?', a: 'Both are possible — full-time presence or scheduled service days, depending on what the site needs.' },
    { q: 'What does a caretaker actually do?', a: 'Supervises common areas, coordinates contractors and trades, obtains quotations for required work, monitors the property and keeps indoor greenery healthy.' },
  ],
};

export default function ServicePage() {
  const { id } = useParams();
  const service = SERVICES.find((s) => s.id === id);
  const others = SERVICES.filter((s) => s.id !== id);

  if (!service) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Service not found</h2>
          <p><Link to="/services" style={{ color: 'var(--pine-2)', fontWeight: 700 }}>Browse all services</Link></p>
        </div>
      </section>
    );
  }

  const faqs = [
    ...(EXTRA_FAQS[id] || []),
    {
      q: 'How do we get started?',
      a: `Request a quote below or contact ${PRIMARY_CONTACT.name} on ${PRIMARY_CONTACT.phoneDisplay}. A site assessment is usually the first step.`,
    },
  ];

  return (
    <>
      <PageHero
        title={<>{service.name.split('&')[0]}<br /><em>{service.name.includes('&') ? service.name.split('&')[1].trim() : 'done properly'}</em></>}
        lead={service.summary}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: service.name }]}
        image={service.image}
        tags={[{ icon: service.icon, label: service.tag }, { icon: 'pin', label: 'Pretoria & Tshwane' }]}
      />

      <section className="section">
        <div className="container content-grid">
          <FadeIn>
            <div className="eyebrow dark">{service.tag}</div>
            <h2>{service.name}</h2>
            <div className="copy">
              <p>{service.detail}</p>
              <p>
                Delivered for {['residential estates', 'sectional title complexes', 'commercial properties', 'property developers', 'managing agents'].join(', ')} across Pretoria and greater Tshwane.
              </p>
            </div>
            <ul className="checklist">
              {service.points.map((p) => (
                <li key={p}><Icon name="check" /> {p}</li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="panel">
              <h3>What this service includes</h3>
              <div className="kv">
                {service.points.map((p) => (
                  <div className="kv-row" key={p}><Icon name="check" /><span>{p}</span></div>
                ))}
              </div>
            </div>
            <div className="panel">
              <h3>Enquire about {service.name.toLowerCase()}</h3>
              <p>Tell us about the property — we'll come back with options, scheduling and a proposal.</p>
              <div className="delivery-row">
                <a className="delivery-btn brand" href={mailto(`Quote request — ${service.name}`)}>
                  <Icon name="mail" /> Email us
                </a>
                <a className="delivery-btn" href={`tel:${PRIMARY_CONTACT.phoneTel}`}>
                  <Icon name="phone" /> {PRIMARY_CONTACT.phoneDisplay}
                </a>
              </div>
              <p className="note">Or use the quote button below — it goes straight to the team.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Heading eyebrow="The process" title="How a site comes onboard" />
          <Steps items={PROCESS} />
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <Heading eyebrow="Good to know" title={`${service.name} — questions`} />
          <Faq items={faqs} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Heading eyebrow="Other services" title="Pair it with" aside="Services that commonly run together on the same site." />
          <div className="cards cols-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {others.map((s) => (
              <Link className="card" key={s.id} to={s.path}>
                <div className="card-img"><img src={s.image} alt={s.imageAlt} loading="lazy" /></div>
                <div className="card-body">
                  <span className="tag">{s.tag}</span>
                  <h3>{s.name}</h3>
                  <p>{s.card}</p>
                  <span className="more">Explore <Icon name="arrowRight" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ServiceCallout
        service={service.name}
        title={`Get a quote for ${service.name.toLowerCase()}`}
        lead="Tell us about the property — services needed, frequency and timing. A site assessment is usually the first step."
        ctaLabel="Request a quote"
      />
    </>
  );
}
