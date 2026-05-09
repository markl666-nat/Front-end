import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Модалка логина. Появляется поверх страницы при клике на "Login" в Header.
 * После успешного логина закрывается автоматически.
 *
 * Для тестирования есть подсказка с тремя seed-юзерами:
 *   admin / admin123
 *   manager / manager123
 *   user / user1234
 */
export function LoginModal({ open, onClose }: Props) {
  const { login } = useAuth();
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ login: loginValue, password });
      // успешно — чистим форму и закрываем
      setLoginValue('');
      setPassword('');
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
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

        <h2 className="modal-title">Login to Cat Base</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label">
            Login (username or email)
            <input
              type="text"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              required
              autoFocus
              disabled={submitting}
            />
          </label>

          <label className="modal-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
            />
          </label>

          {error && <div className="modal-error">{error}</div>}

          <button
            type="submit"
            className="modal-submit"
            disabled={submitting || !loginValue || !password}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="modal-hint">
          <strong>Test accounts:</strong>
          <br />
          admin / admin123
          <br />
          manager / manager123
          <br />
          user / user1234
        </div>
      </div>
    </div>
  );
}