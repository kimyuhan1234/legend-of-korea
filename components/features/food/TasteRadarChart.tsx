'use client'

import type { TasteProfile } from "@/lib/data/food-dupes"

interface TasteRadarChartProps {
  profile: TasteProfile
  locale: string
  size?: number
  color?: string
}

const AXES = {
  ko: [
    { key: "sweet", label: "단맛" },
    { key: "salty", label: "짠맛" },
    { key: "spicy", label: "매운맛" },
    { key: "umami", label: "감칠맛" },
    { key: "sour", label: "신맛" },
  ],
  ja: [
    { key: "sweet", label: "甘み" },
    { key: "salty", label: "塩気" },
    { key: "spicy", label: "辛さ" },
    { key: "umami", label: "旨味" },
    { key: "sour", label: "酸味" },
  ],
  en: [
    { key: "sweet", label: "Sweet" },
    { key: "salty", label: "Salty" },
    { key: "spicy", label: "Spicy" },
    { key: "umami", label: "Umami" },
    { key: "sour", label: "Sour" },
  ],
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

export function TasteRadarChart({
  profile,
  locale,
  size = 160,
  color = "#F0B8B8",
}: TasteRadarChartProps) {
  const axes = AXES[locale as keyof typeof AXES] || AXES.en || AXES.ko
  const cx = size / 2
  const cy = size / 2
  const maxR = size * 0.36
  const labelR = maxR + size * 0.14

  // 5축, -90도부터 72도 간격
  const angles = axes.map((_, i) => -90 + i * 72)

  const getPoint = (angle: number, value: number) => {
    const r = (value / 100) * maxR
    return {
      x: cx + r * Math.cos(toRad(angle)),
      y: cy + r * Math.sin(toRad(angle)),
    }
  }

  const getBgPoint = (angle: number) => ({
    x: cx + maxR * Math.cos(toRad(angle)),
    y: cy + maxR * Math.sin(toRad(angle)),
  })

  const getLabelPoint = (angle: number) => ({
    x: cx + labelR * Math.cos(toRad(angle)),
    y: cy + labelR * Math.sin(toRad(angle)),
  })

  const bgPoints = angles.map(getBgPoint)
  const dataPoints = axes.map((a, i) =>
    getPoint(angles[i], profile[a.key as keyof TasteProfile])
  )

  const toPath = (points: { x: number; y: number }[]) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z"

  // 보조 오각형 (60%)
  const innerR60 = maxR * 0.6

  const pad = size * 0.12

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
      width={size + pad * 2}
      height={size + pad * 2}
      style={{ display: "block", maxWidth: "100%" }}
    >
      {/* 60% 보조 오각형 */}
      <path
        d={toPath(angles.map((a) => ({ x: cx + innerR60 * Math.cos(toRad(a)), y: cy + innerR60 * Math.sin(toRad(a)) })))}
        fill="none"
        stroke="#E4E7EB"
        strokeWidth="0.5"
      />
      {/* 배경 오각형 */}
      <path d={toPath(bgPoints)} fill="#F0F2F5" stroke="#E4E7EB" strokeWidth="1" />
      {/* 축 선 */}
      {bgPoints.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="#E4E7EB" strokeWidth="0.5" />
      ))}
      {/* 데이터 폴리곤 */}
      <path
        d={toPath(dataPoints)}
        fill={color}
        fillOpacity="0.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 데이터 포인트 */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="2.5" fill={color} />
      ))}
      {/* 레이블 */}
      {axes.map((a, i) => {
        const lp = getLabelPoint(angles[i])
        return (
          <text
            key={i}
            x={lp.x.toFixed(1)}
            y={lp.y.toFixed(1)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size * 0.095}
            fill="#1F2937"
            fontWeight="600"
            fontFamily="sans-serif"
          >
            {a.label}
          </text>
        )
      })}
    </svg>
  )
}
