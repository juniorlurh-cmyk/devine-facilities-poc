import { PageHero, Heading } from '../components/Shared';
import ServiceCard from '../components/ServiceCard';
import ServiceCallout from '../components/ServiceCallout';
import FadeIn from '../components/FadeIn';
import { SERVICES } from '../data/services';
import { SITE } from '../data/site';

const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export default function Services() {
  return (
    <>
      <PageHero
        title={<>Services built around<br /><em>how properties actually run.</em></>}
        lead="Four service lines covering the outdoor care, cleaning, building and on-site presence that estates, complexes and commercial properties need — all on structured schedules."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
        image={img('photo-1466692476868-aef1dfb1e735')}
        tags={[
          { icon: 'leaf', label: 'Landscaping' },
          { icon: 'sparkles', label: 'Cleaning' },
          { icon: 'building', label: 'Installations' },
          { icon: 'shield', label: 'Caretaker' },
        ]}
      />

      <section className="section">
        <div className="container">
          <Heading
            eyebrow="Service lines"
            title="Choose one — or combine them"
            aside="Many sites run landscaping and cleaning on the same schedule under one team. The portal demo shows how that reporting works."
          />
          <div className="cards">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.id} delay={i * 90}>
                <ServiceCard service={s} />
              </FadeIn>
            ))}
          </div>
          <p className="note">
            All services confirmed on the company\u2019s website ({SITE.website.replace('https://', '')}) · Indoor plant solutions are also offered — see the caretaker service page.
          </p>
        </div>
      </section>

      <ServiceCallout
        service="General"
        title="Not sure which service fits?"
        lead="Describe the property and the problem — we'll recommend the right service line or combination, and whether a site assessment is needed first."
        ctaLabel="Ask us"
      />
    </>
  );
}
