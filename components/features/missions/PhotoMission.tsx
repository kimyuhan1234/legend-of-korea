'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Camera, Upload, Loader2, X, Sparkles, MessageSquare, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { CourseCompletionModal } from './CourseCompletionModal';
import { FilterSelector } from '@/components/features/camera/FilterSelector';
import { RETRO_FILTERS, applyFilterToFile } from '@/lib/camera/filters';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILES = 3;
const MAX_SIZE_MB = 5;

interface PhotoMissionProps {
  missionId: string;
  courseName: string;
  description: string;
  lpReward: number;
  initialStatus?: string;
  locale: string;
}

export function PhotoMission({
  missionId,
  courseName,
  description,
  lpReward,
  initialStatus = 'unlocked',
  locale,
}: PhotoMissionProps) {
  const t = useTranslations('mission');
  const [status, setStatus] = useState(initialStatus);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [syncCommunity, setSyncCommunity] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('original');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── 파일 선택 검증 ──────────────────────────────────────────
  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const remaining = MAX_FILES - files.length;

    if (selected.length > remaining) {
      toast({
        variant: 'destructive',
        title: t('photoLimitTitle') || '사진 장수 초과',
        description: t('photoLimitDesc', { max: MAX_FILES }) || `최대 ${MAX_FILES}장까지 업로드 가능합니다.`,
      });
      return;
    }

    const invalid = selected.find(
      (f) => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_SIZE_MB * 1024 * 1024
    );
    if (invalid) {
      toast({
        variant: 'destructive',
        title: t('photoFormatError') || '파일 형식 오류',
        description: t('photoFormatDesc') || 'JPEG·PNG·WebP, 5MB 이하만 가능합니다.',
      });
      return;
    }

    const newPreviews = selected.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    // 동일 파일 재선택 가능하도록 value 초기화
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── 업로드 + 미션 완료 ───────────────────────────────────────
  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return;
    setIsUploading(true);

    try {
      // 0. 필터 적용
      const filter = RETRO_FILTERS.find((f) => f.id === selectedFilter) ?? RETRO_FILTERS[0];
      const processedFiles = await Promise.all(files.map((f) => applyFilterToFile(f, filter)));

      // 1. 사진 순차 업로드
      const uploadedUrls: string[] = [];
      for (const file of processedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('missionId', missionId);

        const res = await fetch('/api/missions/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t('uploadError') || '업로드 실패');
        uploadedUrls.push(data.url ?? data.publicUrl);
      }

      // 2. 미션 검증 API (서버에서 URL 유효성 재확인)
      const verifyRes = await fetch('/api/missions/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, type: 'photo', photoUrls: uploadedUrls, syncCommunity }),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.isCorrect) {
        setStatus('completed');
        setTotalEarned((verifyData.lpEarned ?? lpReward) + (verifyData.bonusLp ?? 0));
        if (verifyData.courseCompleted) {
          setShowCompletion(true);
        } else {
          toast({
            title: t('missionComplete') || '미션 완료!',
            description: t('lpEarned', { lp: verifyData.lpEarned ?? lpReward }) || `${lpReward} LP 획득!`,
          });
        }
      } else {
        throw new Error(verifyData.error || t('error') || '처리 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: t('error') || '오류', description: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  // ── Completed 화면 ──────────────────────────────────────────
  if (status === 'completed') {
    return (
      <Card className="w-full border-2 border-green-200 rounded-[2.5rem] overflow-hidden shadow-xl bg-white">
        <CardContent className="p-8 flex flex-col items-center justify-center py-14 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-green-600 animate-bounce" />
          </div>
          <h3 className="text-4xl font-black text-green-700 mb-2">{t('missionComplete') || '미션 완료!'}</h3>
          <p className="text-muted-foreground font-bold text-xl mb-10">{t('lpEarned', { lp: lpReward }) || `${lpReward} LP 획득`}</p>
          <Button size="lg" className="h-14 px-12 rounded-[2rem] shadow-xl hover:scale-105 transition-transform" asChild>
            <Link href="./">{t('nextMission') || '다음 여정으로'}</Link>
          </Button>
        </CardContent>
        <CourseCompletionModal isOpen={showCompletion} onClose={() => setShowCompletion(false)} courseName={courseName} totalLp={totalEarned} locale={locale} />
      </Card>
    );
  }

  // ── 업로드 화면 ─────────────────────────────────────────────
  return (
    <Card className="w-full border-2 border-primary/20 rounded-[2.5rem] overflow-hidden shadow-xl bg-white/40 backdrop-blur-md">
      <CardHeader className="bg-primary/5 pb-6 pt-8 px-8">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline" className="flex items-center gap-1.5 border-primary/30 text-primary py-1 px-3">
            <Camera className="w-4 h-4" />
            {t('photo') || '사진 인증'}
          </Badge>
          <div className="text-xl font-black text-primary">+{lpReward} LP</div>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-black leading-tight text-slate-800">
          {description}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        {/* 사진 그리드 */}
        <div className="grid grid-cols-3 gap-3">
          {previews.map((src, idx) => {
            const cssFilter = RETRO_FILTERS.find((f) => f.id === selectedFilter)?.cssFilter ?? 'none';
            return (
            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 group">
              <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" style={{ filter: cssFilter }} />
              <button
                onClick={() => removeFile(idx)}
                className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )})}

          {files.length < MAX_FILES && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
              <span className="text-xs font-bold text-slate-400 group-hover:text-primary">
                {t('addPhoto') || '사진 추가'}
              </span>
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400 font-medium text-center">
          {files.length}/{MAX_FILES}{t('photoCount') || '장'} · JPEG/PNG/WebP · {t('maxSize', { mb: MAX_SIZE_MB }) || `최대 ${MAX_SIZE_MB}MB`}
        </p>

        {/* 레트로 필터 선택 */}
        {files.length > 0 && (
          <FilterSelector selectedFilter={selectedFilter} onSelect={setSelectedFilter} locale={locale} />
        )}

        {/* 커뮤니티 공유 */}
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <input
            type="checkbox"
            id="syncCommunity"
            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
            checked={syncCommunity}
            onChange={(e) => setSyncCommunity(e.target.checked)}
          />
          <label htmlFor="syncCommunity" className="text-sm font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer">
            <MessageSquare className="w-4 h-4" />
            {t('shareCommunity') || '커뮤니티에도 자동 공유하기'}
          </label>
        </div>

        <Button
          className="w-full h-16 text-xl font-black rounded-2xl shadow-xl hover:shadow-primary/20 transition-all duration-300"
          disabled={files.length === 0 || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? (
            <><Loader2 className="w-6 h-6 animate-spin mr-3" />{t('submitting') || '미션 제출 중...'}</>
          ) : (
            <><Sparkles className="w-5 h-5 mr-2" />{t('completePhoto') || '사진으로 미션 완료하기'}</>
          )}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          multiple
          capture="environment"
          onChange={handleFilesSelect}
        />
      </CardContent>

      <CourseCompletionModal isOpen={showCompletion} onClose={() => setShowCompletion(false)} courseName={courseName} totalLp={totalEarned} locale={locale} />
    </Card>
  );
}
