/**
 * kfood-spots.ts 데이터 무결성 테스트
 */
import { describe, it, expect } from "vitest"
import { kfoodSpots as spots, CITIES } from "../lib/data/kfood-spots"

const REQUIRED_CITIES = ["all", "seoul", "busan", "jeju", "jeonju", "tongyeong", "gyeongju", "cheonan", "yongin", "icheon"]
const LOCALES = ["ko", "ja", "en"] as const

describe("kfood-spots: CITIES 구조", () => {
  it("10개 도시 필터(all 포함)가 있어야 한다", () => {
    const codes = CITIES.map((c) => c.code)
    for (const code of REQUIRED_CITIES) {
      expect(codes, `${code} 도시가 CITIES에 없습니다`).toContain(code)
    }
  })
})

describe("kfood-spots: spots 구조", () => {
  it("spots가 1개 이상 있어야 한다", () => {
    expect(spots.length).toBeGreaterThan(0)
  })

  it("모든 스팟에 필수 필드가 있어야 한다", () => {
    for (const spot of spots) {
      expect(spot.id, "id 없음").toBeTruthy()
      expect(spot.city, `${spot.id}: city 없음`).toBeTruthy()
      expect(spot.cityCode, `${spot.id}: cityCode 없음`).toBeTruthy()
      expect(spot.category, `${spot.id}: category 없음`).toBeTruthy()
      expect(spot.address, `${spot.id}: address 없음`).toBeTruthy()

      for (const locale of LOCALES) {
        expect(spot.name[locale], `${spot.id}: name.${locale} 없음`).toBeTruthy()
        expect(spot.description[locale], `${spot.id}: description.${locale} 없음`).toBeTruthy()
      }
    }
  })

  it("모든 스팟의 cityCode가 CITIES에 존재해야 한다 (all 제외)", () => {
    const validCities = CITIES.map((c) => c.code).filter((v) => v !== "all")
    for (const spot of spots) {
      expect(
        validCities,
        `${spot.id}: cityCode='${spot.cityCode}'는 CITIES에 없는 값`
      ).toContain(spot.cityCode)
    }
  })
})
