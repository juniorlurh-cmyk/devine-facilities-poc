import { PageHero } from '../components/Shared';
import { PROJECTS } from '../data/projects';
import ServiceCallout from '../components/ServiceCallout';
import FadeIn from '../components/FadeIn';
import { Icon } from '../components/Icons';
import { SITE } from '../data/site';

const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export default function Projects() {
  return (
    <>
      <PageHero
        title={<>Work that shows<br /><em>the range.</em></>}
        lead="Case studies from the company's published project pages — elevated installations, indoor greenery, full landscape builds and estate cleaning programmes."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Projects' }]}
        image={img('photo-1416879595882-3373a0480b5b')}
        tags={[
          { icon: 'building', label: 'Installations' },
          { icon: 'leaf', label: 'Landscaping' },
          { icon: 'sparkles', label: 'Cleaning' },
          { icon: 'home', label: 'Estates & complexes' },
        ]}
      />

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {PROJECTS.map((p, i) => (
              <FadeIn key={p.name} delay={i * 60}>
                <article className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr' }} className="proj-grid">
                    <div className="card-img" style={{ aspectRatio: 'auto', minHeight: 260 }}>
                      <img src={p.image} alt={p.imageAlt} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '30px 32px' }}>
                      <span className="tag dev">{p.service}</span>
                      <h3 style={{ marginTop: 10 }}>{p.name}</h3>
                      <p style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600, marginBottom: 12 }}>
                        <Icon name="pin" style={{ width: 13, height: 13, verticalAlign: '-2px' }} /> {p.location}
                      </p>
                      <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 16 }}>{p.summary}</p>
                      <div className="chip-row" style={{ marginTop: 0 }}>
                        {p.tags.map((t) => <span className="chip" key={t}><Icon name="check" /> {t}</span>)}
                      </div>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
          <p className="note" style={{ marginTop: 26 }}>
            Project descriptions summarise the company's published project pages ({SITE.website.replace('https://', '')}/our-projects). Photography is licensed stock — representative of the work type, pending the company's own project images.
          </p>
        </div>
      </section>

      <ServiceCallout
        service="General"
        title="Have a project in mind?"
        lead="From a townhouse garden to an elevated multi-storey installation — tell us what the site needs and we'll scope it properly."
        ctaLabel="Discuss your project"
      />
    </>
  );
}
