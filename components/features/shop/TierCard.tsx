'use client';

import { useState } from 'react';
import { getCurrentTier, getNextTier, TIERS } from '@/lib/constants/tiers';

interface TierCardProps {
  currentTierLevel: number;
  currentLP: number;
  locale: string;
  onUpgradeSuccess: (newTier: number, newLP: number) => void;
}

export default function TierCard({ currentTierLevel, currentLP, locale, onUpgradeSuccess }: TierCardProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showTierList, setShowTierList] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [upgradedTier, setUpgradedTier] = useState<any>(null);

  const currentTier = getCurrentTier(currentTierLevel);
  const nextTier = getNextTier(currentTierLevel);

  const canUpgrade = nextTier && currentLP >= nextTier.requiredLP;
  const progress = nextTier
    ? Math.min((currentLP / nextTier.requiredLP) * 100, 100)
    : 100;
  const remaining = nextTier ? Math.max(nextTier.requiredLP - currentLP, 0) : 0;
  const afterUpgradeLP = nextTier ? currentLP - nextTier.requiredLP : currentLP;

  const handleUpgrade = async () => {
    if (!canUpgrade || isUpgrading) return;
    setIsUpgrading(true);

    try {
      const res = await fetch('/api/shop/tier-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (data.success) {
        setUpgradedTier(data);
        setShowSuccess(true);
        onUpgradeSuccess(data.newTier, data.newLP);
      } else {
        alert(data.error || '승급에 실패했습니다.');
      }
    } catch {
      alert('승급 처리 중 오류가 발생했습니다.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const loc = (obj: { ko: string; ja: string; en: string }) =>
    obj[locale as string] || obj.en || obj.ko;

  return (
    <>
      <div className="bg-gradient-to-br from-[#1F2937] to-sky rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentTier.emoji}</span>
            <div>
              <p className="text-sm text-slate">현재 티어</p>
              <h3 className="text-xl font-bold">{loc(currentTier.name)} (Lv.{currentTier.level})</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate">보유 LP</p>
            <p className="text-2xl font-bold text-mint-deep">{currentLP.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg px-4 py-2 mb-4">
          <p className="text-sm text-white/80">💎 {loc(currentTier.benefits)}</p>
        </div>

        {nextTier ? (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate mb-1">
              <span>다음 티어: {nextTier.emoji} {loc(nextTier.name)}</span>
              <span>{currentLP.toLocaleString()} / {nextTier.requiredLP.toLocaleString()} LP</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${canUpgrade ? 'bg-green-400' : 'bg-mint-deep'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {canUpgrade ? (
              <p className="text-sm text-green-300 mt-2">
                ✅ 승급 가능합니다! (승급 후 잔여: {afterUpgradeLP.toLocaleString()} LP)
              </p>
            ) : (
              <p className="text-sm text-white/50 mt-2">
                🔒 {remaining.toLocaleString()} LP 더 모으면 {loc(nextTier.name)}로 승급!
              </p>
            )}
          </div>
        ) : (
          <div className="mb-4 text-center py-2">
            <p className="text-lg font-bold text-yellow-300">🌟 MAX — 최고 티어 달성!</p>
          </div>
        )}

        <div className="flex gap-3">
          {nextTier && (
            <button
              onClick={handleUpgrade}
              disabled={!canUpgrade || isUpgrading}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                canUpgrade
                  ? 'bg-mint-deep hover:bg-[#7BC8BC] text-white shadow-lg shadow-mint-deep/30'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {isUpgrading
                ? '승급 중...'
                : canUpgrade
                  ? `${nextTier.emoji} ${loc(nextTier.name)}로 승급하기 (-${nextTier.requiredLP.toLocaleString()} LP)`
                  : `LP 부족 (${remaining.toLocaleString()} LP 필요)`}
            </button>
          )}
          <button
            onClick={() => setShowTierList(true)}
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-sm transition-colors"
          >
            전체 티어
          </button>
        </div>
      </div>

      {showTierList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
             onClick={() => setShowTierList(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl"
               onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4 border-b border-cloud">
              <h2 className="text-xl font-bold text-[#111]">🏆 티어 시스템</h2>
              <p className="text-sm text-stone mt-1">LP를 모아 승급하세요. 승급 시 LP가 차감됩니다.</p>
            </div>
            <div className="p-6 space-y-3">
              {TIERS.map(tier => {
                const isCurrent = tier.level === currentTierLevel;
                const isLocked = tier.level > currentTierLevel + 1;
                const isNext = tier.level === currentTierLevel + 1;
                return (
                  <div key={tier.level}
                       className={`p-4 rounded-xl border-2 transition-all ${
                         isCurrent
                           ? 'border-ink bg-mint-deep/5'
                           : isNext
                             ? 'border-mint-deep bg-mint-light'
                             : isLocked
                               ? 'border-cloud bg-snow opacity-50'
                               : 'border-green-200 bg-green-50'
                       }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tier.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#111]">
                              Lv.{tier.level} {loc(tier.name)}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 bg-gradient-to-br from-mint to-blossom text-ink text-xs rounded-full">현재</span>
                            )}
                            {isNext && (
                              <span className="px-2 py-0.5 bg-gradient-to-br from-mint to-blossom text-ink text-xs rounded-full">다음</span>
                            )}
                          </div>
                          <p className="text-xs text-stone mt-0.5">{loc(tier.benefits)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {tier.level === 1 ? (
                          <span className="text-xs text-stone">기본</span>
                        ) : (
                          <span className="text-sm font-bold text-mint-deep">
                            {isLocked ? '🔒' : ''} {tier.requiredLP.toLocaleString()} LP
                          </span>
                        )}
                        {tier.discount > 0 && (
                          <p className="text-xs text-green-600 mt-0.5">할인 {tier.discount}%</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => setShowTierList(false)}
                      className="w-full py-3 bg-gradient-to-br from-mint to-blossom text-ink rounded-xl font-medium hover:bg-[#3D2B79] transition-colors">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && upgradedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
             onClick={() => setShowSuccess(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl text-center p-8"
               onClick={e => e.stopPropagation()}>
            <div className="text-6xl mb-4">{upgradedTier.tierEmoji}</div>
            <h2 className="text-2xl font-bold text-[#111] mb-2">🎉 승급 완료!</h2>
            <p className="text-slate mb-4">
              {currentTier.emoji} {loc(currentTier.name)} → {upgradedTier.tierEmoji} {loc(upgradedTier.tierName)}
            </p>
            <div className="bg-snow rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone">차감 LP</span>
                <span className="text-red-500 font-bold">-{upgradedTier.deducted.toLocaleString()} LP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone">잔여 LP</span>
                <span className="text-mint-deep font-bold">{upgradedTier.newLP.toLocaleString()} LP</span>
              </div>
            </div>
            <button onClick={() => setShowSuccess(false)}
                    className="w-full py-3 bg-gradient-to-br from-mint to-blossom text-ink rounded-xl font-bold hover:bg-[#3D2B79] transition-colors">
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
