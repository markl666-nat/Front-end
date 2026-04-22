import type { Product } from '../types.ts';
import { categoryLabels } from '../data/products.ts';

type Props = {
  product: Product;
  onRemoveFromFavorites: () => void;
};

export function ProductMiniCard({ product, onRemoveFromFavorites }: Props) {
  return (
    <article className="cardMini">
      <img className="cardMini__img" src={product.imageUrl} alt={product.title} />
      <div className="cardMini__body">
        <div className="cardMini__title">{product.title}</div>
        <div className="cardMini__meta">
          <span>{categoryLabels[product.category]}</span>
          <span>·</span>
          <span>{product.priceRub.toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>
      <button
        className="iconBtn iconBtn--on"
        onClick={onRemoveFromFavorites}
        aria-label="Remove from favorites"
        title="Remove"
      >
        ♥
      </button>
    </article>
  );
}