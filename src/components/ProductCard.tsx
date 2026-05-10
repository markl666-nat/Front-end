import { Link } from 'react-router-dom';
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
  // Хелперы — чтобы клики по сердечку и по корзине НЕ срабатывали как переход
  // на страницу товара (родительский Link перехватывает все клики).
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleLike();
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleCart();
  };

  return (
    <article className="cardProduct">
      {/* Картинка + title — кликабельны, ведут на детали */}
      <Link to={`/product/${product.id}`} className="cardProduct__link">
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
              onClick={handleLikeClick}
              aria-pressed={liked}
              aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
              title={liked ? 'In favorites' : 'Add to favorites'}
            >
              ♥
            </button>
          </div>

          <p className="cardProduct__desc">{product.description}</p>

          <div className="cardProduct__footer">
            <div className="price">€{product.priceEuro.toFixed(2)}</div>
            <button
              className={inCart ? 'btn btn--ok' : 'btn btn--primary'}
              onClick={handleCartClick}
            >
              {inCart ? 'In cart' : 'Add to cart'}
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}