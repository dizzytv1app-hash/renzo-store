import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { useRouter } from '@/lib/router';
import { useFavorites } from '@/lib/store';
import { formatPrice, getEffectivePrice, getDiscountPercent, cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  imageUrl: string;
}

export function ProductCard({ product, imageUrl }: ProductCardProps) {
  const { navigate } = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(product.id);
  const discount = getDiscountPercent(product);
  const price = getEffectivePrice(product);

  return (
    <button
      onClick={() => navigate({ name: 'product', slug: product.slug })}
      className="group text-left animate-fade-in"
    >
      <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden mb-2">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new && (
            <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              Yangi
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              -{discount}%
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite({
              product_id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              discount_price: product.discount_price,
              image_url: imageUrl,
              added_at: Date.now(),
            });
          }}
          className={cn(
            'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all',
            fav ? 'bg-red-50 text-red-500' : 'bg-white/80 text-neutral-400 hover:text-neutral-900',
          )}
        >
          <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="px-0.5">
        <h3 className="text-sm font-medium text-neutral-900 truncate">{product.name}</h3>
        <p className="text-xs text-neutral-400 mb-1">Kod: {product.sku}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-neutral-900">{formatPrice(price)}</span>
          {discount > 0 && (
            <span className="text-xs text-neutral-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </button>
  );
}
