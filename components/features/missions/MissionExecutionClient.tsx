'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { GpsVerification } from './GpsVerification'
import { QuizMission } from './QuizMission'
import { PhotoMission } from './PhotoMission'
import { OpenMission } from './OpenMission'
import { BossMission } from './BossMission'

interface Props {
  missionId: string
  courseName: string
  locale: string
  missionType: string
  title: string
  description: string
  hints: string[]
  lpReward: number
  initialStatus: string
  correctAnswer?: string
  latitude: number | null
  longitude: number | null
  isBoss: boolean
}

export function MissionExecutionClient({
  missionId,
  courseName,
  locale,
  missionType,
  title,
  description,
  hints,
  lpReward,
  initialStatus,
  correctAnswer,
  latitude,
  longitude,
  isBoss,
}: Props) {
  const t = useTranslations('mission')
  const hasGps = latitude !== null && longitude !== null

  // GPS 좌표가 없으면 검증 불필요 — 기존 미션과 호환
  const [gpsVerified, setGpsVerified] = useState(!hasGps)

  return (
    <div className="space-y-12">

      {/* GPS 위치 확인 (좌표가 있고 아직 확인 전) */}
      {!gpsVerified && hasGps && (
        <GpsVerification
          missionLat={latitude as number}
          missionLng={longitude as number}
          onVerified={() => setGpsVerified(true)}
          locale={locale}
        />
      )}

      {/* 미션 수행 UI (GPS 확인 후) */}
      {gpsVerified && (
        <>
          {missionType === 'quiz' && (
            <QuizMission
              missionId={missionId}
              courseName={courseName}
              question={title}
              hints={hints}
              lpReward={lpReward}
              initialStatus={initialStatus}
              locale={locale}
            />
          )}

          {missionType === 'photo' && (
            <PhotoMission
              missionId={missionId}
              courseName={courseName}
              description={description}
              lpReward={lpReward}
              initialStatus={initialStatus}
              locale={locale}
            />
          )}

          {(missionType === 'open' || missionType === 'hidden') && (
            <OpenMission
              missionId={missionId}
              courseName={courseName}
              title={title}
              description={description}
              lpReward={lpReward}
              type={missionType as 'open' | 'hidden'}
              initialStatus={initialStatus}
              locale={locale}
            />
          )}

          {missionType === 'boss' && (
            <BossMission
              missionId={missionId}
              courseName={courseName}
              title={title}
              description={description}
              lpReward={lpReward}
              correctAnswer={correctAnswer}
              initialStatus={initialStatus}
              locale={locale}
            />
          )}

          {/* 미션 안내 박스 (보스 제외) */}
          {!isBoss && (
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex items-start gap-5">
              <div className="text-sm text-slate-500 leading-relaxed font-bold w-full">
                <p className="mb-3 text-slate-800 text-base">{t('guideTitle')}</p>
                <ul className="space-y-2 list-none">
                  {[t('guide1'), t('guide2'), t('guide3')].map((g, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
