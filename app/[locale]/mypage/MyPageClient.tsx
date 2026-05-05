'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RankBadge } from '@/components/features/rank/RankBadge';
import { ProfileBadges } from '@/components/features/mypage/ProfileBadges';
import {
  ShoppingBag,
  History,
  Ticket,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Loader2,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ZepMeetingButton } from '@/components/features/quest/ZepMeetingButton';
import { ZepBanner } from '@/components/features/quest/ZepBanner';
import { SettingsSection, SettingsRow } from '@/components/features/mypage/SettingsSection';
import { ProfileSettings } from '@/components/features/mypage/ProfileSettings';
import { AccountDanger } from '@/components/features/mypage/AccountDanger';
import { LevelCard } from '@/components/features/dashboard/LevelCard';
import { MyPlannerCard } from '@/components/features/mypage/MyPlannerCard';
import { AvatarSelectModal } from '@/components/features/mypage/AvatarSelectModal';
import { usePassStatus } from '@/hooks/usePassStatus';
import { resolveAvatarSrc, hasAvatarSource } from '@/lib/avatar/resolve';
import type { UserRankResult } from '@/lib/tiers/levels';
import type { AvatarCategory, AvatarImage } from '@/lib/avatar/data';

interface MyPageClientProps {
  locale: string;
  initialRank?: UserRankResult | null;
  /** server 에서 fetch 한 사용자 선택 아바타 파일명 — 사진 선택 모달 후 router.refresh() 로 갱신 */
  initialAvatarFilename?: string | null;
  /** server 에서 fetch 한 사용자 선택 아바타 카테고리 slug */
  initialAvatarSlug?: string | null;
  /** 사용자 현재 레벨 — AvatarSelectModal 의 카테고리 잠금 판단용 */
  currentLevel?: number;
  /** 사용자가 선택한 image_id (avatar_images.id) — 모달에서 mint-deep ring 강조용 */
  selectedImageId?: string | null;
  /** 모든 카테고리 메타 — AvatarSelectModal 카테고리 섹션 */
  avatarCategories?: AvatarCategory[];
  /** 모든 사진 메타 — AvatarSelectModal 사진 그리드 */
  avatarImages?: AvatarImage[];
  /** 다음 레벨 카테고리 slug (avatar.category.{slug}) — LevelCard 미리보기용 */
  nextCategorySlug?: string | null;
}

export function MyPageClient({
  locale,
  initialRank = null,
  initialAvatarFilename = null,
  initialAvatarSlug = null,
  currentLevel = 1,
  selectedImageId = null,
  avatarCategories = [],
  avatarImages = [],
  nextCategorySlug = null,
}: MyPageClientProps) {
  const t = useTranslations('mypage');
  const tAvatar = useTranslations('avatar');
  const router = useRouter();
  const supabase = useRef(createClient()).current;
  // 패스 검증 — /api/passes/status (TEST_MODE / passes 테이블 / 만료 일관 처리)
  const { hasPass } = usePassStatus();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [lpHistory, setLpHistory] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [orderRegionMap, setOrderRegionMap] = useState<Record<string, string>>({});

  const [lpBalance, setLpBalance] = useState<number>(0);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // 아코디언 섹션 열림 상태
  const [showOrders, setShowOrders] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [showLp, setShowLp] = useState(false);

  // 빗방울만 refetch (focus/visibility 복귀 시 stale 방지)
  const refreshLpBalance = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    const { data } = await supabase
      .from('users')
      .select('total_lp')
      .eq('id', authUser.id)
      .single();
    if (data) setLpBalance(data.total_lp ?? 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push(`/${locale}/auth/login`);
          return;
        }

        const [userProfile, historyRes, couponsRes, ordersRes] = await Promise.all([
          supabase.from('users').select('id, nickname, email, language, avatar_url, total_lp, current_level, role, birth_date, birth_date_verified_at, created_at').eq('id', authUser.id).single(),
          fetch('/api/lp/history'),
          fetch('/api/shop/coupons'),
          fetch('/api/orders'),
        ]);

        const hData = await historyRes.json();
        const cData = await couponsRes.json();
        const oData = await ordersRes.json();

        if (userProfile.data) {
          setUser(userProfile.data);
          setLpBalance(userProfile.data.total_lp ?? 0);
        }
        if (hData.success) {
          setLpHistory(hData.history);
          const applied = new Set<string>(
            (hData.history as any[]).filter((h: any) => h.applied).map((h: any) => h.id)
          );
          setAppliedIds(applied);
        }
        if (cData.success) setCoupons(cData.coupons);
        if (oData.success) {
          setOrders(oData.orders);
          const courseIds: string[] = Array.from(
            new Set(
              (oData.orders as any[])
                .map((o: any) => o.kit_products?.courses?.id)
                .filter(Boolean)
            )
          );
          if (courseIds.length) {
            try {
              const { data: courseRows } = await supabase
                .from('courses')
                .select('id, region')
                .in('id', courseIds);
              const regionById: Record<string, string> = {};
              (courseRows || []).forEach((c: any) => { regionById[c.id] = c.region || ''; });
              const regionByOrder: Record<string, string> = {};
              (oData.orders as any[]).forEach((o: any) => {
                const cId = o.kit_products?.courses?.id;
                if (cId && regionById[cId]) regionByOrder[o.id] = regionById[cId];
              });
              setOrderRegionMap(regionByOrder);
            } catch {
              // ZEP 매핑 실패해도 정상 동작
            }
          }
        }
      } catch (error) {
        console.error('Fetch My Page Data Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 탭 복귀·창 포커스 시 빗방울 동기화 — 타 페이지(상점/미션)에서 LP 변동 후 돌아올 때 stale 방지
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshLpBalance();
    };
    window.addEventListener('focus', refreshLpBalance);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', refreshLpBalance);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // refreshLpBalance 는 클로저 — supabase 참조만 하므로 의존성 비어도 안전
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyLP = async (transactionId: string) => {
    if (appliedIds.has(transactionId) || applyingId) return;
    setApplyingId(transactionId);
    try {
      const res = await fetch('/api/lp/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      });
      if (!res.ok) throw new Error('Failed to apply LP');
      const data = await res.json();
      setLpBalance(data.newBalance);
      setAppliedIds((prev) => {
        const next = new Set(Array.from(prev));
        next.add(transactionId);
        return next;
      });
    } catch (error) {
      console.error('LP apply failed:', error);
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-mint-deep border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-slate-500">{t('loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 container max-w-6xl mx-auto px-4 py-8 md:py-12">
      {initialRank && (
        <div className="mb-8">
          <LevelCard
            locale={locale}
            level={initialRank.level}
            raindrops={initialRank.raindrops}
            isMaxLevel={initialRank.isMaxLevel}
            nextCategorySlug={nextCategorySlug}
          />
        </div>
      )}
      <div className="grid lg:grid-cols-[320px_1fr] gap-8">

        {/* 좌측 사이드바 — 프로필 요약 카드 (기본 구조 유지) */}
        <aside className="space-y-6">
          <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
            <div className="h-24 bg-gradient-to-br from-mint-deep to-sky" />
            <CardContent className="px-6 pb-8 -mt-12 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white mx-auto">
                  {(() => {
                    const avatarSrc = {
                      avatar_url: user?.avatar_url,
                      selected_avatar_filename: initialAvatarFilename,
                      selected_avatar_slug: initialAvatarSlug,
                    };
                    return hasAvatarSource(avatarSrc) ? (
                      <Image src={resolveAvatarSrc(avatarSrc)} alt="Profile" fill className="object-cover" sizes="128px" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-5xl font-black text-slate-300">
                        {user?.nickname?.[0]}
                      </div>
                    );
                  })()}
                </div>
                {/* 아바타 변경 트리거 — 우측 하단 카메라 아이콘 (avatar.changeAvatar i18n) */}
                {avatarCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAvatarModalOpen(true)}
                    aria-label={tAvatar('selectImage')}
                    className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-mint-deep text-white shadow-lg hover:bg-mint hover:scale-110 active:scale-95 transition-all flex items-center justify-center ring-4 ring-white"
                  >
                    <Camera className="w-4 h-4" aria-hidden />
                  </button>
                )}
              </div>

              <h2 className="text-2xl font-black text-slate-800">{user?.nickname}</h2>
              <p className="text-sm text-slate-500 font-bold mb-4">{user?.email}</p>

              {user?.id && (
                <div className="mb-6">
                  <RankBadge userId={user.id} size="lg" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-0.5">{
                    ({ ko: '빗방울 잔액', ja: 'しずく残高', en: 'Raindrops Balance', 'zh-CN': '雨滴余额', 'zh-TW': '雨滴餘額' } as Record<string, string>)[locale] ?? '빗방울 잔액'
                  }</p>
                  <p className="text-xl font-black text-sky transition-all duration-500">{lpBalance.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-0.5">Experience</p>
                  <p className="text-xl font-black text-sky">{orders.length} <span className="text-[10px]">Courses</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 내 플래너 카드 */}
          <MyPlannerCard userId={user?.id ?? null} locale={locale} />

          {/* 프로필 훈장 */}
          {user?.id && <ProfileBadges userId={user.id} />}

          <div className="bg-mint-deep rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl shadow-mint relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <ShieldCheck className="w-10 h-10 text-mint-light mb-2" />
            <h3 className="text-xl font-black">{t('membership') || '레전드 멤버십'}</h3>
            <p className="text-xs text-mint-light font-bold leading-relaxed opacity-80">
              {t('membershipDesc') || '더 높은 등급으로 승급하여 전용 할인 혜택과 특별한 굿즈 기회를 잡으세요.'}
            </p>
            <Button onClick={() => router.push(`/${locale}/shop`)} className="w-full rounded-xl bg-white text-sky font-black hover:bg-sky-light mt-4 h-11 border-none">
              {t('shopCta') || '전설 상점 가기'}
            </Button>
          </div>
        </aside>

        {/* 우측 메인 — 설정 섹션 그룹 */}
        <section className="space-y-6">

          {/* 섹션 1: 내 정보 */}
          <SettingsSection icon="👤" title={t('settings.profile')}>
            <ProfileSettings
              user={{
                ...user,
                selected_avatar_filename: initialAvatarFilename,
                selected_avatar_slug: initialAvatarSlug,
              }}
              locale={locale}
              onUpdate={(updated) => setUser((prev: any) => ({ ...prev, ...updated }))}
            />
          </SettingsSection>

          {/* 섹션 2: 결제 & 혜택 */}
          <SettingsSection icon="💳" title={t('settings.payment')}>
            <SettingsRow
              icon="📦"
              label={t('settings.orders')}
              onClick={() => setShowOrders((v) => !v)}
              isOpen={showOrders}
            />
            {showOrders && (
              <div className="px-5 py-4 bg-slate-50/50 space-y-3">
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-slate-500 gap-2 py-8 opacity-40">
                    <ShoppingBag className="w-8 h-8" />
                    <p className="text-sm font-bold">{t('noOrders') || '주문 내역이 없습니다.'}</p>
                  </div>
                ) : (
                  orders.map((order: any) => (
                    <div key={order.id} className="p-4 rounded-xl bg-white border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-black text-slate-500">
                          #{order.id.split('-')[0].toUpperCase()}
                        </span>
                        <Badge className="rounded-lg px-2 py-0.5 bg-sky-light text-sky border-none font-black text-[10px]">
                          {order.payment_status?.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-6 h-6 text-slate-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-slate-800 truncate">
                            {order.kit_products?.courses?.title?.[locale] || order.kit_products?.courses?.title?.ko || t('digitalPass') || 'Digital Quest Pass'}
                          </h4>
                          <p className="text-xs text-slate-500 font-bold">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm font-black text-slate-800 shrink-0">
                          ₩{order.total_price.toLocaleString()}
                        </p>
                      </div>
                      {orderRegionMap[order.id] && (
                        hasPass ? (
                          <ZepMeetingButton
                            courseId={orderRegionMap[order.id]}
                            hasPurchased={true}
                            locale={locale}
                          />
                        ) : (
                          <ZepBanner locale={locale} />
                        )
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            <SettingsRow
              icon="🎫"
              label={t('settings.coupons')}
              onClick={() => setShowCoupons((v) => !v)}
              isOpen={showCoupons}
            />
            {showCoupons && (
              <div className="px-5 py-4 bg-slate-50/50 space-y-2">
                {coupons.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-slate-500 gap-2 py-8 opacity-40">
                    <Ticket className="w-8 h-8" />
                    <p className="text-sm font-bold">{t('noCoupons') || '보유 중인 쿠폰이 없습니다.'}</p>
                  </div>
                ) : (
                  coupons.map((coupon: any) => (
                    <div key={coupon.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                        <Ticket className="w-5 h-5 text-sky" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-slate-800">{coupon.discount_rate}% OFF</span>
                          <Badge className={`font-black text-[9px] border-none ${coupon.is_used ? 'bg-slate-200 text-slate-500' : 'bg-sky-light text-sky'}`}>
                            {coupon.is_used ? 'USED' : 'ACTIVE'}
                          </Badge>
                        </div>
                        <p className="text-[11px] font-mono font-bold text-slate-500 tracking-wider truncate">{coupon.code}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold shrink-0">
                        <Calendar className="w-3 h-3" />
                        {new Date(coupon.expires_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            <SettingsRow
              icon="💰"
              label={t('settings.lpHistory')}
              onClick={() => setShowLp((v) => !v)}
              isOpen={showLp}
            />
            {showLp && (
              <div className="px-5 py-4 bg-slate-50/50 space-y-2">
                {lpHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-slate-500 gap-2 py-8 opacity-40">
                    <History className="w-8 h-8" />
                    <p className="text-sm font-bold">{t('noLp') || '적립된 빗방울 내역이 없습니다.'}</p>
                  </div>
                ) : (
                  lpHistory.map((item: any) => {
                    const isApplied = appliedIds.has(item.id);
                    const isApplying = applyingId === item.id;
                    const isPositive = item.amount > 0;

                    return (
                      <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border ${isApplied ? 'bg-slate-50/60 border-slate-100' : 'bg-white border-slate-100'}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isApplied ? 'bg-emerald-50 text-emerald-500' : isPositive ? 'bg-sky-light text-sky' : 'bg-rose-50 text-rose-600'}`}>
                          {isApplied ? <CheckCircle2 className="w-5 h-5" /> : isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-black truncate ${isApplied ? 'text-slate-500' : 'text-slate-800'}`}>
                            {item.description}
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold">
                            {new Date(item.created_at).toLocaleDateString()} · {item.type}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-sm font-black ${isApplied ? 'text-slate-500' : isPositive ? 'text-sky' : 'text-rose-500'}`}>
                            {isPositive ? '+' : ''}{item.amount.toLocaleString()}
                            <span className="text-[9px] ml-0.5">빗방울</span>
                          </span>
                          {isPositive && !isApplied && (
                            <button
                              onClick={() => handleApplyLP(item.id)}
                              disabled={isApplying}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-mint-deep text-white rounded-lg text-[10px] font-black hover:bg-mint-deep/80 active:scale-95 transition-all disabled:opacity-50"
                            >
                              {isApplying ? <Loader2 className="w-3 h-3 animate-spin" /> : '→'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </SettingsSection>

          {/* 섹션 3: 도움말 */}
          <SettingsSection icon="ℹ️" title={t('settings.help')}>
            <SettingsRow icon="❓" label={t('settings.faq')} href={`/${locale}/faq`} />
            <SettingsRow icon="📄" label={t('settings.terms')} href={`/${locale}/terms`} />
            <SettingsRow icon="🔒" label={t('settings.privacy')} href={`/${locale}/privacy`} />
          </SettingsSection>

          {/* 섹션 4: 계정 (로그아웃 + 탈퇴) */}
          <AccountDanger locale={locale} />

        </section>

      </div>

      {/* 아바타 사진 선택 모달 — 카메라 아이콘 클릭 시 직접 열림 */}
      {avatarModalOpen && avatarCategories.length > 0 && (
        <AvatarSelectModal
          locale={locale}
          currentLevel={currentLevel}
          selectedImageId={selectedImageId}
          categories={avatarCategories}
          images={avatarImages}
          onClose={() => setAvatarModalOpen(false)}
        />
      )}
    </div>
  );
}
