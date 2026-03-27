'use client';

import { useState, ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { 
  Camera, 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb, 
  Loader2, 
  Sparkles, 
  Upload, 
  X,
  MessageSquare,
  Share2,
  Trophy
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CourseCompletionModal } from './CourseCompletionModal';

interface OpenMissionProps {
  missionId: string;
  courseName: string;
  title: string;
  description: string;
  lpReward: number;
  type: 'open' | 'boss' | 'hidden';
  initialStatus?: string;
  locale: string;
}

export function OpenMission({ 
  missionId, 
  courseName,
  title,
  description, 
  lpReward, 
  type = 'open',
  initialStatus = 'unlocked',
  locale
}: OpenMissionProps) {
  const t = useTranslations('mission');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [syncCommunity, setSyncCommunity] = useState(true);
  const [status, setStatus] = useState(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
          toast({
              variant: 'destructive',
              title: '파일 크기 초과',
              description: '최대 5MB까지 업로드 가능합니다.'
          });
          return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let photoUrl = null;

      // 1. 사진 업로드 (필요한 경우)
      if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('missionId', missionId);

          const uploadRes = await fetch('/api/missions/upload', {
              method: 'POST',
              body: formData
          });
          
          if (!uploadRes.ok) {
              // 오프라인 대응: 실패 시 나중에 재시도 로직 (여기서는 localStorage에 기록만)
              const pendingUploads = JSON.parse(localStorage.getItem('pending_mission_uploads') || '[]');
              pendingUploads.push({ missionId, text, timestamp: Date.now() });
              localStorage.setItem('pending_mission_uploads', JSON.stringify(pendingUploads));
              
              throw new Error('사진 업로드 실패. 나중에 다시 시도됩니다.');
          }
          
          const uploadData = await uploadRes.json();
          photoUrl = uploadData.publicUrl;
      }

      // 2. 미션 완료 처리
      const response = await fetch('/api/missions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          missionId, 
          type, 
          answer: text,
          photoUrl,
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
              title: '미션 완료!',
              description: `${lpReward} LP 획득! 커뮤니티에 공유되었습니다.`,
            });
        }
      } else {
        throw new Error(data.error || '완료 처리 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: '미션 실패',
        description: err.message || '다시 시도해주세요.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBoss = type === 'boss';
  const isHidden = type === 'hidden';

  const themeColors = isBoss 
    ? 'border-amber-400 bg-amber-50/10' 
    : isHidden 
        ? 'border-purple-400 bg-purple-50/10' 
        : 'border-primary/20 bg-white/40';

  return (
    <Card className={`w-full overflow-hidden border-2 rounded-[2.5rem] shadow-xl backdrop-blur-md transition-all duration-500 ${themeColors}`}>
      <CardHeader className={`${isBoss ? 'bg-amber-100/30' : isHidden ? 'bg-purple-100/30' : 'bg-primary/5'} pb-6 pt-8 px-8`}>
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline" className={`flex items-center gap-1.5 py-1 px-3 ${
              isBoss ? 'bg-amber-100 text-amber-700 border-amber-200' : isHidden ? 'bg-purple-100 text-purple-700 border-purple-200' : 'border-primary/30 text-primary'
          }`}>
            {isHidden ? <Sparkles className="w-4 h-4" /> : isBoss ? <Trophy className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            {isHidden ? 'HIDDEN MISSION' : isBoss ? 'BOSS MISSION' : 'OPEN MISSION'}
          </Badge>
          <div className={`text-xl font-black ${isBoss ? 'text-amber-600' : isHidden ? 'text-purple-600' : 'text-primary'}`}>
            +{lpReward} LP
          </div>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-black leading-tight text-slate-800 mb-2">
          {title}
        </CardTitle>
        <p className="text-slate-600 font-medium">{description}</p>
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
            <h3 className="text-4xl font-black text-slate-800 mb-2 relative z-10">미션 완료!</h3>
            <p className="text-muted-foreground font-bold text-xl mb-10 relative z-10">{lpReward} LP를 획득했습니다.</p>
            <Button size="lg" className="h-14 px-12 rounded-[2rem] shadow-xl hover:scale-105 transition-transform relative z-10" asChild>
              <Link href="./">다음 여정으로</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Image Upload Area */}
            <div className="space-y-4">
                <Label className="text-sm font-black text-slate-500 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    사진 인증 (선택 사항)
                </Label>
                
                {preview ? (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner group">
                        <Image src={preview} alt="Preview" fill className="object-cover transition-transform group-hover:scale-105" />
                        <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={removeFile}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-4 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-lg font-bold text-slate-500 group-hover:text-slate-800">사진 찍기 또는 업로드</p>
                            <p className="text-xs text-slate-400 mt-1 italic">JPG, PNG, WEBP (Max 5MB)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e)} />
                    </label>
                )}
            </div>

            {/* Text Input Area */}
            <div className="space-y-4">
                <Label className="text-sm font-black text-slate-500 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    미션 소감 또는 답변 (선택 사항)
                </Label>
                <Textarea 
                    placeholder="미션을 수행하며 느낀 점이나 답변을 자유롭게 적어주세요." 
                    className="min-h-[120px] rounded-2xl border-2 focus-visible:ring-primary/40 focus-visible:border-primary bg-white/80 p-5 text-lg"
                    value={text}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                />
            </div>

            {/* Community Sync */}
            <div className="flex items-center space-x-3 p-5 rounded-2xl bg-primary/5 border border-primary/10">
                <Checkbox 
                    id="syncCommunity" 
                    checked={syncCommunity} 
                    onCheckedChange={(checked) => setSyncCommunity(!!checked)}
                    className="w-5 h-5 rounded-md"
                />
                <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor="syncCommunity"
                        className="text-sm font-bold leading-none cursor-pointer flex items-center gap-1.5"
                    >
                        <Share2 className="w-4 h-4 text-primary" />
                        커뮤니티에 공유하기
                    </label>
                    <p className="text-xs text-muted-foreground">
                        작성한 사진과 글이 다른 여행자들에게 공유됩니다.
                    </p>
                </div>
            </div>

            {/* Submit Button */}
            <Button 
                size="lg" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full h-16 rounded-[1.5rem] shadow-2xl transition-all font-black text-xl flex items-center gap-2 ${
                    isBoss ? 'bg-amber-500 hover:bg-amber-600' : isHidden ? 'bg-purple-600 hover:bg-purple-700' : 'bg-primary hover:bg-primary/90'
                }`}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        처리 중...
                    </>
                ) : (
                    <>
                        {isBoss ? '보스 미션 완료' : '제출 및 완료'}
                        <Sparkles className="w-6 h-6 ml-1" />
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
