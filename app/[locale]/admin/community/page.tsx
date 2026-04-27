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
import { Button } from "@/components/ui/button"
import { 
  Eye, 
  EyeOff, 
  MessageSquare, 
  ThumbsUp, 
  Calendar,
  User as UserIcon,
  ShieldAlert
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/community")
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch community posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleToggleHide = async (postId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/community", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, is_hidden: !currentStatus }),
      })
      if (res.ok) {
        toast({ 
          title: !currentStatus ? "게시물 숨김 완료" : "게시물 공개 완료",
          description: !currentStatus ? "사용자들에게 더 이상 보이지 않습니다." : "게시판에 다시 노출됩니다."
        })
        setPosts(posts.map(p => p.id === postId ? { ...p, is_hidden: !currentStatus } : p))
      }
    } catch (error) {
      toast({ title: "오류 발생", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#111]">커뮤니티 관리</h1>
        <p className="text-slate-500 text-sm mt-1">모험가들의 기록을 모니터링하고 관리합니다.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="py-5 font-bold text-slate-600">작성자</TableHead>
              <TableHead className="font-bold text-slate-600">내용</TableHead>
              <TableHead className="font-bold text-slate-600">코스</TableHead>
              <TableHead className="font-bold text-slate-600">반응</TableHead>
              <TableHead className="font-bold text-slate-600">상태</TableHead>
              <TableHead className="text-right font-bold text-slate-600">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">데이터를 불러오는 중...</TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">게시물이 없습니다.</TableCell>
              </TableRow>
            ) : posts.map((post) => (
              <TableRow key={post.id} className={`border-slate-50 transition-colors ${post.is_hidden ? 'bg-slate-50/50 grayscale-[0.5]' : 'hover:bg-slate-50/30'}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-[#111] text-xs">@{post.users?.nickname || 'Unknown'}</p>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-slate-200 text-slate-500">
                        Lv.{post.users?.current_level || 1}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px] py-2">
                    <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed font-medium">
                      {post.content}
                    </p>
                    {post.photos && post.photos.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-500 py-0 px-1 border-none">
                          📸 {post.photos.length} photos
                        </Badge>
                        {post.is_spoiler && (
                          <Badge className="text-[10px] bg-red-50 text-red-500 py-0 px-1 border-none font-bold">
                            SPOILER
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 w-fit">
                    {post.courses?.title?.ko || 'General'}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 text-slate-500">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{post.likes_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[11px]">{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {post.is_hidden ? (
                    <Badge className="bg-red-100 text-red-700 border-none font-bold px-2 py-0.5">숨김 처리됨</Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold px-2 py-0.5">공개 중</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`h-9 px-3 rounded-xl font-bold transition-all ${
                      post.is_hidden 
                        ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50' 
                        : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                    }`}
                    onClick={() => handleToggleHide(post.id, post.is_hidden)}
                  >
                    {post.is_hidden ? (
                      <><Eye className="w-4 h-4 mr-2" /> 공개 전환</>
                    ) : (
                      <><EyeOff className="w-4 h-4 mr-2" /> 숨기기</>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
