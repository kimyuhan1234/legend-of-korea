'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Trash2, X, Loader2, Camera } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const COUNTRY_OPTIONS = [
  { code: 'JP', flag: '🇯🇵', name: '일본' },
  { code: 'IT', flag: '🇮🇹', name: '이탈리아' },
  { code: 'MX', flag: '🇲🇽', name: '멕시코' },
  { code: 'TH', flag: '🇹🇭', name: '태국' },
  { code: 'US', flag: '🇺🇸', name: '미국' },
  { code: 'FR', flag: '🇫🇷', name: '프랑스' },
  { code: 'IN', flag: '🇮🇳', name: '인도' },
  { code: 'VN', flag: '🇻🇳', name: '베트남' },
];

interface RecipeWriteFormProps {
  locale: string;
}

export default function RecipeWriteForm({ locale }: RecipeWriteFormProps) {
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('JP');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [cookingTime, setCookingTime] = useState(30);
  const [servings, setServings] = useState(2);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [koreanIngredients, setKoreanIngredients] = useState<string[]>(['']);
  const [foreignIngredients, setForeignIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  // ── Photo handling ─────────────────────────────────────────
  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = 5 - photos.length;
    const toAdd = files.slice(0, remaining);

    const previews = toAdd.map(f => URL.createObjectURL(f));
    setPhotos(prev => [...prev, ...previews]);
    setPhotoFiles(prev => [...prev, ...toAdd]);
    e.target.value = '';
  }

  function removePhoto(idx: number) {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
    setPhotoFiles(prev => prev.filter((_, i) => i !== idx));
  }

  async function uploadPhotos(): Promise<string[]> {
    if (photoFiles.length === 0) return [];
    setUploadingPhotos(true);
    const uploaded: string[] = [];
    try {
      for (const file of photoFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload/recipe-photo', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) uploaded.push(data.url);
      }
    } catch (err) {
      console.error('Photo upload failed:', err);
    } finally {
      setUploadingPhotos(false);
    }
    return uploaded;
  }

  // ── Dynamic list helpers ───────────────────────────────────
  function updateList(
    list: string[],
    setList: (v: string[]) => void,
    idx: number,
    val: string
  ) {
    const next = [...list];
    next[idx] = val;
    setList(next);
  }

  function addItem(list: string[], setList: (v: string[]) => void) {
    setList([...list, '']);
  }

  function removeItem(list: string[], setList: (v: string[]) => void, idx: number) {
    if (list.length <= 1) return;
    setList(list.filter((_, i) => i !== idx));
  }

  // ── Submit ─────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast({ variant: 'destructive', title: '요리 이름을 입력해주세요.' });
      return;
    }
    setSubmitting(true);
    try {
      // Upload photos first
      let photoUrls: string[] = [];
      if (photoFiles.length > 0) {
        photoUrls = await uploadPhotos();
      }

      const res = await fetch('/api/community/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          country_code: countryCode,
          difficulty,
          cooking_time: cookingTime,
          servings,
          description: description.trim(),
          photos: photoUrls,
          korean_ingredients: koreanIngredients.filter(v => v.trim()),
          foreign_ingredients: foreignIngredients.filter(v => v.trim()),
          steps: steps.filter(v => v.trim()),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: '레시피가 등록되었습니다! 🍳' });
        router.push(`/${locale}/community`);
      } else {
        toast({ variant: 'destructive', title: data.error || '등록 실패' });
      }
    } catch {
      toast({ variant: 'destructive', title: '오류가 발생했습니다.' });
    } finally {
      setSubmitting(false);
    }
  }

  const DIFFICULTY_LABELS = { easy: '쉬움', medium: '보통', hard: '어려움' };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-2xl shadow p-6 space-y-5">
        <h1 className="text-xl font-black text-[#2D1B69]">🍳 나만의 퓨전 레시피 등록</h1>

        {/* 요리 이름 */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">요리 이름 *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="예: 김치 리조또, 된장 파스타"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35] transition-colors"
            required
          />
        </div>

        {/* 퓨전 국가 */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">퓨전 국가</label>
          <div className="grid grid-cols-4 gap-2">
            {COUNTRY_OPTIONS.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => setCountryCode(c.code)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-xs font-bold transition-all
                  ${countryCode === c.code
                    ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
              >
                <span className="text-xl">{c.flag}</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* 난이도 / 조리시간 / 인분 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">난이도</label>
            <div className="flex flex-col gap-1.5">
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <label key={d} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="difficulty"
                    value={d}
                    checked={difficulty === d}
                    onChange={() => setDifficulty(d)}
                    className="accent-[#FF6B35]"
                  />
                  <span className="text-sm">{DIFFICULTY_LABELS[d]}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">조리 시간 (분)</label>
            <input
              type="number"
              min={1}
              value={cookingTime}
              onChange={e => setCookingTime(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B35]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">인분</label>
            <input
              type="number"
              min={1}
              value={servings}
              onChange={e => setServings(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B35]"
            />
          </div>
        </div>

        {/* 한줄 소개 */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">한줄 소개</label>
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="이 레시피를 한 문장으로 소개해주세요"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF6B35]"
          />
        </div>
      </div>

      {/* 사진 업로드 */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <label className="block text-sm font-bold text-gray-700">요리 사진 (최대 5장)</label>
        <div className="flex flex-wrap gap-3">
          {photos.map((src, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
              <Image src={src} alt={`photo ${idx + 1}`} fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-1 right-1 p-0.5 bg-black/50 rounded-full text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {photos.length < 5 && (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#FF6B35]
                         flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#FF6B35] transition-colors"
            >
              <Camera size={20} />
              <span className="text-xs">사진 추가</span>
            </button>
          )}
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoChange}
        />
        <p className="text-xs text-gray-400">사진은 레시피 등록 후 자동 업로드됩니다</p>
      </div>

      {/* 한국 재료 */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <label className="block text-sm font-bold text-gray-700">🇰🇷 한국 재료</label>
        {koreanIngredients.map((ing, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={ing}
              onChange={e => updateList(koreanIngredients, setKoreanIngredients, idx, e.target.value)}
              placeholder={`재료 ${idx + 1} (예: 김치 100g)`}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B35]"
            />
            <button
              type="button"
              onClick={() => removeItem(koreanIngredients, setKoreanIngredients, idx)}
              disabled={koreanIngredients.length <= 1}
              className="p-2.5 text-gray-400 hover:text-red-400 disabled:opacity-30 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addItem(koreanIngredients, setKoreanIngredients)}
          className="flex items-center gap-1.5 text-sm text-[#2D1B69] font-medium hover:text-[#FF6B35] transition-colors"
        >
          <Plus size={16} /> 재료 추가
        </button>
      </div>

      {/* 외국 재료 */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <label className="block text-sm font-bold text-gray-700">
          {COUNTRY_OPTIONS.find(c => c.code === countryCode)?.flag} 외국 재료
        </label>
        {foreignIngredients.map((ing, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={ing}
              onChange={e => updateList(foreignIngredients, setForeignIngredients, idx, e.target.value)}
              placeholder={`재료 ${idx + 1}`}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B35]"
            />
            <button
              type="button"
              onClick={() => removeItem(foreignIngredients, setForeignIngredients, idx)}
              disabled={foreignIngredients.length <= 1}
              className="p-2.5 text-gray-400 hover:text-red-400 disabled:opacity-30 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addItem(foreignIngredients, setForeignIngredients)}
          className="flex items-center gap-1.5 text-sm text-[#2D1B69] font-medium hover:text-[#FF6B35] transition-colors"
        >
          <Plus size={16} /> 재료 추가
        </button>
      </div>

      {/* 조리 순서 */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <label className="block text-sm font-bold text-gray-700">👨‍🍳 조리 순서</label>
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <span className="w-7 h-7 rounded-full bg-[#2D1B69] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-2.5">
              {idx + 1}
            </span>
            <textarea
              value={step}
              onChange={e => updateList(steps, setSteps, idx, e.target.value)}
              placeholder={`${idx + 1}단계 조리 방법을 입력하세요`}
              rows={2}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF6B35] resize-none"
            />
            <button
              type="button"
              onClick={() => removeItem(steps, setSteps, idx)}
              disabled={steps.length <= 1}
              className="p-2.5 text-gray-400 hover:text-red-400 disabled:opacity-30 transition-colors mt-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addItem(steps, setSteps)}
          className="flex items-center gap-1.5 text-sm text-[#2D1B69] font-medium hover:text-[#FF6B35] transition-colors"
        >
          <Plus size={16} /> 단계 추가
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || uploadingPhotos}
        className="w-full py-4 bg-[#FF6B35] text-white rounded-xl font-bold text-base
                   hover:bg-[#E55A2B] disabled:opacity-60 disabled:cursor-not-allowed
                   transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? (
          <><Loader2 size={18} className="animate-spin" /> 등록 중...</>
        ) : '레시피 등록하기'}
      </button>
    </form>
  );
}
