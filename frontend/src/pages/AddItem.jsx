import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { UploadButton } from '../utils/uploadthing';
import "@uploadthing/react/styles.css";

const AddItem = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({ title: '', description: '', category: 'book' });
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        image: imageUrl,
      };

      const endpoint = form.category === 'book' ? '/api/books' : '/api/games';
      await api.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSuccess(`${form.category === 'book' ? 'Book' : 'Game'} added successfully! 🎉`);
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-page">
      <div className="add-orb add-orb-1" />
      <div className="add-orb add-orb-2" />

      <div className="container add-container">
        {/* Page Title */}
        <div className="add-header">
          <p className="section-subtitle">Share with Community</p>
          <h1 className="add-title">Add New Item</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            List a book or game for the community to discover and swap.
          </p>
        </div>

        {/* Category Selector */}
        <div className="category-selector">
          <button
            type="button"
            className={`cat-btn ${form.category === 'book' ? 'cat-active cat-book' : ''}`}
            onClick={() => setForm(prev => ({ ...prev, category: 'book' }))}
            id="cat-book"
          >
            <span className="cat-icon">📚</span>
            <span className="cat-label">Book</span>
          </button>
          <button
            type="button"
            className={`cat-btn ${form.category === 'game' ? 'cat-active cat-game' : ''}`}
            onClick={() => setForm(prev => ({ ...prev, category: 'game' }))}
            id="cat-game"
          >
            <span className="cat-icon">🎮</span>
            <span className="cat-label">Game</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="add-form-card glass-card">
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <form onSubmit={handleSubmit} id="add-item-form">
            <div className="add-form-grid">
              {/* Left: Fields */}
              <div className="add-fields">
                <div className="form-group">
                  <label className="form-label" htmlFor="item-title">
                    {form.category === 'book' ? '📚' : '🎮'} Item Title
                  </label>
                  <input
                    id="item-title"
                    name="title"
                    type="text"
                    className="form-input"
                    placeholder={form.category === 'book' ? 'e.g. Harry Potter — J.K. Rowling' : 'e.g. FIFA 24 — PS5'}
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="item-desc">📝 Description</label>
                  <textarea
                    id="item-desc"
                    name="description"
                    className="form-textarea"
                    placeholder="Describe the condition, edition, and anything a swapper should know..."
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`btn ${form.category === 'book' ? 'btn-primary' : 'btn-cyan'}`}
                  style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }}
                  disabled={loading}
                  id="add-item-submit"
                >
                  {loading ? (
                    <><span className="btn-spinner" /> Uploading...</>
                  ) : (
                    `✅ Add ${form.category === 'book' ? 'Book' : 'Game'}`
                  )}
                </button>
              </div>

              {/* Right: Image Upload */}
              <div className="add-image-col">
                <label className="form-label">🖼️ Item Photo</label>
                {!imageUrl ? (
                  <div className="upload-area-ut" id="upload-area">
                    <UploadButton
                      endpoint="productImage"
                      onClientUploadComplete={(res) => {
                        setImageUrl(res[0].url);
                        setError('');
                      }}
                      onUploadError={(error) => {
                        setError(`Upload failed: ${error.message}`);
                      }}
                      content={{
                        button({ ready }) {
                          if (ready) return "📸 Upload Photo";
                          return "Connecting...";
                        }
                      }}
                      appearance={{
                        button: {
                          background: "var(--purple)",
                          padding: "1rem 2rem",
                          borderRadius: "var(--radius-lg)",
                          width: "100%",
                          fontSize: "1rem"
                        }
                      }}
                    />
                    <p className="upload-hint" style={{ marginTop: '1rem' }}>JPEG, PNG — Max 4MB</p>
                  </div>
                ) : (
                  <div className="preview-wrap">
                    <img src={imageUrl} alt="Preview" className="image-preview" />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm remove-img-btn"
                      onClick={handleRemoveImage}
                      id="remove-image"
                    >
                      🗑️ Remove Image
                    </button>
                  </div>
                )}
                <div className="add-tips glass-card" style={{ marginTop: '1.5rem' }}>
                  <h4 className="tips-title">📌 Tips for a Great Listing</h4>
                  <ul className="tips-list">
                    <li>Use a clear, well-lit photo</li>
                    <li>Mention the condition (new, good, worn)</li>
                    <li>Include edition or version info</li>
                    <li>Add any extra details a swapper needs</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .add-item-page {
          min-height: 100vh; padding-bottom: 5rem;
          position: relative; overflow: hidden;
        }
        .add-orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; }
        .add-orb-1 { width: 400px; height: 400px; background: rgba(124,58,237,0.15); top: 0; right: 0; }
        .add-orb-2 { width: 350px; height: 350px; background: rgba(6,182,212,0.1); bottom: 0; left: 0; }

        .add-container { position: relative; z-index: 1; padding-top: 3rem; }
        .add-header { text-align: center; margin-bottom: 2rem; }
        .add-title { font-size: clamp(1.8rem, 4vw, 2.75rem); font-weight: 900; }

        /* Category Selector */
        .category-selector {
          display: flex; gap: 1rem; justify-content: center;
          margin-bottom: 2.5rem;
        }
        .cat-btn {
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          padding: 1.5rem 2.5rem;
          background: rgba(255,255,255,0.04);
          border: 2px solid var(--border-glass);
          border-radius: var(--radius-lg);
          cursor: pointer; transition: var(--transition);
          min-width: 140px;
        }
        .cat-btn:hover { border-color: var(--purple); background: var(--purple-dim); }
        .cat-icon { font-size: 2rem; }
        .cat-label { font-size: 1rem; font-weight: 700; color: var(--text-secondary); font-family: 'Inter', sans-serif; }
        .cat-active { transform: translateY(-2px); }
        .cat-book { border-color: var(--purple) !important; background: var(--purple-dim) !important; box-shadow: var(--shadow-purple); }
        .cat-book .cat-label { color: var(--purple-light) !important; }
        .cat-game { border-color: var(--cyan) !important; background: var(--cyan-dim) !important; box-shadow: var(--shadow-cyan); }
        .cat-game .cat-label { color: var(--cyan-light) !important; }

        /* Form Card */
        .add-form-card { padding: 2.5rem; }
        .add-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        .add-fields { display: flex; flex-direction: column; }

        /* Image col */
        .preview-wrap { display: flex; flex-direction: column; gap: 0.75rem; }
        .remove-img-btn { align-self: flex-start; }

        /* Tips */
        .tips-title { font-size: 0.9rem; margin-bottom: 0.75rem; }
        .tips-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
        .tips-list li {
          font-size: 0.85rem; color: var(--text-muted);
          padding-left: 1.1rem; position: relative;
        }
        .tips-list li::before {
          content: '→'; position: absolute; left: 0;
          color: var(--purple-light);
        }
        .add-tips { padding: 1.25rem 1.5rem; }

        .btn-spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }

        @media (max-width: 768px) {
          .add-form-grid { grid-template-columns: 1fr; }
          .category-selector { gap: 0.75rem; }
          .cat-btn { padding: 1.25rem 1.75rem; min-width: 120px; }
        }
      `}</style>
    </div>
  );
};

export default AddItem;
