import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { UPLOADS_URL } from '../api';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [toast, setToast] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, gRes] = await Promise.all([
        api.get('/api/books'),
        api.get('/api/games'),
      ]);
      setBooks(bRes.data);
      setGames(gRes.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    setDeleteLoading(id);
    try {
      await api.delete(`/api/${type}s/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (type === 'book') setBooks(prev => prev.filter(b => b._id !== id));
      else setGames(prev => prev.filter(g => g._id !== id));
      showToast(`${type === 'book' ? 'Book' : 'Game'} deleted successfully!`);
    } catch {
      showToast('Failed to delete. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filterItems = (items) =>
    items.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    );

  const displayBooks = filterItems(books);
  const displayGames = filterItems(games);
  const displayAll = [
    ...displayBooks.map(b => ({ ...b, _type: 'book' })),
    ...displayGames.map(g => ({ ...g, _type: 'game' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="products-page">
      {toast && <div className="toast">{toast}</div>}

      {/* Page Header */}
      <div className="products-header">
        <div className="products-header-bg" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="section-subtitle">Browse All</p>
          <h1 className="products-title">Books &amp; Games</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {books.length} books &amp; {games.length} games available for swap
          </p>
        </div>
      </div>

      <div className="container products-body">
        {/* Controls */}
        <div className="products-controls">
          <div className="tabs">
            {['all', 'books', 'games'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                id={`tab-${tab}`}
              >
                {tab === 'all' ? '🌐 All' : tab === 'books' ? '📚 Books' : '🎮 Games'}
              </button>
            ))}
          </div>
          <div className="search-bar">
            <span className="search-bar-icon">🔍</span>
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="product-search"
            />
          </div>
          {user && (
            <Link to="/add-item" className="btn btn-primary btn-sm">
              + Add Item
            </Link>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-wrapper">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {activeTab === 'all' && (
              <ItemGrid
                items={displayAll}
                user={user}
                onDelete={handleDelete}
                deleteLoading={deleteLoading}
                navigate={navigate}
              />
            )}
            {activeTab === 'books' && (
              <ItemGrid
                items={displayBooks.map(b => ({ ...b, _type: 'book' }))}
                user={user}
                onDelete={handleDelete}
                deleteLoading={deleteLoading}
                navigate={navigate}
              />
            )}
            {activeTab === 'games' && (
              <ItemGrid
                items={displayGames.map(g => ({ ...g, _type: 'game' }))}
                user={user}
                onDelete={handleDelete}
                deleteLoading={deleteLoading}
                navigate={navigate}
              />
            )}
          </>
        )}
      </div>

      <style>{`
        .products-page { min-height: 100vh; }
        .products-header {
          position: relative; overflow: hidden;
          padding: 5rem 0 3rem;
          background: linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%);
        }
        .products-header-bg {
          position: absolute; top: -50px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(124,58,237,0.15), transparent 70%);
          pointer-events: none;
        }
        .products-title { font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 900; }
        .products-body { padding: 2rem 1.5rem 4rem; }
        .products-controls {
          display: flex; align-items: center; gap: 1rem;
          flex-wrap: wrap; margin-bottom: 2.5rem;
        }
        .toast {
          position: fixed; bottom: 2rem; right: 2rem;
          background: #1e293b; border: 1px solid var(--border-glass);
          color: var(--text-primary); padding: 0.9rem 1.5rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          z-index: 9999; animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
};

const ItemGrid = ({ items, user, onDelete, deleteLoading, navigate }) => {
  const [activeContactItem, setActiveContactItem] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: '', type: '', url: '' });

  const closeContactModal = () => {
    setActiveContactItem(null);
  };

  const showInternalToast = (msg, type = 'success', url = '') => {
    setToast({ show: true, msg, type, url });
    setTimeout(() => setToast({ show: false, msg: '', type: '', url: '' }), 10000);
  };

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">📭</span>
        <h3>No items found</h3>
        <p>Try a different search or category.</p>
        <Link to="/add-item" className="btn btn-primary">+ Add First Item</Link>
      </div>
    );
  }

  return (
    <div className="items-grid">
      {items.map(item => {
        const type = item._type;
        const imgSrc = item.image ? (item.image.startsWith('http') ? item.image : `${UPLOADS_URL}${item.image}`) : null;
        const isOwner = user && user.id === item.owner;

        return (
          <div key={item._id} className="item-card">
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
                {isOwner && <span className="owner-tag">Yours</span>}
              </div>
              <h3 className="item-card-title">{item.title}</h3>
              <p className="item-card-desc">{item.description}</p>
            </div>

            <div className="item-card-footer">
              <p className="item-card-owner">By <span>{item.ownerName || 'Anonymous'}</span></p>
              {isOwner && (
                <div className="item-card-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/edit-item/${type}/${item._id}`)}
                    id={`edit-${item._id}`}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(item._id, type)}
                    disabled={deleteLoading === item._id}
                    id={`delete-${item._id}`}
                  >
                    {deleteLoading === item._id ? '...' : '🗑️'}
                  </button>
                </div>
              )}
            </div>

            {/* Contact Owner Section - only for other users' items */}
            {user && !isOwner && (
              <div className="contact-owner-section">
                <button
                  className="contact-owner-btn"
                  onClick={() => setActiveContactItem(item)}
                  id={`contact-${item._id}`}
                >
                  <span className="contact-icon">📬</span>
                  Contact Owner
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Contact Modal */}
      {activeContactItem && (
        <div className="contact-modal-overlay" onClick={closeContactModal}>
          <div className="contact-modal-container" onClick={e => e.stopPropagation()}>
            <div className="contact-modal-header">
              <h3>📋 Owner Contact Info</h3>
              <button className="contact-modal-close" onClick={closeContactModal}>✕</button>
            </div>
            <div className="contact-modal-body">
              <div className="contact-owner-info">
                <div className="contact-avatar">
                  {(activeContactItem.ownerName || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="contact-name">{activeContactItem.ownerName || 'Anonymous'}</div>
                  <div className="contact-type">Owner of "{activeContactItem.title}"</div>
                </div>
              </div>

              <div className="contact-options">
                {/* WhatsApp Chat - Fastest */}
                {activeContactItem.ownerMobile && (
                  <a
                    href={`https://wa.me/${activeContactItem.ownerMobile.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in your item "${activeContactItem.title}" on Swap & Share. Is it still available?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-link contact-whatsapp"
                    id={`whatsapp-${activeContactItem._id}`}
                  >
                    <span className="contact-link-icon">💬</span>
                    <div className="contact-link-info">
                      <span className="contact-link-label">WhatsApp Chat</span>
                      <span className="contact-link-value">Instant Message</span>
                    </div>
                    <span className="contact-link-arrow">→</span>
                  </a>
                )}

                {/* Direct Call Link */}
                {activeContactItem.ownerMobile && (
                  <a
                    href={`tel:${activeContactItem.ownerMobile}`}
                    className="contact-link contact-phone"
                    id={`phone-${activeContactItem._id}`}
                  >
                    <span className="contact-link-icon">📱</span>
                    <div className="contact-link-info">
                      <span className="contact-link-label">Direct Call</span>
                      <span className="contact-link-value">{activeContactItem.ownerMobile}</span>
                    </div>
                    <span className="contact-link-arrow">→</span>
                  </a>
                )}


                {!activeContactItem.ownerMobile && (
                  <div className="contact-no-info">
                    ⚠️ Owner hasn't shared their mobile number yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .owner-tag {
          font-size: 0.72rem; font-weight: 700; color: #4ade80;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2);
          padding: 0.15rem 0.5rem; border-radius: 999px;
        }

        /* Contact Owner Section */
        .contact-owner-section {
          padding: 0 1.25rem 1.25rem;
        }
        .contact-owner-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem 1rem;
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: var(--radius-md, 10px);
          background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(99,102,241,0.08));
          color: #a78bfa;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.02em;
        }
        .contact-owner-btn:hover {
          background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.15));
          border-color: rgba(124,58,237,0.5);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(124,58,237,0.15);
        }
        .contact-icon {
          font-size: 1rem;
        }

        /* Contact Modal Styling */
        .contact-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(6,8,15,0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          animation: modalFadeIn 0.3s ease;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .contact-modal-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          width: 92%;
          max-width: 480px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          overflow: hidden;
          animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .contact-modal-header {
          padding: 1.25rem 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .contact-modal-header h3 { font-size: 1rem; font-weight: 700; margin: 0; }
        .contact-modal-close {
          background: rgba(255,255,255,0.06); border: none; color: var(--text-secondary);
          width: 32px; height: 32px; border-radius: 8px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .contact-modal-close:hover { background: rgba(239,68,68,0.15); color: #f87171; }

        .contact-modal-body { padding: 1.5rem; }
        .contact-owner-info {
          display: flex; align-items: center; gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .contact-avatar {
          width: 48px; height: 48px;
          background: var(--gradient-purple);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1.25rem; color: #fff;
        }
        .contact-name { font-weight: 700; font-size: 1.1rem; color: var(--text-primary); }
        .contact-type { font-size: 0.82rem; color: var(--text-muted); margin-top: 2px; }

        .contact-options { display: flex; flex-direction: column; gap: 0.75rem; }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
          gap: 1rem;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.85rem;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.25s ease;
          margin-bottom: 0.5rem;
        }

        .contact-whatsapp {
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.15);
        }
        .contact-whatsapp:hover {
          background: rgba(34,197,94,0.15);
          border-color: rgba(34,197,94,0.3);
          transform: translateX(3px);
        }

        .contact-phone {
          background: rgba(236,72,153,0.08);
          border: 1px solid rgba(236,72,153,0.15);
        }
        .contact-phone:hover {
          background: rgba(236,72,153,0.15);
          border-color: rgba(236,72,153,0.3);
          transform: translateX(3px);
        }


        .contact-link-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .contact-link-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }
        .contact-link-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-primary, #e2e8f0);
        }
        .contact-link-value {
          font-size: 0.72rem;
          color: var(--text-secondary, #94a3b8);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .contact-link-arrow {
          font-size: 1rem;
          color: var(--text-muted, #64748b);
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .contact-link:hover .contact-link-arrow {
          transform: translateX(3px);
        }

        .contact-no-info {
          font-size: 0.82rem;
          color: var(--text-muted, #64748b);
          text-align: center;
          padding: 0.5rem;
        }
        @media (max-width: 640px) {
          .section-header { text-align: left; }
          .section-title { font-size: 1.5rem; }
          .contact-modal-container { padding: 1.25rem; }
          .contact-owner-info { gap: 1rem; }
          .contact-name { font-size: 1rem; }
          .contact-link { padding: 0.65rem 0.75rem; font-size: 0.9rem; }
        }
        @media (max-width: 480px) {
          .items-grid { grid-template-columns: 1fr; }
          .contact-modal-header h3 { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default Products;
