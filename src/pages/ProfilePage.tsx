import { useState, useEffect } from 'react';
import {
  User, Package, Heart, MapPin, CreditCard, Tag, Bell, Eye, HelpCircle,
  Shield, Send, ChevronRight, BookOpen, Store, LogIn,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { useRouter } from '@/lib/router';
import { useFavorites, useRecentViews, useAddresses } from '@/lib/store';
import { useStoreSettings } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

const statusLabels: Record<OrderStatus, string> = {
  new: 'Yangi',
  accepted: 'Qabul qilindi',
  awaiting_payment: 'To\'lov kutilmoqda',
  payment_confirmed: 'To\'lov tasdiqlandi',
  delivering: 'Yetkazib berilmoqda',
  delivered: 'Yetkazildi',
  cancelled: 'Bekor qilindi',
};

const statusColors: Record<OrderStatus, string> = {
  new: 'bg-blue-50 text-blue-600',
  accepted: 'bg-cyan-50 text-cyan-600',
  awaiting_payment: 'bg-amber-50 text-amber-600',
  payment_confirmed: 'bg-green-50 text-green-600',
  delivering: 'bg-purple-50 text-purple-600',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
};

export function ProfilePage() {
  const { navigate } = useRouter();
  const { favCount } = useFavorites();
  const { items: recentItems } = useRecentViews();
  const { addresses } = useAddresses();
  const settings = useStoreSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setOrders(data);
      setLoadingOrders(false);
    })();
  }, []);

  const menuSections: {
    title: string;
    items: { icon: typeof User; label: string; sub?: string; action: () => void; badge?: number }[];
  }[] = [
    {
      title: 'Mening ma\'lumotlarim',
      items: [
        { icon: Package, label: 'Buyurtmalarim', sub: `${orders.length} ta buyurtma`, action: () => navigate({ name: 'orders' }) },
        { icon: Heart, label: 'Sevimli kiyimlarim', sub: `${favCount} ta`, action: () => navigate({ name: 'favorites' }) },
        { icon: MapPin, label: 'Yetkazib berish manzillari', sub: `${addresses.length} ta`, action: () => navigate({ name: 'addresses' }) },
        { icon: CreditCard, label: 'To\'lovlar tarixi', action: () => navigate({ name: 'orders' }) },
        { icon: Tag, label: 'Mening chegirmalarim', action: () => navigate({ name: 'catalog' }) },
      ],
    },
    {
      title: 'Bildirishnomalar',
      items: [
        { icon: Bell, label: 'Bildirishnomalar', action: () => navigate({ name: 'notifications' }) },
        { icon: Eye, label: 'Oxirgi ko\'rilgan kiyimlar', sub: `${recentItems.length} ta`, action: () => navigate({ name: 'profile' }) },
      ],
    },
    {
      title: 'Yordam va ma\'lumot',
      items: [
        { icon: BookOpen, label: 'Qo\'llanma', action: () => navigate({ name: 'guide' }) },
        { icon: HelpCircle, label: 'Yordam va admin bilan aloqa', action: () => navigate({ name: 'help' }) },
        { icon: Store, label: 'Do\'kon haqida', action: () => navigate({ name: 'about' }) },
        { icon: Shield, label: 'Maxfiylik siyosati', action: () => navigate({ name: 'privacy' }) },
      ],
    },
  ];

  return (
    <div className="pb-20 md:pb-8">
      <Header title="Profil" />

      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Profile header */}
        <div className="card p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <User size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">Mehmon</h2>
              <p className="text-sm text-neutral-400">Telegram akkaunti ulanmagan</p>
            </div>
            <button
              onClick={() => navigate({ name: 'help' })}
              className="flex items-center gap-1.5 text-sm text-neutral-600 border border-neutral-200 rounded-lg px-3 py-2 hover:border-neutral-900 transition-colors"
            >
              <LogIn size={16} /> Kirish
            </button>
          </div>
          <div className="mt-3 bg-amber-50 rounded-lg p-2.5">
            <p className="text-xs text-amber-700">
              Telegram orqali kirgan foydalanuvchining sevimlilari va buyurtmalari saqlanib qoladi.
            </p>
          </div>
        </div>

        {/* Recent orders preview */}
        {!loadingOrders && orders.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold">So'nggi buyurtmalar</h3>
              <button onClick={() => navigate({ name: 'orders' })} className="text-xs text-neutral-500 hover:text-neutral-900">
                Barchasi
              </button>
            </div>
            <div className="space-y-2">
              {orders.slice(0, 3).map((order) => (
                <button
                  key={order.id}
                  onClick={() => navigate({ name: 'order-detail', orderNumber: order.order_number })}
                  className="w-full card p-3 flex items-center justify-between text-left hover:border-neutral-300 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{order.order_number}</p>
                    <p className="text-xs text-neutral-400">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                    <span className="text-sm font-bold">{formatPrice(order.total_amount)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu sections */}
        {menuSections.map((section) => (
          <div key={section.title} className="mb-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wide mb-2 px-1">{section.title}</h3>
            <div className="card divide-y divide-neutral-100">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 p-3.5 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      {item.sub && <p className="text-xs text-neutral-400">{item.sub}</p>}
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-amber-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={18} className="text-neutral-300" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Telegram bot button */}
        {settings?.telegram_bot_url && (
          <a
            href={settings.telegram_bot_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#229ED9] text-white font-medium px-6 py-3 rounded-xl transition-all active:scale-[0.98] hover:bg-[#1d8bc4]"
          >
            <Send size={18} /> Telegram botni ochish
          </a>
        )}

        {/* About section */}
        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-400">{settings?.store_name ?? 'RENZO'}</p>
          <p className="text-xs text-neutral-300 mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
