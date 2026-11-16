import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SITE, PEOPLE, PRIMARY_CONTACT } from '../data/site';
import { SERVICES } from '../data/services';
import { useBackend } from '../lib/BackendContext';
import { Icon } from './Icons';
import ChatWidget from './ChatWidget';

function Topbar() {
  const { content } = useBackend();
  const announcement = content.announcement || '';
  return (
    <>
      {announcement && (
        <div className="announce-bar">
          <div className="container">{announcement}</div>
        </div>
      )}
      <div className="topline">
        <div className="container">
          <span>{SITE.tagline}</span>
          <div className="topline-right">
            <span>{SITE.city}</span>
            <a href={`tel:${PRIMARY_CONTACT.phoneTel}`}>{PRIMARY_CONTACT.phoneDisplay}</a>
          </div>
        </div>
      </div>
    </>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" to="/" aria-label="Devine Facilities Management home">
          <span className="brand-mark">D</span>
          <span className="brand-name">
            DEVINE FACILITIES
            <small>MANAGEMENT</small>
          </span>
        </Link>
        <button
          className="menu-toggle"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
        <nav
          className={`nav-links ${open ? 'open' : ''}`}
          aria-label="Main navigation"
          onClick={(e) => { if (e.target.closest('a')) setOpen(false); }}
        >
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <div className="nav-group">
            <button type="button" aria-haspopup="true" onClick={() => navigate('/services')}>
              Services <Icon name="chevron" />
            </button>
            <div className="nav-drop">
              {SERVICES.map((s) => (
                <Link key={s.id} to={s.path}>{s.name}</Link>
              ))}
              <Link className="nav-drop-all" to="/services">
                All services <Icon name="arrowRight" />
              </Link>
            </div>
          </div>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/portal">Client portal</NavLink>
          <NavLink to="/insights">Insights</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <Link className="btn" to="/contact">
          Request a quote <Icon name="arrowRight" />
        </Link>
      </div>
    </header>
  );
}

const YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="brand" to="/">
              <span className="brand-mark">D</span>
              <span className="brand-name">
                DEVINE FACILITIES
                <small>MANAGEMENT</small>
              </span>
            </Link>
            <p>
              Facilities care for estates, complexes and commercial properties
              across Pretoria — landscaping, cleaning, installations and
              caretaking under professional management.
            </p>
          </div>
          <div>
            <h4>Company</h4>
            <div className="flinks">
              <Link to="/">Home</Link>
              <Link to="/about">About us</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <h4>Services</h4>
            <div className="flinks">
              {SERVICES.map((s) => (
                <Link key={s.id} to={s.path}>{s.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4>Get in touch</h4>
            <div className="flinks">
              {PEOPLE.map((p) => (
                <a key={p.email} href={`mailto:${p.email}`}>
                  {p.name} · {p.phoneDisplay}
                </a>
              ))}
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              <span>{SITE.serviceAreaNote}</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {YEAR} {SITE.name} · {SITE.postalAddress}</span>
          <span>
            Site preview — details subject to owner verification ·{' '}
            <Link to="/admin" className="footer-admin">Staff login</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <>
      <Topbar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
