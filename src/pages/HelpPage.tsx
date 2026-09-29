import { Send, HelpCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { useStoreSettings } from '@/hooks/useData';

export function HelpPage() {
  const settings = useStoreSettings();

  return (
    <div className="pb-20 md:pb-8">
      <Header showBack title="Yordam" />

      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="card p-6 text-center mb-4">
          <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
            <HelpCircle size={28} className="text-neutral-500" />
          </div>
          <h2 className="text-lg font-bold mb-2">Yordam kerakmi?</h2>
          <p className="text-sm text-neutral-500 mb-4">
            Savol yoki muammo bo'lsa, Telegram bot orqali adminlarga murojaat qiling.
          </p>
          {settings?.telegram_bot_url ? (
            <a
              href={settings.telegram_bot_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#229ED9] text-white font-medium px-6 py-3 rounded-xl hover:bg-[#1d8bc4] transition-colors"
            >
              <Send size={18} /> Admin bilan bog'lanish
            </a>
          ) : (
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-sm text-amber-700">
                Telegram bot havolasi hali sozlanmagan. Iltimos, keyinroq urinib ko'ring.
              </p>
            </div>
          )}
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-bold mb-2">Tez-tez so'raladigan savollar</h3>
          <div className="space-y-3">
            {[
              { q: 'Buyurtma qanday beriladi?', a: 'Savatga mahsulot qo\'shing, "Buyurtma berish" tugmasini bosing va ma\'lumotlarni to\'ldiring.' },
              { q: 'Oldindan to\'lov qancha?', a: 'Buyurtma qabul qilingach, kiyim narxining 50% oldindan to\'lanadi. Qolgan summa yetkazib berishda to\'lanadi.' },
              { q: 'To\'lov chekini qanday yuboraman?', a: 'To\'lov chekini Telegram bot orqali yuboring. Admin tekshirib tasdiqlaydi.' },
              { q: 'Buyurtma holatini qayerdan ko\'raman?', a: 'Profil > Buyurtmalarim bo\'limidan buyurtma holatini kuzatishingiz mumkin.' },
            ].map((faq, i) => (
              <div key={i} className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium mb-1">{faq.q}</p>
                <p className="text-sm text-neutral-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
