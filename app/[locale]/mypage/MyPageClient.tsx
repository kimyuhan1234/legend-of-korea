'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/features/community/TierBadge';
import { ProfileBadges } from '@/components/features/mypage/ProfileBadges';
import {
  ShoppingBag,
  History,
  Ticket,
  LogOut,
  Settings,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Loader2,
  CheckCircle2,
  Camera,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MissionRegister from '@/components/features/mypage/MissionRegister';
import { ZepMeetingButton } from '@/components/features/quest/ZepMeetingButton';
import { DigitalPassport } from '@/components/features/mypage/DigitalPassport';
import { toast } from '@/components/ui/use-toast';

interface MyPageClientProps {
  locale: string;
}

export function MyPageClient({ locale }: MyPageClientProps) {
  const t = useTranslations('mypage');
  const lpT = useTranslations('lp');
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [lpHistory, setLpHistory] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  // orderId -> course.region 매핑 (ZEP 스페이스 조회용)
  const [orderRegionMap, setOrderRegionMap] = useState<Record<string, string>>({});

  // LP apply states
  const [lpBalance, setLpBalance] = useState<number>(0);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // Profile edit modal states
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

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
          fetch('/api/orders')
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
          // Mark already-applied items
          const applied = new Set<string>(
            (hData.history as any[]).filter((h: any) => h.applied).map((h: any) => h.id)
          );
          setAppliedIds(applied);
        }
        if (cData.success) setCoupons(cData.coupons);
        if (oData.success) {
          setOrders(oData.orders);
          // 각 주문의 course.region 조회 (ZEP 스페이스 매칭용)
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
              (courseRows || []).forEach((c: any) => {
                regionById[c.id] = c.region || '';
              });
              const regionByOrder: Record<string, string> = {};
              (oData.orders as any[]).forEach((o: any) => {
                const cId = o.kit_products?.courses?.id;
                if (cId && regionById[cId]) regionByOrder[o.id] = regionById[cId];
              });
              setOrderRegionMap(regionByOrder);
            } catch {
              // ZEP 매핑 실패해도 주문 탭은 정상 동작
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  };

  // LP Apply handler
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
      setAppliedIds(prev => { const next = new Set(Array.from(prev)); next.add(transactionId); return next; });
    } catch (error) {
      console.error('LP apply failed:', error);
    } finally {
      setApplyingId(null);
    }
  };

  const openEditProfile = () => {
    setEditNickname(user?.nickname || '');
    setEditAvatarPreview(user?.avatar_url || '');
    setEditAvatarFile(null);
    setIsEditProfile(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditAvatarFile(file);
    setEditAvatarPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleSaveProfile = async () => {
    if (isSaving) return;
    if (!editNickname.trim()) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('nickname', editNickname.trim());
      if (editAvatarFile) formData.append('avatar', editAvatarFile);

      const res = await fetch('/api/profile', { method: 'PATCH', body: formData });
      const data = await res.json();

      if (data.success) {
        setUser((prev: any) => ({ ...prev, ...data.user }));
        toast({ title: t('profileSaved') });
        setIsEditProfile(false);
      } else {
        toast({ variant: 'destructive', title: t('profileSaveFail'), description: data.error });
      }
    } catch {
      toast({ variant: 'destructive', title: t('profileSaveFail') });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-mint-deep border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-slate-400">당신의 전설을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 container max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="grid lg:grid-cols-[320px_1fr] gap-8">

        {/* Sidebar Area */}
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

              <div className="mt-8 space-y-2">
                <Button onClick={openEditProfile} variant="outline" className="w-full rounded-2xl font-black border-2 border-slate-100 text-slate-500 hover:bg-slate-50 transition-all gap-2">
                  <Settings className="w-4 h-4" /> {t('editProfile')}
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="w-full rounded-2xl font-black text-rose-400 hover:text-rose-500 hover:bg-rose-50 transition-all gap-2">
                  <LogOut className="w-4 h-4" /> {t('logout')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 프로필 훈장 */}
          {user?.id && <ProfileBadges userId={user.id} />}

          <div className="bg-mint-deep rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl shadow-mint relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
             <ShieldCheck className="w-10 h-10 text-mint-light mb-2" />
             <h3 className="text-xl font-black">레전드 멤버십</h3>
             <p className="text-xs text-mint-light font-bold leading-relaxed opacity-80">더 높은 등급으로 승급하여 전용 할인 혜택과 특별한 굿즈 기회를 잡으세요.</p>
             <Button onClick={() => router.push(`/${locale}/shop`)} className="w-full rounded-xl bg-white text-sky font-black hover:bg-sky-light mt-4 h-11 border-none">
               전설 상점 가기
             </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden flex flex-col">
          <Tabs defaultValue="lp" className="w-full flex flex-col h-full">
            <CardHeader className="p-0 border-b border-slate-100">
              <TabsList className="w-full flex justify-start h-20 bg-transparent px-8 gap-8 overflow-x-auto scrollbar-hide">
                <TabsTrigger value="lp" className="data-[state=active]:text-sky data-[state=active]:after:w-full relative after:absolute after:bottom-0 after:left-0 after:h-1 after:bg-mint-deep after:rounded-full after:transition-all after:duration-300 font-black text-slate-400 py-6 px-0 h-full rounded-none border-none bg-transparent">
                  {lpT('history')}
                </TabsTrigger>
                <TabsTrigger value="coupons" className="data-[state=active]:text-sky data-[state=active]:after:w-full relative after:absolute after:bottom-0 after:left-0 after:h-1 after:bg-mint-deep after:rounded-full after:transition-all after:duration-300 font-black text-slate-400 py-6 px-0 h-full rounded-none border-none bg-transparent">
                  {t('coupons')}
                </TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:text-sky data-[state=active]:after:w-full relative after:absolute after:bottom-0 after:left-0 after:h-1 after:bg-mint-deep after:rounded-full after:transition-all after:duration-300 font-black text-slate-400 py-6 px-0 h-full rounded-none border-none bg-transparent">
                  {t('orders')}
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:text-sky data-[state=active]:after:w-full relative after:absolute after:bottom-0 after:left-0 after:h-1 after:bg-mint-deep after:rounded-full after:transition-all after:duration-300 font-black text-slate-400 py-6 px-0 h-full rounded-none border-none bg-transparent">
                  {t('missionCenter')}
                </TabsTrigger>
                <TabsTrigger value="passport" className="data-[state=active]:text-sky data-[state=active]:after:w-full relative after:absolute after:bottom-0 after:left-0 after:h-1 after:bg-mint-deep after:rounded-full after:transition-all after:duration-300 font-black text-slate-400 py-6 px-0 h-full rounded-none border-none bg-transparent">
                  {t('passportTab')}
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <div className="flex-1 overflow-y-auto p-8 min-h-[500px]">

              {/* LP History Tab */}
              <TabsContent value="lp" className="m-0 space-y-6">
                {lpHistory.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-4 grayscale opacity-30">
                      <History className="w-16 h-16" />
                      <p className="font-black">적립된 LP 내역이 없습니다.</p>
                    </div>
                ) : (
                  lpHistory.map((item: any) => {
                    const isApplied = appliedIds.has(item.id);
                    const isApplying = applyingId === item.id;
                    const isPositive = item.amount > 0;

                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-4 md:gap-6 p-5 md:p-6 rounded-[2rem] border transition-all duration-300 group
                          ${isApplied
                            ? 'bg-slate-50/60 border-slate-100'
                            : 'bg-slate-50 border-slate-100 hover:border-sky hover:shadow-sm'
                          }`}
                      >
                        {/* icon */}
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-md shrink-0 transition-transform group-hover:scale-110
                          ${isApplied
                            ? 'bg-emerald-50 text-emerald-500'
                            : isPositive ? 'bg-sky-light text-sky' : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {isApplied
                            ? <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7" />
                            : isPositive ? <ArrowUpRight className="w-6 h-6 md:w-7 md:h-7" /> : <ArrowDownLeft className="w-6 h-6 md:w-7 md:h-7" />
                          }
                        </div>

                        {/* description */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <h4 className={`font-black tracking-tight truncate ${isApplied ? 'text-slate-400' : 'text-slate-800'}`}>
                            {item.description}
                          </h4>
                          <p className="text-xs text-slate-400 font-bold">
                            {new Date(item.created_at).toLocaleDateString()} • {item.type}
                          </p>
                        </div>

                        {/* amount + apply button */}
                        <div className="flex items-center gap-2 md:gap-3 shrink-0">
                          <div className={`text-lg md:text-xl font-black ${isApplied ? 'text-slate-400' : isPositive ? 'text-sky' : 'text-rose-500'}`}>
                            {isPositive ? '+' : ''}{item.amount.toLocaleString()} <span className="text-[10px]">LP</span>
                          </div>

                          {isPositive && (
                            isApplied ? (
                              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-500 rounded-xl text-xs font-black">
                                <CheckCircle2 className="w-3 h-3" />
                                {t('lpApplied')}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleApplyLP(item.id)}
                                disabled={isApplying}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-mint-deep text-white rounded-xl text-xs font-black
                                           hover:bg-mint-deep/80 active:scale-95 transition-all
                                           disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isApplying ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    {t('lpApplying')}
                                  </>
                                ) : (
                                  <>
                                    <span>→</span>
                                    {t('lpApplyButton')}
                                  </>
                                )}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </TabsContent>

              {/* Coupons Tab */}
              <TabsContent value="coupons" className="m-0 space-y-6">
                 {coupons.length === 0 ? (
                     <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-4 grayscale opacity-30">
                       <Ticket className="w-16 h-16" />
                       <p className="font-black">보유 중인 쿠폰이 없습니다.</p>
                     </div>
                 ) : (
                   coupons.map((coupon: any) => (
                     <div key={coupon.id} className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-sky-light transition-colors overflow-hidden relative">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-sky-light0/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shrink-0 relative z-10">
                         <Ticket className="w-8 h-8 text-sky" />
                       </div>
                       <div className="flex-1 text-center md:text-left space-y-1 relative z-10">
                         <div className="flex items-center justify-center md:justify-start gap-2">
                           <h3 className="text-xl font-black text-slate-800">{coupon.discount_rate}% OFF</h3>
                           <Badge variant="secondary" className={`font-black text-[10px] border-none ${coupon.is_used ? 'bg-slate-200 text-slate-500' : 'bg-sky-light text-sky'}`}>
                             {coupon.is_used ? 'USED' : 'ACTIVE'}
                           </Badge>
                         </div>
                         <p className="text-sm font-black text-slate-400/80 font-mono tracking-[0.2em]">{coupon.code}</p>
                       </div>
                       <div className="flex flex-col items-center md:items-end gap-2 shrink-0 relative z-10">
                         <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                           <Calendar className="w-4 h-4" />
                           Exp: {new Date(coupon.expires_at).toLocaleDateString()}
                         </div>
                         <Button disabled={coupon.is_used} className={`rounded-full font-black px-6 h-10 shadow-lg transition-all ${coupon.is_used ? 'bg-slate-200 text-slate-400' : 'bg-mint-deep hover:scale-105 active:scale-95'}`}>
                           {coupon.is_used ? '사용 완료' : '지금 사용'}
                         </Button>
                       </div>
                     </div>
                   ))
                 )}
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="m-0 space-y-6">
                 {orders.length === 0 ? (
                     <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-4 grayscale opacity-30">
                       <ShoppingBag className="w-16 h-16" />
                       <p className="font-black">주문 내역이 없습니다.</p>
                     </div>
                 ) : (
                   orders.map((order: any) => (
                     <div key={order.id} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-6">
                       <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Order ID</p>
                             <span className="text-sm font-black text-slate-500 font-mono">#{order.id.split('-')[0].toUpperCase()}</span>
                          </div>
                          <Badge className="rounded-xl px-4 py-1.5 bg-sky-light text-sky border-none font-black text-xs">
                            {order.payment_status?.toUpperCase()}
                          </Badge>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center shrink-0">
                             <ShoppingBag className="w-10 h-10 text-slate-300" />
                          </div>
                          <div className="flex-1 space-y-1">
                             <h4 className="text-xl font-black text-slate-800">{order.kit_products?.courses?.title?.[locale] || order.kit_products?.courses?.title?.ko}</h4>
                             <p className="text-sm text-slate-400 font-bold">디지털 퀘스트 패스 • {order.quantity}건</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xl font-black text-slate-800">₩{order.total_price.toLocaleString()}</p>
                             <span className="text-xs text-slate-400 font-bold">{new Date(order.created_at).toLocaleDateString()}</span>
                          </div>
                       </div>
                       <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <Button variant="outline" className="flex-1 rounded-2xl h-12 font-black border-2 border-slate-200 hover:bg-white text-slate-500 transition-all">
                            배송 조회
                          </Button>
                          <Button className="flex-1 rounded-2xl h-12 font-black bg-white text-sky border-2 border-sky-light hover:bg-sky-light transition-all">
                            미션 시작하기
                          </Button>
                       </div>

                       {/* ZEP 가상 모임 — 구매된 코스에 ZEP 스페이스가 있을 때만 표시 */}
                       {orderRegionMap[order.id] && (
                         <div className="pt-2">
                           <ZepMeetingButton
                             courseId={orderRegionMap[order.id]}
                             hasPurchased={true}
                             locale={locale}
                           />
                         </div>
                       )}
                     </div>
                   ))
                 )}
              </TabsContent>

              {/* Mission Center Tab */}
              <TabsContent value="progress" className="m-0 space-y-6">
                {/* 미션 요약 헤더 */}
                <div className="text-center py-6">
                  <div className="text-5xl mb-3">🏛️</div>
                  <h3 className="text-lg font-bold text-[#111]">
                    {t('missionSummary')}
                  </h3>
                  <p className="text-sm text-stone mt-1">
                    {t('missionSummaryDesc')}
                  </p>
                </div>

                {/* 통계 카드 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl p-4 text-center border border-cloud">
                    <div className="text-2xl mb-1">📋</div>
                    <p className="text-xs text-stone">{t('totalMissions')}</p>
                    <p className="text-2xl font-bold text-[#111]">12</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-cloud">
                    <div className="text-2xl mb-1">🏆</div>
                    <p className="text-xs text-stone">{t('completedMissions')}</p>
                    <p className="text-2xl font-bold text-[#111]">2</p>
                  </div>
                  <div className="bg-mint-deep rounded-xl p-4 text-center text-white">
                    <div className="text-2xl mb-1">✅</div>
                    <p className="text-xs text-slate">{t('earnedLP')}</p>
                    <p className="text-2xl font-bold">600</p>
                  </div>
                </div>

                {/* 완료된 미션 등록하기 */}
                <MissionRegister locale={locale} />
              </TabsContent>

              {/* Passport Tab */}
              <TabsContent value="passport" className="m-0">
                {user?.id && <DigitalPassport userId={user.id} locale={locale} />}
              </TabsContent>

            </div>
          </Tabs>
        </section>

      </div>

      {/* ── Profile Edit Modal ── */}
      {isEditProfile && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsEditProfile(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-800">{t('editProfile')}</h2>
              <button
                onClick={() => setIsEditProfile(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide">
                {t('editAvatarLabel')}
              </p>
              <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-[2rem] border-4 border-slate-100 shadow-lg overflow-hidden bg-slate-100">
                  {editAvatarPreview ? (
                    <Image
                      src={editAvatarPreview}
                      alt="avatar preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-300">
                      {editNickname?.[0] || '?'}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-[2rem] bg-black/40 flex items-center justify-center
                                opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-7 h-7 text-white" />
                </div>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-slate-400 mt-2">JPEG / PNG / WebP · 최대 2MB</p>
            </div>

            {/* Nickname */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 mb-2">
                {t('editNicknameLabel')}
              </label>
              <input
                value={editNickname}
                onChange={e => setEditNickname(e.target.value)}
                maxLength={20}
                placeholder="닉네임 입력"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold
                           outline-none focus:border-mint-deep transition-colors"
              />
              <p className="text-right text-xs text-slate-400 mt-1">{editNickname.length}/20</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditProfile(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-black
                           hover:bg-slate-200 transition-colors text-sm"
              >
                {t('cancelButton')}
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving || !editNickname.trim()}
                className="flex-1 py-3 bg-gradient-to-br from-mint to-blossom text-ink rounded-xl font-black
                           hover:bg-[#374151] disabled:opacity-60 disabled:cursor-not-allowed
                           transition-colors text-sm flex items-center justify-center gap-2"
              >
                {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> 저장 중...</> : t('saveButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
