import { Resend } from "resend"

/**
 * P0F-4: 재인증 알림 메일 발송 — Resend.
 *
 * Vercel Cron (/api/cron/reauth-reminders) 가 매일 호출.
 * D+30 / D+45 / D+59 시점에 1 회씩 발송 — 사용자에게 마감 임박 알림.
 *
 * 정식 도메인 구매 전: onboarding@resend.dev 사용 (Resend 무료 발송 도메인).
 * 도메인 구매 후: 환경변수 RESEND_FROM 으로 변경 가능.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = process.env.RESEND_FROM ?? "Clouds with you <onboarding@resend.dev>"

interface SendReauthInput {
  to: string
  nickname: string
  daysLeft: number
  locale: string
}

interface I18nContent {
  subject: string
  greeting: string
  body: string
  warning: string
  cta: string
  signature: string
}

const I18N: Record<string, (daysLeft: number, nickname: string) => I18nContent> = {
  ko: (d, n) => ({
    subject: `[Clouds with you] 생년월일 인증 ${d}일 남음`,
    greeting: `안녕하세요, ${n}님`,
    body: "한국 개인정보보호법 제22조의2 (만 14세 미만 보호) 에 따라 생년월일 인증이 필요합니다.",
    warning: `<strong>${d}일 후 자동 로그아웃</strong>됩니다. 인증 후에는 다시 묻지 않습니다.`,
    cta: "지금 인증하기",
    signature: "감사합니다.<br/>Clouds with you",
  }),
  ja: (d, n) => ({
    subject: `[Clouds with you] 生年月日認証: あと${d}日`,
    greeting: `${n}様`,
    body: "韓国個人情報保護法第22条の2 (14歳未満の保護) に基づき、生年月日の認証が必要です。",
    warning: `<strong>${d}日後に自動ログアウト</strong>されます。認証後は再度お聞きしません。`,
    cta: "今すぐ認証する",
    signature: "ありがとうございます。<br/>Clouds with you",
  }),
  en: (d, n) => ({
    subject: `[Clouds with you] Birth date verification: ${d} days left`,
    greeting: `Hello ${n}`,
    body: "Under Korea's Personal Information Protection Act §22-2 (protection of users under 14), please verify your birth date.",
    warning: `You will be <strong>automatically signed out in ${d} days</strong>. After verification we won't ask again.`,
    cta: "Verify now",
    signature: "Thank you,<br/>Clouds with you",
  }),
  "zh-CN": (d, n) => ({
    subject: `[Clouds with you] 出生日期认证：剩余${d}天`,
    greeting: `${n}您好`,
    body: "依据韩国《个人信息保护法》第22条之2（保护未满14岁儿童），需要验证出生日期。",
    warning: `<strong>${d}天后将自动退出登录</strong>。验证后将不再询问。`,
    cta: "立即验证",
    signature: "谢谢。<br/>Clouds with you",
  }),
  "zh-TW": (d, n) => ({
    subject: `[Clouds with you] 出生日期驗證：剩餘${d}天`,
    greeting: `${n}您好`,
    body: "依據韓國《個人資料保護法》第22條之2（保護未滿14歲兒童），需要驗證出生日期。",
    warning: `<strong>${d}天後將自動登出</strong>。驗證後將不再詢問。`,
    cta: "立即驗證",
    signature: "謝謝。<br/>Clouds with you",
  }),
}

function buildHtml(content: I18nContent, ctaUrl: string): string {
  return `
<!DOCTYPE html>
<html><body style="font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1F2937;">
  <h2 style="font-size: 20px; margin: 0 0 16px;">${content.greeting}</h2>
  <p style="font-size: 15px; line-height: 1.6;">${content.body}</p>
  <p style="font-size: 15px; line-height: 1.6; padding: 12px; background: #FFF7ED; border-left: 3px solid #F59E0B; border-radius: 4px;">
    ⚠️ ${content.warning}
  </p>
  <p style="margin: 24px 0;">
    <a href="${ctaUrl}" style="display: inline-block; padding: 12px 24px; background: #9DD8CE; color: #1F2937; font-weight: 700; text-decoration: none; border-radius: 8px;">
      ${content.cta}
    </a>
  </p>
  <p style="font-size: 13px; color: #6B7280; margin-top: 32px;">${content.signature}</p>
</body></html>
  `.trim()
}

export async function sendReauthReminder({
  to,
  nickname,
  daysLeft,
  locale,
}: SendReauthInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    console.error("[reauth-email] RESEND_API_KEY not configured")
    return { ok: false, error: "missing_api_key" }
  }

  const builder = I18N[locale] ?? I18N.en
  const content = builder(daysLeft, nickname)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://legend-of-korea.vercel.app"
  const ctaUrl = `${baseUrl}/${locale}`

  try {
    const resend = new Resend(RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject: content.subject,
      html: buildHtml(content, ctaUrl),
    })

    if (error) {
      console.error("[reauth-email] Resend error:", error.message)
      return { ok: false, error: error.message }
    }
    return { ok: true, id: data?.id }
  } catch (err) {
    console.error("[reauth-email] threw:", err)
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
