import type { Product } from '../types.ts';
import { categoryLabels } from '../data/products.ts';

type Props = {
  product: Product;
  liked: boolean;
  inCart: boolean;
  onToggleLike: () => void;
  onToggleCart: () => void;
};

export function ProductCard({
  product,
  liked,
  inCart,
  onToggleLike,
  onToggleCart,
}: Props) {
  return (
    <article className="cardProduct">
      <div className="cardProduct__media">
        <img
          className="cardProduct__img"
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
        />
        <div className="cardProduct__chip">{categoryLabels[product.category]}</div>
      </div>

      <div className="cardProduct__body">
        <div className="cardProduct__titleRow">
          <h3 className="cardProduct__title">{product.title}</h3>
          <button
            className={liked ? 'iconBtn iconBtn--on' : 'iconBtn'}
            onClick={onToggleLike}
            aria-pressed={liked}
            aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
            title={liked ? 'In favorites' : 'Add to favorites'}
          >
            ♥
          </button>
        </div>

        <p className="cardProduct__desc">{product.description}</p>

        <div className="cardProduct__footer">
          <div className="price">{product.priceRub.toLocaleString('ru-RU')} ₽</div>
          <button
            className={inCart ? 'btn btn--ok' : 'btn btn--primary'}
            onClick={onToggleCart}
          >
            {inCart ? 'In cart' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}