import { useState, useMemo } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useData';
import { ProductCard } from '@/components/ProductCard';
import { Header } from '@/components/Header';
import type { Product } from '@/types';

type SortOption = 'newest' | 'price_asc' | 'price_desc';

export function CatalogPage() {
  const [search, setSearch] = useState('');
  const [activeSearch, setSearchActive] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sort, setSort] = useState<SortOption>('newest');
  const [categorySlug, setCategorySlug] = useState<string | undefined>(undefined);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { categories } = useCategories();
  const { products, loading } = useProducts({
    categorySlug,
    search: activeSearch || undefined,
    sort,
    onlyDiscount,
  });

  const getImg = (p: Product) => p.product_images?.[0]?.url ?? '';

  const sortLabels: Record<SortOption, string> = {
    newest: 'Yangilari',
    price_asc: 'Arzonroq',
    price_desc: 'Qimmatroq',
  };

  const filteredCount = products.length;

  return (
    <div className="pb-20 md:pb-8">
      <Header
        showSearch={showSearch}
        searchValue={search}
        onSearch={(v) => {
          setSearch(v);
          setSearchActive(v);
        }}
      />

      {!showSearch && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setShowSearch(true)}
              className="flex-1 flex items-center gap-2 bg-neutral-100 rounded-xl px-4 py-2.5 text-sm text-neutral-400"
            >
              <Search size={18} />
              <span>Qidirish...</span>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2.5 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>
      )}

      {showSearch && (
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
          <button
            onClick={() => {
              setShowSearch(false);
              if (!search) setSearchActive('');
            }}
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            Yopish
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-2">
          <button
            onClick={() => setCategorySlug(undefined)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !categorySlug ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Barchasi
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategorySlug(cat.slug)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categorySlug === cat.slug ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort + Filter row */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex gap-1.5">
            {(Object.keys(sortLabels) as SortOption[]).map((key) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  sort === key ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-600 border border-neutral-200'
                }`}
              >
                {sortLabels[key]}
              </button>
            ))}
          </div>
          <button
            onClick={() => setOnlyDiscount(!onlyDiscount)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              onlyDiscount ? 'bg-red-500 text-white' : 'bg-neutral-50 text-neutral-600 border border-neutral-200'
            }`}
          >
            Chegirma
          </button>
          <span className="text-xs text-neutral-400 ml-auto">{filteredCount} ta mahsulot</span>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[3/4] mb-2" />
                <div className="skeleton h-4 mb-1" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search size={48} className="text-neutral-300 mb-4" />
            <p className="text-neutral-500 font-medium">Mahsulot topilmadi</p>
            <p className="text-sm text-neutral-400 mt-1">Boshqa kalit so'z bilan urinib ko'ring</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} imageUrl={getImg(p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
