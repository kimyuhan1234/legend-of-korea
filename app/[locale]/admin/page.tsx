"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  CreditCard,
  ArrowUpRight,
  MessageSquare
} from "lucide-react"

interface DashboardData {
  summary: {
    todaySales: number
    monthSales: number
    totalOrders: number
    totalUsers: number
  }
  recentOrders: any[]
  recentPosts: any[]
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Failed to fetch admin stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">데스크탑 데이터를 불러오는 중...</div>
  }

  if (!data) return null

  const stats = [
    {
      title: "오늘 매출",
      value: `₩${data.summary.todaySales.toLocaleString()}`,
      icon: CreditCard,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "이번 달 매출",
      value: `₩${data.summary.monthSales.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "총 주문 수",
      value: data.summary.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: "text-sky",
      bg: "bg-sky-light",
    },
    {
      title: "총 회원 수",
      value: data.summary.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-[#111]">대시보드 홈</h1>
        <p className="text-slate-500 text-sm mt-1">오늘의 서비스 현황을 한눈에 확인하세요.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none">Last 24h</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-black text-[#111] mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-[#111]">최근 주문 내역</CardTitle>
            <Badge variant="outline" className="text-xs">전체보기</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[100px]">주문번호</TableHead>
                  <TableHead>고객명</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">날짜</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.map((order) => (
                  <TableRow key={order.id} className="border-slate-50">
                    <TableCell className="font-medium text-xs text-slate-500 truncate max-w-[100px]">
                      {order.id.split('-')[0]}
                    </TableCell>
                    <TableCell className="font-bold text-[#111]">{order.customer_name}</TableCell>
                    <TableCell>₩{order.total_amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          order.payment_status === 'paid' 
                            ? "bg-emerald-100 text-emerald-700 border-none" 
                            : "bg-slate-100 text-slate-500 border-none"
                        }
                      >
                        {order.payment_status === 'paid' ? '결제완료' : '대기'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-slate-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Community Posts */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-[#111]">방금 올라온 글</CardTitle>
            <MessageSquare className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.recentPosts.map((post) => (
                <div key={post.id} className="flex gap-3 group cursor-pointer">
                  <div className="w-1 aspect-square rounded-full bg-[#F0B8B8] mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                  <div className="min-w-0">
                    <p className="text-sm text-[#111] font-bold truncate group-hover:text-[#F0B8B8] transition-colors">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                        @{post.users?.nickname || 'Unknown'}
                      </span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
