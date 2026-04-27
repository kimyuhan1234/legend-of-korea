import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"
import { sendReauthReminder } from "@/lib/email/send-reauth-email"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * P0F-4: 재인증 알림 cron — 매일 자정 UTC 실행 (한국 09:00).
 *
 * 발송 정책:
 *   - 대상: birth_date IS NULL + birth_date_deadline 보유 사용자
 *   - 시점 (deadline 기준): D-30, D-15, D-1
 *     · D-30 (30일 남음) — 첫 알림
 *     · D-15 (15일 남음) — 중간 경고
 *     · D-1  (1일 남음)  — 마지막 경고
 *   - 각 사용자가 동일 시점 메일을 여러 번 받지 않도록 ±12 시간 윈도우
 *
 * 보안:
 *   - Vercel Cron 은 Authorization: Bearer ${CRON_SECRET} 자동 헤더 전송
 *   - 미인증 요청 거부
 */

const TARGET_OFFSETS_DAYS = [30, 15, 1] as const
const WINDOW_HOURS = 12 // ±12h

export async function GET(req: NextRequest) {
  // Vercel Cron 인증
  const authHeader = req.headers.get("authorization")
  const expectedToken = process.env.CRON_SECRET
  if (!expectedToken) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 })
  }
  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const supabase = await createServiceClient()
  const now = Date.now()
  const sent: { userId: string; daysLeft: number; ok: boolean }[] = []

  for (const offsetDays of TARGET_OFFSETS_DAYS) {
    // 해당 offset 의 deadline 윈도우 (now + offset ± 12h)
    const targetMs = now + offsetDays * 24 * 60 * 60 * 1000
    const lowerMs = targetMs - WINDOW_HOURS * 60 * 60 * 1000
    const upperMs = targetMs + WINDOW_HOURS * 60 * 60 * 1000

    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, nickname, language, birth_date_deadline")
      .is("birth_date", null)
      .gte("birth_date_deadline", new Date(lowerMs).toISOString())
      .lt("birth_date_deadline", new Date(upperMs).toISOString())

    if (error) {
      console.error(`[cron-reauth] query error (offset ${offsetDays}d):`, error.message)
      continue
    }
    if (!users || users.length === 0) continue

    for (const u of users) {
      if (!u.email) continue
      const result = await sendReauthReminder({
        to: u.email,
        nickname: u.nickname ?? "User",
        daysLeft: offsetDays,
        locale: u.language ?? "ko",
      })
      sent.push({ userId: u.id, daysLeft: offsetDays, ok: result.ok })
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    totalSent: sent.length,
    successCount: sent.filter((s) => s.ok).length,
    breakdown: sent,
  })
}
