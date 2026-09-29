import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
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

const statusSteps: OrderStatus[] = ['new', 'accepted', 'awaiting_payment', 'payment_confirmed', 'delivering', 'delivered'];

export function OrderDetailPage({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('order_number', orderNumber)
        .maybeSingle();
      if (data) setOrder(data);
      setLoading(false);
    })();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="pb-20 md:pb-8">
        <Header showBack title="Buyurtma" />
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="skeleton h-32 mb-4" />
          <div className="skeleton h-48" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pb-20 md:pb-8">
        <Header showBack title="Buyurtma" />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-neutral-500">Buyurtma topilmadi.</p>
        </div>
      </div>
    );
  }

  const currentStepIdx = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="pb-20 md:pb-8">
      <Header showBack title={order.order_number} />

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {/* Status tracker */}
        <div className="card p-4">
          <h3 className="text-sm font-bold mb-3">Buyurtma holati</h3>
          {isCancelled ? (
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <span className="text-sm text-red-600 font-medium">Buyurtma bekor qilindi</span>
            </div>
          ) : (
            <div className="space-y-3">
              {statusSteps.map((status, i) => {
                const isDone = i <= currentStepIdx;
                const isCurrent = i === currentStepIdx;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isDone ? 'bg-green-500 text-white' : 'bg-neutral-100 text-neutral-400'
                      } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
                    >
                      {isDone ? '✓' : i + 1}
                    </div>
                    <span className={`text-sm ${isDone ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
                      {statusLabels[status]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order items */}
        <div className="card p-4">
          <h3 className="text-sm font-bold mb-3">Mahsulotlar</h3>
          <div className="space-y-3">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-xs text-neutral-400">
                    Kod: {item.product_sku}
                    {item.color && ` • Rang: ${item.color}`}
                    {item.size && ` • O'lcham: ${item.size}`}
                  </p>
                  <p className="text-xs text-neutral-400">{item.quantity} x {formatPrice(item.price)}</p>
                </div>
                <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment info */}
        <div className="card p-4">
          <h3 className="text-sm font-bold mb-3">To'lov ma'lumotlari</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Umumiy summa</span>
              <span className="font-bold">{formatPrice(order.total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Oldindan to'lov (50%)</span>
              <span className="font-bold text-amber-600">{formatPrice(order.prepaid_amount)}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-2">
              <span className="text-neutral-500">Qolgan summa</span>
              <span className="font-bold">{formatPrice(order.total_amount - order.prepaid_amount)}</span>
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-xs px-2.5 py-1 rounded-lg ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </span>
          </div>
        </div>

        {/* Delivery info */}
        <div className="card p-4">
          <h3 className="text-sm font-bold mb-3">Yetkazib berish</h3>
          <div className="space-y-1 text-sm text-neutral-600">
            <p><span className="text-neutral-400">Ism:</span> {order.customer_name}</p>
            <p><span className="text-neutral-400">Telefon:</span> {order.customer_phone}</p>
            {order.customer_telegram && <p><span className="text-neutral-400">Telegram:</span> {order.customer_telegram}</p>}
            <p><span className="text-neutral-400">Manzil:</span> {order.delivery_address}</p>
            <p><span className="text-neutral-400">Sana:</span> {formatDate(order.created_at)}</p>
            {order.notes && <p><span className="text-neutral-400">Izoh:</span> {order.notes}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
