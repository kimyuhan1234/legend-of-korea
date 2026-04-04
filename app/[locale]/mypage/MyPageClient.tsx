'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/features/community/TierBadge';
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
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MissionRegister from '@/components/features/mypage/MissionRegister';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push(`/${locale}/auth/login`);
          return;
        }

        const [userRes, historyRes, couponsRes, ordersRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/lp/history'),
          fetch('/api/shop/coupons'),
          fetch('/api/orders')
        ]);

        const uData = await userRes.json();
        const hData = await historyRes.json();
        const cData = await couponsRes.json();
        const oData = await ordersRes.json();

        if (uData.success) setUser(uData.user);
        if (hData.success) setLpHistory(hData.history);
        if (cData.success) setCoupons(cData.coupons);
        if (oData.success) setOrders(oData.orders);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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
            <div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-600" />
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
                  <p className="text-xl font-black text-indigo-600">{user?.total_lp?.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Experience</p>
                  <p className="text-xl font-black text-indigo-600">{orders.length} <span className="text-[10px]">Courses</span></p>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <Button variant="outline" className="w-full rounded-2xl font-black border-2 border-slate-100 text-slate-500 hover:bg-slate-50 transition-all gap-2">
                  <Settings className="w-4 h-4" /> {t('editProfile')}
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="w-full rounded-2xl font-black text-rose-400 hover:text-rose-500 hover:bg-rose-50 transition-all gap-2">
                  <LogOut className="w-4 h-4" /> {t('logout')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl shadow-indigo-200 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
             <ShieldCheck className="w-10 h-10 text-indigo-200 mb-2" />
             <h3 className="text-xl font-black">레전드 멤버십</h3>
             <p className="text-xs text-indigo-100 font-bold leading-relaxed opacity-80">더 높은 등급으로 승급하여 전용 할인 혜택과 특별한 굿즈 기회를 잡으세요.</p>
             <Button className="w-full rounded-xl bg-white text-indigo-600 font-black hover:bg-indigo-50 mt-4 h-11 border-none">
               전설 상점 가기
             </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden flex flex-col">
          <Tabs defaultValue="lp" className="w-full flex flex-col h-full">
            <CardHeader className="p-0 border-b border-slate-100">
              <TabsList className="w-full flex justify-start h-20 bg-transparent px-8 gap-8 overflow-x-auto scrollbar-hide">
                <TabsTrigger value="lp" className="data-[state=active]:text-indigo-600 data-[state=active]:after:w-full relative after:absolute after:bottom-0 after:left-0 after:h-1 after:bg-indigo-600 after:rounded-full after:transition-all after:duration-300 font-black text-slate-400 py-6 px-0 h-full rounded-none border-none bg-transparent">
                  {lpT('history')}
                </TabsTrigger>
                <TabsTrigger value="coupons" className="data-[state=active]:text-indigo-600 data-[state=active]:after:w-full relative after:absolute after:bottom-0 after:left-0 after:h-1 after:bg-indigo-600 after:rounded-full after:transition-all after:duration-300 font-black text-slate-400 py-6 px-0 h-full rounded-none border-none bg-transparent">
                  {t('coupons')}
                </TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:text-indigo-600 data-[state=active]:after:w-full relative after:absolute after:bottom-0 after:left-0 after:h-1 after:bg-indigo-600 after:rounded-full after:transition-all after:duration-300 font-black text-slate-400 py-6 px-0 h-full rounded-none border-none bg-transparent">
                  {t('orders')}
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:text-indigo-600 data-[state=active]:after:w-full relative after:absolute after:bottom-0 after:left-0 after:h-1 after:bg-indigo-600 after:rounded-full after:transition-all after:duration-300 font-black text-slate-400 py-6 px-0 h-full rounded-none border-none bg-transparent">
                  {t('missionCenter')}
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
                  lpHistory.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors group">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md shrink-0 transition-transform group-hover:scale-110 ${item.amount > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                        {item.amount > 0 ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownLeft className="w-7 h-7" />}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <h4 className="font-black text-slate-800 tracking-tight">{item.description}</h4>
                        <p className="text-xs text-slate-400 font-bold">{new Date(item.created_at).toLocaleDateString()} • {item.type}</p>
                      </div>
                      <div className={`text-xl font-black ${item.amount > 0 ? 'text-indigo-600' : 'text-rose-500'}`}>
                        {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()} <span className="text-[10px]">LP</span>
                      </div>
                    </div>
                  ))
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
                     <div key={coupon.id} className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-indigo-100 transition-colors overflow-hidden relative">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shrink-0 relative z-10">
                         <Ticket className="w-8 h-8 text-indigo-500" />
                       </div>
                       <div className="flex-1 text-center md:text-left space-y-1 relative z-10">
                         <div className="flex items-center justify-center md:justify-start gap-2">
                           <h3 className="text-xl font-black text-slate-800">{coupon.discount_rate}% OFF</h3>
                           <Badge variant="secondary" className={`font-black text-[10px] border-none ${coupon.is_used ? 'bg-slate-200 text-slate-500' : 'bg-indigo-100 text-indigo-700'}`}>
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
                         <Button disabled={coupon.is_used} className={`rounded-full font-black px-6 h-10 shadow-lg transition-all ${coupon.is_used ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 hover:scale-105 active:scale-95'}`}>
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
                          <Badge className="rounded-xl px-4 py-1.5 bg-indigo-100 text-indigo-700 border-none font-black text-xs">
                            {order.payment_status?.toUpperCase()}
                          </Badge>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center shrink-0">
                             <ShoppingBag className="w-10 h-10 text-slate-300" />
                          </div>
                          <div className="flex-1 space-y-1">
                             <h4 className="text-xl font-black text-slate-800">{order.kit_products?.courses?.title?.[locale] || order.kit_products?.courses?.title?.ko}</h4>
                             <p className="text-sm text-slate-400 font-bold">{order.kit_products?.option_type === 'solo' ? '1인 미션 키트' : '2인 미션 키트'} • {order.quantity}개</p>
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
                          <Button className="flex-1 rounded-2xl h-12 font-black bg-white text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50 transition-all">
                            미션 시작하기
                          </Button>
                       </div>
                     </div>
                   ))
                 )}
              </TabsContent>

              {/* Mission Center Tab */}
              <TabsContent value="progress" className="m-0 space-y-6">
                {/* 미션 요약 헤더 */}
                <div className="text-center py-6">
                  <div className="text-5xl mb-3">🏛️</div>
                  <h3 className="text-lg font-bold text-[#2D1B69]">
                    {t('missionSummary')}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('missionSummaryDesc')}
                  </p>
                </div>

                {/* 통계 카드 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                    <div className="text-2xl mb-1">📋</div>
                    <p className="text-xs text-gray-500">{t('totalMissions')}</p>
                    <p className="text-2xl font-bold text-[#2D1B69]">12</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                    <div className="text-2xl mb-1">🏆</div>
                    <p className="text-xs text-gray-500">{t('completedMissions')}</p>
                    <p className="text-2xl font-bold text-[#2D1B69]">2</p>
                  </div>
                  <div className="bg-[#2D1B69] rounded-xl p-4 text-center text-white">
                    <div className="text-2xl mb-1">✅</div>
                    <p className="text-xs text-white/70">{t('earnedLP')}</p>
                    <p className="text-2xl font-bold">600</p>
                  </div>
                </div>

                {/* 완료된 미션 등록하기 */}
                <MissionRegister locale={locale} />
              </TabsContent>

            </div>
          </Tabs>
        </section>

      </div>
    </div>
  );
}
