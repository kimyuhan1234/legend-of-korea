'use client';

import { POST_THEMES } from '@/lib/data/post-themes';

interface CategoryTabsProps {
  currentCategory: string;
  onSelect: (category: string) => void;
  locale: string;
}

export function CategoryTabs({ currentCategory, onSelect, locale }: CategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide border-b border-slate-100 mb-6 bg-white/80 backdrop-blur-md sticky top-[72px] z-30 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 min-w-max pb-3 pt-3">
        {POST_THEMES.map((theme) => {
          const isSelected = currentCategory === theme.id;
          const label = theme.label[locale as keyof typeof theme.label] || theme.label.en;
          return (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-mint-deep text-white shadow-sm scale-105'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-mint-deep hover:text-mint-deep'
              }`}
            >
              <span className="text-base leading-none">{theme.emoji}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
