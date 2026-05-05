'use client'

import { useEffect, useState } from 'react'
import { X, Copy, Check, Loader2 } from 'lucide-react'
import type { ZepZone } from '@/lib/data/zep-spaces'
import { zepSpace } from '@/lib/data/zep-spaces'

interface ZepAccessModalProps {
  isOpen: boolean
  onClose: () => void
  zone: ZepZone
  locale: string
}

type LabelLocale = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const LABEL: Record<LabelLocale, {
  howTo: string
  step1: string
  step2: string
  step3: string
  step4: string
  zoneLocation: string
  password: string
  copied: string
  copy: string
  tip: string
  warning: string
  enterZep: string
  passwordLoading: string
  loginRequired: string
  passRequired: string
  notConfigured: string
  fetchFailed: string
}> = {
  ko: {
    howTo: "접속 방법",
    step1: "아래 버튼을 눌러 ZEP에 접속하세요",
    step2: "비밀번호를 입력하세요",
    step3: "아바타를 선택하고 입장!",
    step4: "구역으로 이동하세요",
    zoneLocation: "내 구역 위치",
    password: "비밀번호",
    copied: "복사되었습니다",
    copy: "복사",
    tip: "ZEP에서는 다른 모험가에게 다가가면 자동으로 음성/화상 대화가 시작됩니다. 마이크와 카메라를 켜주세요!",
    warning: "비밀번호를 다른 사람에게 공유하지 마세요. 구독자만 입장할 수 있는 공간입니다.",
    enterZep: "ZEP 입장하기",
    passwordLoading: "비밀번호 확인 중...",
    loginRequired: "로그인이 필요합니다",
    passRequired: "활성 패스가 필요합니다",
    notConfigured: "ZEP 스페이스가 아직 설정되지 않았습니다",
    fetchFailed: "비밀번호를 받아오지 못했습니다. 잠시 후 다시 시도해주세요.",
  },
  en: {
    howTo: "How to Join",
    step1: "Click the button below to open ZEP",
    step2: "Enter the password",
    step3: "Choose your avatar and enter!",
    step4: "Head to your zone",
    zoneLocation: "Your Zone Location",
    password: "Password",
    copied: "Copied!",
    copy: "Copy",
    tip: "In ZEP, voice/video chat starts automatically when you approach other adventurers. Turn on your mic and camera!",
    warning: "Don't share the password. This space is only for subscribers.",
    enterZep: "Enter ZEP",
    passwordLoading: "Loading password...",
    loginRequired: "Sign-in required",
    passRequired: "Active pass required",
    notConfigured: "The ZEP space is not configured yet",
    fetchFailed: "Failed to retrieve the password. Please try again shortly.",
  },
  ja: {
    howTo: "接続方法",
    step1: "下のボタンを押してZEPに接続",
    step2: "パスワードを入力",
    step3: "アバターを選んで入場！",
    step4: "あなたのゾーンへ移動",
    zoneLocation: "ゾーンの場所",
    password: "パスワード",
    copied: "コピーしました",
    copy: "コピー",
    tip: "ZEPでは他の冒険者に近づくと自動的に音声/ビデオ通話が始まります。マイクとカメラをオンにしてください！",
    warning: "パスワードを他の人に共有しないでください。サブスクライバー専用スペースです。",
    enterZep: "ZEPに入場する",
    passwordLoading: "パスワードを確認中...",
    loginRequired: "ログインが必要です",
    passRequired: "有効なパスが必要です",
    notConfigured: "ZEPスペースがまだ設定されていません",
    fetchFailed: "パスワードを取得できませんでした。しばらくしてから再度お試しください。",
  },
  'zh-CN': {
    howTo: "接入方式",
    step1: "点击下方按钮进入 ZEP",
    step2: "输入密码",
    step3: "选择头像并进入！",
    step4: "前往您的专属区域",
    zoneLocation: "您的专属区域位置",
    password: "密码",
    copied: "已复制",
    copy: "复制",
    tip: "在 ZEP 中，靠近其他冒险者时会自动开启语音/视频通话。请打开麦克风和摄像头！",
    warning: "请勿与他人分享密码。本空间仅限订阅用户进入。",
    enterZep: "进入 ZEP",
    passwordLoading: "正在加载密码...",
    loginRequired: "需要登录",
    passRequired: "需要有效通行证",
    notConfigured: "ZEP 空间尚未配置",
    fetchFailed: "未能获取密码，请稍后再试。",
  },
  'zh-TW': {
    howTo: "接入方式",
    step1: "點擊下方按鈕進入 ZEP",
    step2: "輸入密碼",
    step3: "選擇頭像並進入！",
    step4: "前往您的專屬區域",
    zoneLocation: "您的專屬區域位置",
    password: "密碼",
    copied: "已複製",
    copy: "複製",
    tip: "在 ZEP 中，靠近其他冒險者時會自動開啟語音/視訊通話。請打開麥克風和攝影機！",
    warning: "請勿與他人分享密碼。本空間僅限訂閱使用者進入。",
    enterZep: "進入 ZEP",
    passwordLoading: "正在載入密碼...",
    loginRequired: "需要登入",
    passRequired: "需要有效通行證",
    notConfigured: "ZEP 空間尚未設定",
    fetchFailed: "無法取得密碼，請稍後再試。",
  },
}

function resolveLabelLocale(raw: string): LabelLocale {
  return (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as LabelLocale[]).includes(raw as LabelLocale)
    ? (raw as LabelLocale)
    : 'en'
}

type AccessState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'ready'; password: string }
  | { kind: 'error'; code: 'LOGIN_REQUIRED' | 'PASS_REQUIRED' | 'NOT_CONFIGURED' | 'FETCH_FAILED' }

export function ZepAccessModal({ isOpen, onClose, zone, locale }: ZepAccessModalProps) {
  const l = LABEL[resolveLabelLocale(locale)]
  const [copied, setCopied] = useState(false)
  const [state, setState] = useState<AccessState>({ kind: 'idle' })

  // 모달 열릴 때만 비밀번호 fetch — 닫히면 재호출 시 다시 검증
  useEffect(() => {
    if (!isOpen) {
      setState({ kind: 'idle' })
      return
    }

    let cancelled = false
    setState({ kind: 'loading' })

    fetch('/api/zep/access', { cache: 'no-store' })
      .then(async (res) => {
        if (cancelled) return
        if (res.ok) {
          const data = (await res.json()) as { password?: string }
          if (data.password) {
            setState({ kind: 'ready', password: data.password })
          } else {
            setState({ kind: 'error', code: 'FETCH_FAILED' })
          }
          return
        }
        // 에러 응답 매핑
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        const code = data.error
        if (res.status === 401 || code === 'LOGIN_REQUIRED') {
          setState({ kind: 'error', code: 'LOGIN_REQUIRED' })
        } else if (res.status === 403 || code === 'PASS_REQUIRED') {
          setState({ kind: 'error', code: 'PASS_REQUIRED' })
        } else if (res.status === 503 || code === 'NOT_CONFIGURED') {
          setState({ kind: 'error', code: 'NOT_CONFIGURED' })
        } else {
          setState({ kind: 'error', code: 'FETCH_FAILED' })
        }
      })
      .catch(() => {
        if (!cancelled) setState({ kind: 'error', code: 'FETCH_FAILED' })
      })

    return () => {
      cancelled = true
    }
  }, [isOpen])

  if (!isOpen) return null

  const zoneName = zone.name[locale as keyof typeof zone.name] || zone.name.en || zone.name.ko
  const zoneDesc = zone.description[locale as keyof typeof zone.description] || zone.description.en || zone.description.ko
  const areaGuide = zone.areaGuide[locale as keyof typeof zone.areaGuide] || zone.areaGuide.en || zone.areaGuide.ko

  const password = state.kind === 'ready' ? state.password : ''
  const errorMessage = state.kind === 'error'
    ? state.code === 'LOGIN_REQUIRED'
      ? l.loginRequired
      : state.code === 'PASS_REQUIRED'
      ? l.passRequired
      : state.code === 'NOT_CONFIGURED'
      ? l.notConfigured
      : l.fetchFailed
    : ''

  const handleCopy = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API 미지원 환경 — 조용히 무시
    }
  }

  const isPlaceholder = zepSpace.spaceUrl.includes('YOUR_SPACE_ID')

  const handleEnter = () => {
    if (isPlaceholder) return
    window.open(zepSpace.spaceUrl, '_blank', 'noopener,noreferrer')
  }

  const steps = [l.step1, l.step2, l.step3, l.step4]
  const canEnter = !isPlaceholder && state.kind === 'ready'

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-sky to-mint p-6 text-ink relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-black/10 transition-colors"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
          <div className="text-4xl mb-2">{zone.emoji}</div>
          <h2 className="text-xl font-black pr-8">{zoneName}</h2>
          <p className="text-sm opacity-80 mt-1 pr-8">{zoneDesc}</p>
        </div>

        <div className="p-6 space-y-5">
          {/* 접속 방법 */}
          <div>
            <h3 className="text-sm font-black text-ink mb-3">📋 {l.howTo}</h3>
            <div className="space-y-2.5">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-mint-light text-mint-deep font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 구역 위치 안내 */}
          <div className="bg-sky/10 rounded-xl px-4 py-3 border border-sky/20 flex items-center gap-3">
            <span className="text-2xl shrink-0">{zone.emoji}</span>
            <div>
              <p className="text-xs font-black text-ink mb-0.5">📍 {l.zoneLocation}</p>
              <p className="text-sm text-slate">{areaGuide}</p>
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <h3 className="text-sm font-black text-ink mb-2">🔑 {l.password}</h3>
            {state.kind === 'loading' && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-2 bg-cloud rounded-xl px-4 py-3 border border-mist text-sm text-stone"
              >
                <Loader2 size={14} className="animate-spin" />
                {l.passwordLoading}
              </div>
            )}
            {state.kind === 'ready' && (
              <div className="flex items-center gap-2 bg-cloud rounded-xl px-4 py-3 border border-mist">
                <code className="flex-1 font-mono text-sm font-bold text-ink tracking-wider select-all">
                  {password}
                </code>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs font-bold text-blossom-deep hover:text-blossom transition-colors shrink-0"
                >
                  {copied ? (
                    <><Check size={14} className="text-mint-deep" /> {l.copied}</>
                  ) : (
                    <><Copy size={14} /> {l.copy}</>
                  )}
                </button>
              </div>
            )}
            {state.kind === 'error' && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-bold"
              >
                ⚠️ {errorMessage}
              </div>
            )}
          </div>

          {/* 팁 */}
          <div className="bg-mint-light rounded-xl p-4">
            <p className="text-xs text-mint-deep leading-relaxed">💡 {l.tip}</p>
          </div>

          {/* 경고 */}
          <div className="bg-blossom-light rounded-xl p-3">
            <p className="text-xs text-blossom-deep leading-relaxed">⚠️ {l.warning}</p>
          </div>

          {/* ZEP 입장 버튼 */}
          <button
            onClick={handleEnter}
            disabled={!canEnter}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky to-mint text-ink font-black text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaceholder ? '🔧 ZEP 스페이스 준비 중입니다' : `${l.enterZep} →`}
          </button>
        </div>
      </div>
    </div>
  )
}
