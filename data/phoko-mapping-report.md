# 포토코리아 매핑 결과 (Phase 6.7 draft)

_생성: 2026-04-29T16:20:52.386Z_

## ⚠ 보존 정책

**mapping 안 된 음식의 image URL 은 apply 단계에서 절대 변경 X.**
- mapping 있는 음식만 phoko 이미지로 교체
- mapping 없는 음식은 기존 image (Replicate Flux AI 또는 기존 포토코리아) 그대로 보존
- food-dupes.ts.bak 백업으로 실패 시 복원

## 통계

| 항목 | 값 |
|---|---|
| 총 파일 | 145 |
| 비음식 제외 | 14 |
| 파싱 실패 | 0 |
| 처리 (eligible) | 131 |
| 매핑된 파일 | 111 |
| 매칭 안 된 파일 | 20 |
| 매핑된 음식 | 158 / 239 (66.1%) |
| 매칭 안 된 음식 | 81 (보존) |
| 총 매칭 entry | 158 |
| - high (exact) | 72 |
| - medium | 86 |
| - low | 0 |

## 1:N 매핑 — 36건 (한 파일 → 여러 음식)

### `물회` (5개 음식)
_파일: Type1_물회_스튜디오 4cats_7ooZl7.jpg / by 스튜디오 4cats_

- `jeju-mulhoe` — 물회 _(high, exact_match)_
- `jeju-hanchi-mulhoe` — 제주 한치물회 _(medium, keyword_in_name)_
- `jeju-jari-mulhoe` — 제주 자리물회 _(medium, keyword_in_name)_
- `gyeongju-hanwoo-mulhoe` — 한우 물회 _(medium, keyword_in_name)_
- `sokcho-mulhoe` — 속초 물회 _(medium, keyword_in_name)_

### `된장찌개` (4개 음식)
_파일: Type1_된장찌개_토라이 리퍼블릭_0kyMdH.jpg / by 토라이 리퍼블릭_

- `national-doenjang-jjigae` — 된장찌개 _(high, exact_match)_
- `seoul-doenjang-jjigae` — 서울 된장찌개 _(medium, keyword_in_name)_
- `gyeongju-doenjang-jjigae` — 경주 된장찌개 _(medium, keyword_in_name)_
- `icheon-doenjang-jjigae-hansang` — 된장찌개 한상 _(medium, keyword_in_name)_

### `해물파전` (3개 음식)
_파일: Type1_해물파전_한국관광공사 김지호_WCqdna.jpg / by 한국관광공사 김지호_

- `jeonju-haemul-pajeon` — 해물파전 _(high, exact_match)_
- `busan-haemul-pajeon` — 해물파전 _(high, exact_match)_
- `cheonan-haemul-pajeon` — 천안 해물파전 _(medium, keyword_in_name)_

### `순대` (3개 음식)
_파일: Type1_순대_토라이 리퍼블릭_itEIfn.jpg / by 토라이 리퍼블릭_

- `seoul-sundaekook` — 순대국 _(medium, keyword_in_name)_
- `cheonan-byeongcheon-sundae` — 병천순대 _(medium, keyword_in_name)_
- `yongin-baegam-sundae` — 백암순대 _(medium, keyword_in_name)_

### `장어구이` (3개 음식)
_파일: Type1_장어구이_스튜디오 4cats_Nnoaap.jpg / by 스튜디오 4cats_

- `tongyeong-jangeo-gui` — 통영 장어구이 _(medium, keyword_in_name)_
- `busan-gomjangeo-gui` — 곰장어구이 _(medium, keyword_in_name)_
- `icheon-jangeo-jeongsik` — 장어구이정식 _(medium, keyword_in_name)_

### `갈비탕` (3개 음식)
_파일: Type1_갈비탕_토라이 리퍼블릭_EzACc1.jpg / by 토라이 리퍼블릭_

- `national-galbi-tang` — 갈비탕 _(high, exact_match)_
- `cheonan-galbitang` — 천안 갈비탕 _(medium, keyword_in_name)_
- `icheon-galbitang` — 이천 갈비탕 _(medium, keyword_in_name)_

### `순두부` (3개 음식)
_파일: Type1_순두부_한국관광공사 이범수_rwD3ba.jpg / by 한국관광공사 이범수_

- `yongin-sundubu` — 용인 순두부찌개 _(medium, keyword_in_name)_
- `national-sundubu` — 순두부찌개 _(medium, keyword_in_name)_
- `national-sundubu-gyeongju` — 순두부찌개 _(medium, keyword_in_name)_

### `산채비빔밥` (3개 음식)
_파일: Type1_산채비빔밥_IR 스튜디오_cHfSTa.jpg / by IR 스튜디오_

- `national-sanchae-bibimbap` — 산채비빔밥 _(high, exact_match)_
- `national-sanchae-bibimbap-yongin` — 산채비빔밥 _(high, exact_match)_
- `national-gwangdeok-sanchae` — 광덕산 산채비빔밥 _(medium, keyword_in_name)_

### `콩나물국밥` (2개 음식)
_파일: Type1_콩나물국밥_디엔에이스튜디오_h2SnD2.jpg / by 디엔에이스튜디오_

- `jeonju-kongnamul` — 콩나물국밥 _(high, exact_match)_
- `cheonan-kongnamul-gukbap` — 천안 콩나물국밥 _(medium, keyword_in_name)_

### `한정식` (2개 음식)
_파일: Type1_한정식_토라이 리퍼블릭_IAcjlg.jpg / by 토라이 리퍼블릭_

- `jeonju-hanjeongsik` — 전주 한정식 _(medium, keyword_in_name)_
- `gyeongju-hanjeongsik` — 경주 한정식 _(medium, keyword_in_name)_

### `순대국밥` (2개 음식)
_파일: Type1_순대국밥_김지영_tzGc2w.jpg / by 김지영_

- `cheonan-sundae-soup` — 순대국밥 _(high, exact_match)_
- `jeonju-pisundae` — 피순대와 순대국밥 _(medium, keyword_in_name)_

### `육회` (2개 음식)
_파일: Type1_육회_한국관광공사 김지호_FWuW4a.jpg / by 한국관광공사 김지호_

- `jeonju-yukoe` — 육회 _(high, exact_match)_
- `seoul-yukhoe` — 육회 _(high, exact_match)_

### `식혜` (2개 음식)
_파일: Type1_식혜_한국관광공사 김지호_mHhQZa.jpg / by 한국관광공사 김지호_

- `jeonju-sikhye` — 식혜 _(high, exact_match)_
- `andong-sikhye` — 안동식혜 _(medium, keyword_in_name)_

### `삼겹살` (2개 음식)
_파일: Type1_삼겹살_토라이 리퍼블릭_OiCPWU.jpg / by 토라이 리퍼블릭_

- `seoul-samgyeopsal` — 삼겹살 _(high, exact_match)_
- `icheon-straw-pork` — 볏짚 삼겹살 _(medium, keyword_in_name)_

### `설렁탕` (2개 음식)
_파일: Type1_설렁탕_토라이 리퍼블릭_1id3AQ.jpg / by 토라이 리퍼블릭_

- `seoul-seolleongtang` — 설렁탕 _(high, exact_match)_
- `yongin-seolleongtang` — 용인 설렁탕 _(medium, keyword_in_name)_

### `해물뚝배기` (2개 음식)
_파일: Type1_해물뚝배기_한국관광공사 이범수_mCaz4a.jpg / by 한국관광공사 이범수_

- `tongyeong-haemul-ttukbaegi` — 해물뚝배기 _(high, exact_match)_
- `jeju-haemul-ttukbaegi` — 제주 해물뚝배기 _(medium, keyword_in_name)_

### `해물탕` (2개 음식)
_파일: Type1_해물탕_한국관광공사 김지호_TGCQ3a.jpg / by 한국관광공사 김지호_

- `tongyeong-haemul-tang` — 통영 해물탕 _(medium, keyword_in_name)_
- `yongin-haemul-tang` — 용인 해물탕 _(medium, keyword_in_name)_

### `갈치구이` (2개 음식)
_파일: Type1_갈치구이_한국관광공사 김지호_3UlC3p.jpg / by 한국관광공사 김지호_

- `tongyeong-galchi-gui` — 통영 갈치구이 _(medium, keyword_in_name)_
- `jeju-galchi-gui` — 제주 갈치구이 _(medium, keyword_in_name)_

### `대구탕` (2개 음식)
_파일: Type1_대구탕_한국관광공사 이범수 _huBofa.jpg / by 한국관광공사 이범수_

- `busan-daegu-tang` — 대구탕 _(high, exact_match)_
- `tongyeong-daegu-tang` — 통영 대구탕 _(medium, keyword_in_name)_

### `전복죽` (2개 음식)
_파일: Type1_전복죽_한국관광공사 김지호_LiPq2a.jpg / by 한국관광공사 김지호_

- `jeju-jeonbok-juk` — 전복죽 _(high, exact_match)_
- `busan-jeonbok-juk` — 전복죽 _(high, exact_match)_

### `고사리` (2개 음식)
_파일: Type1_고사리_알렉스 분도_joM8xa.jpg / by 알렉스 분도_

- `jeju-gosari-yukgaejang` — 제주 고사리 육개장 _(medium, keyword_in_name)_
- `jeju-gosari-bokkeum` — 제주 고사리볶음 _(medium, keyword_in_name)_

### `밀면` (2개 음식)
_파일: Type1_밀면_디엔에이스튜디오_JclIeB.jpg / by 디엔에이스튜디오_

- `busan-milmyeon` — 밀면 _(high, exact_match)_
- `gyeongju-milmyeon` — 경주 밀면 _(medium, keyword_in_name)_

### `씨앗호떡` (2개 음식)
_파일: Type1_씨앗호떡_한국관광공사 김지호_sJ8bFa.jpg / by 한국관광공사 김지호_

- `busan-hotteok` — 씨앗호떡 _(high, exact_match)_
- `busan-ssiat-hotteok` — 씨앗호떡 _(high, exact_match)_

### `부산 냉채족발` (2개 음식)
_파일: Type1_부산 냉채족발_김효서_a8ey16.jpg / by 김효서_

- `busan-naengchae-jokbal` — 냉채족발 _(medium, name_in_keyword)_
- `national-jokbal` — 족발 _(medium, name_in_keyword)_

### `어묵(오뎅)` (2개 음식)
_파일: Type1_어묵(오뎅)_한국관광공사 김지호_3HjKXa.jpg / by 한국관광공사 김지호_

- `busan-eomuk` — 어묵 _(high, exact_match)_
- `busan-eomuk-tang` — 어묵탕 _(medium, keyword_in_name)_

### `불고기` (2개 음식)
_파일: Type1_불고기_알렉스 분도_xCXiHa.jpg / by 알렉스 분도_

- `gyeongju-hanwoo-bulgogi` — 한우불고기 _(medium, keyword_in_name)_
- `icheon-dojagi-bulgogi` — 도자기불고기 _(medium, keyword_in_name)_

### `두부전골` (2개 음식)
_파일: Type1_두부전골_디엔에이스튜디오_qTIS6A.jpg / by 디엔에이스튜디오_

- `gyeongju-dubu-jeongol` — 두부전골 _(high, exact_match)_
- `yongin-dubu-jeongol` — 용인 두부전골 _(medium, keyword_in_name)_

### `메밀전병` (2개 음식)
_파일: Type1_메밀전병_IR 스튜디오_UpEQ5a.jpg / by IR 스튜디오_

- `gyeongju-meomil-jeonbyeong` — 메밀전병 _(high, exact_match)_
- `yongin-memil-jeonbyeong` — 용인 메밀전병 _(medium, keyword_in_name)_

### `버섯전골` (2개 음식)
_파일: Type1_버섯전골_한국관광공사 김지호_B0Q2Xa.jpg / by 한국관광공사 김지호_

- `cheonan-mushroom-stew` — 버섯전골 _(high, exact_match)_
- `yongin-beoseot-jeongol` — 용인 버섯전골 _(medium, keyword_in_name)_

### `막국수` (2개 음식)
_파일: Type1_막국수_천준교_1VXdBw.jpg / by 천준교_

- `yongin-makguksu` — 수지 막국수 _(medium, keyword_in_name)_
- `icheon-makguksu` — 이천 막국수 _(medium, keyword_in_name)_

### `한우구이` (2개 음식)
_파일: Type1_한우구이_한국관광공사 이범수_9zxHra.jpg / by 한국관광공사 이범수_

- `yongin-hanwoo` — 용인 한우 구이 _(medium, keyword_in_name)_
- `icheon-hanwoo-gui` — 이천 한우 구이 _(medium, keyword_in_name)_

### `곰탕` (2개 음식)
_파일: Type1_곰탕_토라이 리퍼블릭_u7dewQ.jpg / by 토라이 리퍼블릭_

- `national-gomtang` — 곰탕 _(high, exact_match)_
- `yongin-yangji-gomtang` — 용인 양지곰탕 _(medium, keyword_in_name)_

### `삼계탕` (2개 음식)
_파일: Type1_삼계탕_알렉스 분도_FJxoYa.jpg / by 알렉스 분도_

- `national-samgyetang` — 삼계탕 _(high, exact_match)_
- `yongin-hanbang-samgyetang` — 용인 한방삼계탕 _(medium, keyword_in_name)_

### `감자옹심이` (2개 음식)
_파일: Type1_감자옹심이_디엔에이스튜디오_dPbYf8.jpg / by 디엔에이스튜디오_

- `icheon-gamja-ongsimi` — 감자옹심이 _(high, exact_match)_
- `sokcho-gamja-ongsimi` — 감자옹심이 _(high, exact_match)_

### `안동찜닭` (2개 음식)
_파일: Type1_안동찜닭_IR 스튜디오_3Xgcba.jpg / by IR 스튜디오_

- `andong-jjimdak` — 안동찜닭 _(high, exact_match)_
- `andong-andong-jjimdak` — 안동찜닭 _(high, exact_match)_

### `육회비빔밥` (2개 음식)
_파일: Type1_육회비빔밥_한국관광공사 이범수_RbmPHa.jpg / by 한국관광공사 이범수_

- `national-yukhoe-bibimbap` — 육회비빔밥 _(high, exact_match)_
- `national-hanwoo-yukhoe` — 한우 육회비빔밥 _(medium, keyword_in_name)_


## 1:1 High Confidence — 40건 (정확 일치)

| keyword | 음식 ID | name_ko |
|---|---|---|
| 물짜장 | `jeonju-muljjajang` | 물짜장 |
| 오곡밥 | `jeonju-ogokbap` | 오곡밥 |
| 감자탕 | `seoul-gamjatang` | 감자탕 |
| 라볶이 | `seoul-rabokki` | 라볶이 |
| 충무김밥 | `tongyeong-chungmu-gimbap` | 충무김밥 |
| 꿀빵 | `tongyeong-kkul-ppang` | 꿀빵 |
| 멍게비빔밥 | `tongyeong-meongge-bibimbap` | 멍게비빔밥 |
| 우짜 | `tongyeong-ujja` | 우짜 |
| 피꼬막 | `tongyeong-pi-kkomak` | 피꼬막 |
| 멸치회무침 | `tongyeong-myeolchi-hoemuchim` | 멸치회무침 |
| 학꽁치회 | `tongyeong-hakggongchi-hoe` | 학꽁치 회 |
| 고기국수 | `jeju-gogi-guksu` | 고기국수 |
| 보말칼국수 | `jeju-bomal-kalguksu` | 보말칼국수 |
| 오메기떡 | `jeju-omegi-tteok` | 오메기떡 |
| 한라봉디저트 | `jeju-hallabong` | 한라봉 디저트 |
| 돼지국밥 | `busan-pork-soup` | 돼지국밥 |
| 조개구이 | `busan-grilled-clams` | 조개구이 |
| 비빔당면 | `busan-bibim-dangmyeon` | 비빔당면 |
| 생선구이 | `busan-saengseon-gui` | 생선구이 |
| 해물짬뽕 | `busan-haemul-jjamppong` | 해물짬뽕 |
| 굴전 | `busan-gul-jeon` | 굴전 |
| 복어탕 | `busan-bokeo-tang` | 복어탕 |
| 유부전골 | `busan-yubu-jeongol` | 유부전골 |
| 교리김밥 | `gyeongju-gyori-gimbap` | 교리김밥 |
| 구절판 | `gyeongju-gujeolpan` | 구절판 |
| 호두과자 | `cheonan-walnut-cookie` | 호두과자 |
| 간장게장 | `icheon-ganjang-gejang` | 간장게장 |
| 아바이순대 | `sokcho-abai-sundae` | 아바이순대 |
| 오징어순대 | `sokcho-ojingeo-sundae` | 오징어순대 |
| 안동간고등어 | `andong-gan-godeungeo` | 안동 간고등어 |
| 안동국시 | `andong-guksi` | 안동국시 |
| 잡채 | `national-japchae` | 잡채 |
| 떡볶이 | `national-tteokbokki` | 떡볶이 |
| 오징어볶음 | `national-ojingeo-bokkeum` | 오징어볶음 |
| 약과 | `national-yakgwa` | 약과 |
| 떡국 | `national-tteokguk` | 떡국 |
| 제육볶음 | `national-jeyuk-bokkeum` | 제육볶음 |
| 낙지볶음 | `national-nakji-bokkeum` | 낙지볶음 |
| 부대찌개 | `national-budae-jjigae` | 부대찌개 |
| 김치전 | `national-kimchi-jeon` | 김치전 |

## 매칭 안 된 음식 81건 (image 기존 보존)

### andong (1)

- `andong-heot-jesabap` — 헛제사밥

### busan (5)

- `busan-mul-tteok` — 물떡
- `busan-gopchang` — 양곱창
- `busan-nakgopsae` — 낙곱새
- `busan-hwae` — 활어회
- `busan-agujjim` — 아구찜

### cheonan (9)

- `cheonan-fruit-mochi` — 생과일 모찌
- `cheonan-local-bakery` — 뚜쥬루 앙버터빵
- `cheonan-heuk-dwaeji-gui` — 천안 흑돼지구이
- `cheonan-jokbal` — 천안 족발
- `cheonan-cheonggukjang` — 천안 청국장찌개
- `cheonan-boribap-jeongsik` — 천안 보리밥정식
- `cheonan-bossam` — 천안 보쌈
- `cheonan-makgeolli-ppang` — 천안 막걸리빵
- `cheonan-kalguksu` — 천안 칼국수

### gyeongju (7)

- `gyeongju-tteokgalbi` — 경주 떡갈비
- `gyeongju-ssambap` — 쌈밥 정식
- `gyeongju-haejangguk` — 경주 해장국
- `gyeongju-chalborippang` — 찰보리빵
- `gyeongju-bamyeot` — 밤엿
- `gyeongju-sujae-maekju` — 수제맥주
- `gyeongju-solsongju` — 솔송주

### icheon (6)

- `icheon-bori-gulbi` — 보리굴비
- `icheon-hangwa` — 이천 한과
- `icheon-sansuyu-makgeolli` — 산수유 막걸리
- `icheon-cheonggukjang-jeongsik` — 청국장정식
- `icheon-neungi-shabu` — 능이버섯샤브샤브
- `icheon-bokjung-ppang` — 복숭아빵

### jeju (9)

- `jeju-black-pork` — 흑돼지 구이
- `jeju-momguk` — 몸국
- `jeju-bingtteok` — 빙떡
- `jeju-kkwong-memil-guksu` — 꿩메밀국수
- `jeju-gamgyul-juice` — 감귤주스
- `jeju-okdom-gui` — 제주 옥돔구이
- `jeju-jeonbok-ttukbaegi` — 제주 전복뚝배기
- `jeju-jeopjjak-bbyeoguk` — 제주 접짝뼈국
- `jeju-dwaeji-kimchi-bokkeum` — 제주 흑돼지 김치볶음

### jeonju (10)

- `jeonju-bibimbap` — 전주비빔밥
- `jeonju-tteokgalbi` — 전주 떡갈비
- `jeonju-kalguksu` — 전주식 칼국수
- `jeonju-omogaritang` — 오모가리탕
- `jeonju-chocopie` — 수제 초코파이
- `jeonju-yukgaejang` — 육개장
- `jeonju-bindaetteok` — 녹두전
- `jeonju-cheonggukjang` — 청국장
- `jeonju-bori-guksu` — 보리국수
- `jeonju-gondrebap` — 곤드레밥

### national (5)

- `national-kimchi-jjigae` — 김치찌개
- `national-bossam` — 보쌈
- `national-hangwa` — 한과
- `national-kkomak-bibimbap` — 꼬막비빔밥
- `national-chapssal-tteok` — 찹쌀떡

### seoul (8)

- `seoul-street-toast` — 길거리 토스트
- `seoul-hangang-ramen` — 한강 라면
- `seoul-kalguksu` — 서울 칼국수
- `seoul-mayak-gimbap` — 광장시장 마약김밥
- `seoul-gopchang` — 곱창구이
- `seoul-yang-kkochi` — 양꼬치
- `seoul-chimaek` — 치맥
- `seoul-galbi` — 서울 소갈비

### tongyeong (12)

- `tongyeong-oyster-soup` — 통영 굴국밥
- `tongyeong-sirakguk` — 시락국
- `tongyeong-ppaettaegi-juk` — 빼때기죽
- `tongyeong-dacci` — 다찌 해산물
- `tongyeong-dodari-ssuk` — 도다리쑥국
- `tongyeong-gulbap` — 통영 굴밥
- `tongyeong-jeonbok-gui` — 통영 전복구이
- `tongyeong-mulmegi-tang` — 통영 물메기탕
- `tongyeong-bajirak-kalguksu` — 통영 바지락칼국수
- `tongyeong-saengseon-hoe-jeongsik` — 통영 생선회 정식
- `tongyeong-honghap-tang` — 통영 홍합탕
- `tongyeong-mideodeok-jjim` — 미더덕찜

### yeosu (2)

- `yeosu-seodae-hoemuchim` — 서대회무침
- `yeosu-gejang-baekban` — 여수 게장백반

### yongin (7)

- `yongin-jangter-gukbap` — 민속촌 장터국밥
- `yongin-nurungji-baeksuk` — 누룽지 백숙
- `yongin-pajeon` — 민속촌 파전
- `yongin-cafe-dessert` — 보정동 카페거리 디저트
- `yongin-makgeolli` — 용인 막걸리
- `yongin-sanchae-jeongsik` — 용인 산채정식
- `yongin-heuk-dwaeji` — 용인 흑돼지구이


## 매칭 안 된 파일 20건 (음식 후보 없음)

- `간재미회무침` — Type1_간재미회무침_한국관광공사 김지호_iUagna.jpg
- `꼬막정식` — Type1_꼬막정식_스튜디오 4cats_GI5t0t.jpg
- `닭백숙` — Type1_닭백숙_한국관광공사 박은경_XxhKza.jpg
- `돌게장` — Type1_돌게장_스튜디오 4cats_AkAcwc.jpg
- `매생이굴국밥` — Type1_매생이굴국밥_한국관광공사 이범수_pcSiBa.jpg
- `멸치쌈밥` — Type1_멸치쌈밥_부산관광공사_JW0pPk.jpg
- `보문산 보리밥` — Type1_보문산 보리밥_한국관광공사 김지호_WCqdda.jpg
- `비빔막국수` — Type1_비빔막국수_천준교_0G5b5d.jpg
- `삼겹살` — Type1_삼겹살_한국관광공사 김지호_ENnhza.jpg
- `속초 막걸리빵` — Type1_속초 막걸리빵_테마상품팀 IR 스튜디오_zxHyFa.jpg
- `수육` — Type1_수육_황성훈_Ap3X96.jpg
- `연남 소갈비` — Type1_연남 소갈비_한국관광공사 프레임스튜디오_mfsr4a.jpg
- `엿` — Type1_엿_한국관광공사 김지호_uv8KUa.jpg
- `전복버터구이` — Type1_전복버터구이_한국관광공사 김지호_cOddnB.jpg
- `전주 베테랑칼국수` — Type1_전주 베테랑칼국수_한국관광공사 김지호_5wvfJa.jpg
- `치킨` — Type1_치킨_토라이 리퍼블릭_ScvEBZ.jpg
- `한가원(한과문화박물관)` — Type1_한가원(한과문화박물관)_한국관광공사 김지호_gJRUTa.jpg
- `한정식` — Type1_한정식_토라이 리퍼블릭_YWDsyc.jpg
- `회` — Type1_회_디엔에이스튜디오_Ij5p2g.jpg
- `흑돼지 불고기` — Type1_흑돼지 불고기_한국관광공사 이범수_mCazia.jpg

## 비음식 skip 14건

- `광장시장` — Type1_광장시장_한국관광공사 이범수_84cpha.jpg
- `다찌` — Type1_다찌_스튜디오 4cats_GbFTSV.jpg
- `디저트` — Type1_디저트_한국관광공사 이범수_okwjua.jpg
- `막걸리` — Type1_막걸리_알렉스 분도_joM8Ta.jpg
- `맥주` — Type1_맥주_한국관광공사 김지호_bDFYVa.jpg
- `부산 온천장 곰장어골목` — Type1_부산 온천장 곰장어골목_한국관광공사 이범수_J0pEpa.jpg
- `생과일모찌` — Type1_생과일모찌_한국관광공사 김지호_bEK1Ma.jpg
- `신사동 아귀찜골목` — Type1_신사동 아귀찜골목_한국관광공사 이범수_0FxMpa.jpg
- `안지랑곱창골목` — Type1_안지랑곱창골목_김지영_IHtYGF.jpg
- `애담찹쌀떡` — Type1_애담찹쌀떡_한국관광공사 김지호_bEK1Ia.jpg
- `장충동 족발골목` — Type1_장충동 족발골목_한국관광공사 이범수_5lX5Ya.jpg
- `정남진 장흥토요시장` — Type1_정남진 장흥토요시장_한국관광공사 김지호_22PZSa.jpg
- `토스트` — Type1_토스트_알렉스분도_EZMe4r.jpg
- `한강라면` — Type1_한강라면_알렉스 분도_DLWMza.jpg
