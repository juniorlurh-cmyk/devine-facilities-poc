import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';
import { Icon } from '../components/Icons';
import { PageHero, Heading, Faq } from '../components/Shared';
import ServiceCard from '../components/ServiceCard';
import ServiceCallout from '../components/ServiceCallout';
import { SITE, PEOPLE, REVIEWS, TESTIMONIAL, mailto } from '../data/site';
import { SERVICES, CLIENT_TYPES } from '../data/services';
import { PROJECTS } from '../data/projects';

const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const VALUES = [
  { t: 'Reliability', d: 'Scheduled work that actually happens — the weekly mowing, the twice-weekly clean — not promises that drift.' },
  { t: 'Professional management', d: 'Supervised teams, clear accountability and structured reporting, per the company\u2019s own positioning.' },
  { t: 'Practical solutions', d: 'Caretakers, greenery and maintenance coordinated as one service rather than three contractors.' },
  { t: 'Visible proof', d: 'Work logs, photo evidence and monthly reports so trustees and agents can see what was done.' },
];

const FAQS = [
  {
    q: 'How long has Devine been operating?',
    a: `The company states it was established ${SITE.established} years ago.`,
  },
  {
    q: 'Where is the company based?',
    a: `Devine is Pretoria-based and serves Pretoria and the greater Tshwane region. Postal address: ${SITE.postalAddress}.`,
  },
  {
    q: 'Who do I contact?',
    a: `Marissa van der Walt (${PEOPLE[0].phoneDisplay}, ${PEOPLE[0].email}) or Tjaart van der Walt (${PEOPLE[1].phoneDisplay}, ${PEOPLE[1].email}).`,
  },
  {
    q: 'Is the 5.0 rating verified?',
    a: `The ${REVIEWS.rating}★ rating across ${REVIEWS.count} reviews comes from public directory listings. It\u2019s shown as directory-sourced rather than independently verified.`,
  },
];

export default function About() {
  return (
    <>
      <PageHero
        title={<>Facilities care,<br /><em>professionally managed.</em></>}
        lead="Devine Facilities Management has looked after Pretoria properties for 13 years — landscapes, premises and the people who depend on both."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
        image={img('photo-1470058869958-2a77ade41c02')}
        tags={[
          { icon: 'clock', label: `${SITE.established} years` },
          { icon: 'pin', label: 'Pretoria & Tshwane' },
          { icon: 'shield', label: 'Supervised teams' },
        ]}
      />

      <section className="section">
        <div className="container content-grid">
          <FadeIn>
            <div className="eyebrow dark">The company</div>
            <h2>A facilities partner for shared spaces</h2>
            <div className="copy">
              <p>
                Estates, sectional title complexes and commercial properties all
                share the same problem: many stakeholders, one physical site, and
                nobody clearly accountable for how it looks and runs day to day.
                Devine positions itself as the practical answer — landscaping,
                cleaning, installations and caretaking delivered under one
                professionally managed service.
              </p>
              <p>
                The company\u2019s own site emphasises on-site caretakers, indoor
                greenery, professional management and supervision, and regular
                service — the unglamorous consistency that keeps a property
                presentable between the moments anyone notices.
              </p>
              <p>
                This website is a preview build. Service claims reflect the
                company\u2019s published information; operations data shown in the{' '}
                <Link to="/portal" style={{ fontWeight: 700, color: 'var(--pine-2)' }}>client portal demo</Link>{' '}
                is illustrative sample data.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="panel">
              <h3>Company details</h3>
              <div className="kv">
                <div className="kv-row"><Icon name="building" /><div><b>Company</b><span>{SITE.name}</span></div></div>
                <div className="kv-row"><Icon name="clock" /><div><b>Established</b><span>{SITE.established} years (company-stated)</span></div></div>
                <div className="kv-row"><Icon name="pin" /><div><b>Based in</b><span>{SITE.city}</span></div></div>
                <div className="kv-row"><Icon name="doc" /><div><b>Postal address</b><span>{SITE.postalAddress}</span></div></div>
                <div className="kv-row"><Icon name="users" /><div><b>Public contacts</b><span>{PEOPLE.map((p) => p.name).join(' & ')}</span></div></div>
                <div className="kv-row"><Icon name="sparkles" /><div><b>Directory rating</b><span>{REVIEWS.rating}★ · {REVIEWS.count} reviews · {REVIEWS.source}</span></div></div>
              </div>
            </div>
            <div className="panel">
              <h3>Talk to the team</h3>
              <div className="kv">
                {PEOPLE.map((p) => (
                  <div className="kv-row" key={p.email}>
                    <Icon name="user" />
                    <div>
                      <b>{p.name}</b>
                      <span><a href={`tel:${p.phoneTel}`}>{p.phoneDisplay}</a> · <a href={mailto(`Website enquiry — ${p.name}`)}>{p.email}</a></span>
                    </div>
                  </div>
                ))}
                <div className="kv-row">
                  <Icon name="external" />
                  <div><b>Elsewhere</b><span><a href={SITE.facebook} target="_blank" rel="noopener noreferrer">Facebook</a> · <a href={SITE.website} target="_blank" rel="noopener noreferrer">devinefacilities.co.za</a></span></div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Heading
            eyebrow="What we stand for"
            title="The values behind the work"
          />
          <div className="values" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {VALUES.map((v) => (
              <div className="value" key={v.t}><b>{v.t}</b><span>{v.d}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Heading
            eyebrow="Who we serve"
            title="Client types"
            aside="Shared-space properties where consistent care matters to many stakeholders at once."
          />
          <div className="chip-row" style={{ marginTop: 0 }}>
            {CLIENT_TYPES.map((c) => <span className="chip" key={c}><Icon name="check" /> {c}</span>)}
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Heading eyebrow="What we do" title="Four service lines" />
          <div className="cards">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.id} delay={i * 90}><ServiceCard service={s} /></FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <Heading eyebrow="In their words" title="Published testimonial" />
          <div className="testimonial">
            <blockquote>&ldquo;{TESTIMONIAL.quote}&rdquo;</blockquote>
            <cite><b>{TESTIMONIAL.author}</b> — {TESTIMONIAL.context}</cite>
          </div>
          <p className="note" style={{ textAlign: 'center', marginTop: 16 }}>
            The only testimonial published on the company\u2019s website — shown verbatim. No others are reproduced here.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Heading eyebrow="Project range" title="A sample of published work" aside="Fuller case studies on the projects page." />
          <div className="cards cols-2">
            {PROJECTS.slice(0, 2).map((p, i) => (
              <FadeIn key={p.name} delay={i * 90}>
                <Link className="card" to="/projects">
                  <div className="card-img"><img src={p.image} alt={p.imageAlt} loading="lazy" /></div>
                  <div className="card-body">
                    <span className="tag dev">{p.service}</span>
                    <h3>{p.name}</h3>
                    <p>{p.summary}</p>
                    <span className="more">View project <Icon name="arrowRight" /></span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="container">
          <Heading eyebrow="Good to know" title="About Devine, answered" />
          <Faq items={FAQS} />
        </div>
      </section>

      <ServiceCallout
        service="General"
        title="Working with Devine"
        lead="Tell us about the property and what it needs — we'll come back with options, scheduling and a clear proposal."
        ctaLabel="Start a conversation"
      />
    </>
  );
}
