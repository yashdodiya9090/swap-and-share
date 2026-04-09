import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { UPLOADS_URL } from '../api';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [liveStats, setLiveStats] = useState({ books: 0, games: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [bRes, gRes, sRes] = await Promise.all([
          api.get('/api/books'),
          api.get('/api/games'),
          api.get('/api/stats'),
        ]);
        setFeaturedBooks(bRes.data.slice(0, 3));
        setFeaturedGames(gRes.data.slice(0, 3));
        setLiveStats(sRes.data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const stats = [
    { value: `${liveStats.books < 10 ? liveStats.books : liveStats.books + '+'}`, label: 'Books Listed', icon: '📚' },
    { value: `${liveStats.games < 10 ? liveStats.games : liveStats.games + '+'}`, label: 'Games Listed', icon: '🎮' },
    { value: `${liveStats.users < 50 ? liveStats.users : liveStats.users + '+'}`, label: 'Happy Users', icon: '🤝' },
    { value: '100%', label: 'Free to Use', icon: '✨' },
  ];

  const steps = [
    { icon: '📝', step: '01', title: 'Sign Up', desc: 'Create your free account in seconds. No hidden fees.' },
    { icon: '📸', step: '02', title: 'List Your Item', desc: 'Upload a photo, add title and description.' },
    { icon: '🔍', step: '03', title: 'Discover', desc: 'Browse hundreds of unique books and games nearby.' },
    { icon: '🤝', step: '04', title: 'Connect & Swap', desc: 'Meet other swappers safely and exchange your items in person.' },
  ];


  return (
    <div className="home-page">
      {/* ---- HERO ---- */}
      <section className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="container hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Community Swap Platform
          </div>
          <h1 className="hero-title">
            Swap Books &amp; Games<br />
            <span className="hero-gradient-text">With Your Community</span>
          </h1>
          <p className="hero-desc">
            Give your books and games a second life. List what you have, discover what you need,
            and swap locally — completely free.
          </p>
          <div className="hero-ctas">
            <Link to="/products" className="btn btn-primary hero-btn">
              🔍 Browse Items
            </Link>
            <Link to="/signup" className="btn btn-secondary hero-btn">
              🚀 Start Swapping
            </Link>
          </div>

          {/* Floating cards */}
          <div className="hero-floating-cards">
            <div className="floating-card floating-card-1 glass-card">
              <span className="fc-icon">📚</span>
              <div>
                <div className="fc-title">Books</div>
                <div className="fc-sub">Find rare reads</div>
              </div>
            </div>
            <div className="floating-card floating-card-2 glass-card">
              <span className="fc-icon">🎮</span>
              <div>
                <div className="fc-title">Games</div>
                <div className="fc-sub">Trade your games</div>
              </div>
            </div>
            <div className="floating-card floating-card-3 glass-card">
              <span className="fc-icon">🤝</span>
              <div>
                <div className="fc-title">Free Swap</div>
                <div className="fc-sub">No money needed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- STATS ---- */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-card glass-card">
                <span className="stat-icon">{s.icon}</span>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BOOKS */}

      {!loading && featuredBooks.length > 0 && (
        <section className="section featured-section">
          <div className="container">
            <div className="section-header">
              <p className="section-subtitle">📚 Books</p>
              <h2 className="section-title">Featured <span>Books</span></h2>
            </div>
            <div className="items-grid">
              {featuredBooks.map(book => (
                <ItemCard key={book._id} item={book} type="book" />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/products" className="btn btn-secondary">View All Books →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ---- FEATURED GAMES ---- */}
      {!loading && featuredGames.length > 0 && (
        <section className="section featured-section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-header">
              <p className="section-subtitle">🎮 Games</p>
              <h2 className="section-title">Featured <span>Games</span></h2>
            </div>
            <div className="items-grid">
              {featuredGames.map(game => (
                <ItemCard key={game._id} item={game} type="game" />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/products" className="btn btn-secondary">View All Games →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ---- CTA BANNER ---- */}
      <section className="cta-banner">
        <div className="cta-glow" />
        <div className="container cta-inner">
          <h2>Ready to Start Swapping?</h2>
          <p>Join hundreds of students and readers already swapping on our platform.</p>
          <div className="hero-ctas">
            <Link to="/signup" className="btn btn-primary">Create Free Account</Link>
            <Link to="/products" className="btn btn-secondary">Browse Items</Link>
          </div>
        </div>
      </section>

      <style>{`
        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; align-items: center;
          position: relative;
          overflow: hidden;
          background: var(--gradient-hero);
          padding: 6rem 0 4rem;
        }
        .hero-orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; }
        .hero-orb-1 { width: 600px; height: 600px; background: rgba(124,58,237,0.2); top: -100px; left: -200px; }
        .hero-orb-2 { width: 400px; height: 400px; background: rgba(6,182,212,0.12); bottom: -100px; right: -100px; }
        .hero-orb-3 { width: 300px; height: 300px; background: rgba(236,72,153,0.08); top: 40%; left: 50%; }

        .hero-inner { position: relative; z-index: 1; text-align: center; }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.4rem 1rem;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.35);
          border-radius: 999px;
          font-size: 0.82rem; font-weight: 600;
          color: var(--purple-light);
          margin-bottom: 1.75rem;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .hero-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--purple-light);
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .hero-title {
          font-size: clamp(2.2rem, 5.5vw, 4rem);
          font-weight: 900; line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
        }
        .hero-gradient-text {
          background: linear-gradient(135deg, #7c3aed, #06b6d4, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% auto;
          animation: gradientShift 4s ease infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }

        .hero-desc {
          font-size: 1.1rem; color: var(--text-secondary);
          max-width: 540px; margin: 0 auto 2.5rem;
          line-height: 1.7;
        }
        .hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .hero-btn { padding: 0.85rem 2rem; font-size: 1rem; }

        /* Floating cards */
        .hero-floating-cards {
          display: flex; gap: 1rem; justify-content: center;
          flex-wrap: wrap; margin-top: 4rem;
        }
        .floating-card {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 1rem 1.5rem;
          animation: float 3s ease-in-out infinite;
        }
        .floating-card-1 { animation-delay: 0s; }
        .floating-card-2 { animation-delay: 0.5s; }
        .floating-card-3 { animation-delay: 1s; }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .fc-icon { font-size: 1.75rem; }
        .fc-title { font-weight: 700; font-size: 0.95rem; }
        .fc-sub { font-size: 0.78rem; color: var(--text-muted); }

        /* STATS */
        .stats-section { padding: 3rem 0; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .stat-card {
          padding: 2rem 1rem;
          text-align: center;
        }
        .stat-icon { font-size: 2rem; display: block; margin-bottom: 0.75rem; }
        .stat-value {
          font-size: 2rem; font-weight: 900;
          background: var(--gradient-purple);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }
        .stat-label { color: var(--text-muted); font-size: 0.88rem; margin-top: 0.25rem; }

        /* STEPS handled by index.css */

        /* CTA */
        .cta-banner {
          position: relative;
          overflow: hidden;
          padding: 5rem 0;
          background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05));
          border-top: 1px solid var(--border-glass);
          border-bottom: 1px solid var(--border-glass);
          text-align: center;
        }
        .cta-glow {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-inner { position: relative; z-index: 1; }
        .cta-inner h2 { margin-bottom: 0.75rem; }
        .cta-inner p { color: var(--text-secondary); margin-bottom: 2rem; }

        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .hero { padding: 5rem 0 3rem; }
          .hero-title { font-size: clamp(1.8rem, 8vw, 2.5rem); }
          .hero-desc { font-size: 1rem; }
          .stats-grid { grid-template-columns: 1fr; }
          .hero-floating-cards { flex-direction: column; align-items: center; }
        }
        @media (max-width: 480px) {
          .stat-card { padding: 1.5rem 1rem; }
          .stat-value { font-size: 1.5rem; }
          .hero-ctas { flex-direction: column; width: 100%; }
          .hero-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

// Mini item card for homepage
const ItemCard = ({ item, type }) => {
  const imgSrc = item.image ? `${UPLOADS_URL}${item.image}` : null;
  return (
    <div className="item-card">
      {imgSrc ? (
        <img src={imgSrc} alt={item.title} className="item-card-image" />
      ) : (
        <div className="item-card-image-placeholder">
          {type === 'book' ? '📚' : '🎮'}
        </div>
      )}
      <div className="item-card-body">
        <div className="item-card-header">
          <span className={`badge badge-${type}`}>
            {type === 'book' ? '📚 Book' : '🎮 Game'}
          </span>
        </div>
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-desc">{item.description}</p>
      </div>
      <div className="item-card-footer">
        <p className="item-card-owner">By <span>{item.ownerName || 'Anonymous'}</span></p>
      </div>
    </div>
  );
};

export default Home;
