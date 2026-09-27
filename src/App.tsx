import { RouterProvider, useRouter } from '@/lib/router';
import { BottomNav } from '@/components/BottomNav';
import { FirstVisitModal } from '@/components/FirstVisitModal';
import { useFirstVisit } from '@/lib/store';
import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { ProductPage } from '@/pages/ProductPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderSuccessPage } from '@/pages/OrderSuccessPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { AddressesPage } from '@/pages/AddressesPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { HelpPage } from '@/pages/HelpPage';
import { AboutPage } from '@/pages/AboutPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { GuidePage } from '@/pages/GuidePage';

function AppContent() {
  const { route } = useRouter();
  const { showWarning, dismissWarning } = useFirstVisit();

  const renderPage = () => {
    switch (route.name) {
      case 'home':
        return <HomePage />;
      case 'catalog':
        return <CatalogPage />;
      case 'product':
        return <ProductPage slug={route.slug} />;
      case 'favorites':
        return <FavoritesPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage orderNumber={route.orderNumber} />;
      case 'profile':
        return <ProfilePage />;
      case 'orders':
        return <OrdersPage />;
      case 'order-detail':
        return <OrderDetailPage orderNumber={route.orderNumber} />;
      case 'addresses':
        return <AddressesPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'help':
        return <HelpPage />;
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'guide':
        return <GuidePage />;
      default:
        return <HomePage />;
    }
  };

  const showBottomNav = !['checkout', 'order-success'].includes(route.name);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        {renderPage()}
      </div>
      {showBottomNav && <BottomNav />}
      <FirstVisitModal show={showWarning} onDismiss={dismissWarning} />
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;
