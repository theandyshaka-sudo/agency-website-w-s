import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { isAdmin, logout } = useAuth();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      {/* Top contact bar */}
      <div className="header-topbar">
        <div className="container topbar-inner">
          <div className="topbar-contacts">
            <a href="tel:3473459162" className="topbar-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>
              (347) 345-9162
            </a>
            <a href="tel:9148378794" className="topbar-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>
              (914) 837-8794
            </a>
            <a href="https://mail.google.com/mail/?view=cm&to=theandyshaka@gmail.com" target="_blank" rel="noreferrer" className="topbar-link topbar-email">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              theandyshaka@gmail.com
            </a>
            <a href="https://mail.google.com/mail/?view=cm&to=wngalauka@gmail.com" target="_blank" rel="noreferrer" className="topbar-link topbar-email">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              wngalauka@gmail.com
            </a>
          </div>
          {isAdmin && (
            <button className="admin-pill" onClick={logout}>
              ✓ Admin — Log out
            </button>
          )}
        </div>
      </div>

      {/* Main nav bar */}
      <div className="header-main">
        <div className="container header-main-inner">
          <Link to="/" className="logo">
            <span className="logo-badge">S</span>
            <span className="logo-wordmark">
              W&amp;A <span className="logo-accent">DIGITAL</span>
            </span>
          </Link>

          <nav className={`main-nav${menuOpen ? ' open' : ''}`}>
            <NavLink to="/"        className={navClass} end>Home</NavLink>
            <NavLink to="/reviews" className={navClass}>Reviews</NavLink>
            <NavLink to="/examples" className={navClass}>Portfolio</NavLink>
            <a href="tel:3473459162" className="nav-cta">
              Get a Free Quote
            </a>
          </nav>

          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
