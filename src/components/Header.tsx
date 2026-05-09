import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

type Props = {
  filteredCount: number;
  likedCount: number;
  cartCount: number;
  onGoToCatalog: () => void;
  onGoToFavorites: () => void;
  onGoToAbout: () => void;
};

export function Header({
  filteredCount,
  likedCount,
  cartCount,
  onGoToCatalog,
  onGoToFavorites,
  onGoToAbout,
}: Props) {
  const { isAuthenticated, userName, userRole, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark">🐾</span>
            <span className="brand-text">Cat Base Shop</span>
          </div>

          <nav className="nav">
            <button onClick={onGoToCatalog} className="nav-link">
              Catalog ({filteredCount})
            </button>
            <button onClick={onGoToFavorites} className="nav-link">
              Favorites ({likedCount})
            </button>
            {(userRole === 'Admin' || userRole === 'Manager') && (
              <button
                onClick={() => {
                  document
                    .getElementById('admin')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="nav-link"
              >
                Admin 🛠
              </button>
            )}
            <button onClick={onGoToAbout} className="nav-link">
              About
            </button>
            <span className="nav-cart">🛒 {cartCount}</span>
          </nav>

          {/* Зона авторизации справа */}
          <div className="header-user">
            {isAuthenticated ? (
              <>
                <span className="header-user-name">{userName}</span>
                {userRole && (
                  <span className="header-user-role">{userRole}</span>
                )}
                <button
                  className="header-logout-btn"
                  onClick={logout}
                  title="Sign out"
                >
                  Logout
                </button>
              </>
          ) : (
              <>
                <button
                  className="header-login-btn"
                  onClick={() => setRegisterOpen(true)}
                >
                  Sign Up
                </button>
                <button
                  className="header-login-btn"
                  onClick={() => setLoginOpen(true)}
                >
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