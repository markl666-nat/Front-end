import { useState } from 'react';
import { API_BASE_URL } from '../api/config';
import type { GenderTypes } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccessSwitchToLogin: () => void;
};

/**
 * Модалка регистрации нового пользователя через POST /api/reg.
 * После успеха закрывается и переключает на LoginModal.
 *
 * Бэк требует: UserName, Password, Email обязательны.
 * Contacts/DOB/Gender — опциональные, шлём дефолты.
 */
export function RegisterModal({ open, onClose, onSuccessSwitchToLogin }: Props) {  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

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
          gender: 0 satisfies GenderTypes,   // NotSpecified
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Server returned ${response.status}`);
      }

      // Успех — закрываем себя, открываем логин
      setUserName('');
      setEmail('');
      setPassword('');
      onClose();
      onSuccessSwitchToLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="modal-title">Create account</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label">
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

          <label className="modal-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </label>

          <label className="modal-label">
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

          {error && <div className="modal-error">{error}</div>}

          <button
            type="submit"
            className="modal-submit"
            disabled={submitting || !userName || !email || !password}
          >
            {submitting ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div className="modal-hint">
          New users get the <strong>User</strong> role by default. Admin
          accounts are seeded in the database.
        </div>
      </div>
    </div>
  );
}
