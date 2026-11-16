import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons';

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: 'center', padding: '120px 0' }}>
      <div className="container">
        <div className="eyebrow dark" style={{ justifyContent: 'center' }}>404</div>
        <h1 style={{ fontSize: 'clamp(34px, 5vw, 56px)' }}>This page isn't here.</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 460, margin: '0 auto 30px' }}>
          The link may be old or mistyped — let's get you back to the site.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="btn" to="/">Back to home <Icon name="arrowRight" /></Link>
          <Link className="btn ghost" to="/services">Browse services</Link>
          <Link className="btn ghost" to="/contact">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
