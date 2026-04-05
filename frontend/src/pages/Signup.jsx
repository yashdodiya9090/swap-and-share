import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { authStyles } from './Login';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google OAuth specific states
  const [googleData, setGoogleData] = useState(null);
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
    if (!form.mobile) {
      setError('Mobile number is required');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/api/auth/signup', {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
              <h1 className="auth-form-title">Final Step!</h1>
              <p className="auth-form-sub">Welcome {googleData?.name}! Please provide your mobile number to join.</p>
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
                {loading ? 'Joining...' : '🚀 Create My Account'}
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
            Join the <span>Community!</span>
          </h2>
          <p className="auth-left-desc">
            Create your free account and start listing books and games within minutes. 
            No payment required — ever.
          </p>
          <div className="auth-features">
            {['Free account forever', 'Upload item photos', 'Connect with swappers', 'Manage your listings'].map((f, i) => (
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
            <h1 className="auth-form-title">Create Account</h1>
            <p className="auth-form-sub">Already have one? <Link to="/login" className="auth-link">Sign in</Link></p>
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin 
              onSuccess={onGoogleLoginSuccess} 
              onError={() => setError('Google Signup Failed')} 
              useOneTap 
              theme="filled_blue" 
              shape="pill" 
              width="100%" 
            />
          </div>

          <div className="auth-divider"><span>OR EMAIL</span></div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit} id="signup-form">
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email Address <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                id="signup-email"
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
              <label className="form-label" htmlFor="signup-mobile">Mobile Number <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                id="signup-mobile"
                name="mobile"
                type="tel"
                className="form-input"
                placeholder="+91 9876543210"
                value={form.mobile}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
              <input
                id="signup-confirm"
                name="confirm"
                type="password"
                className="form-input"
                placeholder="Re-enter password"
                value={form.confirm}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', marginTop: '0.25rem' }}
              disabled={loading}
              id="signup-submit"
            >
              {loading ? (
                <><span className="btn-spinner" /> Creating Account...</>
              ) : (
                '🚀 Create Free Account'
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            By creating an account you agree to our terms of service.
          </p>
        </div>
      </div>

      <style>{authStyles}</style>
    </div>
  );
};

export default Signup;

