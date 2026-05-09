import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

/**
 * Header без props — теперь это глобальная навигация по сайту.
 * Использует Link и useNavigate из react-router-dom вместо колбэков.
 *
 * Login и Sign Up остались как модалки — они быстрее чем переходить
 * на отдельные страницы и сохраняют контекст текущей страницы.
 * При желании можно перенаправлять на /login и /register через navigate.
 */
export function Header() {
  const { isAuthenticated, userName, userRole, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">🐾</span>
            <span className="brand-text">Cat Base Shop</span>
          </Link>

          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/catalog" className="nav-link">Catalog</Link>
            <Link to="/cart" className="nav-link cart-link">
  🛒 Cart
  {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
</Link>
            {isAuthenticated && (
              <Link to="/profile" className="nav-link">Profile</Link>
            )}
            {(userRole === 'Admin' || userRole === 'Manager') && (
              <Link to="/admin" className="nav-link">Admin 🛠</Link>
            )}
          </nav>

          <div className="header-user">
            {isAuthenticated ? (
              <>
                <span className="header-user-name">{userName}</span>
                {userRole && <span className="header-user-role">{userRole}</span>}
                <button className="header-logout-btn" onClick={handleLogout} title="Sign out">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="header-login-btn" onClick={() => setRegisterOpen(true)}>
                  Sign Up
                </button>
                <button className="header-login-btn" onClick={() => setLoginOpen(true)}>
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSuccessSwitchToLogin={() => setLoginOpen(true)}
      />
    </>
  );
}