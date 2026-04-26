import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"
import { isAtLeastMinimumAge } from "@/lib/validation/age"

/**
 * 소셜 로그인 직후 추가 정보 (생년월일) 입력을 처리.
 *
 *  - 14세 이상: public.users.birth_date / birth_date_verified_at 업데이트 후 200
 *  - 14세 미만: service-role 클라이언트로 auth.users 삭제 (cascade) → 403
 *    응답에 redirect 정보 포함 (클라이언트는 /auth/age-restricted 로 이동)
 */
export async function POST(req: NextRequest) {
  const { birth_date } = (await req.json().catch(() => ({}))) as {
    birth_date?: string
  }

  if (!birth_date) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  // 14세 미만 — 즉시 auth.users 삭제 (PIPA §22-2). public.users 는 FK CASCADE 로 함께 삭제.
  if (!isAtLeastMinimumAge(birth_date)) {
    const admin = await createServiceClient()
    await admin.auth.admin.deleteUser(user.id)
    return NextResponse.json(
      { error: "UNDER_14", redirect: "/auth/age-restricted" },
      { status: 403 }
    )
  }

  // 14세 이상 — public.users 업데이트
  const { error: updateError } = await supabase
    .from("users")
    .update({
      birth_date,
      birth_date_verified_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (updateError) {
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
