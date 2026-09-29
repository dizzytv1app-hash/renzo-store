import { Bell } from 'lucide-react';
import { Header } from '@/components/Header';

export function NotificationsPage() {
  return (
    <div className="pb-20 md:pb-8">
      <Header showBack title="Bildirishnomalar" />

      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell size={48} className="text-neutral-300 mb-4" />
          <p className="text-neutral-500 font-medium mb-1">Bildirishnomalar yo'q</p>
          <p className="text-sm text-neutral-400">
            Buyurtma holati o'zgarganda sizga xabar beriladi
          </p>
        </div>
      </div>
    </div>
  );
}
