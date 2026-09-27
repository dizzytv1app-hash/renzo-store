import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { useRouter } from '@/lib/router';
import { useFavorites, useCart } from '@/lib/store';
import { formatPrice, getEffectivePrice } from '@/lib/utils';

export function FavoritesPage() {
  const { items, removeFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { navigate } = useRouter();

  return (
    <div className="pb-20 md:pb-8">
      <Header title="Sevimlilar" />

      <div className="max-w-7xl mx-auto px-4 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart size={48} className="text-neutral-300 mb-4" />
            <p className="text-neutral-500 font-medium mb-1">Sevimlilar ro'yxati bo'sh</p>
            <p className="text-sm text-neutral-400 mb-4">Yoqqan mahsulotlaringizni shu yerda saqlang</p>
            <button onClick={() => navigate({ name: 'catalog' })} className="btn-primary">
              Katalogga o'tish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item) => {
              const price = getEffectivePrice({ price: item.price, discount_price: item.discount_price });
              return (
                <div key={item.product_id} className="card p-3 animate-fade-in">
                  <button
                    onClick={() => navigate({ name: 'product', slug: item.slug })}
                    className="block w-full text-left"
                  >
                    <div className="aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden mb-2">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-sm font-medium truncate">{item.name}</h3>
                    <p className="text-sm font-bold mt-1">{formatPrice(price)}</p>
                  </button>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        addToCart({
                          product_id: item.product_id,
                          name: item.name,
                          slug: item.slug,
                          sku: '',
                          price: item.price,
                          discount_price: item.discount_price,
                          image_url: item.image_url,
                          color: '',
                          size: '',
                          quantity: 1,
                        });
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-neutral-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      <ShoppingBag size={16} /> Savatga
                    </button>
                    <button
                      onClick={() => removeFavorite(item.product_id)}
                      className="p-2 rounded-lg border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
