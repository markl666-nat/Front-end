import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/config';

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          password,
          email,
          contacts: '',
          dob: new Date().toISOString(),
          gender: 0,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Server returned ${response.status}`);
      }
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join the Cat Base community</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Username
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              minLength={3}
              required
              autoFocus
              disabled={submitting}
            />
          </label>

          <label className="auth-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </label>

          <label className="auth-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              disabled={submitting}
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="auth-submit"
            disabled={submitting || !userName || !email || !password}
          >
            {submitting ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}