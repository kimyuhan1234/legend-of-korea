"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isPasswordValid } from "@/lib/auth/password-rules"
import { isAtLeastMinimumAge } from "@/lib/validation/age"

// ──────────────────────────────────────────
// 이메일 로그인
// ──────────────────────────────────────────
export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const locale = (formData.get("locale") as string) || "ko"
  const next = (formData.get("next") as string) || ""

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  // next가 있으면 해당 경로로, 없으면 홈으로
  const destination = next && next.startsWith("/") ? next : `/${locale}`
  redirect(destination)
}

// ──────────────────────────────────────────
// 이메일 회원가입
// ──────────────────────────────────────────
export async function signupWithEmail(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const nickname = formData.get("nickname") as string
  const birthDate = formData.get("birth_date") as string
  const language = (formData.get("language") as string) || "ko"
  const locale = (formData.get("locale") as string) || "ko"

  if (!email || !password || !nickname || !birthDate) {
    return { error: "MISSING_FIELDS" as const }
  }
  if (nickname.length > 20) {
    return { error: "NICKNAME_TOO_LONG" as const }
  }
  if (!isPasswordValid(password)) {
    return { error: "PASSWORD_RULES" as const }
  }
  // 만 14세 검증 (PIPA §22-2): supabase.auth.signUp() 호출 전에 차단해
  // auth.users 자체가 생성되지 않게 한다.
  if (!isAtLeastMinimumAge(birthDate)) {
    return { error: "UNDER_14" as const }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // birth_date 는 raw_user_meta_data 로 전달 → 040 트리거가 public.users INSERT 시 함께 저장
      data: { nickname, language, birth_date: birthDate },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "EMAIL_TAKEN" as const }
    }
    return { error: error.message }
  }

  // 이메일 확인 불필요한 경우 바로 로그인 시도.
  // (성공해도 redirect 하지 않고 코드만 반환 — 클라이언트가 토스트 노출 후 라우팅)
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
  if (!loginError) {
    return { success: "SIGNED_IN" as const }
  }

  return { success: "EMAIL_CONFIRM_REQUIRED" as const }
}

// ──────────────────────────────────────────
// 소셜 로그인 (카카오 / 구글 / LINE)
// ──────────────────────────────────────────
export async function loginWithSocial(provider: "kakao" | "google" | "line", locale: string) {
  const supabase = await createClient()

  // LINE은 Supabase가 지원하지만 타입 정의가 버전마다 다를 수 있어 캐스팅
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`,
      // 카카오 scope 강제 명시 — Supabase 가 OIDC default 로 openid+email 을
      // 자동 추가해 비즈 앱 미인증 (account_email 권한 없음) 상태에서
      // KOE205 "설정하지 않은 동의항목" 에러 발생.
      //   - scopes: SDK 옵션 명시
      //   - queryParams.scope: OAuth URL ?scope= 파라미터 강제 override
      //     (둘 다 넣어야 Supabase 내부 default 가 우회됨)
      //   - profile_image 는 카카오 콘솔에서 "선택 동의" 활성화 필요.
      //   - email 은 받지 않음 → Supabase fake email 자동 발급
      //     ('Allow users without an email' 토글 ON 전제).
      scopes: provider === "kakao"
        ? "profile_nickname profile_image"
        : undefined,
      queryParams: provider === "kakao"
        ? {
            prompt: "select_account",
            scope: "profile_nickname profile_image",
          }
        : undefined,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

// ──────────────────────────────────────────
// 로그아웃
// ──────────────────────────────────────────
export async function logout(locale: string = "ko") {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect(`/${locale}`)
}

// ──────────────────────────────────────────
// 현재 유저 프로필 조회
// ──────────────────────────────────────────
export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
}
