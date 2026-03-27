import type { I18nText } from "@/lib/supabase/types"

interface Mission {
  id: string
  sequence: number
  type: "quiz" | "photo" | "open" | "boss" | "hidden"
  title: I18nText
  location_name: I18nText | null
  lp_reward: number
  is_hidden: boolean
}

interface MissionPreviewProps {
  missions: Mission[]
  locale: string
}

const TYPE_ICON: Record<string, string> = {
  quiz: "🧩",
  photo: "📸",
  open: "🗺️",
  boss: "👹",
  hidden: "🌟",
}

const TYPE_LABEL = {
  ko: { quiz: "퀴즈", photo: "사진", open: "탐색", boss: "보스", hidden: "히든" },
  ja: { quiz: "クイズ", photo: "写真", open: "探索", boss: "ボス", hidden: "隠し" },
  en: { quiz: "Quiz", photo: "Photo", open: "Explore", boss: "Boss", hidden: "Hidden" },
}

const SECTION_LABEL = {
  ko: { title: "미션 미리보기", hidden: "히든 미션", hiddenDesc: "직접 탐험해서 발견하세요!" },
  ja: { title: "ミッションプレビュー", hidden: "隠しミッション", hiddenDesc: "直接探検して発見しましょう！" },
  en: { title: "Mission Preview", hidden: "Hidden Mission", hiddenDesc: "Discover it by exploring in person!" },
}

function getI18n(field: I18nText | null, locale: string): string {
  if (!field) return ""
  return (field as unknown as Record<string, string>)[locale] || field.ko || ""
}

export function MissionPreview({ missions, locale }: MissionPreviewProps) {
  const label = SECTION_LABEL[locale as keyof typeof SECTION_LABEL] || SECTION_LABEL.ko
  const typeLabel = TYPE_LABEL[locale as keyof typeof TYPE_LABEL] || TYPE_LABEL.ko
  const visible = missions.filter((m) => !m.is_hidden)
  const hidden = missions.filter((m) => m.is_hidden)

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-xl md:text-2xl font-bold text-[#1B2A4A] mb-6">
        🎯 {label.title}
      </h2>

      <div className="space-y-3">
        {visible.map((mission) => (
          <div
            key={mission.id}
            className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-[#e8ddd0] hover:border-[#D4A843]/40 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1B2A4A]/5 flex items-center justify-center text-lg shrink-0">
              {TYPE_ICON[mission.type] || "🎯"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-[#D4A843]">
                  {String(mission.sequence).padStart(2, "0")}
                </span>
                <span className="text-xs text-[#7a6a58]">
                  {typeLabel[mission.type as keyof typeof typeLabel]}
                </span>
              </div>
              <p className="text-sm font-medium text-[#1B2A4A] truncate">
                {getI18n(mission.title, locale)}
              </p>
              {mission.location_name && (
                <p className="text-xs text-[#7a6a58] mt-0.5">
                  📍 {getI18n(mission.location_name, locale)}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-[#D4A843]">+{mission.lp_reward} LP</span>
            </div>
          </div>
        ))}

        {/* 히든 미션 */}
        {hidden.map((mission) => (
          <div
            key={mission.id}
            className="flex items-center gap-4 bg-[#1B2A4A]/3 rounded-2xl px-5 py-4 border border-dashed border-[#D4A843]/40"
          >
            <div className="w-9 h-9 rounded-xl bg-[#D4A843]/10 flex items-center justify-center text-lg shrink-0">
              🌟
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#D4A843]">{label.hidden}</p>
              <p className="text-xs text-[#7a6a58]">{label.hiddenDesc}</p>
            </div>
            <span className="text-xs font-bold text-[#D4A843]">+{mission.lp_reward} LP</span>
          </div>
        ))}
      </div>
    </section>
  )
}
