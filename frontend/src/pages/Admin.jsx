import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';
import './Admin.css';

export default function Admin() {
  const { isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();

  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    if (!password.trim()) return setError('Please enter the admin password.');

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');
      login(data.token);
      navigate('/examples');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Already logged in
  if (isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-card admin-logged-in-card">
          <div className="admin-check">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2>Admin Session Active</h2>
          <p>You're logged in as an admin. You can manage reviews and portfolio items.</p>
          <div className="admin-links">
            <Link to="/examples" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Manage Portfolio
            </Link>
            <Link to="/reviews" className="btn btn-outline-dark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              Manage Reviews
            </Link>
          </div>
          <button className="admin-logout-text" onClick={logout}>
            Log out of admin session
          </button>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div className="admin-page">
      <div className="admin-card">
        <div className="admin-lock-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </div>
        <h2>Admin Login</h2>
        <p>Enter the admin password to access management features.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin} className="admin-form">
          <div className="form-group">
            <label htmlFor="admin-pw">Admin Password</label>
            <div className="pw-wrap">
              <input
                id="admin-pw"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary admin-submit-btn" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <Link to="/" className="admin-back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
