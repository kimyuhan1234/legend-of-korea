'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/features/community/TierBadge';
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
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ZepMeetingButton } from '@/components/features/quest/ZepMeetingButton';
import { SettingsSection, SettingsRow } from '@/components/features/mypage/SettingsSection';
import { ProfileSettings } from '@/components/features/mypage/ProfileSettings';
import { SubscriptionManage } from '@/components/features/mypage/SubscriptionManage';
import { AccountDanger } from '@/components/features/mypage/AccountDanger';

interface MyPageClientProps {
  locale: string;
}

export function MyPageClient({ locale }: MyPageClientProps) {
  const t = useTranslations('mypage');
  const router = useRouter();
  const supabase = createClient();

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
          supabase.from('users').select('*').eq('id', authUser.id).single(),
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
          const courseIds: string[] = [
            ...new Set(
              (oData.orders as any[])
                .map((o: any) => o.kit_products?.courses?.id)
                .filter(Boolean)
            ),
          ];
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
  }, [supabase, locale, router]);

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
          <p className="font-black text-slate-400">{t('loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 container max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="grid lg:grid-cols-[320px_1fr] gap-8">

        {/* 좌측 사이드바 — 프로필 요약 카드 (기본 구조 유지) */}
        <aside className="space-y-6">
          <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
            <div className="h-24 bg-gradient-to-br from-mint-deep to-sky" />
            <CardContent className="px-6 pb-8 -mt-12 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden bg-white mx-auto">
                  {user?.avatar_url ? (
                    <Image src={user.avatar_url} alt="Profile" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl font-black text-slate-300">
                      {user?.nickname?.[0]}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <TierBadge level={user?.current_tier || 1} className="shadow-lg border-2 border-white scale-110" />
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-800">{user?.nickname}</h2>
              <p className="text-sm text-slate-400 font-bold mb-6">{user?.email}</p>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">LP Balance</p>
                  <p className="text-xl font-black text-sky transition-all duration-500">{lpBalance.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Experience</p>
                  <p className="text-xl font-black text-sky">{orders.length} <span className="text-[10px]">Courses</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

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
              user={user}
              locale={locale}
              onUpdate={(updated) => setUser((prev: any) => ({ ...prev, ...updated }))}
            />
          </SettingsSection>

          {/* 섹션 2: 결제 & 혜택 */}
          <SettingsSection icon="💳" title={t('settings.payment')}>
            <SubscriptionManage locale={locale} />

            <SettingsRow
              icon="📦"
              label={t('settings.orders')}
              onClick={() => setShowOrders((v) => !v)}
              isOpen={showOrders}
            />
            {showOrders && (
              <div className="px-5 py-4 bg-slate-50/50 space-y-3">
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 py-8 opacity-40">
                    <ShoppingBag className="w-8 h-8" />
                    <p className="text-sm font-bold">{t('noOrders') || '주문 내역이 없습니다.'}</p>
                  </div>
                ) : (
                  orders.map((order: any) => (
                    <div key={order.id} className="p-4 rounded-xl bg-white border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-black text-slate-400">
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
                          <p className="text-xs text-slate-400 font-bold">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm font-black text-slate-800 shrink-0">
                          ₩{order.total_price.toLocaleString()}
                        </p>
                      </div>
                      {orderRegionMap[order.id] && (
                        <ZepMeetingButton
                          courseId={orderRegionMap[order.id]}
                          hasPurchased={true}
                          locale={locale}
                        />
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
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 py-8 opacity-40">
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
                        <p className="text-[11px] font-mono font-bold text-slate-400 tracking-wider truncate">{coupon.code}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold shrink-0">
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
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 py-8 opacity-40">
                    <History className="w-8 h-8" />
                    <p className="text-sm font-bold">{t('noLp') || '적립된 LP 내역이 없습니다.'}</p>
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
                          <p className={`text-sm font-black truncate ${isApplied ? 'text-slate-400' : 'text-slate-800'}`}>
                            {item.description}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold">
                            {new Date(item.created_at).toLocaleDateString()} · {item.type}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-sm font-black ${isApplied ? 'text-slate-400' : isPositive ? 'text-sky' : 'text-rose-500'}`}>
                            {isPositive ? '+' : ''}{item.amount.toLocaleString()}
                            <span className="text-[9px] ml-0.5">LP</span>
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
    </div>
  );
}
