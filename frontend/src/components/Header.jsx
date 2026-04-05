import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-menu')) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setShowUserDropdown(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/how-it-works', label: 'How it Works' },
    { to: '/products', label: 'Products' },

    { to: '/new-items', label: 'New Items' },
  ];

  return (
    <>
      <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="header-inner container">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-icon">🔄</span>
            <span className="logo-text">
              Swap<span className="logo-accent">&</span>Share
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="header-actions desktop-actions">
            {user ? (
              <>
                <Link to="/add-item" className="btn btn-primary btn-sm">
                  + Add Item
                </Link>
                <div className="user-menu">
                  <div className="user-avatar" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={`user-dropdown ${showUserDropdown ? 'user-dropdown-open' : ''}`}>
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                    <hr className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-logout">
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'hamburger-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="hamburger-btn"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-overlay ${menuOpen ? 'mobile-overlay-open' : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Menu */}
      <nav className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="mobile-menu-header">
          <span className="logo-text" style={{ fontSize: '1.2rem' }}>
            🔄 Swap<span className="logo-accent">&</span>Share
          </span>
          <button className="mobile-close" onClick={closeMenu}>✕</button>
        </div>

        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
              }
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="mobile-auth">
          {user ? (
            <>
              <div className="mobile-user-info">
                <div className="user-avatar user-avatar-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
              </div>
              <Link to="/add-item" className="btn btn-primary" onClick={closeMenu}
                style={{ width: '100%', justifyContent: 'center' }}>
                + Add Item
              </Link>
              <button className="btn btn-danger" onClick={handleLogout}
                style={{ width: '100%', justifyContent: 'center' }}>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" onClick={closeMenu}
                style={{ width: '100%', justifyContent: 'center' }}>
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary" onClick={closeMenu}
                style={{ width: '100%', justifyContent: 'center' }}>
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      </nav>

      <style>{`
        /* ---- HEADER ---- */
        .header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 0.9rem 0;
          transition: all 0.3s ease;
          background: transparent;
        }
        .header-scrolled {
          background: rgba(6, 8, 15, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 4px 30px rgba(0,0,0,0.4);
          padding: 0.6rem 0;
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        /* Logo */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .logo-icon { font-size: 1.4rem; }
        .logo-text {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .logo-accent {
          background: var(--gradient-purple);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 1px;
        }

        /* Desktop Nav */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .nav-link {
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-sm);
          font-size: 0.92rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: var(--transition);
          text-decoration: none;
        }
        .nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
        .nav-link-active { color: var(--purple-light) !important; background: var(--purple-dim) !important; }

        /* Desktop auth actions */
        .desktop-actions { display: flex; align-items: center; gap: 0.75rem; }

        /* User avatar + dropdown */
        .user-menu { position: relative; }
        .user-avatar {
          width: 36px; height: 36px;
          background: var(--gradient-purple);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.95rem; color: #fff;
          cursor: pointer;
          transition: var(--transition);
        }
        .user-avatar:hover { box-shadow: 0 0 0 3px rgba(124,58,237,0.4); }
        .user-avatar-lg { width: 42px; height: 42px; font-size: 1.1rem; }

        .user-dropdown {
          display: none;
          position: absolute;
          top: calc(100% + 0.75rem);
          right: 0;
          background: #111827;
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          min-width: 200px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          padding: 0.5rem 0;
          z-index: 999;
        }
        .user-dropdown-open { display: block; }
        .user-info {
          padding: 0.75rem 1rem;
          display: flex; flex-direction: column; gap: 0.15rem;
        }
        .user-name { font-weight: 700; font-size: 0.95rem; color: var(--text-primary); }
        .user-email { font-size: 0.78rem; color: var(--text-muted); }
        .dropdown-divider { border: none; border-top: 1px solid var(--border-glass); margin: 0; }
        .dropdown-logout {
          width: 100%; text-align: left;
          padding: 0.65rem 1rem;
          background: transparent; border: none;
          color: #f87171; font-family: 'Inter',sans-serif; font-size: 0.9rem;
          cursor: pointer; transition: var(--transition);
        }
        .dropdown-logout:hover { background: rgba(239,68,68,0.1); }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 5px;
        }
        .hamburger span {
          display: block; width: 24px; height: 2px;
          background: var(--text-primary); border-radius: 2px;
          transition: var(--transition);
          transform-origin: center;
        }
        .hamburger-open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger-open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* Mobile Overlay */
        .mobile-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
          z-index: 998;
        }
        .mobile-overlay-open { display: block; }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed; top: 0; right: -320px;
          width: 300px; height: 100vh;
          background: #0d1117;
          border-left: 1px solid var(--border-glass);
          z-index: 999;
          transition: right 0.35s cubic-bezier(0.4,0,0.2,1);
          display: flex; flex-direction: column;
          padding: 0;
        }
        .mobile-menu-open { right: 0; }
        .mobile-menu-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-glass);
        }
        .mobile-close {
          background: rgba(255,255,255,0.06); border: none; color: var(--text-secondary);
          width: 32px; height: 32px; border-radius: 8px; cursor: pointer;
          font-size: 1rem; display: flex; align-items: center; justify-content: center;
          transition: var(--transition);
        }
        .mobile-close:hover { background: rgba(239,68,68,0.15); color: #f87171; }

        .mobile-nav-links {
          display: flex; flex-direction: column; padding: 1rem;
          gap: 0.25rem; flex: 1;
        }
        .mobile-nav-link {
          padding: 0.85rem 1rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary); font-size: 1rem;
          font-weight: 500; text-decoration: none;
          transition: var(--transition);
        }
        .mobile-nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
        .mobile-nav-link-active { color: var(--purple-light) !important; background: var(--purple-dim) !important; }

        .mobile-auth {
          border-top: 1px solid var(--border-glass);
          padding: 1.25rem 1rem;
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        .mobile-user-info {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.5rem 0; margin-bottom: 0.25rem;
        }

        /* Responsive breakpoints */
        @media (max-width: 900px) {
          .desktop-nav { display: none; }
          .desktop-actions { display: none; }
          .hamburger { display: flex; }
        }
        @media (min-width: 901px) {
          .mobile-overlay { display: none !important; }
          .mobile-menu { display: none; }
        }
      `}</style>
    </>
  );
};

export default Header;
