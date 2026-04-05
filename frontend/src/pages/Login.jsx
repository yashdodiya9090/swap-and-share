import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google OAuth specific states
  const [googleData, setGoogleData] = useState(null); // { idToken, email, name }
  const [showMobilePrompt, setShowMobilePrompt] = useState(false);
  const [mobile, setMobile] = useState('');

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const onGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/api/auth/google', {
        idToken: credentialResponse.credential
      });

      if (data.mobileRequired) {
        setGoogleData({ idToken: credentialResponse.credential, email: data.email, name: data.name });
        setShowMobilePrompt(true);
      } else {
        login(data.token, data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google Auth failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteGoogleSignup = async (e) => {
    e.preventDefault();
    if (!mobile) return setError('Mobile number is required');
    
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/google', {
        idToken: googleData.idToken,
        mobile
      });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete signup');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showMobilePrompt) {
    return (
      <div className="auth-page">
        <div className="auth-container" style={{ maxWidth: '450px' }}>
          <div className="auth-right glass-card" style={{ width: '100%' }}>
            <div className="auth-form-header">
              <h1 className="auth-form-title">Almost There!</h1>
              <p className="auth-form-sub">Please provide your mobile number to complete your profile.</p>
            </div>
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleCompleteGoogleSignup}>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Completing...' : 'Complete Signup'}
              </button>
            </form>
          </div>
        </div>
        <style>{authStyles}</style>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-brand">
            <span style={{ fontSize: '2rem' }}>🔄</span>
            <span className="auth-brand-name">Swap &amp; Share</span>
          </div>
          <h2 className="auth-left-title">
            Welcome <span>Back!</span>
          </h2>
          <p className="auth-left-desc">
            Sign in to list your books and games, manage your items, and connect with the community.
          </p>
          <div className="auth-features">
            {['Browse 800+ items', 'List your own items', 'Swap with community', 'Completely free'].map((f, i) => (
              <div key={i} className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="auth-right glass-card">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Sign In</h1>
            <p className="auth-form-sub">Don't have an account? <Link to="/signup" className="auth-link">Sign up free</Link></p>
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin 
              onSuccess={onGoogleLoginSuccess} 
              onError={() => setError('Google Login Failed')} 
              useOneTap 
              theme="filled_blue" 
              shape="pill" 
              width="100%" 
            />
          </div>

          <div className="auth-divider"><span>OR EMAIL</span></div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <><span className="btn-spinner" /> Signing In...</>
              ) : (
                '🔐 Sign In'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              New to Swap &amp; Share?
            </p>
            <Link to="/signup" className="btn btn-secondary" style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        ${authStyles}
      `}</style>
    </div>
  );
};



export const authStyles = `
  .auth-page {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem 1.5rem;
    position: relative; overflow: hidden;
    background: var(--gradient-hero);
  }
  .auth-orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; }
  .auth-orb-1 { width: 500px; height: 500px; background: rgba(124,58,237,0.18); top: -100px; left: -100px; }
  .auth-orb-2 { width: 400px; height: 400px; background: rgba(6,182,212,0.1); bottom: -100px; right: -100px; }

  .auth-container {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 3rem; max-width: 960px; width: 100%;
    position: relative; z-index: 1;
    align-items: center;
  }

  /* Left */
  .auth-brand { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 2rem; }
  .auth-brand-name { font-size: 1.3rem; font-weight: 800; }
  .auth-left-title {
    font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 900;
    margin-bottom: 1rem; line-height: 1.2;
  }
  .auth-left-title span {
    background: var(--gradient-purple);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .auth-left-desc { color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem; }
  .auth-features { display: flex; flex-direction: column; gap: 0.75rem; }
  .auth-feature {
    display: flex; align-items: center; gap: 0.75rem;
    color: var(--text-secondary); font-size: 0.95rem;
  }
  .auth-feature-icon {
    width: 22px; height: 22px; background: var(--gradient-purple);
    border-radius: 50%; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 700; flex-shrink: 0;
  }

  /* Right */
  .auth-right { padding: 2.5rem; }
  .auth-form-header { margin-bottom: 1.75rem; }
  .auth-form-title { font-size: 1.6rem; font-weight: 800; margin-bottom: 0.35rem; }
  .auth-form-sub { color: var(--text-muted); font-size: 0.9rem; }
  .auth-link { color: var(--purple-light); font-weight: 600; }
  .auth-link:hover { text-decoration: underline; }

  .auth-divider {
    display: flex; align-items: center; gap: 1rem;
    margin: 1.5rem 0; color: var(--text-muted); font-size: 0.85rem;
  }
  .auth-divider::before, .auth-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border-glass);
  }

  .btn-spinner {
    display: inline-block; width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }

  @media (max-width: 768px) {
    .auth-container { grid-template-columns: 1fr; gap: 2rem; }
    .auth-left { text-align: center; }
    .auth-features { align-items: flex-start; }
    .auth-brand { justify-content: center; }
  }
`;

export default Login;
