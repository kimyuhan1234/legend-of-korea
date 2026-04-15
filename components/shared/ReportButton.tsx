'use client'

import { useState } from 'react'

interface ReportButtonProps {
  eventType: 'quest_party' | 'gyeongdo'
  eventId: string
  reportedId: string
  reportedName: string
  locale?: string
}

const REASONS = {
  ko: [
    { value: 'no_show', label: '노쇼 (무단 불참)' },
    { value: 'harassment', label: '언어 폭력 / 괴롭힘' },
    { value: 'fraud', label: '사기 / 기만 행위' },
    { value: 'violence', label: '신체적 위협 / 폭력' },
    { value: 'inappropriate', label: '부적절한 행동' },
    { value: 'other', label: '기타' },
  ],
  ja: [
    { value: 'no_show', label: 'ノーショー（無断欠席）' },
    { value: 'harassment', label: '言葉の暴力 / ハラスメント' },
    { value: 'fraud', label: '詐欺 / 欺瞞行為' },
    { value: 'violence', label: '暴力的な脅し / 暴力' },
    { value: 'inappropriate', label: '不適切な行動' },
    { value: 'other', label: 'その他' },
  ],
  en: [
    { value: 'no_show', label: 'No-show (absent without notice)' },
    { value: 'harassment', label: 'Verbal abuse / harassment' },
    { value: 'fraud', label: 'Fraud / deceptive behavior' },
    { value: 'violence', label: 'Physical threats / violence' },
    { value: 'inappropriate', label: 'Inappropriate behavior' },
    { value: 'other', label: 'Other' },
  ],
}

const LABEL = {
  ko: {
    trigger: '신고',
    title: '신고하기',
    subtitle: (name: string) => `${name}님을 신고합니다`,
    selectReason: '신고 사유 선택',
    detailPlaceholder: '상세 내용 (선택, 최대 500자)',
    submit: '신고 접수',
    submitting: '처리 중...',
    cancel: '취소',
    successMsg: '신고가 접수되었습니다. 검토 후 조치하겠습니다.',
    errorDuplicate: '이미 해당 참여자를 신고하셨습니다.',
    errorGeneric: '오류가 발생했습니다. 다시 시도해주세요.',
    notice: '허위 신고는 이용에 불이익이 있을 수 있습니다.',
  },
  ja: {
    trigger: '通報',
    title: '通報する',
    subtitle: (name: string) => `${name}さんを通報します`,
    selectReason: '通報理由を選択',
    detailPlaceholder: '詳細（任意、最大500文字）',
    submit: '通報を送信',
    submitting: '処理中...',
    cancel: 'キャンセル',
    successMsg: '通報を受け付けました。確認後に対応いたします。',
    errorDuplicate: 'すでにこの参加者を通報済みです。',
    errorGeneric: 'エラーが発生しました。再度お試しください。',
    notice: '虚偽の通報はご利用に影響する場合があります。',
  },
  en: {
    trigger: 'Report',
    title: 'Report User',
    subtitle: (name: string) => `Reporting ${name}`,
    selectReason: 'Select reason',
    detailPlaceholder: 'Details (optional, max 500 chars)',
    submit: 'Submit Report',
    submitting: 'Submitting...',
    cancel: 'Cancel',
    successMsg: 'Report submitted. We will review and take action.',
    errorDuplicate: 'You have already reported this participant.',
    errorGeneric: 'Something went wrong. Please try again.',
    notice: 'False reports may result in account restrictions.',
  },
}

export function ReportButton({
  eventType,
  eventId,
  reportedId,
  reportedName,
  locale = 'ko',
}: ReportButtonProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [detail, setDetail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const t = LABEL[locale as keyof typeof LABEL] ?? LABEL.ko
  const reasons = REASONS[locale as keyof typeof REASONS] ?? REASONS.ko

  function handleClose() {
    setOpen(false)
    setReason('')
    setDetail('')
    setDone(false)
    setError(null)
  }

  async function handleSubmit() {
    if (!reason) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, eventId, reportedId, reason, detail: detail || undefined }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(res.status === 409 ? t.errorDuplicate : t.errorGeneric)
        return
      }
      setDone(true)
    } catch {
      setError(t.errorGeneric)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-stone hover:text-red-500 transition-colors underline underline-offset-2"
      >
        {t.trigger}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            {done ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-bold text-ink">{t.successMsg}</p>
                <button
                  onClick={handleClose}
                  className="mt-6 w-full py-2.5 rounded-xl bg-[#5BBDAD] text-white font-bold text-sm"
                >
                  OK
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-black text-ink mb-1">{t.title}</h2>
                <p className="text-sm text-slate mb-4">{t.subtitle(reportedName)}</p>

                <p className="text-xs font-medium text-stone mb-2">{t.selectReason}</p>
                <div className="flex flex-col gap-2 mb-4">
                  {reasons.map((r) => (
                    <label key={r.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="report-reason"
                        value={r.value}
                        checked={reason === r.value}
                        onChange={() => setReason(r.value)}
                        className="accent-[#5BBDAD]"
                      />
                      <span className="text-sm text-ink">{r.label}</span>
                    </label>
                  ))}
                </div>

                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder={t.detailPlaceholder}
                  rows={3}
                  maxLength={500}
                  className="w-full border border-mist rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#5BBDAD] mb-1"
                />
                <p className="text-xs text-stone text-right mb-2">{detail.length}/500</p>
                <p className="text-xs text-orange-500 mb-4">{t.notice}</p>

                {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

                <div className="flex gap-2">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2.5 rounded-xl border border-mist text-slate font-bold text-sm"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!reason || loading}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm disabled:opacity-40"
                  >
                    {loading ? t.submitting : t.submit}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
