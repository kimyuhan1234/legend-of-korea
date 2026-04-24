'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Camera, X, Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { SELECTABLE_THEMES, type PostTheme } from '@/lib/data/post-themes';
import { RetroFilterCanvas } from '@/components/features/camera/RetroFilterCanvas';
import { RETRO_FILTERS, applyFilterToFile } from '@/lib/camera/filters';

interface CommunityWriteFormProps {
  locale: string;
}

export function CommunityWriteForm({ locale }: CommunityWriteFormProps) {
  const t = useTranslations('community');
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<PostTheme | ''>('');
  
  // Tags logic
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter step (PhotoMission 패턴 재사용)
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [filterIndex, setFilterIndex] = useState(0);
  const filterStep = pendingFiles.length > 0;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast({ variant: 'destructive', title: t('photoLimitTitle'), description: t('photoLimitDesc') });
      return;
    }
    setPendingFiles(files);
    setFilterIndex(0);
    e.target.value = '';
  };

  const advanceFilter = (processedFile: File) => {
    const preview = URL.createObjectURL(processedFile);
    setImages((prev) => [...prev, { file: processedFile, preview }]);
    if (filterIndex + 1 < pendingFiles.length) {
      setFilterIndex(filterIndex + 1);
    } else {
      setPendingFiles([]);
      setFilterIndex(0);
    }
  };

  const handleFilterApply = async (filterId: string) => {
    const src = pendingFiles[filterIndex];
    if (!src) return;
    try {
      const filter = RETRO_FILTERS.find((f) => f.id === filterId) ?? RETRO_FILTERS[0];
      const processed = await applyFilterToFile(src, filter);
      advanceFilter(processed);
    } catch (err) {
      console.error('Filter apply error:', err);
      advanceFilter(src);
    }
  };

  const handleFilterSkip = () => {
    const src = pendingFiles[filterIndex];
    if (src) advanceFilter(src);
  };

  const handleFilterCancel = () => {
    setPendingFiles([]);
    setFilterIndex(0);
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
        toast({ variant: 'destructive', title: t('tagLimitTitle'), description: t('tagLimitDesc') });
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ variant: 'destructive', title: t('titleMissingTitle'), description: t('titleMissingDesc') });
      return;
    }

    if (text.length < 5) {
      toast({ variant: 'destructive', title: t('textShortTitle'), description: t('textShortDesc') });
      return;
    }
    if (!selectedTheme) {
      toast({ variant: 'destructive', title: t('themeMissingTitle'), description: t('themeMissingDesc') });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload photos if any
      const photoUrls: string[] = [];
      for (const img of images) {
        const formData = new FormData();
        formData.append('file', img.file);
        
        const uploadRes = await fetch('/api/community/upload', {
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
          theme: selectedTheme || null,
          tags,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: t('postSuccessTitle'), description: t('postSuccessDesc') });
        router.push(`/${locale}/community`);
        router.refresh();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: t('errorTitle'), description: error.message || t('errorDesc') });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 필터 단계 (선택된 파일에 순차적으로 필터 적용)
  if (filterStep && pendingFiles[filterIndex]) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-3xl border border-mist p-6 md:p-8">
          <p className="text-xs text-stone mb-3 text-center">
            ✨ {filterIndex + 1} / {pendingFiles.length}
          </p>
          <RetroFilterCanvas
            imageFile={pendingFiles[filterIndex]}
            onApply={handleFilterApply}
            onSkip={handleFilterSkip}
            onCancel={handleFilterCancel}
            locale={locale}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('writePost')}</h1>
        <p className="text-slate-400 font-bold">{t('writeSubtitle')}</p>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardContent className="p-8 space-y-8">
          
          {/* Theme Selector (필수) */}
          <div className="space-y-3">
            <Label className="text-sm font-black text-slate-500 ml-1">{t('themeLabel')} *</Label>
            <div className="flex flex-wrap gap-2">
              {SELECTABLE_THEMES.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                const label = theme.label[locale as keyof typeof theme.label] || theme.label.en;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                      isSelected
                        ? 'bg-mint-deep text-white shadow-md scale-105'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-mint-deep'
                    }`}
                  >
                    <span className="text-base leading-none">{theme.emoji}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <Label className="text-sm font-black text-slate-500 ml-1">{t('titleLabel')}</Label>
            <Input
              placeholder={t('titlePlaceholder')}
              className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 p-4 text-lg font-bold focus:ring-2 focus:ring-mint-light transition-all font-sans"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Text Area */}
          <div className="space-y-3">
            <Label className="text-sm font-black text-slate-500 ml-1">{t('text')}</Label>
            <Textarea 
              placeholder={t('writePlaceholder')}
              className="min-h-[250px] rounded-3xl border-slate-100 bg-slate-50/50 p-6 text-base font-medium resize-none focus:ring-2 focus:ring-mint-light transition-all leading-relaxed"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* Tags (Chips) */}
          <div className="space-y-3">
            <Label className="text-sm font-black text-slate-500 ml-1">{t('tagLabel')}</Label>
            <div className="min-h-[56px] rounded-2xl border border-slate-100 bg-slate-50/50 p-3 flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-mint-light transition-all">
              {tags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-mint-light text-mint-deep rounded-xl text-sm font-bold">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                  <button onClick={() => removeTag(i)} className="hover:bg-mint/50 rounded-full p-0.5 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={tags.length < 5 ? t('tagPlaceholder') : ''}
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
              <span className="text-[10px] text-mint-deep bg-mint-light px-2 py-0.5 rounded-full">+30 빗방울</span>
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
                  className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 hover:border-sky transition-all group"
                >
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-mint-deep group-hover:scale-110 transition-all" />
                  <span className="text-[10px] font-black text-slate-400">{t('addPhoto')}</span>
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              multiple
              onChange={handleImageSelect}
            />
          </div>

          {/* Reward Info */}
          <div className="flex items-center gap-3 p-4 bg-mint-light/30 rounded-2xl border border-mint/30">
            <AlertCircle className="w-5 h-5 text-mint-deep/70" />
            <p className="text-xs font-bold text-mint-deep/80">
              {t.rich('rewardInfo', {
                reward: () => (
                  <span className="text-mint-deep font-extrabold">
                    {images.length > 0 ? '50 🌧️' : '30 🌧️'}
                  </span>
                ),
              })}
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            className="w-full h-16 rounded-[1.5rem] text-xl font-black bg-mint-deep hover:bg-[#7BC8BC] text-white shadow-2xl shadow-mint-light hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin mr-3" />
                {t('submitting')}
              </>
            ) : (
              t('writePost')
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
