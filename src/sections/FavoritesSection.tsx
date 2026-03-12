import type { Product } from '../types.ts';
import { ProductMiniCard } from '../components/ProductMiniCard.tsx';

type Props = {
  favorites: Product[];
  onToggleLike: (id: string) => void;
};

export function FavoritesSection({ favorites, onToggleLike }: Props) {
  return (
    <section className="container section" id="favorites">
      <div className="section__header">
        <h2 className="section__title">Favorites</h2>
        <p className="section__subtitle">Items you have liked.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty" role="status">
          Empty for now. Tap ♥ on a product card to add it here.
        </div>
      ) : (
        <div className="grid" aria-label="Favorite items">
          {favorites.map((p) => (
            <ProductMiniCard
              key={p.id}
              product={p}
              onRemoveFromFavorites={() => onToggleLike(p.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}