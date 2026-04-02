import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="container footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-badge">S</span>
              <span className="footer-logo-text">
                W&amp;A <span>DIGITAL</span>
              </span>
            </Link>
            <p className="footer-tagline">
              We help small businesses establish a professional online presence
              with beautiful, fast, and affordable custom websites.
            </p>
            <div className="footer-social-note">
              Serving clients across the New York area and beyond.
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4 className="footer-col-heading">Quick Links</h4>
            <nav className="footer-nav">
              <Link to="/">Home</Link>
              <Link to="/reviews">Client Reviews</Link>
              <Link to="/examples">Portfolio</Link>
              <Link to="/admin">Admin</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-heading">Contact Us</h4>
            <div className="footer-contact-list">
              <a href="tel:3473459162" className="footer-contact-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>
                (347) 345-9162
              </a>
              <a href="tel:9148378794" className="footer-contact-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/></svg>
                (914) 837-8794
              </a>
              <a href="https://mail.google.com/mail/?view=cm&to=theandyshaka@gmail.com" target="_blank" rel="noreferrer" className="footer-contact-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                theandyshaka@gmail.com
              </a>
              <a href="https://mail.google.com/mail/?view=cm&to=wngalauka@gmail.com" target="_blank" rel="noreferrer" className="footer-contact-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                wngalauka@gmail.com
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="footer-col">
            <h4 className="footer-col-heading">Start Today</h4>
            <p className="footer-cta-text">
              Ready for a website that works as hard as you do?
            </p>
            <div className="footer-cta-btns">
              <a href="tel:3473459162" className="btn btn-primary footer-btn">
                Call Now
              </a>
              <a href="https://mail.google.com/mail/?view=cm&to=theandyshaka@gmail.com" target="_blank" rel="noreferrer" className="btn btn-outline-gold footer-btn">
                Email Us
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {year} W&A Digital. All rights reserved.</p>
          <p>Professional Web Design for Small Businesses</p>
        </div>
      </div>
    </footer>
  );
}
