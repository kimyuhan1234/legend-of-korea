'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from '@/components/features/community/TierBadge';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Ticket, ChevronRight, Coins, History, Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import TierCard from '@/components/features/shop/TierCard';
import { createClient } from '@/lib/supabase/client';

interface Coupon {
  id: string;
  code: string;
  discount_rate: number;
  lp_cost: number;
  expires_at: string;
  is_used: boolean;
}

interface UserData {
  total_lp: number;
  current_tier: number;
}

interface ShopClientProps {
  locale: string;
}

export function ShopClient({ locale }: ShopClientProps) {
  const t = useTranslations('shop');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);
  const [isExchanging, setIsExchanging] = useState<number | null>(null);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      const [userProfile, couponsRes] = await Promise.all([
        authUser ? supabase.from('users').select('total_lp, current_tier').eq('id', authUser.id).single() : Promise.resolve({ data: null }),
        fetch('/api/shop/coupons')
      ]);

      const couponsData = await couponsRes.json();

      if (userProfile.data) setUser(userProfile.data);
      if (couponsData.success) setActiveCoupons(couponsData.coupons);
    } catch (error) {
      console.error('Fetch Shop Data Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, []);

  const handleExchange = async (discountRate: number) => {
    if (isExchanging !== null) return;

    setIsExchanging(discountRate);
    try {
      const res = await fetch('/api/shop/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discountRate }),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: t('exchangeSuccess'), description: `${discountRate}% 할인 쿠폰이 발급되었습니다.` });
        setUser(prev => prev ? { ...prev, total_lp: data.newTotalLp } : null);
        setActiveCoupons(prev => [data.coupon, ...prev]);
      } else {
        toast({ variant: 'destructive', title: '교환 실패', description: data.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: '오류 발생', description: '잠시 후 다시 시도해주세요.' });
    } finally {
      setIsExchanging(null);
    }
  };

  const exchangeItems = [
    { rate: 10, cost: 500, label: 'Standard Ticket', color: 'from-blue-500 to-indigo-600' },
    { rate: 20, cost: 1500, label: 'Premium Ticket', color: 'from-indigo-600 to-purple-700' },
    { rate: 30, cost: 3000, label: 'Legendary Ticket', color: 'from-amber-400 to-orange-600' },
  ];

  return (
    <div className="flex-1 container max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Header Section */}
      <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-50 rounded-full -ml-24 -mb-24 blur-3xl opacity-50" />

        <div className="relative space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{t('title')}</h1>
          <p className="text-slate-400 font-bold text-lg">모은 LP를 할인 혜택으로 교환하세요</p>
        </div>

        <div className="relative flex items-center gap-6 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 shadow-inner">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Coins className="w-10 h-10 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">My Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">{user?.total_lp.toLocaleString() || 0}</span>
              <span className="text-sm font-black text-amber-500">LP</span>
            </div>
            {user && <TierBadge level={user.current_tier} className="mt-2" />}
          </div>
        </div>
      </section>

      {/* Tier Card */}
      {user && (
        <section>
          <TierCard
            currentTierLevel={user.current_tier}
            currentLP={user.total_lp}
            locale={locale}
            onUpgradeSuccess={(newTier, newLP) =>
              setUser(prev => prev ? { ...prev, current_tier: newTier, total_lp: newLP } : null)
            }
          />
        </section>
      )}

      {/* Exchange Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('exchangeCoupon')}</h2>
          <Button variant="ghost" className="rounded-full text-slate-400 font-bold text-xs gap-1">
            <History className="w-4 h-4" /> 내역 보기
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exchangeItems.map((item) => (
            <Card key={item.rate} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem]">
              <CardHeader className={`p-8 bg-gradient-to-br ${item.color} text-white relative h-48 flex flex-col justify-end`}>
                <div className="absolute top-6 right-6 opacity-20 group-hover:scale-110 transition-transform">
                  <Ticket className="w-24 h-24 rotate-12" />
                </div>
                <CardTitle className="text-4xl font-black">{item.rate}% OFF</CardTitle>
                <p className="text-white/80 font-bold">{item.label}</p>
              </CardHeader>
              <CardContent className="p-8 pb-4">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <span className="text-slate-400 font-bold text-sm">필요 LP</span>
                  <span className="text-indigo-600 font-extrabold">{item.cost.toLocaleString()} LP</span>
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-4">
                <Button
                  size="lg"
                  className="w-full h-16 rounded-2xl font-black mt-4 shadow-xl shadow-indigo-100 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  disabled={!user || user.total_lp < item.cost || isExchanging !== null}
                  onClick={() => handleExchange(item.rate)}
                >
                  {isExchanging === item.rate ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : item.cost + ' LP로 교환'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* My Coupons Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('myCoupons')}</h2>

        <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 min-h-[200px] flex flex-col justify-center">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            </div>
          ) : activeCoupons.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="text-5xl opacity-20 grayscale">🎟️</div>
              <p className="text-slate-400 font-bold">{t('myCouponEmpty')}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeCoupons.map((coupon) => (
                <div key={coupon.id} className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
                    <Ticket className="w-8 h-8 text-indigo-500" />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-1">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <h3 className="text-xl font-black text-slate-800">{coupon.discount_rate}% {t('discountRate').replace('{rate}% ', '')}</h3>
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-none font-black text-[10px]">{coupon.is_used ? 'USED' : 'ACTIVE'}</Badge>
                    </div>
                    <p className="text-slate-400 font-bold font-mono tracking-wider">{coupon.code}</p>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                      <Calendar className="w-4 h-4" />
                      Expires: {new Date(coupon.expires_at).toLocaleDateString()}
                    </div>
                    <Button variant="outline" className="rounded-full border-2 border-slate-200 font-extrabold h-9 px-6 hover:bg-white transition-all">
                      사용 하기 <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Notice */}
      <section className="grid md:grid-cols-2 gap-8 py-8">
        <div className="bg-amber-50 rounded-[2.5rem] p-8 space-y-4 border border-amber-100">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>
          <h3 className="text-xl font-black text-amber-900">티어 승급 혜택</h3>
          <p className="text-sm text-amber-800/70 font-bold leading-relaxed">전설 등급이 올라갈 때마다 특별한 할인 쿠폰이 자동으로 발급됩니다. 더 많은 모험을 떠나고 전설의 영웅이 되어보세요!</p>
        </div>
        <div className="bg-indigo-50 rounded-[2.5rem] p-8 space-y-4 border border-indigo-100">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-6 h-6 text-indigo-500" />
          </div>
          <h3 className="text-xl font-black text-indigo-900">쿠폰 사용 방법</h3>
          <p className="text-sm text-indigo-800/70 font-bold leading-relaxed">발급받은 쿠폰은 미션 키트 구매 단계에서 적용할 수 있습니다. 한 번에 하나의 쿠폰만 사용 가능하며 유효기간은 90일입니다.</p>
        </div>
      </section>
    </div>
  );
}
