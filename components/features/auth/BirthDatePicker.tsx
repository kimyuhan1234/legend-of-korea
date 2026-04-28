"use client"

import { useEffect, useMemo, useState } from "react"

interface Props {
  /** 현재 값 (YYYY-MM-DD) — 빈 문자열이면 미선택 */
  value: string
  /** 셋 다 선택되면 YYYY-MM-DD 문자열, 미완성이면 빈 문자열로 호출 */
  onChange: (value: string) => void
  /** 3 개 select 의 placeholder + aria-label */
  labels: { year: string; month: string; day: string }
  /** select id prefix — 폼 label htmlFor 연결용 (없어도 동작) */
  idPrefix?: string
  /** form 제출 검증 — 최소 한 개 select 가 미선택이면 invalid */
  required?: boolean
  /** 시각적 invalid 상태 (생년월일 미달 등) */
  invalid?: boolean
  /** form 그룹의 설명 텍스트 id (hint/error 메시지) */
  ariaDescribedBy?: string
  /** 가장 빠른 허용 연도 — default 1900 */
  minYear?: number
  /** 가장 늦은 허용 연도 — default 오늘 연도 (만 14세 컷오프는 부모가 별도 검증) */
  maxYear?: number
}

/**
 * 생년월일 입력용 3 분리 select (year / month / day).
 *
 * 이유: <input type="date"> 네이티브 달력은 모바일에서 1900 년대로 스크롤하기
 * 불편 (수십 번 backward 탭). select 3 개가 더 빠르고 명확하다.
 *
 * - 윤년 / 30 일 / 31 일 자동 처리 (선택한 year+month 의 last day 까지만 day 옵션 노출)
 * - day 가 새 month 의 범위를 넘으면 day 자동 클리어
 * - 셋 다 선택돼야 onChange 가 'YYYY-MM-DD' 호출, 그 전엔 ''
 * - 만 14 세 검증 / 미래 날짜 검증은 부모 form 의 책임 (isAtLeastMinimumAge)
 */
export function BirthDatePicker({
  value,
  onChange,
  labels,
  idPrefix = "birth-date",
  required,
  invalid,
  ariaDescribedBy,
  minYear = 1900,
  maxYear,
}: Props) {
  // 외부 value 가 변하면 내부 select 동기화 (controlled)
  const parsed = parseValue(value)
  const [year, setYear] = useState<string>(parsed.year)
  const [month, setMonth] = useState<string>(parsed.month)
  const [day, setDay] = useState<string>(parsed.day)

  useEffect(() => {
    const p = parseValue(value)
    setYear(p.year)
    setMonth(p.month)
    setDay(p.day)
  }, [value])

  const currentYear = new Date().getFullYear()
  const yearMax = maxYear ?? currentYear
  const years = useMemo(() => {
    const list: number[] = []
    for (let y = yearMax; y >= minYear; y--) list.push(y)
    return list
  }, [minYear, yearMax])

  // 선택한 year/month 의 마지막 날 계산 (빈 값이면 31 — UI 상 모든 day 노출)
  const daysInMonth = useMemo(() => {
    const y = parseInt(year, 10)
    const m = parseInt(month, 10)
    if (!Number.isFinite(y) || !Number.isFinite(m)) return 31
    // Date(y, m, 0) → m 월의 마지막 날 (m 은 1-12 그대로 입력)
    return new Date(y, m, 0).getDate()
  }, [year, month])

  function emit(nextYear: string, nextMonth: string, nextDay: string) {
    if (nextYear && nextMonth && nextDay) {
      const mm = nextMonth.padStart(2, "0")
      const dd = nextDay.padStart(2, "0")
      onChange(`${nextYear}-${mm}-${dd}`)
    } else {
      onChange("")
    }
  }

  function handleYear(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    setYear(next)
    // 윤년 체크 — 2/29 선택 상태에서 평년으로 바뀌면 day 클리어
    let nextDay = day
    if (next && month && day) {
      const last = new Date(parseInt(next, 10), parseInt(month, 10), 0).getDate()
      if (parseInt(day, 10) > last) {
        nextDay = ""
        setDay("")
      }
    }
    emit(next, month, nextDay)
  }

  function handleMonth(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    setMonth(next)
    // 30/31 일 차이 — month 변경 시 day 가 범위 초과면 클리어
    let nextDay = day
    if (year && next && day) {
      const last = new Date(parseInt(year, 10), parseInt(next, 10), 0).getDate()
      if (parseInt(day, 10) > last) {
        nextDay = ""
        setDay("")
      }
    }
    emit(year, next, nextDay)
  }

  function handleDay(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    setDay(next)
    emit(year, month, next)
  }

  const selectClass = `
    h-12 px-3 rounded-xl border bg-white text-[#111] text-sm
    focus:outline-none focus:ring-2 focus:ring-blossom-deep/40 focus:border-blossom-deep
    transition-all w-full
    ${invalid ? "border-red-300 focus:border-red-400 focus:ring-red-200" : "border-mist"}
  `

  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-describedby={ariaDescribedBy}>
      <select
        id={`${idPrefix}-year`}
        aria-label={labels.year}
        aria-invalid={invalid ? "true" : "false"}
        required={required}
        value={year}
        onChange={handleYear}
        className={selectClass}
      >
        <option value="">{labels.year}</option>
        {years.map((y) => (
          <option key={y} value={String(y)}>
            {y}
          </option>
        ))}
      </select>

      <select
        id={`${idPrefix}-month`}
        aria-label={labels.month}
        aria-invalid={invalid ? "true" : "false"}
        required={required}
        value={month}
        onChange={handleMonth}
        className={selectClass}
      >
        <option value="">{labels.month}</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={String(m)}>
            {m}
          </option>
        ))}
      </select>

      <select
        id={`${idPrefix}-day`}
        aria-label={labels.day}
        aria-invalid={invalid ? "true" : "false"}
        required={required}
        value={day}
        onChange={handleDay}
        className={selectClass}
      >
        <option value="">{labels.day}</option>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
          <option key={d} value={String(d)}>
            {d}
          </option>
        ))}
      </select>
    </div>
  )
}

function parseValue(value: string): { year: string; month: string; day: string } {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { year: "", month: "", day: "" }
  }
  const [y, m, d] = value.split("-")
  // 앞자리 0 제거 — select option value 와 일치 (e.g. "01" → "1")
  return {
    year: y,
    month: String(parseInt(m, 10)),
    day: String(parseInt(d, 10)),
  }
}
