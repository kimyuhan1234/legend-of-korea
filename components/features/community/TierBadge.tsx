'use client';

import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface TierBadgeProps {
  level: number;
  className?: string;
}

export function TierBadge({ level, className }: TierBadgeProps) {
  const t = useTranslations('tier');
  
  // Tier color mapping
  const tierColors: { [key: number]: string } = {
    1: "bg-slate-100 text-slate-600 border-slate-200",   // 마을 주민
    2: "bg-blue-50 text-blue-600 border-blue-200",       // 여행자
    3: "bg-green-50 text-green-600 border-green-200",    // 모험가
    4: "bg-purple-50 text-purple-600 border-purple-200", // 영웅
    5: "bg-amber-50 text-amber-600 border-amber-200",    // 전설
    6: "bg-rose-50 text-rose-600 border-rose-200",       // 신화
  };

  const tierIcon: { [key: number]: string } = {
    1: "🏘️",
    2: "🧳",
    3: "⚔️",
    4: "🦸",
    5: "👑",
    6: "✨",
  };

  return (
    <Badge 
      variant="outline" 
      className={`font-black gap-1 py-0.5 px-2 ${tierColors[level] || tierColors[1]} ${className}`}
    >
      <span className="text-[10px]">{tierIcon[level] || tierIcon[1]}</span>
      <span className="text-[10px] uppercase tracking-tighter">
        {t(level.toString())}
      </span>
    </Badge>
  );
}
