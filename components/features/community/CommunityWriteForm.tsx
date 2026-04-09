'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, X, Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { REGIONS } from '@/lib/constants/regions';

interface CommunityWriteFormProps {
  locale: string;
}

export function CommunityWriteForm({ locale }: CommunityWriteFormProps) {
  const t = useTranslations('community');
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  
  // Tags logic
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
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

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && tags.length < 5 && !tags.includes(val)) {
        setTags(prev => [...prev, val]);
        setTagInput('');
      } else if (tags.length >= 5) {
        toast({ variant: 'destructive', title: '태그 제한', description: '태그는 최대 5개까지 가능합니다.' });
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ variant: 'destructive', title: '제목 누락', description: '이야기의 제목을 적어주세요.' });
      return;
    }
    
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
          title,
          text,
          photos: photoUrls,
          region: selectedRegion,
          tags,
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
      toast({ variant: 'destructive', title: '오류 발생', description: error.message || '업로드 중 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('writePost')}</h1>
        <p className="text-slate-400 font-bold">당신의 모험을 전설로 남기세요</p>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardContent className="p-8 space-y-8">
          
          {/* Region Selector */}
          <div className="space-y-3 relative z-30">
            <Label className="text-sm font-black text-slate-500 ml-1">지역 선택</Label>
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full max-w-[200px] h-14 px-4 py-3 border border-slate-100 rounded-2xl bg-slate-50/50 text-slate-700 font-bold
                           appearance-none cursor-pointer focus:outline-none focus:ring-2 
                           focus:ring-indigo-100 focus:border-indigo-300 transition-all"
              >
                <option value="all">지역 선택</option>
                {REGIONS.filter(r => r.code !== 'ad').map(region => (
                  <option key={region.code} value={region.code}>
                    {(region.name as any)[locale] || region.name.en}
                  </option>
                ))}
              </select>
              {/* Custom arrow for native select to keep it looking nice */}
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <Label className="text-sm font-black text-slate-500 ml-1">제목</Label>
            <Input 
              placeholder="게시글의 제목을 입력해주세요"
              className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 p-4 text-lg font-bold focus:ring-2 focus:ring-indigo-100 transition-all font-sans"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Text Area */}
          <div className="space-y-3">
            <Label className="text-sm font-black text-slate-500 ml-1">{t('text')}</Label>
            <Textarea 
              placeholder={t('writePlaceholder')}
              className="min-h-[250px] rounded-3xl border-slate-100 bg-slate-50/50 p-6 text-base font-medium resize-none focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* Tags (Chips) */}
          <div className="space-y-3">
            <Label className="text-sm font-black text-slate-500 ml-1">태그</Label>
            <div className="min-h-[56px] rounded-2xl border border-slate-100 bg-slate-50/50 p-3 flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              {tags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-[#FF6B35] rounded-xl text-sm font-bold">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                  <button onClick={() => removeTag(i)} className="hover:bg-orange-200/50 rounded-full p-0.5 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={tags.length < 5 ? '태그 입력 후 스페이스바 또는 엔터...' : ''}
                className="flex-1 bg-transparent border-none outline-none min-w-[200px] text-sm font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                disabled={tags.length >= 5}
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <Label className="text-sm font-black text-slate-500 ml-1 flex justify-between items-center">
              <span>{t('photo')} ({images.length}/5)</span>
              <span className="text-[10px] text-[#FF6B35] bg-orange-50 px-2 py-0.5 rounded-full">+30 LP</span>
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
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-[#FF6B35] group-hover:scale-110 transition-all" />
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

          {/* Reward Info */}
          <div className="flex items-center gap-3 p-4 bg-orange-50/30 rounded-2xl border border-orange-100/30">
            <AlertCircle className="w-5 h-5 text-[#FF6B35]/70" />
            <p className="text-xs font-bold text-[#FF6B35]/80">
              이야기를 기록하면 <span className="text-[#FF6B35] font-extrabold">{images.length > 0 ? '50 LP' : '30 LP'}</span>가 즉시 적립됩니다.
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            className="w-full h-16 rounded-[1.5rem] text-xl font-black bg-[#FF6B35] hover:bg-[#E55A2B] text-white shadow-2xl shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
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
