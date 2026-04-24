'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  Flame, Loader2, Swords, Trophy, Upload, X, Sparkles, Crown,
} from 'lucide-react';
import Link from 'next/link';
import { CourseCompletionModal } from './CourseCompletionModal';
import { RetroFilterCanvas } from '@/components/features/camera/RetroFilterCanvas';
import { RETRO_FILTERS, applyFilterToFile } from '@/lib/camera/filters';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface BossMissionProps {
  missionId:     string;
  courseName:    string;
  title:         string;
  description:   string;
  lpReward:      number;
  /** 정답이 있으면 quiz 방식, 없으면 open 방식 */
  correctAnswer?: string;
  initialStatus?: string;
  locale:        string;
}

export function BossMission({
  missionId,
  courseName,
  title,
  description,
  lpReward,
  correctAnswer,
  initialStatus = 'unlocked',
  locale,
}: BossMissionProps) {
  const t = useTranslations('mission');
  const [status,        setStatus]        = useState(initialStatus);
  const [answer,        setAnswer]        = useState('');
  const [text,          setText]          = useState('');
  const [file,          setFile]          = useState<File | null>(null);
  const [preview,       setPreview]       = useState<string | null>(null);
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [showCompletion,setShowCompletion]= useState(false);
  const [totalEarned,   setTotalEarned]   = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter step (PhotoMission과 동일 패턴)
  const [filterStep, setFilterStep] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const hasQuiz = !!correctAnswer;

  // ── 파일 선택 → 필터 단계로 진입 ─────────────────────────────
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type) || f.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: t('photoFormatError'),
        description: t('photoFormatDesc'),
      });
      return;
    }
    setPendingFile(f);
    setFilterStep(true);
    e.target.value = '';
  };

  // ── 필터 적용 후 최종 파일 세팅 ───────────────────────────────
  const handleFilterApply = async (filterId: string) => {
    if (!pendingFile) return;
    try {
      const filter = RETRO_FILTERS.find((f) => f.id === filterId) ?? RETRO_FILTERS[0];
      const processed = await applyFilterToFile(pendingFile, filter);
      setFile(processed);
      setPreview(URL.createObjectURL(processed));
    } catch (err) {
      console.error('Filter apply error:', err);
      // 실패 시 원본 그대로 사용
      setFile(pendingFile);
      setPreview(URL.createObjectURL(pendingFile));
    } finally {
      setFilterStep(false);
      setPendingFile(null);
    }
  };

  const handleFilterSkip = () => {
    if (pendingFile) {
      setFile(pendingFile);
      setPreview(URL.createObjectURL(pendingFile));
    }
    setFilterStep(false);
    setPendingFile(null);
  };

  const handleFilterCancel = () => {
    setFilterStep(false);
    setPendingFile(null);
  };

  // ── 제출 ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (hasQuiz && !answer.trim()) {
      toast({ variant: 'destructive', title: t('error'), description: t('enterAnswerFirst') });
      return;
    }
    setIsSubmitting(true);

    try {
      let photoUrls: string[] = [];

      // 사진 업로드 (선택)
      if (file) {
        const form = new FormData();
        form.append('file', file);
        form.append('missionId', missionId);
        const up = await fetch('/api/missions/upload', { method: 'POST', body: form });
        const upData = await up.json();
        if (!up.ok) throw new Error(upData.error || t('uploadError'));
        photoUrls = [upData.url ?? upData.publicUrl];
      }

      // 미션 검증
      const res = await fetch('/api/missions/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId,
          type: hasQuiz ? 'quiz' : 'boss',
          answer: answer || text || null,
          photoUrls,
          syncCommunity: true,
        }),
      });
      const data = await res.json();

      if (data.isCorrect) {
        setStatus('completed');
        setTotalEarned((data.lpEarned ?? lpReward) + (data.bonusLp ?? 0));
        if (data.courseCompleted) {
          setShowCompletion(true);
        } else {
          toast({
            title: t('bossDefeated'),
            description: t('lpEarned', { lp: data.lpEarned ?? lpReward }),
          });
        }
      } else {
        toast({ variant: 'destructive', title: t('tryAgain'), description: data.error });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: t('error'), description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── 완료 화면 ────────────────────────────────────────────────
  if (status === 'completed') {
    return (
      <div className="w-full rounded-[2.5rem] overflow-hidden border-2 border-amber-500/40 bg-gradient-to-b from-stone-950 to-stone-900 shadow-2xl shadow-amber-900/30">
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center relative overflow-hidden">
          {/* 배경 광채 */}
          <div className="absolute inset-0 bg-gradient-radial from-amber-900/30 via-transparent to-transparent pointer-events-none" />
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center mb-8 shadow-lg shadow-amber-500/40 relative z-10 animate-pulse">
            <Crown className="w-14 h-14 text-stone-950" />
          </div>
          <h3 className="text-4xl font-black text-amber-400 mb-3 relative z-10 tracking-widest uppercase">
            {t('bossDefeated')}
          </h3>
          <p className="text-amber-200/70 font-bold text-xl mb-12 relative z-10">
            {t('lpEarned', { lp: lpReward })}
          </p>
          <Button
            size="lg"
            className="h-14 px-14 rounded-[2rem] bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 font-black hover:scale-105 transition-transform shadow-xl shadow-amber-500/30 relative z-10"
            asChild
          >
            <Link href="./">{t('nextMission')}</Link>
          </Button>
        </div>
        <CourseCompletionModal isOpen={showCompletion} onClose={() => setShowCompletion(false)} courseName={courseName} totalLp={totalEarned} locale={locale} />
      </div>
    );
  }

  // ── 필터 단계 (사진 선택 후) ─────────────────────────────────
  if (filterStep && pendingFile) {
    return (
      <div className="w-full rounded-[2.5rem] overflow-hidden border-2 border-amber-500/30 bg-white p-6 md:p-8">
        <RetroFilterCanvas
          imageFile={pendingFile}
          onApply={handleFilterApply}
          onSkip={handleFilterSkip}
          onCancel={handleFilterCancel}
          locale={locale}
        />
      </div>
    );
  }

  // ── 보스 미션 화면 ───────────────────────────────────────────
  return (
    <div className="w-full rounded-[2.5rem] overflow-hidden border-2 border-amber-500/30 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 shadow-2xl shadow-amber-900/20">

      {/* 헤더 */}
      <div className="relative px-8 pt-10 pb-8 border-b border-amber-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
            <Swords className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black text-amber-400 tracking-widest uppercase">
              {t('boss')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xl font-black text-amber-400">+{t('costLp', { cost: lpReward })}</span>
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-amber-50 leading-tight mb-3 relative z-10 tracking-tight">
          {title}
        </h2>
        <p className="text-amber-200/60 font-medium leading-relaxed relative z-10">{description}</p>
      </div>

      {/* 폼 영역 */}
      <div className="px-8 py-8 space-y-6">

        {/* 퀴즈 정답 입력 (정답이 있는 보스) */}
        {hasQuiz && (
          <div className="space-y-3">
            <label className="text-xs font-black text-amber-400/80 tracking-widest uppercase flex items-center gap-2">
              <Flame className="w-4 h-4" />
              {t('finalAnswer')}
            </label>
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={t('enterAnswer')}
              className="h-14 bg-stone-800/80 border-amber-500/20 text-amber-50 placeholder:text-stone-500 rounded-2xl text-lg px-5 focus-visible:ring-amber-500/40 focus-visible:border-amber-500/50"
            />
          </div>
        )}

        {/* 소감 텍스트 */}
        <div className="space-y-3">
          <label className="text-xs font-black text-amber-400/80 tracking-widest uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {t('bossRecord')}
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('bossRecordPlaceholder')}
            className="min-h-[100px] bg-stone-800/80 border-amber-500/20 text-amber-50 placeholder:text-stone-500 rounded-2xl text-base p-5 resize-none focus-visible:ring-amber-500/40 focus-visible:border-amber-500/50"
          />
        </div>

        {/* 사진 업로드 */}
        <div className="space-y-3">
          <label className="text-xs font-black text-amber-400/80 tracking-widest uppercase flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {t('bossTrophy')}
          </label>
          {preview ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-amber-500/20 group">
              <img src={preview} alt="boss trophy" className="w-full h-full object-cover brightness-90" />
              <button
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video rounded-2xl border-2 border-dashed border-amber-500/20 bg-stone-800/30 hover:bg-stone-800/60 hover:border-amber-500/40 transition-all flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <Upload className="w-7 h-7 text-amber-500/60 group-hover:text-amber-400" />
              </div>
              <span className="text-sm font-bold text-stone-500 group-hover:text-amber-400/70">
                {t('uploadPhoto')}
              </span>
            </button>
          )}
          <input ref={fileInputRef} type="file" className="hidden" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={handleFile} />
        </div>

        {/* 제출 버튼 */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || (hasQuiz && !answer.trim())}
          className="w-full h-16 text-xl font-black rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 hover:from-amber-400 hover:to-yellow-500 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 disabled:opacity-40"
        >
          {isSubmitting ? (
            <><Loader2 className="w-6 h-6 animate-spin mr-3" />{t('submitting')}</>
          ) : (
            <><Swords className="w-6 h-6 mr-3" />{t('bossSubmit')}</>
          )}
        </Button>
      </div>

      <CourseCompletionModal isOpen={showCompletion} onClose={() => setShowCompletion(false)} courseName={courseName} totalLp={totalEarned} locale={locale} />
    </div>
  );
}
