'use client';

import Image from 'next/image';
import { Heart, MessageCircle, Clock, Users } from 'lucide-react';

const COUNTRY_FLAGS: Record<string, string> = {
  JP: '🇯🇵', IT: '🇮🇹', MX: '🇲🇽', TH: '🇹🇭',
  US: '🇺🇸', FR: '🇫🇷', IN: '🇮🇳', VN: '🇻🇳',
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '쉬움', medium: '보통', hard: '어려움',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-red-50 text-red-700',
};

function timeAgo(dateString: string) {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export interface RecipeType {
  id: string;
  name: string;
  country_code: string;
  difficulty: string;
  cooking_time: number;
  servings: number;
  description: string;
  photos: string[];
  korean_ingredients: string[];
  foreign_ingredients: string[];
  steps: string[];
  taste_profile?: { sweet: number; salty: number; spicy: number; sour: number; umami: number };
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  user?: { nickname: string; avatar_url?: string };
}

function TastePentagon({ profile }: { profile: NonNullable<RecipeType['taste_profile']> }) {
  const vals = [profile.sweet, profile.salty, profile.spicy, profile.sour, profile.umami];
  const cx = 40; const cy = 40; const R = 30;
  const dataPoints = vals.map((v, i) => {
    const angle = (-Math.PI / 2) + (2 * Math.PI / 5) * i;
    const r = (v / 5) * R;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
  return (
    <svg width={80} height={80} viewBox="0 0 80 80">
      {[1, 2, 3, 4, 5].map(level => {
        const pts = Array.from({ length: 5 }, (_, i) => {
          const angle = (-Math.PI / 2) + (2 * Math.PI / 5) * i;
          const r = (level / 5) * R;
          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        }).join(' ');
        return <polygon key={level} points={pts} fill="none" stroke="#e5e7eb" strokeWidth={0.8} />;
      })}
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (-Math.PI / 2) + (2 * Math.PI / 5) * i;
        return <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(angle)} y2={cy + R * Math.sin(angle)} stroke="#e5e7eb" strokeWidth={0.8} />;
      })}
      <polygon points={dataPoints} fill="rgba(255,107,53,0.25)" stroke="#9DD8CE" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

interface RecipeCardProps {
  recipe: RecipeType;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const flag = COUNTRY_FLAGS[recipe.country_code] || '🌍';
  const allIngredients = [
    ...(recipe.korean_ingredients || []),
    ...(recipe.foreign_ingredients || []),
  ].slice(0, 3);

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] shadow-sm hover:shadow-md transition-shadow overflow-hidden border-0">
      {/* 대표 사진 */}
      <div className="relative h-44 bg-gray-100">
        {recipe.photos?.[0] ? (
          <Image
            src={recipe.photos[0]}
            alt={recipe.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {flag}
          </div>
        )}
        <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] font-bold ${DIFFICULTY_COLOR[recipe.difficulty] || 'bg-gray-100 text-gray-600'}`}>
          {DIFFICULTY_LABEL[recipe.difficulty] || recipe.difficulty}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* 이름 + 플래그 */}
        <div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
            <span>🇰🇷</span>
            <span className="text-gray-400">×</span>
            <span>{flag}</span>
          </div>
          <h3 className="font-bold text-[#111] text-base leading-snug">{recipe.name}</h3>
        </div>

        {/* 한줄 소개 */}
        {recipe.description && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{recipe.description}</p>
        )}

        {/* 재료 미리보기 */}
        {allIngredients.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {allIngredients.map((ing, i) => (
              <span key={i} className="text-xs bg-[#9DD8CE]/8 text-[#111] px-2 py-0.5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                {ing}
              </span>
            ))}
            {(recipe.korean_ingredients.length + recipe.foreign_ingredients.length) > 3 && (
              <span className="text-xs text-gray-400 px-1">
                +{recipe.korean_ingredients.length + recipe.foreign_ingredients.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 시간/인분 + 맛 프로필 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock size={12} /> {recipe.cooking_time}분</span>
            <span className="flex items-center gap-1"><Users size={12} /> {recipe.servings}인분</span>
          </div>
          {recipe.taste_profile && (
            <TastePentagon profile={recipe.taste_profile} />
          )}
        </div>

        {/* 작성자 + 반응 */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {recipe.user?.nickname || 'Unknown'} · {timeAgo(recipe.created_at)}
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Heart size={12} /> {recipe.likes_count}</span>
            <span className="flex items-center gap-1"><MessageCircle size={12} /> {recipe.comments_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
