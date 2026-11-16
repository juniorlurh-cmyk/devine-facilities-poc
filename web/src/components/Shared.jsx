import { Link } from 'react-router-dom';
import FadeIn from './FadeIn';
import { Icon } from './Icons';

export function PageHero({ title, lead, crumbs, tags = [], image }) {
  return (
    <section className="page-hero">
      {image && <img className="bg-img" src={image} alt="" aria-hidden="true" />}
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
              {i > 0 && <Icon name="arrowRight" />}
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1>{title}</h1>
        <p>{lead}</p>
        {tags.length > 0 && (
          <div className="hero-tags">
            {tags.map((t) => (
              <span className="hero-tag" key={t.label}>
                {t.icon && <Icon name={t.icon} />} {t.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Callout({ title, lead, cta = { to: '/contact', label: 'Contact the group' } }) {
  const external = cta.to && /^(tel:|mailto:|https?:)/.test(cta.to);
  return (
    <section className="callout">
      <div className="container">
        <div>
          <div className="eyebrow">Connect with the group</div>
          <h2>{title}</h2>
          <p>{lead}</p>
        </div>
        <FadeIn>
          {cta.onClick ? (
            <button type="button" className="btn lime" onClick={cta.onClick}>
              {cta.label} <Icon name="arrowRight" />
            </button>
          ) : external ? (
            <a className="btn lime" href={cta.to}>
              {cta.label} <Icon name="arrowRight" />
            </a>
          ) : (
            <Link className="btn lime" to={cta.to}>
              {cta.label} <Icon name="arrowRight" />
            </Link>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

export function Heading({ eyebrow, title, aside }) {
  return (
    <div className="heading">
      <div>
        <div className="eyebrow dark">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {aside && <p>{aside}</p>}
    </div>
  );
}

export function Faq({ items }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details className="faq-item" key={f.q}>
          <summary>
            {f.q}
            <Icon name="chevron" />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Steps({ items }) {
  return (
    <div className="steps">
      {items.map((s) => (
        <div className="step" key={s.n}>
          <b>{s.n}</b>
          <h4>{s.t}</h4>
          <p>{s.d}</p>
        </div>
      ))}
    </div>
  );
}
