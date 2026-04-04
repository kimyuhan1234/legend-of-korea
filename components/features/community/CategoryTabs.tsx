'use client';

import { REGIONS } from '@/lib/constants/regions';

const RECIPE_TAB = { code: 'recipe', name: { ko: '🍳 요리 레시피', ja: '🍳 料理レシピ', en: '🍳 Recipes' } };

interface CategoryTabsProps {
  currentCategory: string;
  onSelect: (category: string) => void;
  locale: string;
}

export function CategoryTabs({ currentCategory, onSelect, locale }: CategoryTabsProps) {
  const tabs = [...REGIONS, RECIPE_TAB];
  return (
    <div className="w-full overflow-x-auto scrollbar-hide border-b border-slate-100 mb-6 bg-white/80 backdrop-blur-md sticky top-[72px] z-30 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-6 min-w-max pb-3 pt-3">
        {tabs.map((tab) => {
          const isSelected = currentCategory === tab.code;
          return (
            <button
              key={tab.code}
              onClick={() => onSelect(tab.code)}
              className={`relative px-1 py-2 font-black text-sm whitespace-nowrap transition-colors
                ${isSelected ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {(tab.name as any)[locale] || tab.name.en}
              {isSelected && (
                <span className="absolute bottom-[-13px] left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
