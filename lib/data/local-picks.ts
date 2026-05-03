/**
 * K-Food Spot 로컬 픽 — 한국관광 데이터랩 외지인 랭킹 TOP 10 기반.
 * 출처: https://korean.visitkorea.or.kr/main/area_chart.do
 * 데이터: Tmap 내비게이션 빅데이터 (외지인이 실제로 찾아간 식당)
 *
 * 체인점/프랜차이즈는 로컬 특화 본점만 유지 (스타벅스/맥도날드 등 일반 체인 제외).
 * contentid 는 scripts/match-local-picks.mjs 가 TourAPI searchKeyword2 로 자동 매칭.
 *
 * 키 = 광역 단위 (seoul/busan/jeonbuk/...) + 시 단위 (andong/cheonan/...).
 * 시 단위 키는 광역 fallback 보다 우선 적용.
 */

export interface LocalPickItem {
  /** URL 슬러그 (영문 소문자, 하이픈) */
  id: string

  /** 한국어 이름 (TourAPI searchKeyword2 입력 키워드) */
  searchName: string

  /** 표시 이름 (5 개국어 — 미입력 시 TourAPI title 사용) */
  displayName?: { ko?: string; ja?: string; en?: string; 'zh-CN'?: string; 'zh-TW'?: string }

  /** TourAPI 매칭 결과 — match-local-picks.mjs 가 자동 채움 */
  contentid?: string
  contenttypeid?: string

  /** 외지인 랭킹 순위 */
  rank: number

  /** 큐레이션 메타 — 자유 입력 */
  curation?: {
    tagline?: { ko?: string; ja?: string; en?: string }
    tags?: string[]
    note?: { ko?: string; ja?: string; en?: string }
  }
}

export const LOCAL_PICKS: Record<string, LocalPickItem[]> = {
  seoul: [
    { id: 'ddosuni-yangpyeongdong', searchName: '또순이네집 양평동점', rank: 1 },
    { id: 'starbucks-bukhansan', searchName: '스타벅스 더북한산점', rank: 2,
      curation: { tags: ['북한산 뷰', '특화매장'] } },
    { id: 'yeongdong-seolleongtang', searchName: '영동설렁탕', rank: 3 },
    { id: 'samwon-garden', searchName: '삼원가든 본점', rank: 4, contentid: '132892', contenttypeid: '39',
      curation: { tags: ['갈비', '강남 명소'] } },
    { id: 'uraeok', searchName: '우래옥 본점', rank: 5, contentid: '133339', contenttypeid: '39',
      curation: {
        tagline: { ko: '서울 평양냉면의 살아있는 전설', en: 'A legendary Pyongyang naengmyeon institution in Seoul' },
        tags: ['평양냉면', '70년 전통'],
      } },
    { id: 'edyacoffee-lab', searchName: '이디야커피랩', rank: 6,
      curation: { tags: ['이디야 플래그십'] } },
    { id: 'gangsulae-sanggye', searchName: '강강술래 상계점', rank: 7 },
    { id: 'apgujeong-gongjudduk', searchName: '압구정공주떡', rank: 9 },
    { id: 'gamnamu-gisasikdang', searchName: '감나무집기사식당', rank: 10 },
  ],

  busan: [
    { id: 'ijaemo-pizza-busan', searchName: '이재모피자 본점', rank: 1, contentid: '2836450', contenttypeid: '39',
      curation: { tags: ['부산 명물 피자'] } },
    { id: 'hapcheon-iryu-dwaejigukbap', searchName: '합천일류돼지국밥 본점', rank: 2, contentid: '2911217', contenttypeid: '39',
      curation: {
        tagline: { ko: '부산 돼지국밥의 정수', en: 'Pinnacle of Busan dwaeji-gukbap' },
        tags: ['돼지국밥', '부산 향토'],
      } },
    { id: 'chilam-sagye', searchName: '칠암사계', rank: 3 },
    { id: 'momos-coffee-busan', searchName: '모모스커피 본점', rank: 4, contentid: '2832729', contenttypeid: '39',
      curation: {
        tagline: { ko: '부산 스페셜티 커피 문화의 상징', en: 'Symbol of Busan specialty coffee culture' },
        tags: ['스페셜티 커피', '월드바리스타'],
      } },
    { id: 'ijaemo-pizza-seomyeon', searchName: '이재모피자 서면점', rank: 5 },
    { id: 'tanti', searchName: '탄티', rank: 6 },
    { id: 'subyeon-choigodwaeji', searchName: '수변최고돼지국밥 민락본점', rank: 7, contentid: '2668102', contenttypeid: '39',
      curation: { tags: ['돼지국밥'] } },
    { id: 'seven-island', searchName: '세븐아일랜드', rank: 8 },
    { id: 'momos-yeongdo', searchName: '모모스커피 영도로스터리&커피바', rank: 9,
      curation: { tags: ['로스터리', '영도'] } },
    { id: 'piaq-cafe', searchName: '피아크카페앤베이커리', rank: 10 },
  ],

  daegu: [
    { id: 'gunwi-irouni-hanwoo', searchName: '군위이로운한우', rank: 1,
      curation: { tags: ['한우', '군위'] } },
    { id: 'anouk-apsan', searchName: '아눅앞산', rank: 2 },
    { id: 'lian-jungsik', searchName: '리안', rank: 3,
      curation: { tags: ['중식'] } },
    { id: 'pureun-hoesikdang', searchName: '푸른회식당', rank: 4 },
    { id: 'barmis-doosan', searchName: '바르미스시앤그릴뷔페 두산점', rank: 5 },
    { id: 'yuksolchon-jjigae', searchName: '육솔촌돼지찌개', rank: 6 },
    { id: 'daedeok-sikdang', searchName: '대덕식당', rank: 7, contentid: '133894', contenttypeid: '39',
      curation: {
        tagline: { ko: '대구 따로국밥의 살아있는 전설', en: 'Living legend of Daegu ttaro-gukbap' },
        tags: ['따로국밥', '대구 향토'],
      } },
    { id: 'opung-doova', searchName: '오풍드부아', rank: 8 },
    { id: 'nakyeong-jjimgalbi', searchName: '낙영찜갈비 본점', rank: 9, contentid: '637751', contenttypeid: '39',
      curation: { tags: ['찜갈비'] } },
    { id: 'seomin-galbi', searchName: '서민갈비', rank: 10 },
  ],

  incheon: [
    { id: 'joyangbangjik', searchName: '조양방직', rank: 1, contentid: '2590794', contenttypeid: '39',
      curation: {
        tagline: { ko: '강화도 폐방직공장 카페', en: 'Strawberry-themed cafe in former Ganghwa textile factory' },
        tags: ['강화도', '카페'],
      } },
    { id: 'forest-outings-songdo', searchName: '포레스트아웃팅스 송도점', rank: 2 },
    { id: 'gongdan-tteokbokki', searchName: '공단떡볶이', rank: 3 },
    { id: 'cafe-mium', searchName: '카페미음', rank: 4 },
    { id: 'omokgol-meminudong', searchName: '오목골즉석메밀우동', rank: 5 },
    { id: 'haesom-ssambap', searchName: '해솜쌈밥', rank: 6 },
    { id: 'jayeon-do-soltbbang', searchName: '자연도소금빵 본점', rank: 7,
      curation: { tags: ['소금빵', '인천 베이커리'] } },
    { id: 'dongyang-yeomjeon-bakery', searchName: '동양염전베이커리카페', rank: 8 },
    { id: 'beolmal-maeuntang', searchName: '벌말매운탕 본점', rank: 9 },
    { id: 'lolbeach-coffee', searchName: '롤비치커피앤브레드', rank: 10 },
  ],

  gwangju: [
    { id: 'changeok-tteokjip', searchName: '창억떡집 중흥본점', rank: 1 },
    { id: 'funny-cafe-and-lounge', searchName: '퍼니스카페앤라운지', rank: 2 },
    { id: 'gomesquare-shinsegae', searchName: '고메스퀘어 광주신세계사거리점', rank: 3 },
    { id: 'sansu-ssambap', searchName: '산수쌈밥', rank: 4, contentid: '2859166', contenttypeid: '39',
      curation: { tags: ['쌈밥', '광주 향토'] } },
    { id: 'gomesquare-sangmu', searchName: '고메스퀘어 광주상무점', rank: 5 },
    { id: 'maek-mundong', searchName: '맥문동', rank: 6 },
    { id: 'changeok-tteok-dongmyeong', searchName: '창억떡 동명점', rank: 7 },
    { id: 'myeonghwa-yuksiksikdang', searchName: '명화식육식당', rank: 8 },
    { id: 'yeongmi-oritang', searchName: '영미오리탕', rank: 9,
      curation: { tags: ['오리탕', '광주 향토'] } },
    { id: 'jinsikdang', searchName: '진식당 본점', rank: 10 },
  ],

  daejeon: [
    { id: 'sungsimdang-main', searchName: '성심당 본점', rank: 1, contentid: '1796079', contenttypeid: '39',
      curation: {
        tagline: { ko: '대전을 대표하는 70년 전통 베이커리', en: "Daejeon's iconic 70-year-old bakery" },
        tags: ['70년 전통', '튀김소보로', '대전 명물'],
      } },
    { id: 'sungsimdang-dcc', searchName: '성심당 DCC점', rank: 2,
      curation: { tags: ['성심당'] } },
    { id: 'sungsimdang-lotte', searchName: '성심당 롯데백화점대전점', rank: 3,
      curation: { tags: ['성심당'] } },
    { id: 'taepyeongso-gukbap-bongwan', searchName: '태평소국밥 본관', rank: 4,
      curation: { tags: ['소국밥', '대전 향토'] } },
    { id: 'omoonchang-sundae-gukbap', searchName: '오문창순대국밥', rank: 5 },
    { id: 'changeok-tteokjip-daejeon', searchName: '창억떡집 대전본점', rank: 6 },
    { id: 'wonjo-taepyeongso', searchName: '원조태평소국밥 태평본점', rank: 7 },
    { id: 'besta-buffet', searchName: '베스타프리미엄뷔페', rank: 8 },
    { id: 'osi-kalguksu', searchName: '오씨칼국수 본점', rank: 9 },
    { id: 'gomesquare-daejeon', searchName: '고메스퀘어 대전둔산직영점', rank: 10 },
  ],

  ulsan: [
    { id: 'eonyang-giwajip-bulgogi', searchName: '언양기와집불고기', rank: 1,
      curation: {
        tagline: { ko: '울산 언양 불고기의 원조', en: 'Origin of Ulsan Eonyang bulgogi' },
        tags: ['언양불고기', '울산 향토'],
      } },
    { id: 'gritbi-seosaeng', searchName: '그릿비 서생점', rank: 2 },
    { id: 'hofpolaa', searchName: '호피폴라', rank: 3 },
    { id: 'tteokbau-hoetjip', searchName: '떡바우횟집', rank: 4 },
    { id: 'yulijeong', searchName: '율리정', rank: 5 },
    { id: 'hangawi', searchName: '한가위', rank: 6 },
    { id: 'cafe-meok', searchName: '카페먹', rank: 7 },
    { id: 'nine-hill', searchName: '나인힐', rank: 8 },
    { id: 'nongdo', searchName: '농도', rank: 9 },
    { id: 'bbangpaje', searchName: '빵파제', rank: 10 },
  ],

  sejong: [
    { id: 'sanjang-garden', searchName: '산장가든', rank: 1 },
    { id: 'bugang-ok', searchName: '부강옥 세종부강본점', rank: 2 },
    { id: 'jangwon-galkalguksu', searchName: '장원갑칼국수 세종본점', rank: 4 },
    { id: 'pang-gwajajeom', searchName: '팡과자점', rank: 5 },
    { id: 'cafe-noho', searchName: '카페노호', rank: 6 },
    { id: 'gomesquare-sejong', searchName: '고메스퀘어 세종점', rank: 7 },
    { id: 'songeunjeong-boribap', searchName: '송은정보리밥 본점', rank: 9 },
    { id: 'chungnam-sundaegukbap', searchName: '충남순대국밥', rank: 10 },
  ],

  gyeonggi: [
    { id: 'jangeo-uikkum', searchName: '장어의꿈', rank: 1 },
    { id: 'ilsan-kalguksu', searchName: '일산칼국수 본점', rank: 2 },
    { id: 'sanyiro-gan-godeungeo', searchName: '산으로간고등어', rank: 3 },
    { id: 'haengju-sanseong-gukjip', searchName: '행주산성원조국수집', rank: 4,
      curation: { tags: ['행주산성', '잔치국수'] } },
    { id: 'gangsulae-neulbom', searchName: '강강술래 늘봄농원점', rank: 5 },
    { id: 'forest-outings-yongin', searchName: '포레스트아웃팅스 용인점', rank: 6 },
    { id: 'gabojeong-galbi', searchName: '가보정갈비 1관', rank: 7, contentid: '602895', contenttypeid: '39',
      curation: { tags: ['수원 갈비', '경기 명소'] } },
    { id: 'cheongdam-chueojeong', searchName: '청담추어정 본점', rank: 8 },
    { id: 'yuchi-hoegwan', searchName: '유치회관 본점', rank: 9 },
    { id: 'songchu-gamagol', searchName: '송추가마골 본관', rank: 10, contentid: '2789360', contenttypeid: '39',
      curation: { tags: ['갈비'] } },
  ],

  gangwon: [
    { id: 'donghwa-garden', searchName: '동화가든 본점', rank: 1, contentid: '623223', contenttypeid: '39',
      curation: {
        tagline: { ko: '강원 초당순두부의 대명사', en: 'Famous Gangwon chodang sundubu spot' },
        tags: ['초당순두부', '강원 향토'],
      } },
    { id: 'toetmaru-dakgalbi', searchName: '툇마루집닭갈비 본점', rank: 2,
      curation: { tags: ['춘천닭갈비', '강원 향토'] } },
    { id: 'cheongcho-mulhoe-sokcho', searchName: '청초수물회 속초본점', rank: 3,
      curation: { tags: ['속초 물회'] } },
    { id: 'bada-jeongwon', searchName: '바다정원', rank: 4 },
    { id: 'gallery-bobs', searchName: '갤러리밥스', rank: 5 },
    { id: 'toetmaru-namchuncheon', searchName: '툇마루집닭갈비 남춘천점', rank: 6 },
    { id: 'manseok-dakgangjeong', searchName: '만석닭강정 본점', rank: 7,
      curation: { tags: ['닭강정', '속초 명물'] } },
    { id: 'choilsoon-jjamppong', searchName: '최일순짬뽕순두부', rank: 8 },
    { id: 'yangji-mal-hwaroguyi', searchName: '양지말화로구이', rank: 9 },
    { id: 'cafe-gamjabat', searchName: '카페감자밭', rank: 10,
      curation: { tags: ['감자빵', '춘천 명물'] } },
  ],

  chungbuk: [
    { id: 'cafe-san', searchName: '카페산', rank: 1,
      curation: { tags: ['단양', '뷰 카페'] } },
    { id: 'memilmadang', searchName: '메밀마당 충주중앙탑본점', rank: 2 },
    { id: 'poyd-carrot', searchName: '포이드캐럿', rank: 3 },
    { id: 'uri-bakery', searchName: '우리베이커리', rank: 4 },
    { id: 'deomsil-bunsik', searchName: '덤실분식', rank: 5 },
    { id: 'bungyong-bulgogi', searchName: '붕용불고기', rank: 6 },
    { id: 'lazy-crocodile', searchName: '게으른악어', rank: 7,
      curation: { tags: ['카페'] } },
    { id: 'majunganeun-gil', searchName: '마중가는길', rank: 8 },
  ],

  chungnam: [
    { id: 'tujourou-bbangdolgama', searchName: '뚜쥬루 빵돌가마점', rank: 1,
      curation: {
        tagline: { ko: '천안을 대표하는 명물 베이커리', en: "Cheonan's iconic local bakery" },
        tags: ['거북이빵', '천안 명물'],
      } },
    { id: 'road-1950', searchName: '로드1950', rank: 2 },
    { id: 'urungi-baksa', searchName: '우렁이박사', rank: 3 },
    { id: 'mokhwa-banjeom', searchName: '목화반점', rank: 4, contentid: '800487', contenttypeid: '39',
      curation: { tags: ['중식'] } },
    { id: 'jangwon-makguksu', searchName: '장원막국수', rank: 5 },
    { id: 'landmark-195', searchName: '랜드마크195', rank: 6 },
    { id: 'pitang-gimtang', searchName: '피탕김탕', rank: 7 },
    { id: 'haereum', searchName: '해어름', rank: 8 },
    { id: 'chungnamjip-sundae', searchName: '충남집순대', rank: 9 },
    { id: 'halmeoni-hakhwa-hodugwaja', searchName: '할머니학화호두과자 본점', rank: 10,
      curation: {
        tagline: { ko: '천안 호두과자의 원조', en: 'Origin of Cheonan walnut cookies' },
        tags: ['호두과자', '천안 명물'],
      } },
  ],

  jeonbuk: [
    { id: 'lee-seongdang-main', searchName: '이성당 본점', rank: 1, contentid: '2010199', contenttypeid: '39',
      curation: {
        tagline: { ko: '한국에서 가장 오래된 빵집', en: "Korea's oldest bakery" },
        tags: ['군산', '단팥빵', '100년 전통'],
      } },
    { id: 'hyundae-ok-jeonju', searchName: '현대옥 전주본점', rank: 2, contentid: '2778475', contenttypeid: '39',
      curation: {
        tagline: { ko: '전주 콩나물국밥의 명가', en: 'Famous Jeonju kongnamul-gukbap' },
        tags: ['콩나물국밥', '전주 향토'],
      } },
    { id: 'hwasim-sundubu', searchName: '화심순두부 본점', rank: 3 },
    { id: 'hanil-ok', searchName: '한일옥', rank: 4 },
    { id: 'jirinseong', searchName: '지린성', rank: 5,
      curation: { tags: ['중식'] } },
    { id: 'sulji-bakery', searchName: '슬지제빵소', rank: 6 },
    { id: 'veteran', searchName: '베테랑', rank: 7, contentid: '2759615', contenttypeid: '39',
      curation: {
        tagline: { ko: '전주 칼국수의 살아있는 전설', en: 'Legendary Jeonju kalguksu' },
        tags: ['칼국수', '전주 향토'],
      } },
    { id: 'binhae-won', searchName: '빈해원', rank: 8, contentid: '854679', contenttypeid: '39',
      curation: { tags: ['중식', '군산'] } },
    { id: 'seonam-manchan', searchName: '서남만찬', rank: 9 },
    { id: 'bokseong-ru', searchName: '복성루', rank: 10, contentid: '1827859', contenttypeid: '39',
      curation: { tags: ['중식'] } },
  ],

  jeonnam: [
    { id: 'naju-gomtang-hayanjip', searchName: '나주곰탕하얀집', rank: 1,
      curation: {
        tagline: { ko: '나주곰탕의 살아있는 전설', en: 'Legendary Naju gomtang' },
        tags: ['나주곰탕', '향토'],
      } },
    { id: 'ssanggyo-sutbul-galbi', searchName: '쌍교숯불갈비 담양본점', rank: 2, contentid: '2841818', contenttypeid: '39',
      curation: { tags: ['담양 떡갈비'] } },
    { id: 'mokwol-bbangjip', searchName: '목월빵집', rank: 3, contentid: '2605429', contenttypeid: '39',
      curation: { tags: ['구례 베이커리'] } },
    { id: 'samdae-gwangyang-bulgogi', searchName: '삼대광양불고기집', rank: 4, contentid: '642995', contenttypeid: '39',
      curation: {
        tagline: { ko: '광양 불고기의 명가', en: 'Famous Gwangyang bulgogi' },
        tags: ['광양불고기', '향토'],
      } },
    { id: 'deulkkot-sup', searchName: '들꽃숲', rank: 5 },
    { id: 'cafe-guman', searchName: '카페구만', rank: 6 },
    { id: 'ddokbang-guksu', searchName: '똑방국수', rank: 7 },
    { id: 'baviere-damyang', searchName: '베비에르 담양점', rank: 8 },
    { id: 'kkotdolgejang-1', searchName: '꽃돌게장1번가', rank: 9, contentid: '2858408', contenttypeid: '39',
      curation: { tags: ['여수', '돌게장'] } },
    { id: 'naju-gomtang-noan', searchName: '나주곰탕노안집', rank: 10 },
  ],

  gyeongbuk: [
    { id: 'hwangnam-bbang', searchName: '황남빵', rank: 1, contentid: '2765063', contenttypeid: '39',
      curation: {
        tagline: { ko: '경주 황남빵의 원조', en: 'Origin of Gyeongju Hwangnam bread' },
        tags: ['경주 명물', '90년 전통'],
      } },
    { id: 'maetdol-sundubu', searchName: '맷돌순두부', rank: 2, contentid: '2838924', contenttypeid: '39',
      curation: { tags: ['경주', '순두부'] } },
    { id: 'breath-coffee-works', searchName: '브레스커피웍스', rank: 3 },
    { id: 'aurora', searchName: '아우로라', rank: 4 },
    { id: 'hwanyeo-hoetjip', searchName: '환여횟집', rank: 5, contentid: '403868', contenttypeid: '39',
      curation: { tags: ['포항', '회'] } },
    { id: 'gyori-gimbap', searchName: '교리김밥 경주본점', rank: 6,
      curation: {
        tagline: { ko: '경주 김밥의 정수', en: 'Pinnacle of Gyeongju gimbap' },
        tags: ['경주 김밥'],
      } },
    { id: 'nokyeongbo-charapa', searchName: '노경보차라파', rank: 7 },
    { id: 'terarosa-gyeongju', searchName: '테라로사 경주점', rank: 8,
      curation: { tags: ['스페셜티 커피'] } },
    { id: 'hanjae-mineri', searchName: '한재참미나리식육식당', rank: 9 },
    { id: 'verdant', searchName: '버던트', rank: 10 },
  ],

  gyeongnam: [
    { id: 'twosomeplace-changwon', searchName: '투썸플레이스 창원귀산해변점', rank: 1,
      curation: { tags: ['해변뷰 카페'] } },
    { id: 'dongbuhoe-center', searchName: '동부회센터', rank: 2 },
    { id: 'daedong-halmae-guksu', searchName: '대동할매국수', rank: 3,
      curation: {
        tagline: { ko: '김해 할매국수의 명가', en: 'Famous Gimhae halmae guksu' },
        tags: ['김해 향토'],
      } },
    { id: 'hayeon-ok', searchName: '하연옥 본점', rank: 4,
      curation: { tags: ['진주냉면', '향토'] } },
    { id: 'haju-ok', searchName: '하주옥', rank: 5 },
    { id: 'starbucks-tongdosa', searchName: '스타벅스 양산통도사점', rank: 6,
      curation: { tags: ['통도사', '특화매장'] } },
    { id: 'mokhwa-hugye-sikdang', searchName: '목화휴게소식당', rank: 7 },
    { id: 'green-house-jujam', searchName: '그린하우스 주남점', rank: 8 },
    { id: 'soto', searchName: '소토', rank: 9 },
    { id: 'starbucks-changwonmachang', searchName: '스타벅스 창원마창대교점', rank: 10,
      curation: { tags: ['특화매장'] } },
  ],

  jeju: [
    { id: 'ujin-haejangguk', searchName: '우진해장국 본관', rank: 1,
      curation: {
        tagline: { ko: '제주 해장국의 자존심', en: 'Pride of Jeju haejangguk' },
        tags: ['제주', '고사리해장국'],
      } },
    { id: 'sosaek-chaebon', searchName: '소색채본', rank: 2 },
    { id: 'yeondon', searchName: '연돈', rank: 3, contentid: '2829949', contenttypeid: '39',
      curation: {
        tagline: { ko: '백종원이 인정한 제주 돈가스', en: "Jeju's famed donkatsu, recommended by Baek Jong-won" },
        tags: ['돈가스', '백종원 추천'],
      } },
    { id: 'jamae-guksu', searchName: '자매국수 본점', rank: 4,
      curation: { tags: ['제주 고기국수'] } },
    { id: 'oneunjeong-gimbap', searchName: '오는정김밥', rank: 5, contentid: '2831635', contenttypeid: '39',
      curation: {
        tagline: { ko: '서귀포 줄서는 김밥집', en: "Jeju's most-queued gimbap shop" },
        tags: ['서귀포 명물'],
      } },
    { id: 'ijaemo-pizza-jeju', searchName: '이재모피자 제주점', rank: 6 },
    { id: 'jejudang-bakery', searchName: '제주당베이커리카페', rank: 7 },
    { id: 'haejigae', searchName: '해지개', rank: 8 },
    { id: 'cafe-lucia', searchName: '카페루시아 본점', rank: 9 },
  ],

  // ── 시 단위 (광역 fallback 대체) — 한국관광 데이터랩 외지인 랭킹 TOP 10 ──

  andong: [
    { id: 'mammoth-bakery-namu', searchName: '맘모스베이커리 남부본점', rank: 1, contentid: '1802913', contenttypeid: '39',
      curation: { tags: ['안동 베이커리'] } },
    { id: 'iljik-sikdang', searchName: '일직식당', rank: 2, contentid: '2738012', contenttypeid: '39',
      curation: { tags: ['안동 한식'] } },
    { id: 'mcd-andong-dt', searchName: '맥도날드 안동DT점', rank: 3,
      curation: { tags: ['안동'] } },
    { id: 'starbucks-andong-gangbyeon', searchName: '스타벅스 안동강변DT점', rank: 4,
      curation: { tags: ['안동 카페'] } },
    { id: 'gureume-396-coffee', searchName: '구름에396커피', rank: 5,
      curation: { tags: ['안동 카페'] } },
    { id: 'mammoth-songhyeon-andong', searchName: '맘모스제과 송현분점', rank: 6,
      curation: { tags: ['안동 베이커리'] } },
    { id: 'okdong-sonkguksu', searchName: '옥동손국수', rank: 7,
      curation: { tags: ['안동 한식'] } },
    { id: 'mokseokwon', searchName: '목석원', rank: 8,
      curation: { tags: ['안동 한식'] } },
    { id: 'wolyeongdang', searchName: '월영당', rank: 9, contentid: '2831873', contenttypeid: '39',
      curation: { tags: ['안동 카페'] } },
    { id: 'sancheong-sikdang-andong', searchName: '산청식당', rank: 10,
      curation: { tags: ['안동 한식'] } },
  ],

  cheonan: [
    { id: 'tujourou-bbangdolgama-cheonan', searchName: '뚜쥬루 빵돌가마점', rank: 1,
      curation: { tags: ['천안 베이커리', '거북이빵'] } },
    { id: 'landmark-195-cheonan', searchName: '랜드마크195', rank: 2,
      curation: { tags: ['천안 카페'] } },
    { id: 'chungnamjip-sundae-cheonan', searchName: '충남집순대', rank: 3, contentid: '1014021', contenttypeid: '39',
      curation: { tags: ['천안'] } },
    { id: 'halmeoni-hakhwa-cheonan', searchName: '할머니학화호도과자 본점', rank: 4,
      curation: { tags: ['천안 호두과자'] } },
    { id: 'tujourou-geobugi', searchName: '뚜쥬루 거북이점', rank: 5,
      curation: { tags: ['천안 베이커리'] } },
    { id: 'baksunja-aunae-sundae', searchName: '박순자아우내순대', rank: 6,
      curation: { tags: ['천안 한식'] } },
    { id: 'eomgane-bonga-sigoljip', searchName: '엄가네본가시골집', rank: 7,
      curation: { tags: ['천안 한식'] } },
    { id: 'sigol-sondubu-cheonan', searchName: '시골손두부', rank: 8,
      curation: { tags: ['천안 한식'] } },
    { id: 'cheonghwajip-cheonan', searchName: '청화집', rank: 9, contentid: '699586', contenttypeid: '39',
      curation: { tags: ['천안 한식'] } },
    { id: 'inju-cafe-pungkyeong', searchName: '인주카페 풍경점', rank: 10, contentid: '2767559', contenttypeid: '39',
      curation: { tags: ['천안 카페'] } },
  ],

  tongyeong: [
    { id: 'arse-tongyeong', searchName: '아르세', rank: 1,
      curation: { tags: ['통영 카페'] } },
    { id: 'ttungbo-halmae-gimbap', searchName: '뚱보할매김밥집', rank: 2,
      curation: { tags: ['통영 충무김밥'] } },
    { id: 'simgane-haemul-jjamppong', searchName: '심가네해물짬뽕', rank: 3, contentid: '2756580', contenttypeid: '39',
      curation: { tags: ['통영 중식'] } },
    { id: 'badadam-tongyeong', searchName: '바다담', rank: 4,
      curation: { tags: ['통영 카페'] } },
    { id: 'dongpirang-jeonbok', searchName: '동피랑전복마을', rank: 5,
      curation: { tags: ['통영 전복'] } },
    { id: 'jjekjjek-coffee-tongyeong', searchName: '짹짹커피 통영점', rank: 6,
      curation: { tags: ['통영 카페'] } },
    { id: 'saengsaeng-gulmaeul-daepunggwan', searchName: '생생굴마을대풍관', rank: 7,
      curation: { tags: ['통영 굴'] } },
    { id: 'starbucks-tongyeong-buksin', searchName: '스타벅스 통영북신DT점', rank: 8,
      curation: { tags: ['통영 카페'] } },
    { id: 'hansanseom-sikdang', searchName: '한산섬식당', rank: 9, contentid: '2929336', contenttypeid: '39',
      curation: { tags: ['통영 한식'] } },
    { id: 'omisa-kkulppang', searchName: '오미사꿀빵', rank: 10,
      curation: { tags: ['통영 꿀빵'] } },
  ],

  yongin: [
    { id: 'sanyiro-godeungeo-yongin', searchName: '산으로간고등어', rank: 1, contentid: '2756816', contenttypeid: '39',
      curation: { tags: ['용인 한식'] } },
    { id: 'forest-outings-yongin-direct', searchName: '포레스트아웃팅스 용인점', rank: 2,
      curation: { tags: ['용인 카페'] } },
    { id: 'gogiri-makguksu', searchName: '고기리막국수', rank: 3, contentid: '2781892', contenttypeid: '39',
      curation: { tags: ['용인 막국수'] } },
    { id: 'miga-hwogwo-yanggogi', searchName: '미가훠궈양고기', rank: 4, contentid: '2742176', contenttypeid: '39',
      curation: { tags: ['용인 중식'] } },
    { id: 'mansujeong-yongin', searchName: '만수정', rank: 5, contentid: '2742174', contenttypeid: '39',
      curation: { tags: ['용인'] } },
    { id: 'gapado-cheongbori-yongin', searchName: '가파도청보리밥', rank: 6,
      curation: { tags: ['용인 한식'] } },
    { id: 'mcd-yongin-suji-dt', searchName: '맥도날드 용인수지DT점', rank: 7,
      curation: { tags: ['용인'] } },
    { id: 'starbucks-yongin-gogi', searchName: '스타벅스 용인고기동유원지점', rank: 8,
      curation: { tags: ['용인 카페'] } },
    { id: 'yudam-deulbap-yongin', searchName: '유담들밥 용인본점', rank: 9,
      curation: { tags: ['용인 한식'] } },
    { id: 'time-to-be-yongin', searchName: '타임투비', rank: 10,
      curation: { tags: ['용인 카페'] } },
  ],

  icheon: [
    { id: 'gangminju-deulbap-icheon', searchName: '강민주의들밥 본점', rank: 1, contentid: '135454', contenttypeid: '39',
      curation: { tags: ['이천 쌀밥'] } },
    { id: 'ijinsanghoe', searchName: '이진상회', rank: 2, contentid: '2875287', contenttypeid: '39',
      curation: { tags: ['이천 카페'] } },
    { id: 'cheongmok-icheon', searchName: '청목', rank: 3,
      curation: { tags: ['이천 한식'] } },
    { id: 'gyeongchundang-icheon', searchName: '경춘당', rank: 4,
      curation: { tags: ['이천'] } },
    { id: 'naratnim-icheon-ssalbap', searchName: '나랏님이천쌀밥', rank: 5,
      curation: { tags: ['이천 쌀밥'] } },
    { id: 'unjung-yangpyeong-haejangguk', searchName: '운중양평해장국설렁탕', rank: 6,
      curation: { tags: ['이천 해장국'] } },
    { id: 'gangminju-icheon-direct', searchName: '강민주의들밥 이천직영점', rank: 7,
      curation: { tags: ['이천 쌀밥'] } },
    { id: 'seorak-makguksu-icheon', searchName: '설악막국수춘천닭갈비 이천점', rank: 8,
      curation: { tags: ['이천 닭갈비'] } },
    { id: 'uju-myeonok-icheon', searchName: '우주면옥 본점', rank: 9,
      curation: { tags: ['이천 면요리'] } },
    { id: 'woni-ssalbap', searchName: '원이쌀밥', rank: 10, contentid: '2773706', contenttypeid: '39',
      curation: { tags: ['이천 쌀밥'] } },
  ],

  sokcho: [
    { id: 'cheongchosu-sokcho-direct', searchName: '청초수물회 속초본점', rank: 1,
      curation: { tags: ['속초 물회'] } },
    { id: 'manseok-sokcho-direct', searchName: '만석닭강정 본점', rank: 2,
      curation: { tags: ['속초 닭강정'] } },
    { id: 'bongpomeoguri-sokcho', searchName: '봉포머구리집 속초본점', rank: 3,
      curation: { tags: ['속초 해산물'] } },
    { id: 'sokcho-hangari-mulhoe', searchName: '속초항아리물회', rank: 4,
      curation: { tags: ['속초 물회'] } },
    { id: 'eighty-eight-saengseon', searchName: '88생선구이', rank: 5, contentid: '134033', contenttypeid: '39',
      curation: { tags: ['속초 생선구이'] } },
    { id: 'kim-yeongae-sundubu', searchName: '김영애할머니순두부 본점', rank: 6, contentid: '2839793', contenttypeid: '39',
      curation: { tags: ['속초 순두부'] } },
    { id: 'shelter-sokcho', searchName: '셜터', rank: 7,
      curation: { tags: ['속초 카페'] } },
    { id: 'cafe-git-sokcho', searchName: '카페긷', rank: 8,
      curation: { tags: ['속초 카페'] } },
    { id: 'starbucks-sokcho-yeongnangho', searchName: '스타벅스 영랑호리조트점', rank: 9,
      curation: { tags: ['속초 카페'] } },
    { id: 'starbucks-sokcho-dt', searchName: '스타벅스 속초DT점', rank: 10,
      curation: { tags: ['속초 카페'] } },
  ],

  yeosu: [
    { id: 'kkotdolgejang-1-yeosu', searchName: '꽃돌게장1번가', rank: 1, contentid: '2858408', contenttypeid: '39',
      curation: { tags: ['여수 게장'] } },
    { id: 'moiphin-ocean', searchName: '모이핀 오션점', rank: 2, contentid: '2931286', contenttypeid: '39',
      curation: { tags: ['여수 카페'] } },
    { id: 'starbucks-yeosu-dolsan', searchName: '스타벅스 더여수돌산DT점', rank: 3,
      curation: { tags: ['여수 카페'] } },
    { id: 'yeosu-myeongdong-gejang', searchName: '여수명동게장', rank: 4,
      curation: { tags: ['여수 게장'] } },
    { id: 'cheongjeong-gejangchon', searchName: '청정게장촌', rank: 5, contentid: '2866501', contenttypeid: '39',
      curation: { tags: ['여수 게장'] } },
    { id: 'sunine-bapsang', searchName: '순이네밥상', rank: 6,
      curation: { tags: ['여수 한식'] } },
    { id: 'bada-gimbap', searchName: '바다김밥', rank: 7,
      curation: { tags: ['여수 김밥'] } },
    { id: 'wonjo-dukkeobi-gejang', searchName: '원조두꺼비게장', rank: 8,
      curation: { tags: ['여수 게장'] } },
    { id: 'pulppuri-heukdubu', searchName: '풀뿌리흑두부', rank: 9,
      curation: { tags: ['여수 두부'] } },
    { id: 'bada-gimbap-dolsan', searchName: '바다김밥 돌산직영점', rank: 10,
      curation: { tags: ['여수 김밥'] } },
  ],
}

/**
 * 도시별 로컬 픽 — city.id 직접 매칭만 (광역 fallback 제거 — 도시별 큐레이션 데이터로 분리됨).
 * 키 없는 도시는 빈 배열 반환 → UI 에서 "준비 중" 표시.
 */
export function getLocalPicks(city: string): LocalPickItem[] {
  return LOCAL_PICKS[city] ?? []
}

/**
 * city.id 또는 province.id 로 픽 찾기 (상세 페이지 라우팅용).
 */
export function findLocalPick(city: string, pickId: string): LocalPickItem | null {
  const picks = getLocalPicks(city)
  return picks.find((p) => p.id === pickId) ?? null
}
