'use client'

import type { RadarAxis } from '@/lib/curation/radar'

interface Props {
  axes: RadarAxis[]
  overlayAxes?: RadarAxis[]
  size?: number
  color?: string
  strokeColor?: string
  overlayColor?: string
  overlayStrokeColor?: string
  showLabels?: boolean
  legend?: { primary: string; overlay?: string }
}

function getPoint(cx: number, cy: number, radius: number, index: number, total: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  }
}

export function RadarChart({
  axes,
  overlayAxes,
  size = 220,
  color = 'rgba(157, 216, 206, 0.45)',
  strokeColor = '#5BBDAD',
  overlayColor = 'rgba(240, 184, 184, 0.45)',
  overlayStrokeColor = '#E89292',
  showLabels = true,
  legend,
}: Props) {
  const cx = size / 2
  const cy = size / 2
  const labelPad = showLabels ? 38 : 8
  const maxRadius = size / 2 - labelPad

  const total = axes.length
  if (total < 3) return null

  // 격자 링 5단계
  const rings = [0.2, 0.4, 0.6, 0.8, 1].map(ratio => {
    const r = maxRadius * ratio
    const pts = Array.from({ length: total }, (_, i) => getPoint(cx, cy, r, i, total))
    return pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  })

  // 축 라인
  const axisLines = axes.map((_, i) => {
    const p = getPoint(cx, cy, maxRadius, i, total)
    return { x1: cx, y1: cy, x2: p.x, y2: p.y }
  })

  // 데이터 폴리곤
  const dataPoints = axes.map((a, i) => {
    const r = maxRadius * Math.max(0, Math.min(1, a.value))
    return getPoint(cx, cy, r, i, total)
  })
  const dataPolygon = dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  // 오버레이 폴리곤
  const overlayPoints = overlayAxes?.map((a, i) => {
    const r = maxRadius * Math.max(0, Math.min(1, a.value))
    return getPoint(cx, cy, r, i, overlayAxes.length)
  })
  const overlayPolygon = overlayPoints?.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  // 라벨 위치 (축 바깥쪽)
  const labelPoints = axes.map((_, i) => getPoint(cx, cy, maxRadius + labelPad * 0.55, i, total))

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Radar chart">
        {/* 격자 */}
        {rings.map((pts, i) => (
          <polygon
            key={`ring-${i}`}
            points={pts}
            fill="none"
            stroke="#E4E7EB"
            strokeWidth={0.6}
          />
        ))}
        {/* 축 라인 */}
        {axisLines.map((l, i) => (
          <line
            key={`axis-${i}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="#E4E7EB"
            strokeWidth={0.6}
          />
        ))}
        {/* 오버레이 (도시) — 먼저 그려서 뒤로 */}
        {overlayPolygon && (
          <polygon
            points={overlayPolygon}
            fill={overlayColor}
            stroke={overlayStrokeColor}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        )}
        {/* 데이터 (유저) */}
        <polygon
          points={dataPolygon}
          fill={color}
          stroke={strokeColor}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* 꼭짓점 점 */}
        {dataPoints.map((p, i) => (
          <circle key={`dot-${i}`} cx={p.x} cy={p.y} r={5} fill={strokeColor} />
        ))}
        {overlayPoints?.map((p, i) => (
          <circle key={`odot-${i}`} cx={p.x} cy={p.y} r={5} fill={overlayStrokeColor} />
        ))}
        {/* 라벨 */}
        {showLabels &&
          axes.map((a, i) => {
            const pt = labelPoints[i]
            return (
              <g key={`label-${i}`}>
                <text
                  x={pt.x}
                  y={pt.y - 4}
                  textAnchor="middle"
                  fontSize={14}
                  dominantBaseline="middle"
                >
                  {a.icon}
                </text>
                <text
                  x={pt.x}
                  y={pt.y + 11}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill="#64748B"
                >
                  {a.label}
                </text>
              </g>
            )
          })}
      </svg>

      {/* 범례 */}
      {legend && (legend.primary || legend.overlay) && (
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 mt-2">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: strokeColor }}
            />
            {legend.primary}
          </span>
          {legend.overlay && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: overlayStrokeColor }}
              />
              {legend.overlay}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
