'use client';

import { useTranslations } from 'next-intl';

interface MissionProgressProps {
  completed: number;
  total: number;
}

export default function MissionProgress({ completed, total }: MissionProgressProps) {
  const t = useTranslations('mypage');
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white/80">
          {t('progressLabel')}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">
            {completed} / {total}
          </span>
          <span className="text-xs font-bold text-[#9DD8CE] bg-white/20 px-2 py-0.5 rounded-full">
            {pct}%
          </span>
        </div>
      </div>

      <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #9DD8CE 0%, #FFB347 50%, #9DD8CE 100%)',
            backgroundSize: '200% 100%',
            animation: pct > 0 ? 'shimmer 2s infinite linear' : 'none',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>

      {pct === 100 && (
        <p className="text-center text-sm font-bold text-yellow-300 animate-bounce">
          🎉 모든 미션 완료!
        </p>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
