export function AboutSection() {
  return (
    <section className="container section" id="about">
      <div className="section__header">
        <h2 className="section__title">About</h2>
        <p className="section__subtitle">
          Training project: interactive product catalog themed around The Battle Cats.
        </p>
      </div>

      <div className="about">
        <div className="about__card">
          <div className="about__title">What this site demonstrates</div>
          <ul className="about__list">
            <li>Live search (onChange + useState)</li>
            <li>Filtering by categories</li>
            <li>Catalog rendered with .map() over product list</li>
            <li>Action buttons: like and add to cart</li>
            <li>Counters for found items, favorites and cart</li>
          </ul>
        </div>

        <div className="about__card">
          <div className="about__title">Notes</div>
          <p className="about__text">
            Data comes from a mock array in <code>products.ts</code> and is
            combined with an API response. You can replace it with your own API
            without changing the UI.
          </p>
        </div>
      </div>
    </section>
  );
}