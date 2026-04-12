"use client"

import { useEffect, useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Building2, Phone, User, Hash, Banknote } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminB2BPage() {
  const [b2bOrders, setB2BOrders] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    agency_name: "",
    contact_person: "",
    contact_phone: "",
    course_id: "",
    quantity: 10,
    unit_price: 18000
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [b2bRes, coursesRes] = await Promise.all([
          fetch("/api/admin/b2b"),
          fetch("/api/missions") // using existing missions/courses API
        ])
        const b2bData = await b2bRes.json()
        const coursesData = await coursesRes.json()
        setB2BOrders(b2bData)
        setCourses(coursesData.courses || [])
      } catch (error) {
        console.error("Failed to fetch B2B data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/b2b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        toast({ title: "B2B 주문 생성 완료" })
        const newOrder = await res.json()
        setB2BOrders([newOrder, ...b2bOrders])
        setIsAdding(false)
        setFormData({
          agency_name: "",
          contact_person: "",
          contact_phone: "",
          course_id: "",
          quantity: 10,
          unit_price: 18000
        })
      }
    } catch (error) {
      toast({ title: "오류 발생", variant: "destructive" })
    }
  }

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/b2b", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, status }),
      })
      if (res.ok) {
        toast({ title: "상태 변경 완료" })
        setB2BOrders(b2bOrders.map(o => o.id === orderId ? { ...o, status } : o))
      }
    } catch (error) {
      toast({ title: "오류 발생", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111]">B2B 주문 관리</h1>
          <p className="text-slate-500 text-sm mt-1">여행사 및 숙소 대량 주문을 관리합니다.</p>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#F0F2F5] hover:bg-[#243a63] text-white rounded-xl h-12 font-bold px-6 border-none"
        >
          {isAdding ? "취소" : <><Plus className="w-5 h-5 mr-2" /> 새 B2B 주문</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg font-bold">새 대량 주문 등록</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">여행사/기관명</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    required
                    placeholder="예: (주)전주투어" 
                    className="pl-10 h-12 border-slate-200 rounded-xl"
                    value={formData.agency_name}
                    onChange={(e) => setFormData({ ...formData, agency_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">담당자 성함</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    required
                    placeholder="홍길동 팀장" 
                    className="pl-10 h-12 border-slate-200 rounded-xl"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">연락처</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    required
                    placeholder="010-0000-0000" 
                    className="pl-10 h-12 border-slate-200 rounded-xl"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">코스 선택</label>
                <Select value={formData.course_id} onValueChange={(val) => setFormData({ ...formData, course_id: val })}>
                  <SelectTrigger className="h-12 border-slate-200 rounded-xl">
                    <SelectValue placeholder="코스를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.title.ko}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">수량</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="number"
                    required
                    min={1}
                    className="pl-10 h-12 border-slate-200 rounded-xl"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">공급 단가</label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="number"
                    required
                    min={0}
                    className="pl-10 h-12 border-slate-200 rounded-xl"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-3 pt-2">
                <Button type="submit" className="w-full h-14 bg-[#F0B8B8] hover:bg-[#b88d30] text-[#111] font-black text-lg rounded-2xl shadow-lg shadow-[#F0B8B8]/20 border-none transition-all">
                  주문 등록 완료
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-5 font-bold text-slate-600">기관/여행사</TableHead>
              <TableHead className="font-bold text-slate-600">담당자</TableHead>
              <TableHead className="font-bold text-slate-600">코스명</TableHead>
              <TableHead className="font-bold text-slate-600">수량</TableHead>
              <TableHead className="font-bold text-slate-600">상태</TableHead>
              <TableHead className="text-right font-bold text-slate-600">총 금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400">데이터를 불러오는 중...</TableCell>
              </TableRow>
            ) : b2bOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400">B2B 주문 내역이 없습니다.</TableCell>
              </TableRow>
            ) : b2bOrders.map((order) => (
              <TableRow key={order.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                <TableCell>
                  <p className="font-bold text-[#111]">{order.agency_name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-700">{order.contact_person}</p>
                    <p className="text-slate-400">{order.contact_phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-slate-200 text-slate-600 font-medium">
                    {order.courses?.title?.ko || '연결안됨'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="font-black text-slate-700">{order.quantity} <span className="text-xs font-normal text-slate-400">개</span></p>
                </TableCell>
                <TableCell>
                  <Select 
                    defaultValue={order.status || 'pending'} 
                    onValueChange={(val) => handleStatusChange(order.id, val)}
                  >
                    <SelectTrigger className="w-[110px] h-9 border-slate-200 rounded-lg text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">대기</SelectItem>
                      <SelectItem value="confirmed">확정</SelectItem>
                      <SelectItem value="shipped">발송완료</SelectItem>
                      <SelectItem value="delivered">도착완료</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <p className="font-black text-[#111]">₩{order.total_amount.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">단가: ₩{order.unit_price.toLocaleString()}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
