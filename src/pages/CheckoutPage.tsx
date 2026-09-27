import { useState } from 'react';
import { Check, ArrowRight, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { useRouter } from '@/lib/router';
import { useCart, useAddresses } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { formatPrice, generateOrderNumber } from '@/lib/utils';
import type { OrderStatus } from '@/types';

export function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { addresses } = useAddresses();
  const { navigate } = useRouter();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [address, setAddress] = useState('');
  const [selectedAddrId, setSelectedAddrId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const prepaidAmount = Math.round(cartTotal * 0.5);

  const handleSelectAddress = (id: string) => {
    setSelectedAddrId(id);
    const addr = addresses.find((a) => a.id === id);
    if (addr) {
      setAddress(`${addr.address}, ${addr.city}`);
      setName(addr.recipient_name);
      setPhone(addr.phone);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!name.trim()) {
      setError('Ismingizni kiriting');
      return;
    }
    if (!phone.trim()) {
      setError('Telefon raqamingizni kiriting');
      return;
    }
    if (!address.trim()) {
      setError('Yetkazib berish manzilini kiriting');
      return;
    }

    setLoading(true);
    const orderNumber = generateOrderNumber();

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: name,
          customer_phone: phone,
          customer_telegram: telegram || null,
          delivery_address: address,
          total_amount: cartTotal,
          prepaid_amount: prepaidAmount,
          status: 'new' as OrderStatus,
          notes: notes || null,
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        product_name: item.name,
        product_sku: item.sku,
        quantity: item.quantity,
        price: item.discount_price ?? item.price,
        color: item.color || null,
        size: item.size || null,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      navigate({ name: 'order-success', orderNumber });
    } catch {
      setError('Buyurtma yuborishda xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step <= 3) {
    return (
      <div className="pb-20 md:pb-8">
        <Header showBack title="Buyurtma berish" />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-neutral-500 mb-4">Savat bo'sh</p>
          <button onClick={() => navigate({ name: 'catalog' })} className="btn-primary">
            Katalogga o'tish
          </button>
        </div>
      </div>
    );
  }

  const steps = ['Mahsulotlar', 'Manzil', 'Tasdiqlash'];

  return (
    <div className="pb-20 md:pb-8">
      <Header showBack title="Buyurtma berish" />

      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step > i + 1
                    ? 'bg-green-500 text-white'
                    : step === i + 1
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {step > i + 1 ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs ml-1.5 hidden sm:block ${step >= i + 1 ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${step > i + 1 ? 'bg-green-500' : 'bg-neutral-100'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Review items */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-base font-bold mb-3">Mahsulotlarni tekshirish</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={`${item.product_id}-${item.color}-${item.size}`} className="card p-3 flex gap-3">
                  <div className="w-16 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <div className="flex gap-2 mt-1 mb-1">
                      {item.color && <span className="text-xs text-neutral-500">Rang: {item.color}</span>}
                      {item.size && <span className="text-xs text-neutral-500">O'lcham: {item.size}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400">{item.quantity} x {formatPrice(item.discount_price ?? item.price)}</span>
                      <span className="text-sm font-bold">{formatPrice((item.discount_price ?? item.price) * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card p-4 mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-500">Jami summa</span>
                <span className="text-sm font-bold">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">Oldindan to'lov (50%)</span>
                <span className="text-sm font-bold text-amber-600">{formatPrice(prepaidAmount)}</span>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full btn-primary flex items-center justify-center gap-2">
              Davom etish <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-base font-bold mb-3">Yetkazib berish ma'lumotlari</h2>

            {addresses.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-neutral-500 mb-2">Saqlangan manzillar:</p>
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr.id)}
                      className={`w-full text-left card p-3 transition-colors ${
                        selectedAddrId === addr.id ? 'border-neutral-900 ring-1 ring-neutral-900' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{addr.label}</span>
                        {addr.is_default && (
                          <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">Asosiy</span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">{addr.recipient_name} • {addr.phone}</p>
                      <p className="text-xs text-neutral-500">{addr.address}, {addr.city}</p>
                    </button>
                  ))}
                </div>
                <div className="my-3 flex items-center gap-3">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="text-xs text-neutral-400">yoki yangi manzil</span>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Ism va familiya *</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ismingizni kiriting" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Telefon raqam *</label>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" type="tel" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Telegram username (ixtiyoriy)</label>
                <input className="input" value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="@username" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Yetkazib berish manzili *</label>
                <textarea className="input min-h-[80px]" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Shahar, ko'cha, uy raqami..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Izoh (ixtiyoriy)</label>
                <textarea className="input min-h-[60px]" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Qo'shimcha ma'lumot..." />
              </div>
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-500">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(1)} className="btn-outline flex-1">Orqaga</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Davom etish <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-base font-bold mb-3">Buyurtmani tasdiqlash</h2>

            <div className="card p-4 mb-3">
              <h3 className="text-sm font-bold mb-2">Mijoz ma'lumotlari</h3>
              <div className="space-y-1 text-sm text-neutral-600">
                <p><span className="text-neutral-400">Ism:</span> {name}</p>
                <p><span className="text-neutral-400">Telefon:</span> {phone}</p>
                {telegram && <p><span className="text-neutral-400">Telegram:</span> {telegram}</p>}
                <p><span className="text-neutral-400">Manzil:</span> {address}</p>
                {notes && <p><span className="text-neutral-400">Izoh:</span> {notes}</p>}
              </div>
            </div>

            <div className="card p-4 mb-3">
              <h3 className="text-sm font-bold mb-2">Mahsulotlar</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={`${item.product_id}-${item.color}-${item.size}`} className="flex justify-between text-sm">
                    <span className="text-neutral-600">
                      {item.name} ({item.color}, {item.size}) x{item.quantity}
                    </span>
                    <span className="font-medium">{formatPrice((item.discount_price ?? item.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4 mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-500">Jami summa</span>
                <span className="text-sm font-bold">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-500">Oldindan to'lov (50%)</span>
                <span className="text-sm font-bold text-amber-600">{formatPrice(prepaidAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 mt-2">
                <span className="text-sm text-neutral-500">Qolgan summa</span>
                <span className="text-sm font-bold">{formatPrice(cartTotal - prepaidAmount)}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-amber-700 leading-relaxed">
                Buyurtma qabul qilingandan so'ng, kiyim narxining 50 foizini oldindan to'lashing.
                To'lov chekini Telegram bot orqali yuboring. Admin chekni tekshirib tasdiqlaydi.
              </p>
            </div>

            {error && (
              <div className="mb-3 flex items-center gap-2 text-sm text-red-500">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="btn-outline flex-1">Orqaga</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? 'Yuborilmoqda...' : 'Buyurtmani yuborish'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
