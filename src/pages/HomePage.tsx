import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners, useProducts, useCategories } from '@/hooks/useData';
import { ProductCard } from '@/components/ProductCard';
import { Header } from '@/components/Header';
import { useRouter } from '@/lib/router';
import type { Product } from '@/types';

export function HomePage() {
  const { banners, loading: bannersLoading } = useBanners();
  const { categories } = useCategories();
  const { products, loading: productsLoading } = useProducts({ sort: 'newest' });
  const { navigate } = useRouter();
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setBannerIdx((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const getImg = (p: Product) => p.product_images?.[0]?.url ?? '';

  const newProducts = products.filter((p) => p.is_new).slice(0, 6);
  const discounted = products
    .filter((p) => p.discount_price !== null && p.discount_price < p.price)
    .slice(0, 6);

  return (
    <div className="pb-20 md:pb-8">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Banner Carousel */}
        <div className="relative rounded-2xl overflow-hidden h-48 sm:h-64 md:h-80 mb-6 bg-neutral-200">
          {!bannersLoading && banners.length > 0 ? (
            <>
              {banners.map((banner, i) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    i === bannerIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img src={banner.image_url} alt={banner.title ?? ''} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    {banner.title && <h2 className="text-xl md:text-2xl font-bold mb-1">{banner.title}</h2>}
                    {banner.subtitle && <p className="text-sm md:text-base opacity-90">{banner.subtitle}</p>}
                  </div>
                </div>
              ))}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={() => setBannerIdx((prev) => (prev - 1 + banners.length) % banners.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-white hover:bg-white/50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setBannerIdx((prev) => (prev + 1) % banners.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-white hover:bg-white/50 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-2 right-1/2 translate-x-1/2 flex gap-1.5">
                    {banners.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === bannerIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="skeleton w-full h-full" />
          )}
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3">Kategoriyalar</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate({ name: 'catalog' })}
                className="flex-shrink-0 flex flex-col items-center gap-2 w-20"
              >
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors">
                  <span className="text-xs font-medium text-center px-1">{cat.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* New Products */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">Yangi mahsulotlar</h2>
            <button
              onClick={() => navigate({ name: 'catalog' })}
              className="text-xs text-neutral-500 hover:text-neutral-900"
            >
              Barchasi
            </button>
          </div>
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton aspect-[3/4] mb-2" />
                  <div className="skeleton h-4 mb-1" />
                  <div className="skeleton h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {newProducts.map((p) => (
                <ProductCard key={p.id} product={p} imageUrl={getImg(p)} />
              ))}
            </div>
          )}
        </section>

        {/* Discounted Products */}
        {discounted.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold">Chegirmadagi mahsulotlar</h2>
              <button
                onClick={() => navigate({ name: 'catalog' })}
                className="text-xs text-neutral-500 hover:text-neutral-900"
              >
                Barchasi
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {discounted.map((p) => (
                <ProductCard key={p.id} product={p} imageUrl={getImg(p)} />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section>
          <h2 className="text-base font-bold mb-3">Barcha mahsulotlar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} imageUrl={getImg(p)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
