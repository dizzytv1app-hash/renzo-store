import { Search, ShoppingBag, Heart, ArrowLeft } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { useCart, useFavorites } from '@/lib/store';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  onSearch?: (q: string) => void;
  searchValue?: string;
}

export function Header({ title, showBack, showSearch, onSearch, searchValue }: HeaderProps) {
  const { navigate, goBack, canGoBack, route } = useRouter();
  const { cartCount } = useCart();
  const { favCount } = useFavorites();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
        {showBack && canGoBack && (
          <button onClick={goBack} className="p-2 -ml-2 text-neutral-700 hover:text-neutral-900 transition-colors">
            <ArrowLeft size={22} />
          </button>
        )}

        {showSearch ? (
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchValue ?? ''}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder="Mahsulot nomi yoki kodi..."
              className="w-full bg-neutral-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:bg-neutral-50 focus:ring-1 focus:ring-neutral-300 transition-all"
            />
          </div>
        ) : (
          <h1 className="flex-1 text-lg font-bold tracking-tight truncate">
            {title ?? 'RENZO'}
          </h1>
        )}

        {!showSearch && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate({ name: 'favorites' })}
              className={cn(
                'p-2 rounded-lg transition-colors relative',
                route.name === 'favorites' ? 'text-neutral-900' : 'text-neutral-600 hover:text-neutral-900',
              )}
            >
              <Heart size={22} />
              {favCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {favCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate({ name: 'cart' })}
              className={cn(
                'p-2 rounded-lg transition-colors relative',
                route.name === 'cart' ? 'text-neutral-900' : 'text-neutral-600 hover:text-neutral-900',
              )}
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
