type Props = {
  onGoToCatalog: () => void;
  onResetFilters: () => void;
};

export function HeroSection({ onGoToCatalog, onResetFilters }: Props) {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 className="hero__title">Interactive Cat Base catalog</h1>
          <p className="hero__text">
            Build your army of cats, upgrade your base and save your favorite
            items. Search and filters work in real time.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary" onClick={onGoToCatalog}>
              Go to catalog
            </button>
            <button className="btn btn--ghost" onClick={onResetFilters}>
              Reset filters
            </button>
          </div>
        </div>

        <div className="hero__card" aria-label="Promo banner">
          <div className="hero__badge">NEW</div>
          <div className="hero__art" />
          <div className="hero__meta">
            <div className="hero__metaTitle">Seasonal picks</div>
            <div className="hero__metaText">Pick cats and upgrades for your playstyle.</div>
          </div>
        </div>
      </div>
    </section>
  );
}