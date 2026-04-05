import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EditItem = () => {
  const { type, id } = useParams(); // type: 'book' or 'game'
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({ title: '', description: '' });
  const [existingImage, setExistingImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`/api/${type}s/${id}`);
        // Check ownership
        if (data.owner !== user?.id) {
          navigate('/products');
          return;
        }
        setForm({ title: data.title, description: data.description });
        setExistingImage(data.image);
      } catch {
        setError('Item not found or you are not authorized to edit it.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, type, user, navigate]);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveNew = () => {
    setNewImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      if (newImage) formData.append('image', newImage);

      await axios.put(`/api/${type}s/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Item updated successfully! 🎉');
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-wrapper" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const currentImg = preview || (existingImage ? `/uploads/${existingImage}` : null);

  return (
    <div className="edit-item-page">
      <div className="edit-orb edit-orb-1" />
      <div className="edit-orb edit-orb-2" />

      <div className="container edit-container">
        <div className="edit-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <p className="section-subtitle">Edit Your Listing</p>
          <h1 className="edit-title">
            Edit {type === 'book' ? '📚 Book' : '🎮 Game'}
          </h1>
        </div>

        <div className="edit-card glass-card">
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <form onSubmit={handleSubmit} id="edit-item-form">
            <div className="edit-grid">
              {/* Left: Fields */}
              <div>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-title">
                    {type === 'book' ? '📚' : '🎮'} Title
                  </label>
                  <input
                    id="edit-title"
                    name="title"
                    type="text"
                    className="form-input"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-desc">📝 Description</label>
                  <textarea
                    id="edit-desc"
                    name="description"
                    className="form-textarea"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>

                <div className="edit-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                    disabled={saving}
                    id="edit-submit"
                  >
                    {saving ? (
                      <><span className="btn-spinner" /> Saving...</>
                    ) : (
                      '💾 Save Changes'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/products')}
                    id="edit-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Right: Image */}
              <div>
                <label className="form-label">🖼️ Photo</label>
                {currentImg ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <img src={currentImg} alt="Item" className="image-preview" />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <label className="btn btn-secondary btn-sm change-img-btn" htmlFor="edit-image-input">
                        🔄 Change Photo
                      </label>
                      {preview && (
                        <button type="button" className="btn btn-danger btn-sm" onClick={handleRemoveNew}>
                          ✕ Revert
                        </button>
                      )}
                    </div>
                    <input
                      id="edit-image-input"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFile}
                      ref={fileRef}
                      style={{ display: 'none' }}
                    />
                  </div>
                ) : (
                  <div className="upload-area">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFile}
                      ref={fileRef}
                      id="edit-image-input"
                    />
                    <div className="upload-icon">📷</div>
                    <p className="upload-text">Click to upload a photo</p>
                    <p className="upload-hint">JPEG, PNG, GIF, WebP — Max 5MB</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .edit-item-page {
          min-height: 100vh; padding-bottom: 5rem;
          position: relative; overflow: hidden;
        }
        .edit-orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; }
        .edit-orb-1 { width: 400px; height: 400px; background: rgba(124,58,237,0.12); top: 0; left: 0; }
        .edit-orb-2 { width: 350px; height: 350px; background: rgba(6,182,212,0.08); bottom: 0; right: 0; }

        .edit-container { position: relative; z-index: 1; padding-top: 3rem; max-width: 900px; }
        .edit-header { margin-bottom: 2.5rem; }
        .back-btn {
          background: none; border: none; color: var(--text-muted);
          cursor: pointer; font-family: 'Inter',sans-serif; font-size: 0.9rem;
          display: inline-flex; align-items: center; gap: 0.4rem;
          margin-bottom: 1rem; transition: var(--transition); padding: 0;
        }
        .back-btn:hover { color: var(--text-primary); }
        .edit-title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 900; }

        .edit-card { padding: 2.5rem; }
        .edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .edit-actions { display: flex; gap: 0.75rem; margin-top: 1rem; }

        .change-img-btn { cursor: pointer; display: inline-flex; align-items: center; }

        .btn-spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }

        @media (max-width: 768px) {
          .edit-grid { grid-template-columns: 1fr; }
          .edit-actions { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default EditItem;
