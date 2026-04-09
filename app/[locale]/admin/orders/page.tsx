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
import { Search, Save, Truck, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const { toast } = useToast()

  const fetchOrders = async (query = "") => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/orders?search=${query}`)
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, shipping_status: status }),
      })
      if (res.ok) {
        toast({ title: "상태 변경 완료", description: `주문 상태가 ${status}로 변경되었습니다.` })
        setOrders(orders.map(o => o.id === orderId ? { ...o, shipping_status: status } : o))
      }
    } catch (error) {
      toast({ title: "오류 발생", description: "상태 변경 중 오류가 발생했습니다.", variant: "destructive" })
    }
  }

  const handleTrackingSave = async (orderId: string, trackingNum: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, tracking_number: trackingNum }),
      })
      if (res.ok) {
        toast({ title: "운송장 저장 완료", description: "운송장 번호가 업데이트되었습니다." })
      }
    } catch (error) {
      toast({ title: "오류 발생", description: "저장 중 오류가 발생했습니다.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111]">주문 관리</h1>
          <p className="text-slate-500 text-sm mt-1">키트 배송 상태와 운송장을 관리합니다.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="주문번호 또는 고객명 검색" 
            className="pl-10 h-11 bg-white border-slate-200 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders(search)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-5 font-bold text-slate-600">주문정보</TableHead>
              <TableHead className="font-bold text-slate-600">고객</TableHead>
              <TableHead className="font-bold text-slate-600">결제상태</TableHead>
              <TableHead className="font-bold text-slate-600">배송상태</TableHead>
              <TableHead className="font-bold text-slate-600">운송장 번호</TableHead>
              <TableHead className="text-right font-bold text-slate-600">금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400">데이터를 불러오는 중...</TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400">주문 내역이 없습니다.</TableCell>
              </TableRow>
            ) : orders.map((order) => (
              <TableRow key={order.id} className="border-slate-50 group hover:bg-slate-50/30 transition-colors">
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] text-slate-400 uppercase">{order.id.split('-')[0]}</p>
                    <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-bold text-[#111]">{order.customer_name}</p>
                    <p className="text-[10px] text-slate-400">{order.customer_phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      order.payment_status === 'paid' 
                        ? "bg-emerald-100 text-emerald-700 border-none" 
                        : "bg-amber-100 text-amber-700 border-none"
                    }
                  >
                    {order.payment_status === 'paid' ? '결제완료' : '대기'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select 
                    defaultValue={order.shipping_status || 'preparing'} 
                    onValueChange={(val) => handleStatusChange(order.id, val)}
                  >
                    <SelectTrigger className="w-[120px] h-9 border-slate-200 rounded-lg text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preparing">준비 중</SelectItem>
                      <SelectItem value="shipped">배송 중</SelectItem>
                      <SelectItem value="delivered">배송 완료</SelectItem>
                      <SelectItem value="refunded">환불 완료</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 max-w-[200px]">
                    <div className="relative flex-1">
                      <Truck className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <Input 
                        defaultValue={order.tracking_number || ""} 
                        placeholder="운송장 입력"
                        className="h-9 pl-8 text-xs border-slate-200 rounded-lg focus-visible:ring-[#D4A843]"
                        onBlur={(e) => handleTrackingSave(order.id, e.target.value)}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <p className="font-black text-[#111]">₩{order.total_amount.toLocaleString()}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
