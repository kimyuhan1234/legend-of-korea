'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { WifiOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface OfflineGuardProps {
  children: React.ReactNode;
  locale?: string;
}

export function OfflineGuard({ children }: OfflineGuardProps) {
  const t = useTranslations('mission');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 초기 상태 확인
    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        variant: 'destructive',
        title: t('offlineTitle') || 'Internet connection required',
        description: t('offlineNotice') || '인터넷 연결이 필요합니다. 연결 상태를 확인해주세요.',
      });
    };

    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: t('onlineRestored') || '연결 복구됨',
        description: t('onlineRestoredDesc') || '인터넷 연결이 복구되었습니다.',
      });
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online',  handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online',  handleOnline);
    };
  }, [t]);

  if (isOffline) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4 min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
          <WifiOff className="w-12 h-12 text-slate-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-800">
            {t('offlineTitle') || 'Internet connection required'}
          </h2>
          <p className="text-slate-500 font-medium">
            {t('offlineNotice') || '인터넷 연결이 필요합니다. 연결 상태를 확인해주세요.'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
