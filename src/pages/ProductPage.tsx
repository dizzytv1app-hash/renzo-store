import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, X, Check, ChevronRight } from 'lucide-react';
import { useProduct } from '@/hooks/useData';
import { Header } from '@/components/Header';
import { useRouter } from '@/lib/router';
import { useCart, useFavorites, useRecentViews } from '@/lib/store';
import { formatPrice, getEffectivePrice, getDiscountPercent, cn } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useData';

export function ProductPage({ slug }: { slug: string }) {
  const { product, loading } = useProduct(slug);
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addRecent } = useRecentViews();
  const { products: allProducts } = useProducts({ sort: 'newest' });

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [imageIdx, setImageIdx] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] ?? '');
      setSelectedSize(product.sizes[0] ?? '');
      setImageIdx(0);
      addRecent({
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        image_url: product.product_images?.[0]?.url ?? '',
        price: product.price,
        discount_price: product.discount_price,
      });
    }
  }, [product]);

  if (loading) {
    return (
      <div className="pb-20 md:pb-8">
        <Header showBack title="Mahsulot" />
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="skeleton aspect-square mb-4" />
          <div className="skeleton h-6 mb-2" />
          <div className="skeleton h-4 w-2/3 mb-4" />
          <div className="skeleton h-10 mb-4" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pb-20 md:pb-8">
        <Header showBack title="Mahsulot" />
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <p className="text-neutral-500">Mahsulot topilmadi.</p>
        </div>
      </div>
    );
  }

  const images = product.product_images ?? [];
  const price = getEffectivePrice(product);
  const discount = getDiscountPercent(product);
  const fav = isFavorite(product.id);
  const related = allProducts.filter((p) => p.id !== product.id && p.category_id === product.category_id).slice(0, 4);

  const handleAddToCart = () => {
    if (product.colors.length > 0 && !selectedColor) return;
    if (product.sizes.length > 0 && !selectedSize) return;
    addToCart({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      discount_price: product.discount_price,
      image_url: images[0]?.url ?? '',
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pb-24 md:pb-8">
      <Header showBack title={product.name} />

      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Images */}
          <div>
            <div
              className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden cursor-zoom-in mb-3"
              onClick={() => setZoomOpen(true)}
            >
              <img
                src={images[imageIdx]?.url ?? ''}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  -{discount}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setImageIdx(i)}
                    className={cn(
                      'w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                      i === imageIdx ? 'border-neutral-900' : 'border-transparent opacity-60',
                    )}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="mb-2">
              {product.category && (
                <span className="text-xs text-neutral-400 uppercase tracking-wide">
                  {product.category.name}
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-1">{product.name}</h1>
            <p className="text-sm text-neutral-400 mb-3">Kod: {product.sku}</p>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold">{formatPrice(price)}</span>
              {discount > 0 && (
                <span className="text-base text-neutral-400 line-through">{formatPrice(product.price)}</span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-neutral-600 leading-relaxed mb-5">{product.description}</p>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Rang: <span className="text-neutral-500">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all',
                        selectedColor === color
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400',
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">O'lcham: <span className="text-neutral-500">{selectedSize}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-[44px] px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all text-center',
                        selectedSize === size
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400',
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 font-medium px-6 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98]',
                  added ? 'bg-green-600 text-white' : 'bg-neutral-900 text-white hover:bg-neutral-800',
                )}
              >
                {added ? (
                  <>
                    <Check size={20} /> Qo'shildi
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} /> Savatga qo'shish
                  </>
                )}
              </button>
              <button
                onClick={() =>
                  toggleFavorite({
                    product_id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    discount_price: product.discount_price,
                    image_url: images[0]?.url ?? '',
                    added_at: Date.now(),
                  })
                }
                className={cn(
                  'p-3.5 rounded-xl border-2 transition-all',
                  fav ? 'border-red-200 bg-red-50 text-red-500' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400',
                )}
              >
                <Heart size={20} fill={fav ? 'currentColor' : 'none'} />
              </button>
            </div>

            <button
              onClick={() => {
                handleAddToCart();
                setTimeout(() => navigate({ name: 'checkout' }), 300);
              }}
              className="w-full mt-2 btn-outline"
            >
              Buyurtma berish
            </button>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-base font-bold mb-3">O'xshash mahsulotlar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} imageUrl={p.product_images?.[0]?.url ?? ''} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom modal */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fade-in" onClick={() => setZoomOpen(false)}>
          <button className="absolute top-4 right-4 p-2 text-white/80 hover:text-white">
            <X size={28} />
          </button>
          <img src={images[imageIdx]?.url ?? ''} alt={product.name} className="max-w-full max-h-full object-contain" />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageIdx((prev) => (prev - 1 + images.length) % images.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white"
              >
                <ChevronRight size={32} className="rotate-180" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageIdx((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
