// ─────────────────────────────────────────────
//  lib/data/diy-workshops.ts
//  서울 / 부산 도시별 체험 묶음 데이터 (GetYourGuide 검색 URL만 사용)
// ─────────────────────────────────────────────

type I18n = { ko: string; en: string; ja: string }

export interface CityWorkshopExperience {
  icon: string
  name: I18n
  desc: I18n
  price: string
  duration: string
  image: string
  detailDesc: I18n
  location: I18n
  features: { ko: string[]; en: string[]; ja: string[] }
}

export interface CityWorkshop {
  cityId: string
  cityName: I18n
  description: I18n
  experiences: CityWorkshopExperience[]
  bookingLinks: { platform: string; url: string; icon: string }[]
}

export const CITY_WORKSHOPS: CityWorkshop[] = [
  {
    cityId: 'seoul',
    cityName: { ko: '서울', en: 'Seoul', ja: 'ソウル' },
    description: {
      ko: '한옥에서 즐기는 트렌디한 공방 체험',
      en: 'Trendy craft workshops in traditional Hanok',
      ja: '韓屋で楽しむトレンディなクラフト体験',
    },
    experiences: [
      {
        icon: '🌸',
        name: { ko: '한옥 향수 만들기', en: 'Perfume Making in Hanok', ja: '韓屋で香水作り' },
        desc: {
          ko: '500가지 향료 중 골라 나만의 시그니처 향수 제작',
          en: 'Create your signature scent from 500+ fragrance materials',
          ja: '500種以上の香料から自分だけの香水を作る',
        },
        price: '₩35,000~',
        duration: '1.5~2h',
        image: '/images/diy/seoul-perfume-hanok.jpg',
        detailDesc: {
          ko: '전통 한옥에서 500가지 이상의 향료를 직접 시향하고, 전문 조향사의 안내로 나만의 시그니처 향수를 만드는 체험입니다. 완성된 향수(50ml)는 고급 패키지에 담아 가져갈 수 있어 여행 기념품으로도 완벽합니다.',
          en: 'In a traditional Hanok, explore 500+ fragrance materials and create your own signature perfume guided by a professional perfumer. Take home your finished 50ml perfume in luxury packaging — a perfect travel souvenir.',
          ja: '伝統韓屋で500種以上の香料を試し、プロの調香師のガイドで自分だけのシグネチャー香水を作る体験です。完成した香水(50ml)は高級パッケージでお持ち帰りいただけます。',
        },
        location: { ko: '서울 북촌', en: 'Bukchon, Seoul', ja: 'ソウル北村' },
        features: {
          ko: ['영어 안내 가능', '당일 완성품 수령', '예약 필수', '2인 이상 추천'],
          en: ['English guide available', 'Same-day takeaway', 'Reservation required', 'Recommended for 2+'],
          ja: ['英語ガイド対応', '当日完成品受取', '予約必須', '2名以上推奨'],
        },
      },
      {
        icon: '🌸',
        name: { ko: '홍대 니치 퍼퓸 클래스', en: 'Niche Perfume Class in Hongdae', ja: '弘大ニッチパフュームクラス' },
        desc: {
          ko: '100% 천연 오일로 50ml EDP + 10ml 테스터 세트 제작',
          en: 'Craft 50ml EDP + 10ml tester set with 100% natural oils',
          ja: '100%天然オイルで50ml EDP + 10mlテスターセット作り',
        },
        price: '₩45,000~',
        duration: '1.5h',
        image: '/images/diy/seoul-perfume-hongdae.jpg',
        detailDesc: {
          ko: '홍대 골목의 아늑한 향수 공방에서 100% 천연 에센셜 오일과 앱솔루트로 나만의 니치 향수를 조향합니다. 한국적 감성의 독자적인 베이스 향료를 사용하여 세상에 하나뿐인 향수를 만들 수 있습니다. 50ml EDP + 10ml 트래블 사이즈 세트를 가져갑니다.',
          en: "In a cozy perfume house in a Hongdae alley, blend your own niche perfume using 100% natural essential oils with unique Korean-inspired base scents. Take home a 50ml EDP + 10ml travel-size tester set — a fragrance you can't find anywhere else.",
          ja: '弘大の路地裏にある香水工房で、100%天然エッセンシャルオイルと韓国的感性のベース香料を使って世界に一つだけの香水を作ります。50ml EDP + 10mlトラベルサイズセットをお持ち帰り。',
        },
        location: { ko: '서울 홍대/합정', en: 'Hongdae/Hapjeong, Seoul', ja: 'ソウル弘大/合井' },
        features: {
          ko: ['영어 안내 가능', '100% 천연 오일', '남성 향수도 가능', '예약 필수'],
          en: ['English available', '100% natural oils', "Men's cologne available", 'Reservation required'],
          ja: ['英語対応', '100%天然オイル', 'メンズ香水も可能', '予約必須'],
        },
      },
      {
        icon: '💍',
        name: {
          ko: '실버링 만들기 (성수/잠실/혜화/홍대)',
          en: 'Silver Ring Making (Seongsu/Jamsil/Hyehwa/Hongdae)',
          ja: 'シルバーリング作り（聖水/蚕室/恵化/弘大）',
        },
        desc: {
          ko: '전문 장인이 안내하는 실버 주얼리 제작 체험',
          en: 'Craft personal silver jewelry guided by professional artisans',
          ja: 'プロの職人がガイドするシルバージュエリー制作体験',
        },
        price: '₩30,000~',
        duration: '1.5~2h',
        image: '/images/diy/seoul-silver-ring.jpg',
        detailDesc: {
          ko: '성수, 잠실, 혜화, 홍대 등 서울 주요 지역의 아틀리에에서 순은을 직접 망치질하고 성형하여 나만의 실버링을 만드는 체험입니다. 커플링, 우정반지, 혼자만의 기념반지 등 어떤 목적이든 환영합니다. 보석 세팅도 가능합니다.',
          en: 'At ateliers in Seongsu, Jamsil, Hyehwa, and Hongdae, hammer and shape pure silver into your own ring. Perfect for couple rings, friendship rings, or a personal keepsake. Gemstone setting available.',
          ja: '聖水、蚕室、恵化、弘大のアトリエで純銀を直接ハンマーで叩いてシルバーリングを作る体験。カップルリング、友情リング、記念リングなど目的を問わず歓迎。宝石セッティングも可能。',
        },
        location: { ko: '서울 성수/잠실/혜화/홍대', en: 'Seongsu/Jamsil/Hyehwa/Hongdae', ja: '聖水/蚕室/恵化/弘大' },
        features: {
          ko: ['영어 안내 가능', '당일 수령', '커플/친구 추천', '보석 세팅 옵션'],
          en: ['English available', 'Same-day pickup', 'Perfect for couples', 'Gemstone option'],
          ja: ['英語対応', '当日受取', 'カップル推奨', '宝石セッティング可'],
        },
      },
      {
        icon: '📜',
        name: { ko: '북촌 한지 공예', en: 'Hanji Paper Craft in Bukchon', ja: '北村韓紙工芸' },
        desc: {
          ko: '전통 한옥에서 한지로 소품 만들기 체험',
          en: 'Create accessories with traditional Korean paper in a real Hanok',
          ja: '伝統韓屋で韓紙の小物作り体験',
        },
        price: '₩15,000~',
        duration: '1~1.5h',
        image: '/images/diy/seoul-hanji.jpg',
        detailDesc: {
          ko: '북촌 한옥마을의 실제 한옥에서 1000년 전통의 한지(한국 전통 종이)를 사용하여 엽서, 부채, 소품함 등을 만드는 체험입니다. 한지의 독특한 질감과 내구성을 직접 느끼며 한국 전통 공예를 배울 수 있습니다.',
          en: 'In a genuine Hanok in Bukchon Village, create postcards, fans, and accessory boxes using hanji — Korean traditional paper with 1000 years of history. Feel the unique texture and durability of hanji while learning Korean traditional craft.',
          ja: '北村韓屋村の本物の韓屋で、1000年の伝統を持つ韓紙を使ってポストカード、扇子、小物入れなどを作る体験。韓紙の独特な質感と耐久性を直接感じながら韓国伝統工芸を学べます。',
        },
        location: { ko: '서울 북촌 한옥마을', en: 'Bukchon Hanok Village, Seoul', ja: 'ソウル北村韓屋村' },
        features: {
          ko: ['예약 없이 가능 (일부)', '₩5,000부터 시작', '가족 친화적', '안국역 도보 10분'],
          en: ['Walk-in OK (some)', 'From ₩5,000', 'Family friendly', '10min from Anguk Station'],
          ja: ['予約なしOK（一部）', '₩5,000から', 'ファミリー歓迎', '安国駅徒歩10分'],
        },
      },
      {
        icon: '✨',
        name: { ko: '나전칠기 공예 (북촌)', en: 'Mother-of-Pearl Craft in Bukchon', ja: '螺鈿漆器工芸（北村）' },
        desc: {
          ko: '자개를 이용한 보석함/브로치 만들기',
          en: 'Make a jewelry box or brooch with mother-of-pearl inlay',
          ja: '螺鈿で宝石箱やブローチ作り',
        },
        price: '₩20,000~',
        duration: '1.5h',
        image: '/images/diy/seoul-nacre.jpg',
        detailDesc: {
          ko: '한국 전통 나전칠기 기법으로 자개(조개 껍데기의 진주층)를 활용하여 보석함, 브로치, 손거울, 엽서 등을 만드는 체험입니다. 한국 무형문화재 장인의 기술을 체험할 수 있는 귀한 기회입니다.',
          en: 'Using traditional Korean mother-of-pearl inlay technique (najeon-chilgi), create a jewelry box, brooch, hand mirror, or postcard. A rare opportunity to experience the skills of Korean intangible cultural heritage artisans.',
          ja: '韓国伝統螺鈿漆器技法で、貝殻の真珠層を活用して宝石箱、ブローチ、手鏡、ポストカードなどを作る体験。韓国無形文化財の匠の技を体験できる貴重な機会です。',
        },
        location: { ko: '서울 북촌', en: 'Bukchon, Seoul', ja: 'ソウル北村' },
        features: {
          ko: ['영어 안내 가능', '건조 시간 필요 (1주)', '한국 전통 공예', '예약 필수'],
          en: ['English available', 'Drying time needed (1 week)', 'Korean heritage craft', 'Reservation required'],
          ja: ['英語対応', '乾燥時間必要（1週間）', '韓国伝統工芸', '予約必須'],
        },
      },
      {
        icon: '🪢',
        name: { ko: '보자기 매듭 공예', en: 'Bojagi Wrapping Art Class', ja: 'ポジャギ包み工芸' },
        desc: {
          ko: '연세대 인증 전문가에게 배우는 전통 보자기 아트',
          en: 'Learn traditional Bojagi from a Yonsei University certified expert',
          ja: '延世大学認定専門家から伝統ポジャギを学ぶ',
        },
        price: '₩25,000~',
        duration: '1.5h',
        image: '/images/diy/seoul-bojagi.jpg',
        detailDesc: {
          ko: '연세대학교 1급 인증 전문가에게 한국 전통 보자기 포장 아트를 배우는 체험입니다. 단순한 공예가 아니라 한국의 미학과 문화를 담은 포장 예술을 배울 수 있습니다. 완성된 보자기 작품은 가져갈 수 있습니다.',
          en: "Learn the art of Bojagi (Korean traditional wrapping cloth) from a Level 1 certified expert from Yonsei University. More than just craft — it's Korean aesthetic and cultural art of wrapping. Take home your finished piece.",
          ja: '延世大学1級認定の専門家から韓国伝統のポジャギ（風呂敷）アートを学ぶ体験。単なる工芸ではなく、韓国の美学と文化を込めた包装芸術を学べます。完成した作品はお持ち帰り可能。',
        },
        location: { ko: '서울 종로', en: 'Jongno, Seoul', ja: 'ソウル鍾路' },
        features: {
          ko: ['영어 안내 가능', '인증 전문가 강의', '완성품 수령', '예약 필수'],
          en: ['English available', 'Certified instructor', 'Take home finished work', 'Reservation required'],
          ja: ['英語対応', '認定専門家の指導', '完成品受取', '予約必須'],
        },
      },
    ],
    bookingLinks: [
      { platform: 'GetYourGuide', url: 'https://www.getyourguide.com/seoul-l197/arts-crafts-workshops-tc80/', icon: '🔵' },
    ],
  },
  {
    cityId: 'busan',
    cityName: { ko: '부산', en: 'Busan', ja: '釜山' },
    description: {
      ko: '바다가 보이는 공방에서 특별한 체험',
      en: 'Special craft experiences with ocean views',
      ja: '海が見える工房での特別な体験',
    },
    experiences: [
      {
        icon: '🌸',
        name: { ko: '부산 향수 만들기', en: 'Perfume Making in Busan', ja: '釜山で香水作り' },
        desc: {
          ko: '해운대/광안리 인근 공방에서 나만의 향수 제작',
          en: 'Create your own perfume near Haeundae/Gwangalli',
          ja: '海雲台/広安里近くの工房で自分だけの香水作り',
        },
        price: '₩30,000~',
        duration: '1.5h',
        image: '/images/diy/busan-perfume.jpg',
        detailDesc: {
          ko: '해운대·광안리 바다 전망이 펼쳐지는 공방에서 바다 향을 모티브로 나만의 시그니처 향수를 조향하는 체험입니다. 부산의 여름 바다, 갈맷길 솔향 등 지역 감성을 담은 향료를 사용합니다. 완성된 향수(30ml)는 바로 가져갈 수 있습니다.',
          en: 'At a workshop overlooking Haeundae or Gwangalli Beach, craft your own signature perfume inspired by the sea. Choose from ocean, pine, and local Busan-inspired fragrance materials. Take home your finished 30ml perfume immediately.',
          ja: '海雲台・広安里の海が見える工房で、海をモチーフにした自分だけのシグネチャー香水を調香する体験。釜山の夏の海や松の香りなど地域感性の香料を使用。完成した香水(30ml)はすぐにお持ち帰り。',
        },
        location: { ko: '부산 해운대/광안리', en: 'Haeundae/Gwangalli, Busan', ja: '釜山海雲台/広安里' },
        features: {
          ko: ['바다 뷰 공방', '당일 완성품 수령', '커플 체험 추천', '예약 필수'],
          en: ['Ocean view studio', 'Same-day takeaway', 'Great for couples', 'Reservation required'],
          ja: ['海ビューの工房', '当日完成品受取', 'カップル体験推奨', '予約必須'],
        },
      },
      {
        icon: '💍',
        name: { ko: '실버링 만들기', en: 'Silver Ring Workshop', ja: 'シルバーリング作り' },
        desc: {
          ko: '커플링/우정반지 직접 제작 체험',
          en: 'Craft your own couple or friendship rings',
          ja: 'カップルリング/友情リングを手作り',
        },
        price: '₩30,000~',
        duration: '1.5~2h',
        image: '/images/diy/busan-silver-ring.jpg',
        detailDesc: {
          ko: '광안리 바다가 보이는 주얼리 아틀리에에서 순은 소재를 직접 망치질하여 나만의 실버링을 제작합니다. 커플링, 우정반지, 개인 기념반지 어떤 형태든 가능하며 사이즈 각인 서비스도 포함됩니다.',
          en: 'At a jewelry atelier overlooking Gwangalli Beach, hammer pure silver into your own ring. Couple rings, friendship rings, and solo commemorative rings are all welcome. Ring sizing and engraving service included.',
          ja: '広安里の海が見えるジュエリーアトリエで、純銀をハンマーで叩いてリングを作ります。カップルリング、友情リング、個人記念リングすべて対応。サイズ刻印サービス込み。',
        },
        location: { ko: '부산 광안리', en: 'Gwangalli, Busan', ja: '釜山広安里' },
        features: {
          ko: ['영어 안내 가능', '각인 서비스 포함', '커플/친구 추천', '당일 수령'],
          en: ['English available', 'Engraving included', 'Perfect for couples', 'Same-day pickup'],
          ja: ['英語対応', '刻印サービス込み', 'カップル推奨', '当日受取'],
        },
      },
      {
        icon: '🕯️',
        name: { ko: '바다향 캔들 만들기', en: 'Ocean Candle Making', ja: '海キャンドル作り' },
        desc: {
          ko: '부산 바다를 담은 소이 캔들 제작',
          en: 'Make a soy candle inspired by Busan ocean',
          ja: '釜山の海をイメージしたソイキャンドル作り',
        },
        price: '₩25,000~',
        duration: '1h',
        image: '/images/diy/busan-candle.jpg',
        detailDesc: {
          ko: '천연 소이왁스와 부산 바다를 모티브로 한 에센셜 오일을 사용하여 나만의 향초를 만드는 체험입니다. 유리 컨테이너에 담긴 완성 캔들은 여행 기념품으로 가져가거나 지인에게 선물하기에 완벽합니다. 굳는 시간 동안 주변 카페를 즐길 수 있습니다.',
          en: 'Using natural soy wax and ocean-inspired essential oils from Busan, create your own scented candle. The finished candle in a glass container makes a perfect souvenir or gift. Enjoy a nearby cafe while it sets.',
          ja: '天然ソイワックスと釜山の海をモチーフにしたエッセンシャルオイルを使って自分だけの香キャンドルを作る体験。ガラス容器に入った完成キャンドルはお土産やプレゼントに最適。固まる間は近くのカフェを楽しめます。',
        },
        location: { ko: '부산 해운대/서면', en: 'Haeundae/Seomyeon, Busan', ja: '釜山海雲台/西面' },
        features: {
          ko: ['천연 소이왁스', '당일 완성', '여행 기념품 최적', '초보자 환영'],
          en: ['Natural soy wax', 'Same-day finish', 'Perfect travel souvenir', 'Beginners welcome'],
          ja: ['天然ソイワックス', '当日完成', '旅行土産に最適', '初心者歓迎'],
        },
      },
      {
        icon: '🏺',
        name: { ko: '도자기 페인팅', en: 'Ceramic Painting', ja: '陶磁器ペインティング' },
        desc: {
          ko: '미리 구워진 도자기에 나만의 디자인 페인팅',
          en: 'Paint your own design on pre-fired ceramics',
          ja: '焼成済み陶磁器に自分だけのデザインをペイント',
        },
        price: '₩20,000~',
        duration: '1~1.5h',
        image: '/images/diy/busan-ceramics.jpg',
        detailDesc: {
          ko: '이미 성형·소성된 도자기(컵, 접시, 화병 중 선택)에 자유롭게 그림을 그리고 유약을 칠하는 체험입니다. 도예 초보자도 부담 없이 즐길 수 있으며, 아이와 함께 하기에도 적합합니다. 완성작은 현장에서 바로 가져갈 수 있습니다.',
          en: 'Paint freely on a pre-formed and bisque-fired ceramic (choose from cup, plate, or vase) and glaze it. Perfectly accessible for beginners and great for kids too. Take your finished piece home right away.',
          ja: '成形・素焼き済みの陶磁器（マグカップ、皿、花瓶から選択）に自由に絵付けして釉薬を塗る体験。陶芸初心者でも気軽に楽しめ、子どもと一緒にも最適。完成品はその場でお持ち帰り。',
        },
        location: { ko: '부산 해운대/남포동', en: 'Haeundae/Nampo-dong, Busan', ja: '釜山海雲台/南浦洞' },
        features: {
          ko: ['초보자 환영', '당일 수령', '아이와 함께 OK', '디자인 자유'],
          en: ['Beginners welcome', 'Same-day pickup', 'Kid-friendly', 'Free design choice'],
          ja: ['初心者歓迎', '当日受取', '子ども同伴OK', 'デザイン自由'],
        },
      },
    ],
    bookingLinks: [
      { platform: 'GetYourGuide', url: 'https://www.getyourguide.com/s/?q=busan+craft+class', icon: '🔵' },
    ],
  },
]
