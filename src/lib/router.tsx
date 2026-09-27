import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'catalog' }
  | { name: 'favorites' }
  | { name: 'cart' }
  | { name: 'profile' }
  | { name: 'product'; slug: string }
  | { name: 'checkout' }
  | { name: 'order-success'; orderNumber: string }
  | { name: 'orders' }
  | { name: 'order-detail'; orderNumber: string }
  | { name: 'addresses' }
  | { name: 'notifications' }
  | { name: 'help' }
  | { name: 'about' }
  | { name: 'privacy' }
  | { name: 'guide' };

interface RouterContextValue {
  route: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Route[]>([{ name: 'home' }]);

  const route = history[history.length - 1];

  const navigate = useCallback((r: Route) => {
    setHistory((prev) => [...prev, r]);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const goBack = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <RouterContext.Provider value={{ route, navigate, goBack, canGoBack: history.length > 1 }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
