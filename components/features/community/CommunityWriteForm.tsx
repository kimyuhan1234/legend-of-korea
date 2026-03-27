'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, X, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from '@/components/ui/use-toast';
import Image from 'next/image';

interface Course {
  id: string;
  title: string;
}

interface CommunityWriteFormProps {
  locale: string;
  courses: Course[];
}

export function CommunityWriteForm({ locale, courses }: CommunityWriteFormProps) {
  const t = useTranslations('community');
  const router = useRouter();
  const [text, setText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('none');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast({ variant: 'destructive', title: '사진 초과', description: '사진은 최대 5장까지 업로드 가능합니다.' });
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (text.length < 5) {
      toast({ variant: 'destructive', title: '내용 부족', description: '이야기를 최소 5자 이상 적어주세요.' });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload photos if any
      const photoUrls: string[] = [];
      for (const img of images) {
        const formData = new FormData();
        formData.append('file', img.file);
        
        const uploadRes = await fetch('/api/missions/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) photoUrls.push(uploadData.url);
      }

      // 2. Create post
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          photos: photoUrls,
          courseId: selectedCourse === 'none' ? null : selectedCourse,
          isSpoiler,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: '기록 완료!', description: '전설의 페이지에 당신의 기록이 남겨졌습니다. (+LP)' });
        router.push(`/${locale}/community`);
        router.refresh();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: '오류 발생', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('writePost')}</h1>
        <p className="text-slate-400 font-bold">당신의 모험을 전설로 남기세요</p>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardContent className="p-8 space-y-8">
          {/* Course Selector */}
          <div className="space-y-3">
            <Label className="text-sm font-black text-slate-500 ml-1">{t('selectCourse')}</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold">
                <SelectValue placeholder="모험했던 코스를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">코스 선택 안 함</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text Area */}
          <div className="space-y-3">
            <Label className="text-sm font-black text-slate-500 ml-1">{t('text')}</Label>
            <Textarea 
              placeholder={t('writePlaceholder')}
              className="min-h-[200px] rounded-3xl border-slate-100 bg-slate-50/50 p-6 text-lg font-medium resize-none focus:ring-2 focus:ring-indigo-100 transition-all"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <Label className="text-sm font-black text-slate-500 ml-1 flex justify-between items-center">
              <span>{t('photo')} ({images.length}/5)</span>
              <span className="text-[10px] text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">+30 LP</span>
            </Label>
            
            <div className="flex flex-wrap gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden group border-2 border-white shadow-md">
                  <Image src={img.preview} alt="Preview" fill className="object-cover" unoptimized />
                  <button 
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {images.length < 5 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 hover:border-indigo-200 transition-all group"
                >
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all" />
                  <span className="text-[10px] font-black text-slate-400">사진 추가</span>
                </button>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleImageSelect}
            />
          </div>

          {/* Spoiler Toggle */}
          <div className="flex items-center space-x-3 p-5 bg-orange-50/50 rounded-3xl border border-orange-100/50 transition-all hover:bg-orange-50">
            <Checkbox 
              id="isSpoiler" 
              checked={isSpoiler} 
              onCheckedChange={(checked) => setIsSpoiler(checked as boolean)}
              className="w-6 h-6 rounded-lg border-orange-200 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
            />
            <div className="grid gap-0.5 leading-none">
              <label 
                htmlFor="isSpoiler" 
                className="text-sm font-black text-orange-950 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-orange-500" />
                {t('spoilerWarning')}
              </label>
              <p className="text-[11px] text-orange-700/70 font-bold">중요한 줄거리나 기믹 노출 시 체크해 주세요.</p>
            </div>
          </div>

          {/* Reward Info */}
          <div className="flex items-center gap-3 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/30">
            <AlertCircle className="w-5 h-5 text-indigo-400" />
            <p className="text-xs font-bold text-indigo-600/80">
              이야기를 기록하면 <span className="text-indigo-600 font-extrabold">{images.length > 0 ? '30 LP' : '50 LP'}</span>가 즉시 적립됩니다.
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            className="w-full h-16 rounded-[1.5rem] text-xl font-black shadow-2xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin mr-3" />
                기록하는 중...
              </>
            ) : (
              '기록 남기기'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
