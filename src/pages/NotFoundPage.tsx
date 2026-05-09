import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <video
        className="not-found-video"
        src="/videos/cat404.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <h1>404 — Cat not found</h1>
      <p>This page has wandered off into the wilderness.</p>
      <p className="not-found-hint">
        Maybe a Boss Cat ate it. Or maybe you mistyped the URL.
      </p>

      <div className="not-found-links">
        <Link to="/" className="not-found-btn primary">Back to Home</Link>
        <Link to="/catalog" className="not-found-btn">Browse Catalog</Link>
      </div>
    </div>
  );
}