import { Store, Send, Globe } from 'lucide-react';
import { Header } from '@/components/Header';
import { useStoreSettings } from '@/hooks/useData';

export function AboutPage() {
  const settings = useStoreSettings();

  return (
    <div className="pb-20 md:pb-8">
      <Header showBack title="Do'kon haqida" />

      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="card p-6 text-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto mb-3">
            <Store size={32} className="text-white" />
          </div>
          <h1 className="text-xl font-bold mb-1">{settings?.store_name ?? 'RENZO'}</h1>
          {settings?.store_description && (
            <p className="text-sm text-neutral-500">{settings.store_description}</p>
          )}
        </div>

        {settings?.about_text && (
          <div className="card p-4 mb-4">
            <p className="text-sm text-neutral-600 leading-relaxed">{settings.about_text}</p>
          </div>
        )}

        <div className="space-y-2">
          {settings?.telegram_bot_url && (
            <a
              href={settings.telegram_bot_url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-4 flex items-center gap-3 hover:border-neutral-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#229ED9]/10 flex items-center justify-center text-[#229ED9]">
                <Send size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Telegram bot</p>
                <p className="text-xs text-neutral-400">Admin bilan bog'lanish</p>
              </div>
            </a>
          )}

          {settings?.telegram_channel_url && (
            <a
              href={settings.telegram_channel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-4 flex items-center gap-3 hover:border-neutral-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#229ED9]/10 flex items-center justify-center text-[#229ED9]">
                <Globe size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Telegram kanal</p>
                <p className="text-xs text-neutral-400">Yangiliklar va aksiyalar</p>
              </div>
            </a>
          )}

          {!settings?.telegram_bot_url && !settings?.telegram_channel_url && (
            <div className="card p-4">
              <p className="text-sm text-neutral-400 text-center">
                Telegram havolalari hali sozlanmagan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
