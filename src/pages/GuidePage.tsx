import { BookOpen } from 'lucide-react';
import { Header } from '@/components/Header';

const guideSteps = [
  { title: 'Kiyimni qanday topish', desc: 'Bosh sahifadagi kategoriyalar yoki katalog bo\'limidan foydalaning. Qidiruv maydoniga mahsulot nomi yoki kodini kiriting.' },
  { title: 'Kiyim turini tanlash', desc: 'Katalogda yuqoridagi kategoriya tugmalarini bosib, kerakli kiyim turini tanlang.' },
  { title: 'Rang va o\'lchamni tanlash', desc: 'Mahsulot sahifasida rang va o\'lcham tugmalarini tanlang. Tanlovsiz savatga qo\'shib bo\'lmaydi.' },
  { title: 'Sevimlilarga qo\'shish', desc: 'Mahsulot kartochkasidagi yurak belgisini bosing. Sevimlilar sahifasida barcha tanlangan kiyimlarni ko\'rishingiz mumkin.' },
  { title: 'Savatga qo\'shish', desc: 'Mahsulot sahifasida "Savatga qo\'shish" tugmasini bosing. Savatda mahsulot sonini o\'zgartirishingiz mumkin.' },
  { title: 'Buyurtma qanday berish', desc: 'Savatga kirib, "Buyurtma berish" tugmasini bosing. 3 bosqichda ma\'lumotlarni to\'ldiring: mahsulotlar, manzil, tasdiqlash.' },
  { title: 'Buyurtma qabul qilinishi', desc: 'Buyurtma yuborilgach, admin uni qabul qiladi. Buyurtmalarim bo\'limidan holatni kuzating.' },
  { title: '50% oldindan to\'lov', desc: 'Buyurtma qabul qilingach, kiyim narxining 50 foizini oldindan to\'lashing. Masalan: 100 000 so\'m narxga 50 000 so\'m oldindan to\'lov.' },
  { title: 'To\'lov chekini yuborish', desc: 'To\'lovni amalga oshirgach, chekni Telegram bot orqali yuboring. Admin chekni tekshiradi.' },
  { title: 'Admin to\'lovni tasdiqlashi', desc: 'Admin chekni tekshirib tasdiqlaydi. Shundan so\'ng buyurtma holati "To\'lov tasdiqlandi" ga o\'zgaradi.' },
  { title: 'Yetkazib berish jarayoni', desc: 'To\'lov tasdiqlangach, buyurtma yetkazib beriladi. Holat "Yetkazib berilmoqda" va "Yetkazildi" ga o\'zgaradi.' },
  { title: 'Buyurtma holatini tekshirish', desc: 'Profil > Buyurtmalarim bo\'limiga kirib, buyurtma holatini kuzating. Har bir buyurtmani bosib batafsil ko\'rishingiz mumkin.' },
  { title: 'Bekor qilish va yordam', desc: 'Buyurtmani bekor qilish uchun admin bilan bog\'laning. Yordam kerak bo\'lsa, Profil > Yordam bo\'limiga o\'ting.' },
];

export function GuidePage() {
  return (
    <div className="pb-20 md:pb-8">
      <Header showBack title="Qo\'llanma" />

      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="card p-5 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <BookOpen size={20} className="text-neutral-600" />
            </div>
            <h1 className="text-lg font-bold">Buyurtma berish tartibi</h1>
          </div>
          <p className="text-sm text-neutral-500">
            Bu bo\'limda do\'kondan xarid qilish va buyurtma berish tartibi batafsil tushuntirilgan.
          </p>
        </div>

        <div className="space-y-3">
          {guideSteps.map((step, i) => (
            <div key={i} className="card p-4 flex gap-3">
              <div className="w-7 h-7 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1">{step.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
