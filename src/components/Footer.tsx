import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-brand">
              Ponos<span className="brand-text-dot">.</span><span className="brand-text-suffix">official</span>
            </div>
            <p className="footer-text">
              Demo catalog of cats, base upgrades, buffs and gacha capsules
              inspired by The Battle Cats by PONOS Corporation.
            </p>
          </div>

          <div className="footer-col">
            <div className="footer-heading">Catalog</div>
            <Link to="/catalog" className="footer-link">All items</Link>
            <Link to="/" className="footer-link">Home</Link>
          </div>

          <div className="footer-col">
            <div className="footer-heading">Account</div>
            <Link to="/login" className="footer-link">Login</Link>
            <Link to="/register" className="footer-link">Sign Up</Link>
            <Link to="/profile" className="footer-link">Profile</Link>
          </div>

          <div className="footer-col">
            <div className="footer-heading">About</div>
            <span className="footer-text">
              Coursework project for TUM, FCIM,
              Web Technologies discipline, 2026.
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-bottom-text">
            © {new Date().getFullYear()} Ponos.official — built by markl666 & radicq
          </span>
          <span className="footer-bottom-badge">
            React · TypeScript · ASP.NET Core 8
          </span>
        </div>
      </div>
    </footer>
  );
}