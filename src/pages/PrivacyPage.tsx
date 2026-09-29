import { Shield } from 'lucide-react';
import { Header } from '@/components/Header';
import { useStoreSettings } from '@/hooks/useData';

export function PrivacyPage() {
  const settings = useStoreSettings();

  return (
    <div className="pb-20 md:pb-8">
      <Header showBack title="Maxfiylik siyosati" />

      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="card p-6 mb-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
            <Shield size={24} className="text-neutral-600" />
          </div>
          <h1 className="text-lg font-bold mb-3">Maxfiylik siyosati</h1>
          <div className="text-sm text-neutral-600 leading-relaxed space-y-3">
            {settings?.privacy_policy ? (
              <p>{settings.privacy_policy}</p>
            ) : (
              <p>
                Foydalanuvchi ma'lumotlari faqat buyurtmalarni qayta ishlash uchun ishlatiladi.
                Biz sizning shaxsiy ma'lumotlaringizni hech kimga oshkor qilmaymiz.
              </p>
            )}
            <div>
              <h3 className="font-medium text-neutral-900 mb-1">Qaysi ma'lumotlar saqlanadi:</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-500">
                <li>Ism va familiya (buyurtma berish uchun)</li>
                <li>Telefon raqam (aloqa uchun)</li>
                <li>Yetkazib berish manzili</li>
                <li>Buyurtma tarixi</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-1">Ma'lumotlar qanday ishlatiladi:</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-500">
                <li>Buyurtmalarni qayta ishlash va yetkazib berish</li>
                <li>Buyurtma holati haqida xabar berish</li>
                <li>Mijoz bilan aloqa o'rnatish</li>
              </ul>
            </div>
            <p className="text-neutral-500">
              Ma'lumotlaringiz uchinchi shaxslarga sotilmaydi va noto'g'ri ishlatilmaydi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
