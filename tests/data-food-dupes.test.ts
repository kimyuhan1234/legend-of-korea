/**
 * food-dupes.ts 데이터 무결성 테스트
 * - 모든 지역이 필수 필드를 가지는지 확인
 * - 음식 데이터 구조가 올바른지 확인
 * - 듀프(매칭) 데이터가 유효한지 확인
 */
import { describe, it, expect } from "vitest"
import { regions } from "../lib/data/food-dupes"

const LOCALES = ["ko", "ja", "en"] as const
const REQUIRED_REGION_CODES = [
  "jeonju", "seoul", "tongyeong", "jeju",
  "busan", "gyeongju", "cheonan", "yongin", "icheon",
  "sokcho", "yeosu", "andong",
  "national",  // 전국 한국 전통 — 권역 무관 28건
]
describe("food-dupes: 지역(Region) 구조", () => {
  it("12개 도시 + national 이 모두 존재해야 한다", () => {
    const codes = regions.map((r) => r.code)
    for (const code of REQUIRED_REGION_CODES) {
      expect(codes, `${code} 지역이 없습니다`).toContain(code)
    }
    expect(regions).toHaveLength(13)
  })

  it("모든 지역에 필수 필드가 있어야 한다", () => {
    for (const region of regions) {
      expect(region.code, "code 없음").toBeTruthy()
      expect(region.icon, `${region.code}: icon 없음`).toBeTruthy()
      expect(region.image, `${region.code}: image 없음`).toBeTruthy()

      for (const locale of LOCALES) {
        expect(region.name[locale], `${region.code}: name.${locale} 없음`).toBeTruthy()
        expect(region.description[locale], `${region.code}: description.${locale} 없음`).toBeTruthy()
      }
    }
  })

  it("이미지 경로가 /images/village/ 로 시작해야 한다", () => {
    for (const region of regions) {
      expect(
        region.image,
        `${region.code}: 이미지 경로 형식 오류 (${region.image})`
      ).toMatch(/^\/images\/village\//)
    }
  })
})

describe("food-dupes: 음식(RegionalFood) 구조", () => {
  it("각 지역이 최소 3개 음식을 가져야 한다", () => {
    // Phase G-fix 중복 통합 후 sokcho 가 3개로 감소 — 권역별 음식 불균형은 의도.
    // national 25건이 6 권역 모두에 합쳐 노출되어 전체 최소는 보장됨.
    for (const region of regions) {
      expect(
        region.foods.length,
        `${region.code}: 음식이 최소 3개여야 하는데 ${region.foods.length}개`
      ).toBeGreaterThanOrEqual(3)
    }
  })

  it("모든 음식에 필수 필드가 있어야 한다 (image는 optional)", () => {
    for (const region of regions) {
      for (const food of region.foods) {
        expect(food.id, `id 없음`).toBeTruthy()
        expect(food.region, `${food.id}: region 없음`).toBe(region.code)
        expect(food.tags, `${food.id}: tags 없음`).toBeInstanceOf(Array)

        for (const locale of LOCALES) {
          expect(food.name[locale], `${food.id}: name.${locale} 없음`).toBeTruthy()
          expect(food.storyDescription[locale], `${food.id}: storyDescription.${locale} 없음`).toBeTruthy()
          expect(food.ingredients[locale].length, `${food.id}: ingredients.${locale} 비어있음`).toBeGreaterThan(0)
        }
      }
    }
  })

  it("tasteProfile 값은 0~100 사이여야 한다", () => {
    for (const region of regions) {
      for (const food of region.foods) {
        const { sweet, salty, spicy, umami, sour } = food.tasteProfile
        for (const [key, val] of Object.entries({ sweet, salty, spicy, umami, sour })) {
          expect(val, `${food.id}: tasteProfile.${key} = ${val} (범위 초과)`).toBeGreaterThanOrEqual(0)
          expect(val, `${food.id}: tasteProfile.${key} = ${val} (범위 초과)`).toBeLessThanOrEqual(100)
        }
      }
    }
  })

  it("음식 이미지 경로는 /images/food/ 또는 Supabase Storage URL 이어야 한다", () => {
    // Phase F 이후 이미지는 Supabase Storage 로 이전 (food-images 버킷).
    // 레거시 /images/food/ 로컬 경로도 일부 잔존 — 둘 다 허용.
    const SUPABASE_STORAGE = /^https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/food-images\//
    const LEGACY_LOCAL = /^\/images\/food\//
    for (const region of regions) {
      for (const food of region.foods) {
        if (!food.image) continue
        const ok = SUPABASE_STORAGE.test(food.image) || LEGACY_LOCAL.test(food.image)
        expect(ok, `${food.id}: 이미지 경로 형식 오류 (${food.image})`).toBe(true)
      }
    }
  })

  it("모든 음식에 듀프(dupe)가 1개 이상 있어야 한다", () => {
    for (const region of regions) {
      for (const food of region.foods) {
        expect(
          Object.keys(food.dupes).length,
          `${food.id}: dupes가 비어있음`
        ).toBeGreaterThan(0)
      }
    }
  })

  it("듀프 similarityPercent 는 50~100 사이여야 한다", () => {
    for (const region of regions) {
      for (const food of region.foods) {
        for (const dupe of Object.values(food.dupes)) {
          if ('challenge' in dupe) continue
          expect(
            dupe.similarityPercent,
            `${food.id} > ${dupe.name.ko}: similarityPercent = ${dupe.similarityPercent}`
          ).toBeGreaterThanOrEqual(50)
          expect(
            dupe.similarityPercent,
            `${food.id} > ${dupe.name.ko}: similarityPercent = ${dupe.similarityPercent}`
          ).toBeLessThanOrEqual(100)
        }
      }
    }
  })
})