import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { useRouter } from '@/lib/router';

export function OrderSuccessPage({ orderNumber }: { orderNumber: string }) {
  const { navigate } = useRouter();

  return (
    <div className="pb-20 md:pb-8">
      <Header title="Buyurtma yuborildi" />

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h1 className="text-xl font-bold mb-2">Buyurtma qabul qilindi!</h1>
          <p className="text-sm text-neutral-500 mb-4">
            Buyurtmangiz muvaffaqiyatli yuborildi. Tez orada admin siz bilan bog'lanadi.
          </p>

          <div className="card p-4 w-full mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-500">Buyurtma raqami</span>
              <span className="text-sm font-bold">{orderNumber}</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-3 mt-3">
              <Package size={20} className="text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                Oldindan to'lov (50%) chekini Telegram bot orqali yuboring.
                Admin tasdiqlagach, buyurtma holati yangilanadi.
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <button onClick={() => navigate({ name: 'orders' })} className="btn-outline flex-1">
              Buyurtmalarim
            </button>
            <button onClick={() => navigate({ name: 'home' })} className="btn-primary flex-1 flex items-center justify-center gap-2">
              Bosh sahifa <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
