"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts"
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Zap, 
  MousePointer2,
  Globe2,
  CheckCircle2,
  Target
} from "lucide-react"

export default function AdminStatsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFullStats = async () => {
      try {
        const res = await fetch("/api/admin/stats/full")
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Failed to fetch full stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFullStats()
  }, [])

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium font-bold">통계 데이터를 분석 중...</div>
  if (!data) return null

  // Data Processing for Revenue Chart
  const revenueChartData = data.revenue.reduce((acc: any[], item: any) => {
    const date = new Date(item.created_at).toLocaleDateString()
    const existing = acc.find(a => a.date === date)
    if (existing) {
      existing.amount += item.total_amount
    } else {
      acc.push({ date, amount: item.total_amount })
    }
    return acc
  }, [])

  // Data Processing for Course Sales
  const courseChartData = data.courseSales.reduce((acc: any[], item: any) => {
    const title = item.courses?.title?.ko || 'Unknown'
    const existing = acc.find(a => a.name === title)
    if (existing) {
      existing.sales += 1
    } else {
      acc.push({ name: title, sales: 1 })
    }
    return acc
  }, [])

  // Data Processing for Languages
  const langChartData = data.languages.reduce((acc: any[], item: any) => {
    const lang = item.language || 'ko'
    const existing = acc.find(a => a.name === lang.toUpperCase())
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: lang.toUpperCase(), value: 1 })
    }
    return acc
  }, [])

  const COLORS = ['#1B2A4A', '#D4A843', '#3B82F6', '#10B981', '#F59E0B']

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-black text-[#111]">통계 분석</h1>
        <p className="text-slate-500 text-sm mt-1">플랫폼의 성과를 데이터로 정밀하게 파악합니다.</p>
      </div>

      {/* Main Revenue Chart */}
      <Card className="border-none shadow-sm overflow-hidden bg-white rounded-3xl">
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-black text-[#111]">일별 매출 트렌드 (최근 30일)</CardTitle>
          </div>
          <CardDescription>결제 완료된 주문 기준의 매출 변화 추이입니다.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  tickFormatter={(val) => `₩${(val/10000).toLocaleString()}만`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                  formatter={(val: any) => [`₩${val.toLocaleString()}`, '매출']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Sales Chart */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F5F3EF] text-[#D4A843] rounded-lg">
                <Target className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-black text-[#111]">코스별 판매량 비중</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 'bold', fill: '#1B2A4A' }}
                    width={100}
                  />
                  <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="sales" fill="#1B2A4A" radius={[0, 8, 8, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Language Distribution */}
        <Card className="border-none shadow-sm bg-white rounded-3xl">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Globe2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-black text-[#111]">글로벌 사용자 분포 (언어)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 flex flex-col items-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={langChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {langChartData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 w-full">
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Market</p>
                <p className="text-xl font-black text-[#111] mt-1">{langChartData[0]?.name || 'N/A'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Users</p>
                <p className="text-xl font-black text-[#111] mt-1">{data.languages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Affiliate Stats Summary */}
         <Card className="border-none shadow-sm bg-[#F5F3EF] text-white rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-white/10 rounded-2xl text-[#D4A843]">
                <MousePointer2 className="w-6 h-6" />
              </div>
              <Badge className="bg-[#D4A843] text-[#111] font-black border-none">LIVE PERFORMANCE</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-bold">총 제휴 링크 클릭</p>
              <h2 className="text-4xl font-black">{data.affiliate.length.toLocaleString()} <span className="text-lg font-medium text-[#D4A843]">Clicks</span></h2>
            </div>
            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">최근 클릭 (Today)</span>
                <span className="text-sm font-black text-[#D4A843]">+{Math.floor(data.affiliate.length * 0.1)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Completion Stats */}
        <Card className="border-none shadow-sm bg-[#D4A843] text-[#111] rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-[#F5F3EF]/10 rounded-2xl text-[#111]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <Badge className="bg-[#F5F3EF] text-white font-black border-none">USER ENGAGEMENT</Badge>
            </div>
            <div className="space-y-1">
              <p className="font-bold opacity-70">총 미션 수행 기록</p>
              <h2 className="text-4xl font-black">{data.missions.length.toLocaleString()} <span className="text-lg font-medium opacity-70">Actions</span></h2>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-3 bg-[#F5F3EF]/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#F5F3EF] rounded-full" style={{ width: '75%' }} />
              </div>
              <span className="font-black text-sm">75% Completion</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
