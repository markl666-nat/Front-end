import type { ProductCategory } from '../types';

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
  return (
    <header className="header">
      <div className="container header__row">
        <div className="brand" role="banner">
          <div className="brand__logo" aria-hidden="true">
            <img
              className="brand__logoImage"
              src="https://i.pinimg.com/736x/50/06/b9/5006b9924e63e21ddbe352a60fc3ecb7.jpg"
              alt="PONOS official logo"
            />
          </div>
          <div className="brand__text">
            <div className="brand__title">ponos.official</div>
            <div className="brand__subtitle">The Battle Cats</div>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <button className="nav__link" onClick={onGoToCatalog}>
            Catalog
          </button>
          <button className="nav__link" onClick={onGoToFavorites}>
            Favorites
          </button>
          <button className="nav__link" onClick={onGoToAbout}>
            About
          </button>
        </nav>

        <div className="header__stats" aria-label="Counters">
          <div className="pill">
            <span className="pill__label">Found</span>
            <span className="pill__value">{filteredCount}</span>
          </div>
          <div className="pill">
            <span className="pill__label">Favorites</span>
            <span className="pill__value">{likedCount}</span>
          </div>
          <div className="pill">
            <span className="pill__label">Cart</span>
            <span className="pill__value">{cartCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
}