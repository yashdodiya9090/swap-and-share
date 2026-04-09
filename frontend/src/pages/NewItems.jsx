import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { UPLOADS_URL } from '../api';

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNew = async () => {
      try {
        const [bRes, gRes] = await Promise.all([
          api.get('/api/books'),
          api.get('/api/games'),
        ]);
        const allItems = [
          ...bRes.data.map(b => ({ ...b, _type: 'book' })),
          ...gRes.data.map(g => ({ ...g, _type: 'game' })),
        ]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 20);
        setItems(allItems);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchNew();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="new-items-page">
      {/* Header */}
      <div className="new-items-header">
        <div className="ni-orb ni-orb-1" />
        <div className="ni-orb ni-orb-2" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="new-badge">
            <span className="pulse-dot" />
            Live Updates
          </div>
          <h1 className="ni-title">
            🆕 Newly Listed <span className="ni-gradient">Items</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', maxWidth: 500 }}>
            Fresh books and games added by the community. Be the first to claim them!
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📭</span>
            <h3>No items yet</h3>
            <p>Be the first to list a book or game!</p>
            <Link to="/add-item" className="btn btn-primary">+ Add Item</Link>
          </div>
        ) : (
          <div className="ni-grid">
            {items.map(item => {
              const imgSrc = item.image ? (item.image.startsWith('http') ? item.image : `${UPLOADS_URL}${item.image}`) : null;
              return (
                <div key={item._id} className="ni-card glass-card">
                  <div className="ni-card-img-wrap">
                    {imgSrc ? (
                      <img src={imgSrc} alt={item.title} className="ni-card-img" />
                    ) : (
                      <div className="ni-card-img-placeholder">
                        {item._type === 'book' ? '📚' : '🎮'}
                      </div>
                    )}
                    <span className={`ni-badge badge badge-${item._type}`}>
                      {item._type === 'book' ? '📚 Book' : '🎮 Game'}
                    </span>
                    <span className="ni-time">{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="ni-card-body">
                    <h3 className="ni-card-title">{item.title}</h3>
                    <p className="ni-card-desc">{item.description}</p>
                    <div className="ni-card-footer">
                      <span className="ni-owner">
                        <span className="ni-owner-avatar">
                          {(item.ownerName || 'A').charAt(0).toUpperCase()}
                        </span>
                        {item.ownerName || 'Anonymous'}
                      </span>
                      <Link to="/products" className="btn btn-secondary btn-sm">
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {items.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/products" className="btn btn-primary">Browse All Items →</Link>
          </div>
        )}
      </div>

      <style>{`
        .new-items-page { min-height: 100vh; }
        .new-items-header {
          position: relative; overflow: hidden;
          padding: 5rem 0 3rem;
          background: linear-gradient(180deg, rgba(6,182,212,0.08) 0%, transparent 100%);
        }
        .ni-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .ni-orb-1 { width: 400px; height: 400px; background: rgba(6,182,212,0.15); top: -100px; right: -50px; }
        .ni-orb-2 { width: 300px; height: 300px; background: rgba(124,58,237,0.1); bottom: -50px; left: 0; }

        .new-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.4rem 1rem;
          background: rgba(6,182,212,0.12);
          border: 1px solid rgba(6,182,212,0.3);
          border-radius: 999px;
          font-size: 0.82rem; font-weight: 600;
          color: var(--cyan-light);
          margin-bottom: 1rem;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .pulse-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--cyan-light);
          animation: pulseCyan 1.5s ease-in-out infinite;
        }
        @keyframes pulseCyan {
          0%,100% { opacity:1; transform:scale(1); box-shadow: 0 0 0 0 rgba(6,182,212,0.4); }
          50% { opacity:0.8; transform:scale(1.2); box-shadow: 0 0 0 6px rgba(6,182,212,0); }
        }
        .ni-title { font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 900; }
        .ni-gradient {
          background: var(--gradient-cyan);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ni-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .ni-card { overflow: hidden; }
        .ni-card-img-wrap { position: relative; }
        .ni-card-img { width: 100%; height: 210px; object-fit: cover; display: block; }
        .ni-card-img-placeholder {
          width: 100%; height: 210px;
          background: linear-gradient(135deg, rgba(6,182,212,0.12), rgba(124,58,237,0.08));
          display: flex; align-items: center; justify-content: center;
          font-size: 3.5rem;
        }
        .ni-badge {
          position: absolute; top: 0.75rem; left: 0.75rem;
        }
        .ni-time {
          position: absolute; top: 0.75rem; right: 0.75rem;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
          color: var(--text-secondary); font-size: 0.75rem;
          padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 500;
        }
        .ni-card-body { padding: 1.25rem; }
        .ni-card-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.5rem; }
        .ni-card-desc {
          font-size: 0.87rem; color: var(--text-secondary); line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 1rem;
        }
        .ni-card-footer { display: flex; align-items: center; justify-content: space-between; }
        .ni-owner {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.85rem; color: var(--text-muted);
        }
        .ni-owner-avatar {
          width: 26px; height: 26px; border-radius: 50%;
          background: var(--gradient-cyan);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; color: #fff;
        }

        @media (max-width: 560px) {
          .ni-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default NewItems;
