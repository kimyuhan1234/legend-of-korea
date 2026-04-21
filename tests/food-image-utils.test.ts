import { describe, it, expect } from 'vitest'
import { cleanKoreanFoodName, toEnglishQuery, KOREAN_FOOD_MAP } from '../lib/food-image/korean-to-english'

describe('cleanKoreanFoodName', () => {
  it('지역명 접두사를 제거한다', () => {
    expect(cleanKoreanFoodName('용인 순두부찌개')).toBe('순두부찌개')
    expect(cleanKoreanFoodName('전주비빔밥')).toBe('전주비빔밥') // 붙어있는 지역명은 제거 안 함
    expect(cleanKoreanFoodName('서울 된장찌개')).toBe('된장찌개')
    expect(cleanKoreanFoodName('제주 흑돼지 구이')).toBe('흑돼지 구이')
    expect(cleanKoreanFoodName('이천 갈비탕')).toBe('갈비탕')
    expect(cleanKoreanFoodName('천안 칼국수')).toBe('칼국수')
  })

  it('지역명 없는 경우 그대로 반환한다', () => {
    expect(cleanKoreanFoodName('삼겹살')).toBe('삼겹살')
    expect(cleanKoreanFoodName('냉면')).toBe('냉면')
  })
})

describe('toEnglishQuery', () => {
  it('매핑 테이블에 있는 음식명은 영문 쿼리를 반환한다', () => {
    const result = toEnglishQuery('비빔밥')
    expect(result).toContain('bibimbap')
  })

  it('지역명 포함 음식명도 정리 후 매핑한다', () => {
    const result = toEnglishQuery('용인 순두부찌개')
    expect(result).toContain('sundubu')
  })

  it('매핑 없을 때 태그를 활용한다', () => {
    const result = toEnglishQuery('알 수 없는 음식', ['해산물', '구이'])
    expect(result).toContain('korean food')
  })

  it('매핑 없고 태그도 없을 때 이름+korean food를 반환한다', () => {
    const result = toEnglishQuery('미지의음식')
    expect(result).toContain('korean food')
  })
})

describe('KOREAN_FOOD_MAP', () => {
  it('주요 한식 50개 이상이 매핑되어 있다', () => {
    expect(Object.keys(KOREAN_FOOD_MAP).length).toBeGreaterThanOrEqual(50)
  })

  it('모든 매핑값이 비어있지 않다', () => {
    for (const [ko, en] of Object.entries(KOREAN_FOOD_MAP)) {
      expect(en, `${ko} 매핑이 비어있음`).toBeTruthy()
      expect(en.trim().length, `${ko} 매핑이 공백만 있음`).toBeGreaterThan(0)
    }
  })
})
