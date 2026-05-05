'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { Camera, Loader2, Pencil, Check, X } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { AvatarCropModal } from './AvatarCropModal'
import { resolveAvatarSrc, hasAvatarSource } from '@/lib/avatar/resolve'

interface Props {
  user: { nickname?: string; avatar_url?: string | null; email?: string }
  locale: string
  onUpdate: (updated: { nickname?: string; avatar_url?: string | null }) => void
}

const LOCALES: { code: string; label: string; flag: string }[] = [
  { code: 'ko', label: '한국어', flag: '\u{1F1F0}\u{1F1F7}' },
  { code: 'en', label: 'English', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'ja', label: '日本語', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'zh-CN', label: '简体中文', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'zh-TW', label: '繁體中文', flag: '\u{1F1F9}\u{1F1FC}' },
]

export function ProfileSettings({ user, locale, onUpdate }: Props) {
  const t = useTranslations('mypage')
  const router = useRouter()
  const pathname = usePathname()

  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState(user?.nickname || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '')
  const [saving, setSaving] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const avatarRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // 크롭 모달에 원본 이미지 전달
    setCropSrc(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleCropConfirm = (croppedBlob: Blob) => {
    const cropped = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' })
    setAvatarFile(cropped)
    setAvatarPreview(URL.createObjectURL(croppedBlob))
    setCropSrc(null)
  }

  const handleCropCancel = () => {
    setCropSrc(null)
  }

  const handleSave = async () => {
    if (saving || !nickname.trim()) return
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('nickname', nickname.trim())
      if (avatarFile) formData.append('avatar', avatarFile)

      const res = await fetch('/api/profile', { method: 'PATCH', body: formData })
      const data = await res.json()

      if (data.success) {
        onUpdate(data.user)
        toast({ title: t('profileSaved') })
        setEditing(false)
        setAvatarFile(null)
      } else {
        toast({ variant: 'destructive', title: t('profileSaveFail'), description: data.error })
      }
    } catch {
      toast({ variant: 'destructive', title: t('profileSaveFail') })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setNickname(user?.nickname || '')
    setAvatarPreview(user?.avatar_url || '')
    setAvatarFile(null)
  }

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return
    // Replace the first path segment (locale) with newLocale
    const parts = pathname.split('/')
    parts[1] = newLocale
    router.push(parts.join('/'))
  }

  return (
    <>
      {cropSrc && (
        <AvatarCropModal
          imageSrc={cropSrc}
          locale={locale}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}
    <div className="divide-y divide-slate-100">
      {/* 프로필 편집 */}
      <div className="p-5">
        {!editing ? (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
              {hasAvatarSource(user) ? (
                <Image src={resolveAvatarSrc(user)} alt="" width={56} height={56} className="object-cover w-full h-full" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-black text-slate-300">
                  {user?.nickname?.[0] || '?'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-800 truncate">{user?.nickname || '-'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" /> {t('settings.editProfile')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 아바타 */}
            <div className="flex flex-col items-center">
              <div
                className="relative group cursor-pointer"
                onClick={() => avatarRef.current?.click()}
              >
                <div className="w-20 h-20 rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden bg-slate-100">
                  {avatarPreview ? (
                    <Image src={avatarPreview} alt="" width={80} height={80} className="object-cover w-full h-full" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-black text-slate-300">
                      {nickname?.[0] || '?'}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <p className="text-[10px] text-slate-500 mt-2">JPEG / PNG / WebP · max 2MB</p>
            </div>

            {/* 닉네임 */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">
                {t('editNicknameLabel')}
              </label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-mint-deep transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" /> {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !nickname.trim()}
                className="flex-1 py-2.5 bg-gradient-to-br from-mint to-blossom text-ink rounded-xl font-black text-sm hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-1.5"
              >
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> ...</> : <><Check className="w-4 h-4" /> {t('save')}</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 언어 설정 */}
      <div className="p-5">
        <label className="block text-xs font-bold text-slate-500 mb-2">
          🌐 {t('settings.language')}
        </label>
        <select
          value={locale}
          onChange={(e) => handleLocaleChange(e.target.value)}
          className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white outline-none focus:border-mint-deep transition-colors"
        >
          {LOCALES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.label}
            </option>
          ))}
        </select>
      </div>
    </div>
    </>
  )
}
