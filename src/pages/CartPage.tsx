import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { useRouter } from '@/lib/router';
import { useCart } from '@/lib/store';
import { formatPrice, getEffectivePrice, cn } from '@/lib/utils';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { navigate } = useRouter();
  const [showSummary, setShowSummary] = useState(false);

  return (
    <div className="pb-20 md:pb-8">
      <Header title="Savat" />

      <div className="max-w-3xl mx-auto px-4 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag size={48} className="text-neutral-300 mb-4" />
            <p className="text-neutral-500 font-medium mb-1">Savat bo'sh</p>
            <p className="text-sm text-neutral-400 mb-4">Mahsulotlarni savatga qo'shing</p>
            <button onClick={() => navigate({ name: 'catalog' })} className="btn-primary">
              Katalogga o'tish
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {items.map((item) => {
                const price = getEffectivePrice(item);
                return (
                  <div key={`${item.product_id}-${item.color}-${item.size}`} className="card p-3 flex gap-3 animate-fade-in">
                    <button
                      onClick={() => navigate({ name: 'product', slug: item.slug })}
                      className="flex-shrink-0 w-20 h-24 bg-neutral-100 rounded-lg overflow-hidden"
                    >
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <button onClick={() => navigate({ name: 'product', slug: item.slug })} className="text-left">
                        <h3 className="text-sm font-medium truncate">{item.name}</h3>
                      </button>
                      <p className="text-xs text-neutral-400 mb-1">Kod: {item.sku}</p>
                      <div className="flex gap-2 mb-2">
                        {item.color && (
                          <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded">{item.color}</span>
                        )}
                        {item.size && (
                          <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded">{item.size}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.color, item.size, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.color, item.size, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{formatPrice(price * item.quantity)}</span>
                          <button
                            onClick={() => removeFromCart(item.product_id, item.color, item.size)}
                            className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-neutral-500">Mahsulotlar soni</span>
                <span className="text-sm font-medium">{items.reduce((s, i) => s + i.quantity, 0)} ta</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-500">Yetkazib berish</span>
                <span className="text-sm font-medium text-green-600">Bepul</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex items-center justify-between mb-4">
                <span className="font-medium">Jami</span>
                <span className="text-xl font-bold">{formatPrice(cartTotal)}</span>
              </div>
              <button
                onClick={() => navigate({ name: 'checkout' })}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Buyurtma berish <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
