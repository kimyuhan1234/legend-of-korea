'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Trash2, X, Loader2, Camera } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { RetroFilterCanvas } from '@/components/features/camera/RetroFilterCanvas';
import { RETRO_FILTERS, applyFilterToFile } from '@/lib/camera/filters';

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const COUNTRY_OPTIONS: { code: string; flag: string; name: Record<Lang, string> }[] = [
  { code: 'JP', flag: '🇯🇵', name: { ko: '일본',     ja: '日本',      en: 'Japan',    'zh-CN': '日本',    'zh-TW': '日本' } },
  { code: 'IT', flag: '🇮🇹', name: { ko: '이탈리아', ja: 'イタリア',  en: 'Italy',    'zh-CN': '意大利',  'zh-TW': '義大利' } },
  { code: 'MX', flag: '🇲🇽', name: { ko: '멕시코',   ja: 'メキシコ',  en: 'Mexico',   'zh-CN': '墨西哥',  'zh-TW': '墨西哥' } },
  { code: 'TH', flag: '🇹🇭', name: { ko: '태국',     ja: 'タイ',       en: 'Thailand', 'zh-CN': '泰国',    'zh-TW': '泰國' } },
  { code: 'US', flag: '🇺🇸', name: { ko: '미국',     ja: 'アメリカ',  en: 'USA',      'zh-CN': '美国',    'zh-TW': '美國' } },
  { code: 'FR', flag: '🇫🇷', name: { ko: '프랑스',   ja: 'フランス',  en: 'France',   'zh-CN': '法国',    'zh-TW': '法國' } },
  { code: 'IN', flag: '🇮🇳', name: { ko: '인도',     ja: 'インド',    en: 'India',    'zh-CN': '印度',    'zh-TW': '印度' } },
  { code: 'VN', flag: '🇻🇳', name: { ko: '베트남',   ja: 'ベトナム',  en: 'Vietnam',  'zh-CN': '越南',    'zh-TW': '越南' } },
];

const LANGS: readonly Lang[] = ['ko', 'ja', 'en', 'zh-CN', 'zh-TW']
function toLang(raw: string): Lang {
  return (LANGS as readonly string[]).includes(raw) ? (raw as Lang) : 'ko'
}

const STR: Record<string, Record<Lang, string>> = {
  heading:         { ko: '🍳 나만의 퓨전 레시피 등록',       ja: '🍳 マイフュージョンレシピ登録',   en: '🍳 Register Your Fusion Recipe',   'zh-CN': '🍳 登记我的融合菜谱',   'zh-TW': '🍳 登記我的融合菜譜' },
  dishName:        { ko: '요리 이름 *',                      ja: '料理名 *',                          en: 'Dish Name *',                       'zh-CN': '料理名 *',             'zh-TW': '料理名 *' },
  dishNamePh:      { ko: '예: 김치 리조또, 된장 파스타',      ja: '例：キムチリゾット、味噌パスタ',   en: 'e.g. Kimchi Risotto, Doenjang Pasta','zh-CN': '例：泡菜意烩饭、大酱意面',  'zh-TW': '例：泡菜義燉飯、大醬義大利麵' },
  fusionCountry:   { ko: '퓨전 국가',                        ja: 'フュージョン国',                    en: 'Fusion Country',                    'zh-CN': '融合国家',             'zh-TW': '融合國家' },
  difficulty:      { ko: '난이도',                           ja: '難易度',                            en: 'Difficulty',                        'zh-CN': '难度',                 'zh-TW': '難度' },
  cookTime:        { ko: '조리 시간 (분)',                   ja: '調理時間(分)',                      en: 'Cook Time (min)',                   'zh-CN': '烹饪时间 (分钟)',      'zh-TW': '烹飪時間 (分鐘)' },
  servings:        { ko: '인분',                             ja: '人分',                              en: 'Servings',                          'zh-CN': '人份',                 'zh-TW': '人份' },
  summary:         { ko: '한줄 소개',                        ja: '一行紹介',                          en: 'One-line Summary',                  'zh-CN': '一句话简介',           'zh-TW': '一句話簡介' },
  summaryPh:       { ko: '이 레시피를 한 문장으로 소개해주세요', ja: 'このレシピを一文で紹介してください', en: 'Describe this recipe in one sentence', 'zh-CN': '用一句话介绍这道菜谱', 'zh-TW': '用一句話介紹這道菜譜' },
  photos:          { ko: '요리 사진 (최대 5장)',             ja: '料理写真 (最大5枚)',                en: 'Dish Photos (up to 5)',             'zh-CN': '料理照片 (最多5张)',   'zh-TW': '料理照片 (最多5張)' },
  addPhoto:        { ko: '사진 추가',                        ja: '写真追加',                          en: 'Add photo',                         'zh-CN': '添加照片',             'zh-TW': '新增照片' },
  photoUploadNote: { ko: '사진은 레시피 등록 후 자동 업로드됩니다', ja: '写真はレシピ登録後に自動アップロードされます', en: 'Photos upload automatically after you submit', 'zh-CN': '提交后照片将自动上传', 'zh-TW': '提交後照片將自動上傳' },
  tasteProfile:    { ko: '🎯 맛 프로필 (0~5)',               ja: '🎯 味プロフィール (0〜5)',          en: '🎯 Taste Profile (0–5)',            'zh-CN': '🎯 味道档案 (0-5)',    'zh-TW': '🎯 味道檔案 (0-5)' },
  sweet:           { ko: '🍯 달콤',                          ja: '🍯 甘い',                            en: '🍯 Sweet',                          'zh-CN': '🍯 甜',                'zh-TW': '🍯 甜' },
  salty:           { ko: '🧂 짭조름',                        ja: '🧂 塩辛い',                          en: '🧂 Salty',                          'zh-CN': '🧂 咸',                'zh-TW': '🧂 鹹' },
  spicy:           { ko: '🌶️ 매콤',                          ja: '🌶️ 辛い',                            en: '🌶️ Spicy',                          'zh-CN': '🌶️ 辣',                'zh-TW': '🌶️ 辣' },
  sour:            { ko: '🍋 새콤',                          ja: '🍋 酸っぱい',                         en: '🍋 Sour',                           'zh-CN': '🍋 酸',                'zh-TW': '🍋 酸' },
  umami:           { ko: '🍄 감칠맛',                        ja: '🍄 うま味',                          en: '🍄 Umami',                          'zh-CN': '🍄 鲜',                'zh-TW': '🍄 鮮' },
  kIngredients:    { ko: '🇰🇷 한국 재료',                    ja: '🇰🇷 韓国食材',                       en: '🇰🇷 Korean Ingredients',             'zh-CN': '🇰🇷 韩国食材',         'zh-TW': '🇰🇷 韓國食材' },
  fIngredients:    { ko: '외국 재료',                        ja: '外国の食材',                         en: 'Foreign Ingredients',               'zh-CN': '外国食材',             'zh-TW': '外國食材' },
  ingredientPh:    { ko: '재료',                             ja: '食材',                               en: 'Ingredient',                        'zh-CN': '食材',                 'zh-TW': '食材' },
  ingredientHint:  { ko: '예: 김치 100g',                    ja: '例：キムチ 100g',                   en: 'e.g. Kimchi 100g',                  'zh-CN': '例：泡菜 100克',       'zh-TW': '例：泡菜 100克' },
  addIngredient:   { ko: '재료 추가',                        ja: '食材追加',                           en: 'Add ingredient',                    'zh-CN': '添加食材',             'zh-TW': '新增食材' },
  steps:           { ko: '👨‍🍳 조리 순서',                   ja: '👨‍🍳 調理手順',                      en: '👨‍🍳 Cooking Steps',                'zh-CN': '👨‍🍳 烹饪步骤',        'zh-TW': '👨‍🍳 烹飪步驟' },
  stepPh:          { ko: '단계 조리 방법을 입력하세요',      ja: '段階の調理方法を入力してください',  en: 'Describe this step',                'zh-CN': '请描述此步骤',         'zh-TW': '請描述此步驟' },
  addStep:         { ko: '단계 추가',                        ja: '手順追加',                           en: 'Add step',                          'zh-CN': '添加步骤',             'zh-TW': '新增步驟' },
  easy:            { ko: '쉬움',                             ja: '簡単',                               en: 'Easy',                              'zh-CN': '简单',                 'zh-TW': '簡單' },
  medium:          { ko: '보통',                             ja: '普通',                               en: 'Medium',                            'zh-CN': '普通',                 'zh-TW': '普通' },
  hard:            { ko: '어려움',                           ja: '難しい',                             en: 'Hard',                              'zh-CN': '困难',                 'zh-TW': '困難' },
  submitting:      { ko: '등록 중...',                       ja: '登録中...',                          en: 'Submitting...',                     'zh-CN': '提交中...',            'zh-TW': '提交中...' },
  submit:          { ko: '레시피 등록하기',                  ja: 'レシピを登録',                       en: 'Submit Recipe',                     'zh-CN': '提交菜谱',             'zh-TW': '提交菜譜' },
  dishNameRequired:{ ko: '요리 이름을 입력해주세요.',        ja: '料理名を入力してください。',        en: 'Please enter the dish name.',       'zh-CN': '请输入料理名称。',     'zh-TW': '請輸入料理名稱。' },
  recipePosted:    { ko: '레시피가 등록되었습니다! 🍳',      ja: 'レシピを登録しました！🍳',           en: 'Recipe posted! 🍳',                 'zh-CN': '菜谱已发布！🍳',       'zh-TW': '菜譜已發布！🍳' },
  submitFailed:    { ko: '등록 실패',                        ja: '登録失敗',                           en: 'Submit failed',                     'zh-CN': '提交失败',             'zh-TW': '提交失敗' },
  errorOccurred:   { ko: '오류가 발생했습니다.',             ja: 'エラーが発生しました。',             en: 'An error occurred.',                'zh-CN': '发生了错误。',         'zh-TW': '發生了錯誤。' },
}

interface RecipeWriteFormProps {
  locale: string;
}

export default function RecipeWriteForm({ locale }: RecipeWriteFormProps) {
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const lang = toLang(locale);
  const s = (k: keyof typeof STR) => STR[k][lang];

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
  const [tasteProfile, setTasteProfile] = useState({ sweet: 0, salty: 0, spicy: 0, sour: 0, umami: 0 });

  // Filter step state
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [filterIndex, setFilterIndex] = useState(0);
  const filterStep = pendingFiles.length > 0;

  // ── Photo handling ─────────────────────────────────────────
  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = 5 - photos.length;
    const toAdd = files.slice(0, remaining);

    setPendingFiles(toAdd);
    setFilterIndex(0);
    e.target.value = '';
  }

  function advanceFilter(processed: File) {
    const preview = URL.createObjectURL(processed);
    setPhotos((prev) => [...prev, preview]);
    setPhotoFiles((prev) => [...prev, processed]);
    if (filterIndex + 1 < pendingFiles.length) {
      setFilterIndex(filterIndex + 1);
    } else {
      setPendingFiles([]);
      setFilterIndex(0);
    }
  }

  async function handleFilterApply(filterId: string) {
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
  }

  function handleFilterSkip() {
    const src = pendingFiles[filterIndex];
    if (src) advanceFilter(src);
  }

  function handleFilterCancel() {
    setPendingFiles([]);
    setFilterIndex(0);
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
      toast({ variant: 'destructive', title: s('dishNameRequired') });
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
          taste_profile: tasteProfile,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: s('recipePosted') });
        router.push(`/${locale}/community`);
      } else {
        toast({ variant: 'destructive', title: data.error || s('submitFailed') });
      }
    } catch {
      toast({ variant: 'destructive', title: s('errorOccurred') });
    } finally {
      setSubmitting(false);
    }
  }

  const getDiffLabel = (d: 'easy' | 'medium' | 'hard') => STR[d][lang];

  // 필터 단계
  if (filterStep && pendingFiles[filterIndex]) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow p-6 md:p-8">
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-2xl shadow p-6 space-y-5">
        <h1 className="text-xl font-black text-[#111]">{s('heading')}</h1>

        {/* 요리 이름 */}
        <div>
          <label className="block text-sm font-bold text-slate mb-1.5">{s('dishName')}</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={s('dishNamePh')}
            className="w-full border border-mist rounded-xl px-4 py-3 text-sm outline-none focus:border-mint-deep transition-colors"
            required
          />
        </div>

        {/* 퓨전 국가 */}
        <div>
          <label className="block text-sm font-bold text-slate mb-1.5">{s('fusionCountry')}</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {COUNTRY_OPTIONS.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => setCountryCode(c.code)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-xs font-bold transition-all
                  ${countryCode === c.code
                    ? 'border-mint-deep bg-mint-light text-mint-deep'
                    : 'border-mist text-slate hover:border-mist'
                  }`}
              >
                <span className="text-xl">{c.flag}</span>
                {c.name[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* 난이도 / 조리시간 / 인분 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate mb-1.5">{s('difficulty')}</label>
            <div className="flex flex-col gap-1.5">
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <label key={d} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="difficulty"
                    value={d}
                    checked={difficulty === d}
                    onChange={() => setDifficulty(d)}
                    className="accent-[#9DD8CE]"
                  />
                  <span className="text-sm">{getDiffLabel(d)}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate mb-1.5">{s('cookTime')}</label>
            <input
              type="number"
              min={1}
              value={cookingTime}
              onChange={e => setCookingTime(Number(e.target.value))}
              className="w-full border border-mist rounded-xl px-3 py-2.5 text-sm outline-none focus:border-mint-deep"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate mb-1.5">{s('servings')}</label>
            <input
              type="number"
              min={1}
              value={servings}
              onChange={e => setServings(Number(e.target.value))}
              className="w-full border border-mist rounded-xl px-3 py-2.5 text-sm outline-none focus:border-mint-deep"
            />
          </div>
        </div>

        {/* 한줄 소개 */}
        <div>
          <label className="block text-sm font-bold text-slate mb-1.5">{s('summary')}</label>
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={s('summaryPh')}
            className="w-full border border-mist rounded-xl px-4 py-3 text-sm outline-none focus:border-mint-deep"
          />
        </div>
      </div>

      {/* 사진 업로드 */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <label className="block text-sm font-bold text-slate">{s('photos')}</label>
        <div className="flex flex-wrap gap-3">
          {photos.map((src, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-mist">
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
              className="w-24 h-24 rounded-xl border-2 border-dashed border-mist hover:border-mint-deep
                         flex flex-col items-center justify-center gap-1 text-stone hover:text-mint-deep transition-colors"
            >
              <Camera size={20} />
              <span className="text-xs">{s('addPhoto')}</span>
            </button>
          )}
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          multiple
          className="hidden"
          onChange={handlePhotoChange}
        />
        <p className="text-xs text-stone">{s('photoUploadNote')}</p>
      </div>

      {/* 맛 프로필 */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <label className="block text-sm font-bold text-slate">{s('tasteProfile')}</label>
        <div className="flex gap-6 items-center">
          {/* 슬라이더 */}
          <div className="flex-1 space-y-3">
            {(
              [
                { key: 'sweet', label: s('sweet') },
                { key: 'salty', label: s('salty') },
                { key: 'spicy', label: s('spicy') },
                { key: 'sour',  label: s('sour') },
                { key: 'umami', label: s('umami') },
              ] as { key: keyof typeof tasteProfile; label: string }[]
            ).map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs w-20 shrink-0">{label}</span>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={1}
                  value={tasteProfile[key]}
                  onChange={e => setTasteProfile(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  className="flex-1 accent-[#9DD8CE]"
                />
                <span className="text-xs w-4 text-right font-bold text-mint-deep">{tasteProfile[key]}</span>
              </div>
            ))}
          </div>
          {/* SVG 오각형 레이더 */}
          <div className="shrink-0">
            <svg width={100} height={100} viewBox="0 0 100 100">
              {/* 배경 격자 */}
              {[1, 2, 3, 4, 5].map(level => {
                const pts = Array.from({ length: 5 }, (_, i) => {
                  const angle = (-Math.PI / 2) + (2 * Math.PI / 5) * i;
                  const r = (level / 5) * 40;
                  return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`;
                }).join(' ');
                return <polygon key={level} points={pts} fill="none" stroke="#e5e7eb" strokeWidth={0.8} />;
              })}
              {/* 축선 */}
              {Array.from({ length: 5 }, (_, i) => {
                const angle = (-Math.PI / 2) + (2 * Math.PI / 5) * i;
                return (
                  <line
                    key={i}
                    x1={50} y1={50}
                    x2={50 + 40 * Math.cos(angle)}
                    y2={50 + 40 * Math.sin(angle)}
                    stroke="#e5e7eb" strokeWidth={0.8}
                  />
                );
              })}
              {/* 데이터 오각형 */}
              {(() => {
                const vals = [tasteProfile.sweet, tasteProfile.salty, tasteProfile.spicy, tasteProfile.sour, tasteProfile.umami];
                const pts = vals.map((v, i) => {
                  const angle = (-Math.PI / 2) + (2 * Math.PI / 5) * i;
                  const r = (v / 5) * 40;
                  return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`;
                }).join(' ');
                return (
                  <polygon
                    points={pts}
                    fill="rgba(255,107,53,0.25)"
                    stroke="#9DD8CE"
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                  />
                );
              })()}
              {/* 꼭짓점 라벨 */}
              {[
                { key: 'sweet' as const, i: 0 },
                { key: 'salty' as const, i: 1 },
                { key: 'spicy' as const, i: 2 },
                { key: 'sour'  as const, i: 3 },
                { key: 'umami' as const, i: 4 },
              ].map(({ key, i }) => {
                const tasteLabel = STR[key][lang].replace(/^[^\s]+\s/, '');
                const angle = (-Math.PI / 2) + (2 * Math.PI / 5) * i;
                const x = 50 + 48 * Math.cos(angle);
                const y = 50 + 48 * Math.sin(angle);
                return (
                  <text
                    key={key}
                    x={x} y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={6}
                    fill="#6b7280"
                  >
                    {tasteLabel}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* 한국 재료 */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <label className="block text-sm font-bold text-slate">{s('kIngredients')}</label>
        {koreanIngredients.map((ing, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={ing}
              onChange={e => updateList(koreanIngredients, setKoreanIngredients, idx, e.target.value)}
              placeholder={`${s('ingredientPh')} ${idx + 1} (${s('ingredientHint')})`}
              className="flex-1 border border-mist rounded-xl px-3 py-2.5 text-sm outline-none focus:border-mint-deep"
            />
            <button
              type="button"
              onClick={() => removeItem(koreanIngredients, setKoreanIngredients, idx)}
              disabled={koreanIngredients.length <= 1}
              className="p-2.5 text-stone hover:text-red-400 disabled:opacity-30 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addItem(koreanIngredients, setKoreanIngredients)}
          className="flex items-center gap-1.5 text-sm text-[#111] font-medium hover:text-mint-deep transition-colors"
        >
          <Plus size={16} /> {s('addIngredient')}
        </button>
      </div>

      {/* 외국 재료 */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <label className="block text-sm font-bold text-slate">
          {COUNTRY_OPTIONS.find(c => c.code === countryCode)?.flag} {s('fIngredients')}
        </label>
        {foreignIngredients.map((ing, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={ing}
              onChange={e => updateList(foreignIngredients, setForeignIngredients, idx, e.target.value)}
              placeholder={`${s('ingredientPh')} ${idx + 1}`}
              className="flex-1 border border-mist rounded-xl px-3 py-2.5 text-sm outline-none focus:border-mint-deep"
            />
            <button
              type="button"
              onClick={() => removeItem(foreignIngredients, setForeignIngredients, idx)}
              disabled={foreignIngredients.length <= 1}
              className="p-2.5 text-stone hover:text-red-400 disabled:opacity-30 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addItem(foreignIngredients, setForeignIngredients)}
          className="flex items-center gap-1.5 text-sm text-[#111] font-medium hover:text-mint-deep transition-colors"
        >
          <Plus size={16} /> {s('addIngredient')}
        </button>
      </div>

      {/* 조리 순서 */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <label className="block text-sm font-bold text-slate">{s('steps')}</label>
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-mint to-blossom text-ink text-xs font-bold flex items-center justify-center shrink-0 mt-2.5">
              {idx + 1}
            </span>
            <textarea
              value={step}
              onChange={e => updateList(steps, setSteps, idx, e.target.value)}
              placeholder={`${idx + 1}. ${s('stepPh')}`}
              rows={2}
              className="flex-1 border border-mist rounded-xl px-3 py-2.5 text-sm outline-none focus:border-mint-deep resize-none"
            />
            <button
              type="button"
              onClick={() => removeItem(steps, setSteps, idx)}
              disabled={steps.length <= 1}
              className="p-2.5 text-stone hover:text-red-400 disabled:opacity-30 transition-colors mt-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addItem(steps, setSteps)}
          className="flex items-center gap-1.5 text-sm text-[#111] font-medium hover:text-mint-deep transition-colors"
        >
          <Plus size={16} /> {s('addStep')}
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || uploadingPhotos}
        className="w-full py-4 bg-gradient-to-br from-mint to-blossom text-ink rounded-xl font-bold text-base
                   hover:bg-[#7BC8BC] disabled:opacity-60 disabled:cursor-not-allowed
                   transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? (
          <><Loader2 size={18} className="animate-spin" /> {s('submitting')}</>
        ) : s('submit')}
      </button>
    </form>
  );
}
