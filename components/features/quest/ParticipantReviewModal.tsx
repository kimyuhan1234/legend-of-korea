'use client'

import { useState } from 'react'

interface ParticipantReviewModalProps {
  isOpen: boolean
  onClose: () => void
  eventType: 'quest_party' | 'gyeongdo'
  eventId: string
  revieweeId: string
  revieweeName: string
  locale: string
}

const LABEL = {
  ko: {
    title: '참여자 평가',
    subtitle: '함께한 여행은 어떠셨나요?',
    ratingLabel: '별점 선택',
    commentPlaceholder: '자유롭게 의견을 남겨주세요 (선택)',
    submit: '평가 제출',
    submitting: '제출 중...',
    cancel: '취소',
    successMsg: '평가가 완료되었습니다.',
    errorDuplicate: '이미 평가한 참여자입니다.',
    errorGeneric: '오류가 발생했습니다. 다시 시도해주세요.',
    stars: ['', '별로예요', '그저 그래요', '보통이에요', '좋아요', '최고예요'],
    anonymous: '* 평가는 익명으로 처리됩니다',
  },
  ja: {
    title: '参加者の評価',
    subtitle: '一緒の旅はいかがでしたか？',
    ratingLabel: '星を選択',
    commentPlaceholder: 'コメントを自由にどうぞ（任意）',
    submit: '評価を送信',
    submitting: '送信中...',
    cancel: 'キャンセル',
    successMsg: '評価が完了しました。',
    errorDuplicate: 'すでにこの参加者を評価済みです。',
    errorGeneric: 'エラーが発生しました。もう一度お試しください。',
    stars: ['', 'よくない', '普通', 'まあまあ', '良い', '最高'],
    anonymous: '* 評価は匿名で処理されます',
  },
  en: {
    title: 'Rate Participant',
    subtitle: 'How was your adventure together?',
    ratingLabel: 'Select rating',
    commentPlaceholder: 'Leave a comment (optional)',
    submit: 'Submit',
    submitting: 'Submitting...',
    cancel: 'Cancel',
    successMsg: 'Review submitted successfully.',
    errorDuplicate: 'You have already reviewed this participant.',
    errorGeneric: 'Something went wrong. Please try again.',
    stars: ['', 'Poor', 'Fair', 'Okay', 'Good', 'Excellent'],
    anonymous: '* Reviews are anonymous',
  },
}

export function ParticipantReviewModal({
  isOpen,
  onClose,
  eventType,
  eventId,
  revieweeId,
  revieweeName,
  locale,
}: ParticipantReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const t = LABEL[locale as keyof typeof LABEL] ?? LABEL.ko

  if (!isOpen) return null

  async function handleSubmit() {
    if (rating === 0) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/review/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, eventId, revieweeId, rating, comment: comment || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(res.status === 409 ? t.errorDuplicate : t.errorGeneric)
        return
      }
      if (data.success) setDone(true)
    } catch {
      setError(t.errorGeneric)
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setRating(0)
    setHovered(0)
    setComment('')
    setDone(false)
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        {done ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">⭐</div>
            <p className="font-bold text-ink text-lg">{t.successMsg}</p>
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
            <p className="text-sm text-slate mb-4">
              {t.subtitle} — <span className="font-semibold text-[#7c3aed]">{revieweeName}</span>
            </p>

            {/* 별점 선택 */}
            <p className="text-xs text-stone mb-2 font-medium">{t.ratingLabel}</p>
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="text-3xl transition-transform hover:scale-110"
                  aria-label={`${star}점`}
                >
                  {star <= (hovered || rating) ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            {(hovered || rating) > 0 && (
              <p className="text-xs text-[#7c3aed] font-semibold mb-3">
                {t.stars[hovered || rating]}
              </p>
            )}

            {/* 코멘트 */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.commentPlaceholder}
              rows={3}
              maxLength={300}
              className="w-full border border-mist rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#5BBDAD] mb-1"
            />
            <p className="text-xs text-stone text-right mb-3">{comment.length}/300</p>

            <p className="text-xs text-stone mb-4">{t.anonymous}</p>

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
                disabled={rating === 0 || loading}
                className="flex-1 py-2.5 rounded-xl bg-[#5BBDAD] text-white font-bold text-sm disabled:opacity-40"
              >
                {loading ? t.submitting : t.submit}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
