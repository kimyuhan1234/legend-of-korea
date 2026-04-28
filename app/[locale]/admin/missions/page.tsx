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
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit2, Save, X, QrCode } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminMissionsPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/api/admin/courses")
      const data = await res.json()
      setCourses(data.courses || [])
      if (data.courses?.length > 0) {
        setSelectedCourseId(data.courses[0].id)
      }
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    if (!selectedCourseId) return
    const fetchMissions = async () => {
      setLoading(true)
      const res = await fetch(`/api/admin/missions?courseId=${selectedCourseId}`)
      const data = await res.json()
      setMissions(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchMissions()
  }, [selectedCourseId])

  const handleEdit = (mission: any) => {
    setEditingId(mission.id)
    setEditForm({ ...mission })
  }

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/missions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mission_id: editingId,
          title: editForm.title,
          description: editForm.description,
          hint_1: editForm.hint_1,
          hint_2: editForm.hint_2,
          hint_3: editForm.hint_3,
        }),
      })
      if (res.ok) {
        toast({ title: "미션 수정 완료" })
        setMissions(missions.map(m => m.id === editingId ? { ...m, ...editForm } : m))
        setEditingId(null)
      }
    } catch {
      toast({ title: "오류 발생", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111]">미션 관리</h1>
          <p className="text-slate-500 text-sm mt-1">코스별 미션 내용과 힌트를 수정합니다.</p>
        </div>
        
        <div className="w-full sm:w-64">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="h-12 border-slate-200 rounded-xl bg-white font-bold text-[#111]">
              <SelectValue placeholder="코스 선택" />
            </SelectTrigger>
            <SelectContent>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>{course.title.ko}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-16 text-center font-bold">순서</TableHead>
              <TableHead className="font-bold">미션 정보</TableHead>
              <TableHead className="font-bold">유형</TableHead>
              <TableHead className="font-bold">QR 코드</TableHead>
              <TableHead className="font-bold">보상</TableHead>
              <TableHead className="text-right font-bold w-24">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-medium">로딩 중...</TableCell>
              </TableRow>
            ) : missions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-medium font-bold">등록된 미션이 없습니다.</TableCell>
              </TableRow>
            ) : missions.map((m) => (
              <TableRow key={m.id} className="border-slate-50 group hover:bg-slate-50/20 transition-colors">
                <TableCell className="text-center font-black text-slate-500">#{m.sequence}</TableCell>
                <TableCell className="py-5">
                  <div className="max-w-md space-y-1">
                    <p className="font-bold text-[#111]">{m.title.ko}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{m.description.ko}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="bg-gradient-to-br from-mint to-blossom text-ink border-none py-0.5 px-2 text-[10px] font-bold">
                      {m.type.toUpperCase()}
                    </Badge>
                    {m.is_hidden && <Badge className="bg-peach text-slate border-none py-0.5 px-2 text-[10px] font-bold">HIDDEN</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                    <QrCode className="w-3.5 h-3.5" />
                    {m.qr_code}
                  </div>
                </TableCell>
                <TableCell className="font-black text-blossom-deep">{m.lp_reward} 빗방울</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg text-slate-500 hover:text-[#111] hover:bg-slate-100"
                    onClick={() => handleEdit(m)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden border-none shadow-2xl animate-in fade-in zoom-in duration-300">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
              <CardTitle className="text-xl font-black text-[#111]">미션 내용 수정</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">상태 정보</label>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-slate-200 text-slate-500">#{editForm.sequence}</Badge>
                    <Badge className="bg-gradient-to-br from-mint to-blossom text-ink border-none">{editForm.type.toUpperCase()}</Badge>
                    <Badge variant="outline" className="border-slate-200 text-slate-500 font-mono">{editForm.qr_code}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">미션 제목 (한국어)</label>
                  <Input 
                    value={editForm.title.ko}
                    onChange={(e) => setEditForm({...editForm, title: { ...editForm.title, ko: e.target.value }})}
                    className="h-12 border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">미션 설명 (한국어)</label>
                  <Textarea 
                    value={editForm.description.ko}
                    onChange={(e) => setEditForm({...editForm, description: { ...editForm.description, ko: e.target.value }})}
                    className="min-h-[100px] border-slate-200 rounded-xl py-3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">힌트 1단계</label>
                    <Input 
                      value={editForm.hint_1?.ko || ""}
                      onChange={(e) => setEditForm({...editForm, hint_1: { ...editForm.hint_1, ko: e.target.value }})}
                      className="text-xs border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">힌트 2단계</label>
                    <Input 
                      value={editForm.hint_2?.ko || ""}
                      onChange={(e) => setEditForm({...editForm, hint_2: { ...editForm.hint_2, ko: e.target.value }})}
                      className="text-xs border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">힌트 3단계</label>
                    <Input 
                      value={editForm.hint_3?.ko || ""}
                      onChange={(e) => setEditForm({...editForm, hint_3: { ...editForm.hint_3, ko: e.target.value }})}
                      className="text-xs border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => setEditingId(null)} 
                  variant="outline" 
                  className="flex-1 h-14 rounded-2xl border-slate-200 font-bold"
                >
                  취소
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-mint to-blossom text-ink font-black text-lg border-none hover:bg-[#374151] shadow-lg shadow-[#1F2937]/20 transition-all"
                >
                  <Save className="w-5 h-5 mr-2" /> 저장 완료
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
