'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle2, Camera, Upload, Loader2, X, Trophy, Sparkles, MessageSquare } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"; // Need to create checkbox.tsx
import { Label } from "@/components/ui/label"; // Need to create label.tsx
import Link from 'next/link';
import { CourseCompletionModal } from './CourseCompletionModal';

interface PhotoMissionProps {
  missionId: string;
  courseName: string;
  description: string;
  lpReward: number;
  initialStatus?: string;
  isBoss?: boolean;
  isHidden?: boolean;
  locale: string;
}

export function PhotoMission({ 
  missionId, 
  courseName,
  description, 
  lpReward, 
  initialStatus = 'unlocked',
  isBoss = false,
  isHidden = false,
  locale
}: PhotoMissionProps) {
  const t = useTranslations('mission');
  const [status, setStatus] = useState(initialStatus);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [syncCommunity, setSyncCommunity] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ variant: 'destructive', title: '파일 크기 초과', description: '5MB 이하의 이미지만 업로드 가능합니다.' });
        return;
      }
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || isUploading) return;

    setIsUploading(true);
    try {
      // 1. Upload to Storage
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('missionId', missionId);

      const uploadRes = await fetch('/api/missions/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error);

      // 2. Complete Mission
      const response = await fetch('/api/missions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          missionId, 
          type: isBoss ? 'boss' : isHidden ? 'hidden' : 'photo',
          photoUrl: uploadData.url,
          syncCommunity
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('completed');
        setTotalEarned(data.lpEarned + (data.bonusLp || 0));

        if (data.courseCompleted) {
            setShowCompletion(true);
        } else {
            toast({
              title: t('missionComplete') || '미션 완료!',
              description: t('lpEarned', { lp: lpReward }) || `${lpReward} LP 획득!`,
            });
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error('Photo upload error:', err);
      toast({
        variant: 'destructive',
        title: t('error') || '오류',
        description: err.message || '이미지 업로드 중 오류가 발생했습니다.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const gradientClass = isBoss 
    ? "from-yellow-400/20 to-amber-600/20" 
    : isHidden ? "from-purple-500/20 to-indigo-600/20" : "from-primary/5 to-primary/10";

  return (
    <Card className={`w-full border-2 rounded-[2.5rem] overflow-hidden shadow-xl transition-all duration-500 ${
        isBoss ? 'border-amber-400 bg-amber-50/10' : isHidden ? 'border-purple-400 bg-purple-50/10' : 'border-primary/20 bg-white/40'
    }`}>
      <CardHeader className={`pb-6 pt-8 px-8 bg-gradient-to-br ${gradientClass}`}>
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline" className={`flex items-center gap-1.5 py-1 px-3 border-none ${
              isBoss ? 'bg-amber-100 text-amber-700' : isHidden ? 'bg-purple-100 text-purple-700' : 'bg-primary/20 text-primary'
          }`}>
            {isBoss ? <Trophy className="w-4 h-4" /> : isHidden ? <Sparkles className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            {isBoss ? '보스 미션' : isHidden ? '히든 미션' : '사진 인증'}
          </Badge>
          <div className="text-xl font-black text-slate-800">+{lpReward} LP</div>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-black leading-tight text-slate-800">
          {description}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-8">
        {status === 'completed' ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-700 relative">
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute w-2 h-2 rounded-full animate-ping opacity-0"
                        style={{ 
                            backgroundColor: ['#FBBF24', '#34D399', '#60A5FA', '#F471B5'][i % 4],
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${1 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-10 scale-110 ${isBoss ? 'bg-amber-100' : isHidden ? 'bg-purple-100' : 'bg-green-100'}`}>
              <CheckCircle2 className={`w-12 h-12 ${isBoss ? 'text-amber-600' : isHidden ? 'text-purple-600' : 'text-green-600'} animate-bounce`} />
            </div>
            <h3 className="text-4xl font-black mb-2 relative z-10 text-slate-800">미션 완료!</h3>
            <p className="text-muted-foreground font-bold text-xl mb-10 relative z-10">{lpReward} LP를 획득했습니다.</p>
            <Button size="lg" className="h-14 px-12 rounded-[2rem] shadow-xl hover:scale-105 transition-transform relative z-10" asChild>
              <Link href="./">다음 여정으로</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div 
              className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden group ${
                previewUrl ? 'border-primary/40 bg-black/5' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer'
              }`}
              onClick={() => !previewUrl && fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="rounded-full font-bold" onClick={() => fileInputRef.current?.click()}>사진 변경</Button>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-4 right-4 rounded-full w-10 h-10 shadow-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                      setPreviewUrl(null);
                    }}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center">
                      <p className="text-lg font-bold text-slate-700">사진을 선택하여 업로드</p>
                      <p className="text-sm text-slate-400 font-medium">최대 5MB, JPG/PNG/WEBP</p>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                capture="environment"
                onChange={handleImageSelect}
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {/* Checkbox component needed */}
                <input 
                    type="checkbox" 
                    id="syncCommunity" 
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                    checked={syncCommunity}
                    onChange={(e) => setSyncCommunity(e.target.checked)}
                />
                <label htmlFor="syncCommunity" className="text-sm font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer">
                    <MessageSquare className="w-4 h-4" />
                    커뮤니티에도 자동 공유하기
                </label>
            </div>

            <Button 
              className="w-full h-16 text-xl font-black rounded-2xl shadow-xl hover:shadow-primary/20 transition-all duration-300"
              disabled={!selectedImage || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-3" />
                  미션 제출 중...
                </>
              ) : (
                <>
                  {isBoss ? '보스 미션 완료하기' : '미션 완료하기'}
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
      <CourseCompletionModal 
        isOpen={showCompletion} 
        onClose={() => setShowCompletion(false)} 
        courseName={courseName}
        totalLp={totalEarned} 
        locale={locale}
      />
    </Card>
  );
}
