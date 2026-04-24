'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { QRScanner } from '@/components/features/missions/QRScanner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Info, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ScanPageProps {
  params: { locale: string };
}

export default function ScanPage({ params }: ScanPageProps) {
  const { locale } = params;
  const t = useTranslations('mission');
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const { toast } = useToast();

  const handleScanSuccess = async (qrCode: string) => {
    if (isVerifying) return;
    
    setIsVerifying(true);
    try {
      const response = await fetch('/api/missions/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
            title: data.is_hidden ? t('hiddenMissionFound') : t('missionVerified'),
            description: t('movingToMission', { title: data.missionTitle }),
        });
        // Redirect to the mission detail page: /missions/[courseId]/[missionId]
        router.push(`/${locale}/missions/${data.courseId}/${data.missionId}`);
      } else {
        toast({
          variant: 'destructive',
          title: t('recognitionFailed'),
          description: data.error || t('invalidQrOrNoPermission'),
        });
        setIsVerifying(false); // Let them try again
      }
    } catch (err) {
      console.error('Scan verify error:', err);
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('networkError'),
      });
      setIsVerifying(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto py-20 md:py-28 px-8 md:px-10 min-h-screen flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
          <Link href={`/${locale}/missions`} className="flex items-center gap-1 font-bold">
            <ChevronLeft className="w-5 h-5" />
            {t('back')}
          </Link>
        </Button>
        <div className="bg-slate-100 px-8 md:px-10 py-1.5 rounded-full text-xs font-black text-slate-500 flex items-center gap-1.5 shadow-sm">
           <MapPin className="w-3 h-3" />
           {t('realtimeSync')}
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black mb-3">{t('scanTitle')}</h1>
        <p className="text-muted-foreground font-medium">
          {t('scanSubtitle')}
        </p>
      </div>

      <div className="flex-1">
          <QRScanner onScanSuccess={handleScanSuccess} />
      </div>

      <div className="mt-12 p-6 rounded-[2rem] bg-peach border border-peach flex items-start gap-4">
         <Sparkles className="w-5 h-5 text-blossom-deep mt-1" />
         <div className="text-sm text-slate leading-relaxed font-bold">
            <p className="mb-1">{t('scanTipTitle')}</p>
            <p className="text-blossom-deep/70 font-medium">{t('scanTipDesc')}</p>
         </div>
      </div>
    </div>
  );
}
