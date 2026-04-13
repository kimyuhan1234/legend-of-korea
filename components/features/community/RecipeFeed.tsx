'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, PenLine } from 'lucide-react';
import { RecipeCard, RecipeType } from './RecipeCard';

const COUNTRY_FILTERS = [
  { code: 'all', label: '전체' },
  { code: 'JP', label: '🇯🇵 일본' },
  { code: 'IT', label: '🇮🇹 이탈리아' },
  { code: 'MX', label: '🇲🇽 멕시코' },
  { code: 'TH', label: '🇹🇭 태국' },
  { code: 'US', label: '🇺🇸 미국' },
  { code: 'FR', label: '🇫🇷 프랑스' },
  { code: 'IN', label: '🇮🇳 인도' },
  { code: 'VN', label: '🇻🇳 베트남' },
];

interface RecipeFeedProps {
  locale: string;
}

export function RecipeFeed({ locale }: RecipeFeedProps) {
  const [country, setCountry] = useState('all');
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const url = country === 'all'
          ? '/api/community/recipes'
          : `/api/community/recipes?country=${country}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) setRecipes(data.recipes);
      } catch (err) {
        console.error('RecipeFeed fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [country]);

  return (
    <div className="space-y-6">
      {/* 배너 */}
      <div className="bg-mint-deep rounded-2xl p-5 flex items-center justify-between gap-4 text-white">
        <div>
          <p className="font-black text-base">🍳 나만의 퓨전 레시피를 공유해보세요!</p>
          <p className="text-sm text-white/80 mt-0.5">한국 재료로 만드는 세계 퓨전 요리</p>
        </div>
        <Link
          href={`/${locale}/community/recipe/write`}
          className="shrink-0 flex items-center gap-1.5 bg-white text-[#9DD8CE] px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-mint-light transition-colors"
        >
          <PenLine size={15} />
          레시피 작성
        </Link>
      </div>

      {/* 국가 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {COUNTRY_FILTERS.map(f => (
          <button
            key={f.code}
            onClick={() => setCountry(f.code)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors
              ${country === f.code
                ? 'bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] text-[#1F2937]'
                : 'bg-cloud text-slate hover:bg-mist'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 피드 */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-sky" />
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-cloud">
          <div className="text-5xl mb-3">🍳</div>
          <p className="text-stone font-bold">아직 등록된 레시피가 없습니다.</p>
          <p className="text-sm text-stone mt-1">첫 번째 레시피를 공유해보세요!</p>
          <Link
            href={`/${locale}/community/recipe/write`}
            className="inline-block mt-4 px-5 py-2.5 bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] text-[#1F2937] rounded-xl font-bold text-sm hover:bg-[#7BC8BC] transition-colors"
          >
            레시피 작성하기
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
