import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config';
import './Home.css';

const SERVICES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: 'Custom Website Design',
    desc: 'Unique, tailored websites that reflect your brand identity and stand out from the competition.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    title: 'Mobile-First Development',
    desc: 'Every site we build looks and performs perfectly on phones, tablets, and desktops.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="3.5"/><circle cx="6.5" cy="13.5" r="3.5"/><circle cx="17" cy="17" r="3"/>
      </svg>
    ),
    title: 'Brand Identity',
    desc: 'Logo design, color palettes, and visual assets that create a cohesive, memorable brand.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Fast Turnaround',
    desc: 'We deliver high-quality websites quickly so you can start growing your business sooner.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    title: 'Affordable Pricing',
    desc: 'Professional web design at prices that make sense for small business budgets. No surprises.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Ongoing Support',
    desc: "We're here after launch to help with updates, maintenance, and growing your online presence.",
  },
];

const FEATURES = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
    ),
    title: 'Affordable',
    desc: 'Professional websites at prices designed for small businesses. Get more value for every dollar.',
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    ),
    title: 'Fast Delivery',
    desc: 'Most projects go live within 1–2 weeks. We move quickly without cutting corners.',
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 11.08 22 12 12 22 2 12 2.45 7.11"/><path d="M22 11.08L12 2 2.45 7.11"/><line x1="12" y1="22" x2="12" y2="2"/></svg>
    ),
    title: 'Professional',
    desc: 'Clean, modern designs that make your business look credible and inspire trust in visitors.',
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
    title: 'Local Focus',
    desc: 'We understand local businesses and build websites that serve your community effectively.',
  },
];

const STEPS = [
  { n: '1', title: 'Contact Us',     desc: "Call or email us. We'll discuss your vision, goals, and budget — no pressure." },
  { n: '2', title: 'Design & Build', desc: 'We design and develop your custom website, keeping you in the loop throughout.' },
  { n: '3', title: 'Review & Refine',desc: 'You review everything and we make adjustments until you love every detail.' },
  { n: '4', title: 'Go Live!',       desc: 'We launch your new website and it starts working for your business immediately.' },
];

export default function Home() {
  const obsRef = useRef(null);

  const [stats, setStats] = useState({ reviewCount: 0, avgRating: 0 });

  useEffect(() => {
    fetch(`${API_BASE}/api/reviews`)
      .then((r) => r.json())
      .then((reviews) => {
        if (!reviews.length) return;
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setStats({
          reviewCount: reviews.length,
          avgRating: Math.round(avg * 10) / 10,
        });
      })
      .catch(() => {}); // silently ignore — stats just stay at 0
  }, []);

  useEffect(() => {
    obsRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.fade-in-up').forEach((el) =>
      obsRef.current.observe(el)
    );

    return () => obsRef.current?.disconnect();
  }, []);

  return (
    <div className="home-page">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid-overlay" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            ✦ Professional Web Design Agency
          </div>
          <h1 className="hero-title">
            We Build Websites That<br />
            <span>Grow Your Business</span>
          </h1>
          <p className="hero-subtitle">
            Helping small businesses establish a professional online presence with
            beautiful, fast, and affordable custom websites.
          </p>
          <div className="hero-actions">
            <a href="tel:3473459162" className="btn btn-primary hero-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>
              Call for a Free Quote
            </a>
            <Link to="/examples" className="btn btn-outline hero-btn">
              View Our Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-num">{stats.reviewCount > 0 ? stats.reviewCount : '—'}</span>
              <span className="stat-lbl">Happy Clients</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="stat-num">100%</span>
              <span className="stat-lbl">Mobile Ready</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="stat-num">
                {stats.reviewCount > 0 ? `${stats.avgRating}★` : '—'}
              </span>
              <span className="stat-lbl">Avg Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span />
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────────────── */}
      <section className="services-section">
        <div className="container">
          <div className="section-header fade-in-up">
            <div className="section-tag">What We Do</div>
            <h2 className="section-title">
              Everything You Need to<br /><span>Succeed Online</span>
            </h2>
            <p className="section-subtitle">
              From concept to launch, we handle every aspect of your web presence so you can focus on running your business.
            </p>
          </div>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <div
                key={i}
                className="service-card fade-in-up"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ───────────────────────────────────────────────────── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header fade-in-up">
            <div className="section-tag">Why Choose Us</div>
            <h2 className="section-title">
              Built for <span>Small Business</span> Success
            </h2>
            <p className="section-subtitle">
              We specialize in helping small businesses compete online with professional websites at prices that make sense.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="feature-card fade-in-up"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className="feature-bg-num">{f.num}</span>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ─────────────────────────────────────────────────────────── */}
      <section className="process-section">
        <div className="container">
          <div className="section-header fade-in-up">
            <div className="section-tag">How It Works</div>
            <h2 className="section-title" style={{ color: '#fff' }}>
              From Idea to <span>Live Website</span>
            </h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.55)' }}>
              A simple, transparent process from our first conversation to launch day.
            </p>
          </div>
          <div className="process-track">
            {STEPS.map((s, i) => (
              <div key={i} className="process-step fade-in-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="process-step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="cta-section" id="contact">
        <div className="container">
          <div className="cta-box fade-in-up">
            <div className="cta-tag">Get Started Today</div>
            <h2>Ready to Build Your Dream Website?</h2>
            <p>
              Get a free consultation — no pressure, no commitment. Just honest advice
              about what your business needs online.
            </p>
            <div className="cta-buttons">
              <a href="tel:3473459162" className="btn btn-primary cta-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>
                (347) 345-9162
              </a>
              <a href="tel:9148378794" className="btn btn-primary cta-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>
                (914) 837-8794
              </a>
              <a href="https://mail.google.com/mail/?view=cm&to=theandyshaka@gmail.com" target="_blank" rel="noreferrer" className="btn btn-outline cta-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                Email Andy
              </a>
              <a href="https://mail.google.com/mail/?view=cm&to=wngalauka@gmail.com" target="_blank" rel="noreferrer" className="btn btn-outline cta-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
