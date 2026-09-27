import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react';
import { useRouter, type Route } from '@/lib/router';
import { useCart, useFavorites } from '@/lib/store';
import { cn } from '@/lib/utils';

const navItems: { route: Route; label: string; icon: typeof Home }[] = [
  { route: { name: 'home' }, label: 'Bosh sahifa', icon: Home },
  { route: { name: 'catalog' }, label: 'Katalog', icon: LayoutGrid },
  { route: { name: 'favorites' }, label: 'Sevimlilar', icon: Heart },
  { route: { name: 'cart' }, label: 'Savat', icon: ShoppingBag },
  { route: { name: 'profile' }, label: 'Profil', icon: User },
];

export function BottomNav() {
  const { route, navigate } = useRouter();
  const { cartCount } = useCart();
  const { favCount } = useFavorites();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200 md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const isActive = route.name === item.route.name;
          const Icon = item.icon;
          const badge =
            item.route.name === 'cart' ? cartCount : item.route.name === 'favorites' ? favCount : 0;

          return (
            <button
              key={item.route.name}
              onClick={() => navigate(item.route)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors',
                isActive ? 'text-neutral-900' : 'text-neutral-400',
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {badge}
                  </span>
                )}
              </div>
              <span className={cn('text-[10px] font-medium', isActive ? 'opacity-100' : 'opacity-70')}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
