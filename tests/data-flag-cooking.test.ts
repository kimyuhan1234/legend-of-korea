/**
 * flag-cooking.ts 데이터 무결성 테스트
 */
import { describe, it, expect } from "vitest"
import { flagCountries, fusionRecipes as recipes } from "../lib/data/flag-cooking"

const REQUIRED_COUNTRY_CODES = ["jp", "it", "mx", "th", "us", "fr", "in", "vn", "cn", "id", "es", "my"]
const LOCALES = ["ko", "ja", "en"] as const

describe("flag-cooking: flagCountries 구조", () => {
  it("12개 국가가 모두 존재해야 한다", () => {
    const codes = flagCountries.map((c) => c.code)
    for (const code of REQUIRED_COUNTRY_CODES) {
      expect(codes, `${code} 국가가 없습니다`).toContain(code)
    }
    expect(flagCountries).toHaveLength(12)
  })

  it("모든 국가에 필수 필드가 있어야 한다", () => {
    for (const country of flagCountries) {
      expect(country.code).toBeTruthy()
      expect(country.flag).toBeTruthy()
      for (const locale of LOCALES) {
        expect(country.name[locale], `${country.code}: name.${locale} 없음`).toBeTruthy()
      }
    }
  })
})

// 구 8개국(jp/it/mx/th/us/fr/in/vn): 5개, 신규 4개국(cn/id/es/my): 7개 → 총 68개
const COUNTRIES_5 = ["jp", "it", "mx", "th", "us", "fr", "in", "vn"]
const COUNTRIES_7 = ["cn", "id", "es", "my"]

describe("flag-cooking: recipes 구조", () => {
  it("총 레시피가 68개여야 한다", () => {
    expect(recipes).toHaveLength(68)
  })

  it("구 8개국은 레시피 5개씩 있어야 한다", () => {
    for (const code of COUNTRIES_5) {
      const count = recipes.filter((r) => r.countryCode === code).length
      expect(count, `${code}: 레시피가 5개여야 하는데 ${count}개`).toBe(5)
    }
  })

  it("신규 4개국(cn/id/es/my)은 레시피 7개씩 있어야 한다", () => {
    for (const code of COUNTRIES_7) {
      const count = recipes.filter((r) => r.countryCode === code).length
      expect(count, `${code}: 레시피가 7개여야 하는데 ${count}개`).toBe(7)
    }
  })

  it("모든 레시피에 필수 필드가 있어야 한다", () => {
    for (const recipe of recipes) {
      expect(recipe.id, "id 없음").toBeTruthy()
      expect(recipe.countryCode, `${recipe.id}: countryCode 없음`).toBeTruthy()
      expect(recipe.image, `${recipe.id}: image 없음`).toBeTruthy()
      expect(recipe.difficulty, `${recipe.id}: difficulty 없음`).toBeTruthy()

      for (const locale of LOCALES) {
        expect(recipe.name[locale], `${recipe.id}: name.${locale} 없음`).toBeTruthy()
        expect(recipe.description[locale], `${recipe.id}: description.${locale} 없음`).toBeTruthy()
      }
    }
  })

  it("이미지 경로는 /images/ 하위에 있어야 한다", () => {
    for (const recipe of recipes) {
      if (!recipe.image) continue  // image는 optional
      expect(
        recipe.image,
        `${recipe.id}: 이미지 경로 오류 (${recipe.image})`
      ).toMatch(/^\/images\//)
    }
  })
})
