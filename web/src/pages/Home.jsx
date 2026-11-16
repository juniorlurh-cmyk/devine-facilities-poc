import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';
import { Icon } from '../components/Icons';
import { Heading, Steps, Faq } from '../components/Shared';
import ServiceCard from '../components/ServiceCard';
import ServiceCallout from '../components/ServiceCallout';
import { SITE, SECTORS, REVIEWS, TESTIMONIAL, PRIMARY_CONTACT } from '../data/site';
import { SERVICES } from '../data/services';
import { PROJECTS } from '../data/projects';

const HOW_IT_WORKS = [
  { n: '01', t: 'Site assessment', d: 'We visit the property, understand the scope and agree what "well cared for" means for that site.' },
  { n: '02', t: 'Structured schedule', d: 'Tasks are planned weekly, fortnightly or monthly — landscaping, cleaning or caretaker days — with clear ownership.' },
  { n: '03', t: 'Supervised delivery', d: 'Teams work to the schedule under supervision, with issues logged and followed up rather than forgotten.' },
  { n: '04', t: 'Visible reporting', d: 'Clients can see what was done, what needs attention and what is planned next — including photo evidence.' },
];

const FAQS = [
  {
    q: 'What types of properties do you service?',
    a: `Devine works with ${SECTORS.join(', ').toLowerCase()} across Pretoria and greater Tshwane. Most work is on shared or communal areas — gardens, walkways, entrances and facilities that need consistent care.`,
  },
  {
    q: 'Do you handle both landscaping and cleaning?',
    a: 'Yes — that is the core of the business. Many sites combine garden maintenance and communal-area cleaning under one schedule, so one team relationship covers the property\u2019s outdoor care.',
  },
  {
    q: 'Can you take on an installation project as well?',
    a: 'Yes. Landscape installations range from townhouse gardens to large-scale elevated landscapes — the company\u2019s published projects include multi-storey installations using crane lifting and custom planters.',
  },
  {
    q: 'How do clients keep track of the work?',
    a: 'Through a client-reporting portal — a working demo is on this site under "Client portal". It shows scheduled tasks, completed work logs with photo evidence, an issue register and a monthly service report.',
  },
  {
    q: 'How do we get a quote?',
    a: `Request a quote on any service page or contact ${PRIMARY_CONTACT.name} directly on ${PRIMARY_CONTACT.phoneDisplay} or ${PRIMARY_CONTACT.email}. A site assessment is usually the first step.`,
  },
];

export default function Home() {
  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="hero">
        <div className="container">
          <FadeIn>
            <span className="eyebrow">Pretoria &amp; greater Tshwane · ${SITE.established} years in operation</span>
            <h1>
              Your property,<br />
              <em>cared for properly.</em>
            </h1>
            <p className="hero-copy">
              Devine Facilities Management keeps estates, complexes and commercial
              properties looking their best — landscaping, cleaning, installations
              and caretaking, all under professional supervision and visible
              reporting.
            </p>
            <div className="hero-actions">
              <Link className="btn lime" to="/contact">
                Request a quote <Icon name="arrowRight" />
              </Link>
              <Link className="btn ghost" to="/services" style={{ color: '#eef3ec', borderColor: 'rgba(255,255,255,0.3)' }}>
                Explore services
              </Link>
            </div>
            <div className="hero-note">
              <span><b>{SITE.established} yrs</b> in operation</span>
              <span><b>{REVIEWS.rating}★</b> {REVIEWS.count} public directory reviews</span>
              <span><b>5</b> client types served</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---------- services ---------- */}
      <section className="section">
        <div className="container">
          <Heading
            eyebrow="What we do"
            title="Four services. One accountable team."
            aside="Every service line is delivered on a structured schedule with supervision — not ad-hoc visits."
          />
          <div className="cards">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.id} delay={i * 90}>
                <ServiceCard service={s} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- differentiator: visible reporting ---------- */}
      <section className="section tint">
        <div className="container split">
          <FadeIn>
            <div className="eyebrow dark">The Devine difference</div>
            <h2>Not just doing the work — <em>proving</em> it was done.</h2>
            <div className="copy" style={{ marginTop: 20 }}>
              <p>
                Facilities management fails quietly: lawns get mowed, bins get
                emptied, and nobody can say for sure what happened last Tuesday.
                Devine\u2019s model is built around visibility — scheduled tasks,
                logged work, photo evidence and a monthly report a trustee board
                or managing agent can actually read.
              </p>
              <p>
                The <Link to="/portal" style={{ fontWeight: 700, color: 'var(--pine-2)' }}>client portal</Link>{' '}
                on this site is a working demo of that reporting layer.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={140}>
            <div className="values">
              <div className="value"><b>Scheduled</b><span>Every recurring task has a plan, not just a promise.</span></div>
              <div className="value"><b>Documented</b><span>Work logs with notes and photo evidence per visit.</span></div>
              <div className="value"><b>Reported</b><span>Monthly summaries showing done, outstanding and planned.</span></div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section className="section white">
        <div className="container">
          <Heading
            eyebrow="How it works"
            title="From first call to fully managed site"
          />
          <Steps items={HOW_IT_WORKS} />
        </div>
      </section>

      {/* ---------- sectors ---------- */}
      <section className="section">
        <div className="container">
          <Heading
            eyebrow="Who we work with"
            title="Built for properties that serve many people"
            aside="The common thread: shared spaces that need consistent, professional care."
          />
          <div className="chip-row" style={{ marginTop: 0 }}>
            {SECTORS.map((s) => (
              <span className="chip" key={s}><Icon name="check" /> {s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- featured projects ---------- */}
      <section className="section tint">
        <div className="container">
          <Heading
            eyebrow="Selected work"
            title="Projects that show the range"
            aside="Case studies from the company's published project pages — representative photography pending the company's own images."
          />
          <div className="cards">
            {PROJECTS.slice(0, 3).map((p, i) => (
              <FadeIn key={p.name} delay={i * 90}>
                <Link className="card" to="/projects">
                  <div className="card-img"><img src={p.image} alt={p.imageAlt} loading="lazy" /></div>
                  <div className="card-body">
                    <span className="tag dev">{p.service}</span>
                    <h3>{p.name}</h3>
                    <p>{p.location}</p>
                    <span className="more">View projects <Icon name="arrowRight" /></span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- testimonial ---------- */}
      <section className="section white">
        <div className="container">
          <div className="testimonial">
            <blockquote>&ldquo;{TESTIMONIAL.quote}&rdquo;</blockquote>
            <cite><b>{TESTIMONIAL.author}</b> — {TESTIMONIAL.context}</cite>
          </div>
          <p className="note" style={{ textAlign: 'center', marginTop: 18 }}>
            Published on the company\u2019s own website · Directory listings show {REVIEWS.rating}★ across {REVIEWS.count} public reviews.
          </p>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section">
        <div className="container">
          <Heading eyebrow="Good to know" title="Questions we hear often" />
          <Faq items={FAQS} />
        </div>
      </section>

      <ServiceCallout
        service="General"
        title="Tell us about your property"
        lead="One conversation is usually enough to scope the work — services, frequency and timing. We'll follow up with a site assessment or a written proposal."
        ctaLabel="Request a quote"
      />
    </>
  );
}
