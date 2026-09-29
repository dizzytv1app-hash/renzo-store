import { useState, useEffect } from 'react';
import { Package, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { useRouter } from '@/lib/router';
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

export function OrdersPage() {
  const { navigate } = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="pb-20 md:pb-8">
      <Header showBack title="Buyurtmalarim" />

      <div className="max-w-3xl mx-auto px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-4">
                <div className="skeleton h-5 w-1/3 mb-2" />
                <div className="skeleton h-4 w-2/3 mb-2" />
                <div className="skeleton h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={48} className="text-neutral-300 mb-4" />
            <p className="text-neutral-500 font-medium mb-1">Buyurtmalar yo'q</p>
            <p className="text-sm text-neutral-400 mb-4">Hali buyurtma bermagansiz</p>
            <button onClick={() => navigate({ name: 'catalog' })} className="btn-primary">
              Katalogga o'tish
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => navigate({ name: 'order-detail', orderNumber: order.order_number })}
                className="w-full card p-4 text-left hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold">{order.order_number}</p>
                    <p className="text-xs text-neutral-400">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-lg ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-500">
                    {order.order_items?.length ?? 0} ta mahsulot
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{formatPrice(order.total_amount)}</span>
                    <ChevronRight size={18} className="text-neutral-300" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
