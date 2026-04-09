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
            title: data.is_hidden ? '히든 미션 발견!' : '미션 확인 완료',
            description: `${data.missionTitle} 미션으로 이동합니다.`,
        });
        // Redirect to the mission detail page: /missions/[courseId]/[missionId]
        router.push(`/${locale}/missions/${data.courseId}/${data.missionId}`);
      } else {
        toast({
          variant: 'destructive',
          title: '인식 실패',
          description: data.error || '올바른 QR 코드가 아니거나 권한이 없습니다.',
        });
        setIsVerifying(false); // Let them try again
      }
    } catch (err) {
      console.error('Scan verify error:', err);
      toast({
        variant: 'destructive',
        title: '오류',
        description: '서버와 통신 중 오류가 발생했습니다.',
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
           실시간 동기화 중
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black mb-3">미션 스캔</h1>
        <p className="text-muted-foreground font-medium">
          현장의 QR 코드를 스캔하여 전설의 흔적을 찾으세요.
        </p>
      </div>

      <div className="flex-1">
          <QRScanner onScanSuccess={handleScanSuccess} />
      </div>

      <div className="mt-12 p-6 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-start gap-4">
         <Sparkles className="w-5 h-5 text-amber-500 mt-1" />
         <div className="text-sm text-amber-700 leading-relaxed font-bold">
            <p className="mb-1">TIP: 비밀의 장소에는 숨겨진 미션이 있습니다!</p>
            <p className="text-amber-600/70 font-medium">QR 코드를 발견하면 바로 스캔해 보세요. 보너스 LP가 기다리고 있습니다.</p>
         </div>
      </div>
    </div>
  );
}
