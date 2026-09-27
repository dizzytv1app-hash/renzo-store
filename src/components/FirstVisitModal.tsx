import { AlertTriangle, X } from 'lucide-react';

interface FirstVisitModalProps {
  show: boolean;
  onDismiss: () => void;
}

export function FirstVisitModal({ show, onDismiss }: FirstVisitModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 animate-scale-in shadow-2xl">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
            <AlertTriangle size={28} className="text-amber-500" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">Diqqat!</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Mahsulot narxlari va mavjud rang hamda o'lchamlar o'zgarib turishi mumkin.
            Buyurtma berishdan oldin mahsulotning joriy ma'lumotlarini tekshiring.
          </p>
          <button onClick={onDismiss} className="btn-primary w-full mt-2">
            Tushunarli
          </button>
        </div>
      </div>
    </div>
  );
}
