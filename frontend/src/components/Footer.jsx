import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span>🔄</span>
              <span className="logo-text">
                Swap<span className="logo-accent">&</span>Share
              </span>
            </div>
            <p className="footer-tagline">
              A community platform to swap books and games with people near you. Give your items a second life.
            </p>
            <div className="footer-badges">
              <span className="f-badge">📚 Books</span>
              <span className="f-badge">🎮 Games</span>
              <span className="f-badge">🤝 Swap</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/how-it-works">How it Works</Link></li>
              <li><Link to="/products">Products</Link></li>

              <li><Link to="/new-items">New Items</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-col">
            <h4 className="footer-col-title">Account</h4>
            <ul className="footer-links">
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/add-item">Add Item</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-col-title">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/products">📚 Books</Link></li>
              <li><Link to="/products">🎮 Games</Link></li>
              <li><Link to="/new-items">🆕 New Arrivals</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} <span className="purple-text">Swap &amp; Share</span>. Final Year Project — MERN Stack.
          </p>
          <p className="footer-made">
            Made with <span style={{ color: '#ec4899' }}>♥</span> by the Swap &amp; Share Team
          </p>
        </div>
      </div>

      <style>{`
        .footer {
          position: relative;
          background: #080b13;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 4rem 0 2rem;
          margin-top: auto;
          overflow: hidden;
        }
        .footer-glow {
          position: absolute;
          bottom: -100px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }
        .footer-logo {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 1.2rem; font-weight: 800;
          margin-bottom: 1rem;
        }
        .footer-tagline {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 1.25rem;
        }
        .footer-badges {
          display: flex; gap: 0.5rem; flex-wrap: wrap;
        }
        .f-badge {
          padding: 0.3rem 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-glass);
          border-radius: 999px;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .footer-col-title {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--purple-light);
          margin-bottom: 1.25rem;
        }
        .footer-links {
          list-style: none;
          display: flex; flex-direction: column; gap: 0.65rem;
        }
        .footer-links a {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-decoration: none;
          transition: var(--transition);
        }
        .footer-links a:hover { color: var(--text-primary); padding-left: 4px; }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .footer-copy, .footer-made {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
        }
        .purple-text {
          color: var(--purple-light);
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
