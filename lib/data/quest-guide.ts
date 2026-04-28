// lib/data/quest-guide.ts
// /quest/guide 페이지의 5개국어 콘텐츠
// 분리 파일로 두어 페이지 컴포넌트가 가벼워지고, 번역 관리가 편해진다.

export type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

export interface GuideFaq {
  q: string
  a: string
}

export interface GuideContent {
  title: string
  subtitle: string

  // S1 미션이 뭔가요?
  s1Title: string
  s1Body: string

  // S2 시작하는 법
  s2Title: string
  s2Step1Title: string
  s2Step1Items: string[]
  s2Step2Title: string
  s2Step2Items: string[]
  s2Step3Title: string
  s2Step3Items: string[]

  // S3 미션 장소 찾기
  s3Title: string
  s3Intro: string
  s3PinOrange: string
  s3PinGreen: string
  s3PinGray: string
  s3TapLabel: string
  s3TapItems: string[]
  s3Tip: string
  s3TipItems: string[]

  // S4 GPS 체크인
  s4Title: string
  s4Intro: string
  s4Steps: string[]
  s4TroubleTitle: string
  s4TroubleItems: string[]

  // S5 미션 수행
  s5Title: string
  s5QuizTitle: string
  s5QuizQuote: string
  s5QuizBody: string
  s5QuizHints: string[]
  s5PhotoTitle: string
  s5PhotoQuote: string
  s5PhotoBody: string
  s5OpenTitle: string
  s5OpenQuote: string
  s5OpenBody: string
  s5BossTitle: string
  s5BossQuote: string
  s5BossBody: string

  // S6 보상
  s6Title: string
  s6RewardTitle: string
  s6RewardItems: string[]
  s6SpendTitle: string
  s6SpendItems: string[]

  // S7 파티 플레이
  s7Title: string
  s7Intro: string
  s7StepsTitle: string
  s7Steps: string[]
  s7BenefitsTitle: string
  s7Benefits: string[]

  // S8 FAQ
  s8Title: string
  faq: GuideFaq[]

  // CTA
  ctaText: string
  ctaButton: string
  stepLabel: string
}

export const QUEST_GUIDE: Record<Lang, GuideContent> = {
  ko: {
    title: '🗺️ Cloud with you 미션 가이드',
    subtitle: '한국의 숨겨진 명소를 찾아 떠나는 보물찾기 여행, 처음이어도 괜찮아요!',
    s1Title: '미션이 뭔가요?',
    s1Body: 'Cloud with you 미션은 한국의 숨겨진 명소를 직접 방문하며 즐기는 보물찾기 여행입니다.\n\n미션 장소에 도착하면 스마트폰이 자동으로 위치를 확인하고, 퀴즈를 풀거나 사진을 찍으면 미션 완료! 보상으로 💧 빗방울(포인트)을 받을 수 있어요.',

    s2Title: '시작하는 법',
    s2Step1Title: '코스 선택',
    s2Step1Items: ['전주·부산·서울·제주 등 9개 도시 코스 중 선택', '각 코스는 5~8개 미션으로 구성', '난이도: 쉬움 / 보통 / 어려움'],
    s2Step2Title: '패스 구매',
    s2Step2Items: ['Short (₩2,900 / 7일) · Standard (₩4,900 / 15일) · Long (₩7,900 / 30일) 중 선택', '패스가 있어야 미션 시작 가능', '활성 패스 1 개로 모든 도시 모든 미션 무제한'],
    s2Step3Title: '미션 시작',
    s2Step3Items: ['"미션 시작" 버튼을 눌러주세요', '첫 번째 미션 장소가 지도에 표시돼요', '지도를 보고 미션 장소로 이동!'],

    s3Title: '미션 장소 찾기',
    s3Intro: '지도에서 미션 핀(📍)을 확인하세요.',
    s3PinOrange: '🟠 주황 핀 — 현재 진행할 미션',
    s3PinGreen: '🟢 초록 핀 — 이미 완료한 미션',
    s3PinGray: '⬜ 회색 핀 — 아직 잠긴 미션',
    s3TapLabel: '핀을 탭하면:',
    s3TapItems: ['장소 이름과 주소', '현재 위치에서의 거리', '간단한 힌트'],
    s3Tip: '💡 팁',
    s3TipItems: ['핀 근처에 도착하면 자동으로 알림이 와요', '순서 상관없이 원하는 미션부터 진행 가능!'],

    s4Title: 'GPS 체크인',
    s4Intro: '미션 장소에 도착하면 이렇게 동작해요:',
    s4Steps: [
      '📍 "현재 위치 확인 중..." 메시지가 표시돼요',
      '🔵 지도에 내 위치(파란 점)가 나타나요',
      '⭕ 미션 장소 주변에 파란 원(200m 반경)이 보여요',
      '✅ 원 안에 들어가면 "체크인 가능!" 버튼이 활성화돼요',
      '버튼을 누르면 체크인 완료!',
    ],
    s4TroubleTitle: '⚠️ 체크인이 안 될 때',
    s4TroubleItems: [
      '위치 서비스(GPS)가 꺼져있나요? → 설정에서 켜주세요',
      '실내에 있나요? → 건물 밖으로 나가면 정확도가 올라가요',
      'Wi-Fi가 꺼져있나요? → Wi-Fi를 켜면 위치가 더 정확해요',
      '배터리 절약 모드인가요? → 절약 모드를 끄면 GPS가 정상 작동해요',
    ],

    s5Title: '미션 수행',
    s5QuizTitle: '🧠 퀴즈 미션',
    s5QuizQuote: '"이 건물은 몇 년에 지어졌을까요?"',
    s5QuizBody: '정답을 입력하면 완료! 모르겠으면 힌트를 써도 돼요.',
    s5QuizHints: ['힌트 1 — 무료', '힌트 2 — 💧 30 빗방울', '힌트 3 — 💧 50 빗방울'],
    s5PhotoTitle: '📸 사진 미션',
    s5PhotoQuote: '"이 장소에서 기념사진을 찍어주세요!"',
    s5PhotoBody: '카메라로 사진을 찍어 업로드하면 완료. 원하면 커뮤니티에 자동 공유돼요.',
    s5OpenTitle: '✍️ 자유 미션',
    s5OpenQuote: '"이 장소에서 느낀 점을 적어주세요"',
    s5OpenBody: '자유롭게 감상을 작성하면 돼요. 형식 제한 없음!',
    s5BossTitle: '👑 보스 미션',
    s5BossQuote: '"최종 미션 — 여러 조건을 달성하세요!"',
    s5BossBody: '코스의 마지막 특별 미션. 보상 빗방울이 3배!',

    s6Title: '보상',
    s6RewardTitle: '💧 빗방울 적립',
    s6RewardItems: [
      '일반 미션 (퀴즈·사진·자유): 100 빗방울',
      '보스 미션: 300 빗방울',
      '히든 미션 (숨겨진 미션 발견!): 500 빗방울',
      '코스 전체 완주 보너스: 500 빗방울',
    ],
    s6SpendTitle: '빗방울로 할 수 있는 것',
    s6SpendItems: [
      '🎖️ 조선 직업 랭크업 (농민 → 선비 → 영의정!)',
      '🎟️ 할인 쿠폰 교환 (10% / 20% / 30%)',
      '🏆 리더보드 순위 경쟁',
    ],

    s7Title: '파티 플레이 (함께하기)',
    s7Intro: '혼자도 재미있지만, 친구와 함께하면 더 신나요!',
    s7StepsTitle: '👥 파티 만들기',
    s7Steps: [
      '코스 페이지에서 "파티 만들기" 클릭',
      '초대 코드가 생성돼요',
      '친구에게 코드를 공유하세요',
      '같은 코스를 함께 진행!',
    ],
    s7BenefitsTitle: '파티원끼리 할 수 있는 것',
    s7Benefits: [
      '실시간 채팅으로 소통',
      '서로의 미션 진행 상황 확인',
      '먼저 완료한 사람이 힌트를 공유할 수 있어요',
    ],

    s8Title: '자주 묻는 질문',
    faq: [
      { q: '미션은 순서대로 해야 하나요?', a: '아니요! 원하는 미션부터 자유롭게 도전하세요.' },
      { q: '미션에 시간 제한이 있나요?', a: '없습니다. 나만의 속도로 여유롭게 즐기세요. 오늘 2개, 내일 3개 — 자유롭게!' },
      { q: '비가 오면 어떡하나요?', a: '실내 미션도 있어요! 날씨 좋은 날 야외 미션에 도전하세요.' },
      { q: '체크인 버튼이 안 눌려요.', a: '미션 장소 200m 이내인지 확인하세요. GPS 신호가 약하면 잠시 기다린 후 다시 시도해 주세요. 건물 밖에서 시도하면 더 잘 됩니다.' },
      { q: '사진을 잘못 올렸어요.', a: '마이페이지에서 다시 업로드할 수 있어요.' },
      { q: '빗방울은 환불되나요?', a: '빗방울은 서비스 내 포인트로, 현금 환불은 불가합니다.' },
      { q: '외국어로도 이용 가능한가요?', a: '네! 한국어·영어·일본어·중국어(간체/번체) 5개 언어를 지원합니다.' },
    ],

    ctaText: '이제 준비됐나요?',
    ctaButton: '코스 보러가기 →',
    stepLabel: 'STEP',
  },

  ja: {
    title: '🗺️ Cloud with you ミッションガイド',
    subtitle: '韓国の隠れた名所を巡る宝探しの旅。初めてでも大丈夫!',
    s1Title: 'ミッションとは?',
    s1Body: 'Cloud with you のミッションは、韓国の隠れた名所を実際に訪れながら楽しむ宝探し旅行です。\n\nミッション場所に到着するとスマホが自動で位置を確認し、クイズを解いたり写真を撮ったりすればミッション完了! ご褒美に 💧 雨粒(ポイント)がもらえます。',

    s2Title: '始め方',
    s2Step1Title: 'コース選択',
    s2Step1Items: ['全州・釜山・ソウル・済州など9都市のコースから選択', '各コースは5〜8個のミッションで構成', '難易度: やさしい / ふつう / むずかしい'],
    s2Step2Title: 'パス購入',
    s2Step2Items: ['Short (₩2,900 / 7日) ・ Standard (₩4,900 / 15日) ・ Long (₩7,900 / 30日) から選択', 'パスがないとミッションを開始できません', '有効なパス 1 枚で全都市・全ミッション無制限'],
    s2Step3Title: 'ミッション開始',
    s2Step3Items: ['「ミッション開始」ボタンをタップ', '最初のミッション場所が地図に表示されます', '地図を見てミッション場所へ移動!'],

    s3Title: 'ミッション場所を見つける',
    s3Intro: '地図でミッションのピン(📍)を確認してください。',
    s3PinOrange: '🟠 オレンジピン — 現在のミッション',
    s3PinGreen: '🟢 グリーンピン — 完了済み',
    s3PinGray: '⬜ グレーピン — まだロック中',
    s3TapLabel: 'ピンをタップすると:',
    s3TapItems: ['場所の名前と住所', '現在地からの距離', '簡単なヒント'],
    s3Tip: '💡 ヒント',
    s3TipItems: ['ピン付近に着くと自動で通知が来ます', '順番に関係なく、好きなミッションから可能!'],

    s4Title: 'GPSチェックイン',
    s4Intro: 'ミッション場所に到着するとこう動きます:',
    s4Steps: [
      '📍 「現在位置を確認中...」 のメッセージ',
      '🔵 地図に自分の位置(青い点)が表示',
      '⭕ ミッション場所の周りに青い円(半径200m)',
      '✅ 円に入ると「チェックイン可能!」ボタンが有効化',
      'ボタンを押せばチェックイン完了!',
    ],
    s4TroubleTitle: '⚠️ チェックインできないとき',
    s4TroubleItems: [
      '位置情報(GPS)がオフ? → 設定でオンにしてください',
      '屋内にいますか? → 屋外に出ると精度が上がります',
      'Wi-Fiがオフ? → Wi-Fiをオンにすると位置精度が向上',
      '省電力モード? → 省電力をオフにするとGPSが正常動作',
    ],

    s5Title: 'ミッション実行',
    s5QuizTitle: '🧠 クイズミッション',
    s5QuizQuote: '「この建物は何年に建てられたでしょう?」',
    s5QuizBody: '正解を入力で完了! 分からなければヒントも使えます。',
    s5QuizHints: ['ヒント1 — 無料', 'ヒント2 — 💧 30雨粒', 'ヒント3 — 💧 50雨粒'],
    s5PhotoTitle: '📸 写真ミッション',
    s5PhotoQuote: '「この場所で記念写真を撮ってください!」',
    s5PhotoBody: 'カメラで撮影してアップロードすれば完了。希望すればコミュニティに自動共有。',
    s5OpenTitle: '✍️ 自由ミッション',
    s5OpenQuote: '「この場所で感じたことを書いてください」',
    s5OpenBody: '自由に感想を書いてください。形式の制限なし!',
    s5BossTitle: '👑 ボスミッション',
    s5BossQuote: '「最終ミッション — 複数の条件を達成せよ!」',
    s5BossBody: 'コース最後の特別ミッション。報酬の雨粒は3倍!',

    s6Title: 'ご褒美',
    s6RewardTitle: '💧 雨粒の獲得',
    s6RewardItems: [
      '通常ミッション(クイズ・写真・自由): 100雨粒',
      'ボスミッション: 300雨粒',
      '隠しミッション(発見ボーナス!): 500雨粒',
      'コース完走ボーナス: 500雨粒',
    ],
    s6SpendTitle: '雨粒でできること',
    s6SpendItems: [
      '🎖️ 朝鮮職業ランクアップ (農民 → 士大夫 → 領議政!)',
      '🎟️ 割引クーポン交換 (10% / 20% / 30%)',
      '🏆 リーダーボード順位競争',
    ],

    s7Title: 'パーティプレイ(仲間と一緒に)',
    s7Intro: '一人でも楽しいけれど、友達と一緒だともっと!',
    s7StepsTitle: '👥 パーティを作る',
    s7Steps: [
      'コースページで「パーティを作る」をタップ',
      '招待コードが生成されます',
      '友達にコードを共有',
      '同じコースを一緒に進行!',
    ],
    s7BenefitsTitle: 'パーティメンバーでできること',
    s7Benefits: [
      'リアルタイムチャットで交流',
      'お互いのミッション進捗を確認',
      '先に完了した人がヒントを共有可能',
    ],

    s8Title: 'よくある質問',
    faq: [
      { q: 'ミッションは順番通りにやる必要がありますか?', a: 'いいえ! 好きなミッションから自由にチャレンジしてください。' },
      { q: 'ミッションに時間制限はありますか?', a: 'ありません。自分のペースで気楽にお楽しみください。今日2個、明日3個 — 自由に!' },
      { q: '雨が降ったらどうしますか?', a: '屋内ミッションもあります! 天気の良い日に屋外ミッションに挑戦してください。' },
      { q: 'チェックインボタンが押せません。', a: 'ミッション場所から200m以内か確認してください。GPS信号が弱い場合は少し待ってから再度お試しください。屋外の方がうまくいきます。' },
      { q: '写真を間違えてアップロードしました。', a: 'マイページから再アップロードできます。' },
      { q: '雨粒は払い戻しされますか?', a: '雨粒はサービス内ポイントで、現金払い戻しはできません。' },
      { q: '外国語でも利用できますか?', a: 'はい! 韓国語・英語・日本語・中国語(簡体/繁体)の5言語に対応。' },
    ],

    ctaText: '準備はできましたか?',
    ctaButton: 'コースを見る →',
    stepLabel: 'STEP',
  },

  en: {
    title: '🗺️ Cloud with you Mission Guide',
    subtitle: 'A treasure hunt across hidden Korean gems — first-timer friendly!',
    s1Title: 'What is a Mission?',
    s1Body: 'Cloud with you missions are treasure-hunt trips where you visit hidden spots across Korea in person.\n\nWhen you arrive at a mission spot, your phone automatically confirms your location. Solve a quiz or snap a photo and the mission is complete! You earn 💧 Raindrops (points) as a reward.',

    s2Title: 'Getting Started',
    s2Step1Title: 'Pick a Course',
    s2Step1Items: ['Choose from 9 city courses — Jeonju, Busan, Seoul, Jeju and more', 'Each course has 5–8 missions', 'Difficulty: Easy / Normal / Hard'],
    s2Step2Title: 'Buy a Pass',
    s2Step2Items: ['Pick Short (₩2,900 / 7d), Standard (₩4,900 / 15d), or Long (₩7,900 / 30d)', 'A pass is required to start missions', 'One active pass unlocks unlimited missions in every city'],
    s2Step3Title: 'Start Missions',
    s2Step3Items: ['Tap "Start Mission"', 'The first mission spot appears on the map', 'Follow the map and head to the location!'],

    s3Title: 'Finding Mission Spots',
    s3Intro: 'Check the mission pins (📍) on the map.',
    s3PinOrange: '🟠 Orange pin — current mission',
    s3PinGreen: '🟢 Green pin — completed',
    s3PinGray: '⬜ Gray pin — still locked',
    s3TapLabel: 'Tap a pin to see:',
    s3TapItems: ['Place name and address', 'Distance from your location', 'A short hint'],
    s3Tip: '💡 Tip',
    s3TipItems: ['You get an auto-notification when you approach a pin', 'Missions can be done in any order!'],

    s4Title: 'GPS Check-in',
    s4Intro: 'When you reach a mission spot, here is what happens:',
    s4Steps: [
      '📍 "Checking your location..." appears',
      '🔵 Your location (blue dot) shows on the map',
      '⭕ A blue circle (200 m radius) wraps the spot',
      '✅ Step inside the circle to activate the "Check-in" button',
      'Tap the button — check-in complete!',
    ],
    s4TroubleTitle: '⚠️ If check-in fails',
    s4TroubleItems: [
      'Is location service (GPS) off? → Turn it on in settings',
      'Are you indoors? → Head outside for better accuracy',
      'Is Wi-Fi off? → Turning Wi-Fi on improves positioning',
      'Battery saver on? → Disable it so GPS works fully',
    ],

    s5Title: 'Doing the Mission',
    s5QuizTitle: '🧠 Quiz Mission',
    s5QuizQuote: '"What year was this building constructed?"',
    s5QuizBody: 'Type the correct answer to clear. Use hints if stuck.',
    s5QuizHints: ['Hint 1 — Free', 'Hint 2 — 💧 30 Raindrops', 'Hint 3 — 💧 50 Raindrops'],
    s5PhotoTitle: '📸 Photo Mission',
    s5PhotoQuote: '"Take a commemorative photo at this spot!"',
    s5PhotoBody: 'Shoot with your camera and upload. Optionally auto-share to the community.',
    s5OpenTitle: '✍️ Open Mission',
    s5OpenQuote: '"Write what this place made you feel"',
    s5OpenBody: 'Free-form reflection — no format limits!',
    s5BossTitle: '👑 Boss Mission',
    s5BossQuote: '"Final mission — clear multiple conditions!"',
    s5BossBody: 'The last special mission of a course. Triple reward Raindrops!',

    s6Title: 'Rewards',
    s6RewardTitle: '💧 Earning Raindrops',
    s6RewardItems: [
      'Regular mission (quiz / photo / open): 100 Raindrops',
      'Boss mission: 300 Raindrops',
      'Hidden mission (discovery bonus!): 500 Raindrops',
      'Full course clear bonus: 500 Raindrops',
    ],
    s6SpendTitle: 'What to spend Raindrops on',
    s6SpendItems: [
      '🎖️ Joseon job rank-ups (Peasant → Scholar → Prime Minister!)',
      '🎟️ Discount coupons (10% / 20% / 30%)',
      '🏆 Leaderboard rankings',
    ],

    s7Title: 'Party Play (Playing Together)',
    s7Intro: 'Solo is fun, but friends make it more!',
    s7StepsTitle: '👥 Create a Party',
    s7Steps: [
      'Tap "Create Party" on a course page',
      'An invite code is generated',
      'Share the code with friends',
      'Play the same course together!',
    ],
    s7BenefitsTitle: 'What party members can do',
    s7Benefits: [
      'Real-time chat',
      "Check each other's mission progress",
      'Finishers can share hints with the rest',
    ],

    s8Title: 'Frequently Asked Questions',
    faq: [
      { q: 'Do I have to do missions in order?', a: 'No! Tackle any mission you like in any order.' },
      { q: 'Is there a time limit?', a: 'None. Go at your own pace — two today, three tomorrow, whatever you like.' },
      { q: 'What if it rains?', a: 'We have indoor missions too! Save outdoor ones for better weather.' },
      { q: 'My check-in button won\'t activate.', a: 'Make sure you\'re within 200 m of the spot. If GPS is weak, wait a moment and try again. Being outside works best.' },
      { q: 'I uploaded the wrong photo.', a: 'You can re-upload from My Page.' },
      { q: 'Are Raindrops refundable?', a: 'Raindrops are in-service points — no cash refunds.' },
      { q: 'Is the service available in other languages?', a: 'Yes! Korean, English, Japanese, Chinese (Simplified/Traditional) — 5 languages supported.' },
    ],

    ctaText: 'Ready to start?',
    ctaButton: 'See Courses →',
    stepLabel: 'STEP',
  },

  'zh-CN': {
    title: '🗺️ Cloud with you 任务指南',
    subtitle: '探访韩国隐藏名胜的寻宝之旅 — 新手也能轻松上手!',
    s1Title: '什么是任务?',
    s1Body: 'Cloud with you 任务是亲自走访韩国隐藏景点的寻宝旅行。\n\n到达任务地点时,手机会自动确认位置,解答问题或拍照即可完成任务! 奖励为 💧 雨滴(积分)。',

    s2Title: '如何开始',
    s2Step1Title: '选择课程',
    s2Step1Items: ['全州·釜山·首尔·济州等 9 个城市课程任选', '每个课程包含 5~8 个任务', '难度: 简单 / 普通 / 困难'],
    s2Step2Title: '购买通行证',
    s2Step2Items: ['在 Short (₩2,900 / 7天) · Standard (₩4,900 / 15天) · Long (₩7,900 / 30天) 中选择', '必须持有通行证才能开始任务', '一张有效通行证无限解锁所有城市所有任务'],
    s2Step3Title: '开始任务',
    s2Step3Items: ['点击"开始任务"按钮', '地图上显示第一个任务地点', '查看地图前往目的地!'],

    s3Title: '寻找任务地点',
    s3Intro: '在地图上查看任务图钉(📍)。',
    s3PinOrange: '🟠 橙色图钉 — 当前任务',
    s3PinGreen: '🟢 绿色图钉 — 已完成',
    s3PinGray: '⬜ 灰色图钉 — 未解锁',
    s3TapLabel: '点击图钉可查看:',
    s3TapItems: ['地点名称和地址', '距离当前位置的距离', '简单提示'],
    s3Tip: '💡 小贴士',
    s3TipItems: ['靠近图钉会自动提醒', '不限顺序,随心挑选任务!'],

    s4Title: 'GPS 签到',
    s4Intro: '到达任务地点时,系统会这样运行:',
    s4Steps: [
      '📍 显示"正在确认当前位置..."',
      '🔵 地图上显示你的位置(蓝色点)',
      '⭕ 任务地点周围出现蓝色圆圈(200米半径)',
      '✅ 进入圆圈内,"签到"按钮被激活',
      '点击按钮即完成签到!',
    ],
    s4TroubleTitle: '⚠️ 签到失败时',
    s4TroubleItems: [
      '定位服务(GPS)关闭? → 请在设置中开启',
      '在室内? → 走到室外精度会更高',
      'Wi-Fi 关闭? → 开启 Wi-Fi 可提升定位精度',
      '省电模式? → 关闭省电模式让 GPS 正常工作',
    ],

    s5Title: '执行任务',
    s5QuizTitle: '🧠 问答任务',
    s5QuizQuote: '"这座建筑是哪一年建造的?"',
    s5QuizBody: '输入正确答案即可完成! 不会可使用提示。',
    s5QuizHints: ['提示 1 — 免费', '提示 2 — 💧 30 雨滴', '提示 3 — 💧 50 雨滴'],
    s5PhotoTitle: '📸 照片任务',
    s5PhotoQuote: '"请在这里拍纪念照!"',
    s5PhotoBody: '用相机拍照并上传即可完成,可选择自动共享到社区。',
    s5OpenTitle: '✍️ 自由任务',
    s5OpenQuote: '"写下你在此地的感受"',
    s5OpenBody: '自由书写感想,无格式限制!',
    s5BossTitle: '👑 首领任务',
    s5BossQuote: '"最终任务 — 达成多项条件!"',
    s5BossBody: '课程最后的特别任务,奖励雨滴 3 倍!',

    s6Title: '奖励',
    s6RewardTitle: '💧 雨滴积累',
    s6RewardItems: [
      '普通任务(问答/照片/自由): 100 雨滴',
      '首领任务: 300 雨滴',
      '隐藏任务(发现奖励!): 500 雨滴',
      '课程通关奖励: 500 雨滴',
    ],
    s6SpendTitle: '雨滴可以做什么',
    s6SpendItems: [
      '🎖️ 朝鲜官职升级(农夫 → 士大夫 → 领议政!)',
      '🎟️ 折扣券兑换 (10% / 20% / 30%)',
      '🏆 排行榜名次竞争',
    ],

    s7Title: '组队游戏(一起玩)',
    s7Intro: '独自玩也有趣,和朋友一起更精彩!',
    s7StepsTitle: '👥 创建队伍',
    s7Steps: [
      '在课程页面点击"创建队伍"',
      '生成邀请码',
      '把邀请码分享给朋友',
      '一起闯关同一课程!',
    ],
    s7BenefitsTitle: '队员之间可以',
    s7Benefits: [
      '实时聊天互动',
      '查看彼此的任务进度',
      '先完成的人可以分享提示',
    ],

    s8Title: '常见问题',
    faq: [
      { q: '任务必须按顺序吗?', a: '不用! 想做哪个就做哪个。' },
      { q: '任务有时间限制吗?', a: '没有。按自己的节奏享受即可 — 今天 2 个、明天 3 个都行!' },
      { q: '下雨怎么办?', a: '也有室内任务! 好天气时再挑战户外任务。' },
      { q: '签到按钮不能点。', a: '请确认距离任务地点 200 米以内。若 GPS 信号弱,稍等片刻再试。户外效果更好。' },
      { q: '上传错了照片。', a: '可在"我的"页面重新上传。' },
      { q: '雨滴可以退款吗?', a: '雨滴是服务内积分,不支持现金退款。' },
      { q: '支持外语吗?', a: '支持! 提供韩语·英语·日语·中文(简体/繁体)五种语言。' },
    ],

    ctaText: '准备好了吗?',
    ctaButton: '查看课程 →',
    stepLabel: 'STEP',
  },

  'zh-TW': {
    title: '🗺️ Cloud with you 任務指南',
    subtitle: '探訪韓國隱藏名勝的尋寶之旅 — 新手也能輕鬆上手!',
    s1Title: '什麼是任務?',
    s1Body: 'Cloud with you 任務是親自走訪韓國隱藏景點的尋寶旅行。\n\n到達任務地點時,手機會自動確認位置,解答問題或拍照即可完成任務! 獎勵為 💧 雨滴(積分)。',

    s2Title: '如何開始',
    s2Step1Title: '選擇課程',
    s2Step1Items: ['全州·釜山·首爾·濟州等 9 個城市課程任選', '每個課程包含 5~8 個任務', '難度: 簡單 / 普通 / 困難'],
    s2Step2Title: '購買通行證',
    s2Step2Items: ['在 Short (₩2,900 / 7天) · Standard (₩4,900 / 15天) · Long (₩7,900 / 30天) 中選擇', '必須持有通行證才能開始任務', '一張有效通行證無限解鎖所有城市所有任務'],
    s2Step3Title: '開始任務',
    s2Step3Items: ['點擊「開始任務」按鈕', '地圖上顯示第一個任務地點', '查看地圖前往目的地!'],

    s3Title: '尋找任務地點',
    s3Intro: '在地圖上查看任務圖釘(📍)。',
    s3PinOrange: '🟠 橙色圖釘 — 當前任務',
    s3PinGreen: '🟢 綠色圖釘 — 已完成',
    s3PinGray: '⬜ 灰色圖釘 — 未解鎖',
    s3TapLabel: '點擊圖釘可查看:',
    s3TapItems: ['地點名稱和地址', '距離當前位置的距離', '簡單提示'],
    s3Tip: '💡 小提示',
    s3TipItems: ['靠近圖釘會自動提醒', '不限順序,隨心挑選任務!'],

    s4Title: 'GPS 簽到',
    s4Intro: '到達任務地點時,系統會這樣運作:',
    s4Steps: [
      '📍 顯示「正在確認目前位置...」',
      '🔵 地圖上顯示你的位置(藍色點)',
      '⭕ 任務地點周圍出現藍色圓圈(200公尺半徑)',
      '✅ 進入圓圈內,「簽到」按鈕被啟用',
      '點擊按鈕即完成簽到!',
    ],
    s4TroubleTitle: '⚠️ 簽到失敗時',
    s4TroubleItems: [
      '定位服務(GPS)關閉? → 請在設定中開啟',
      '在室內? → 走到室外精度會更高',
      'Wi-Fi 關閉? → 開啟 Wi-Fi 可提升定位精度',
      '省電模式? → 關閉省電模式讓 GPS 正常運作',
    ],

    s5Title: '執行任務',
    s5QuizTitle: '🧠 問答任務',
    s5QuizQuote: '「這座建築是哪一年建造的?」',
    s5QuizBody: '輸入正確答案即可完成! 不會可使用提示。',
    s5QuizHints: ['提示 1 — 免費', '提示 2 — 💧 30 雨滴', '提示 3 — 💧 50 雨滴'],
    s5PhotoTitle: '📸 照片任務',
    s5PhotoQuote: '「請在這裡拍紀念照!」',
    s5PhotoBody: '用相機拍照並上傳即可完成,可選擇自動分享到社群。',
    s5OpenTitle: '✍️ 自由任務',
    s5OpenQuote: '「寫下你在此地的感受」',
    s5OpenBody: '自由書寫感想,無格式限制!',
    s5BossTitle: '👑 首領任務',
    s5BossQuote: '「最終任務 — 達成多項條件!」',
    s5BossBody: '課程最後的特別任務,獎勵雨滴 3 倍!',

    s6Title: '獎勵',
    s6RewardTitle: '💧 雨滴累積',
    s6RewardItems: [
      '一般任務(問答/照片/自由): 100 雨滴',
      '首領任務: 300 雨滴',
      '隱藏任務(發現獎勵!): 500 雨滴',
      '課程通關獎勵: 500 雨滴',
    ],
    s6SpendTitle: '雨滴可以用來',
    s6SpendItems: [
      '🎖️ 朝鮮官職升級(農夫 → 士大夫 → 領議政!)',
      '🎟️ 折扣券兌換 (10% / 20% / 30%)',
      '🏆 排行榜名次競爭',
    ],

    s7Title: '組隊遊玩(一起玩)',
    s7Intro: '獨自玩也有趣,和朋友一起更精彩!',
    s7StepsTitle: '👥 建立隊伍',
    s7Steps: [
      '在課程頁面點擊「建立隊伍」',
      '產生邀請碼',
      '把邀請碼分享給朋友',
      '一起闖關同一課程!',
    ],
    s7BenefitsTitle: '隊員之間可以',
    s7Benefits: [
      '即時聊天互動',
      '查看彼此的任務進度',
      '先完成的人可以分享提示',
    ],

    s8Title: '常見問題',
    faq: [
      { q: '任務必須按順序嗎?', a: '不用! 想做哪個就做哪個。' },
      { q: '任務有時間限制嗎?', a: '沒有。按自己的節奏享受即可 — 今天 2 個、明天 3 個都行!' },
      { q: '下雨怎麼辦?', a: '也有室內任務! 好天氣時再挑戰戶外任務。' },
      { q: '簽到按鈕不能點。', a: '請確認距離任務地點 200 公尺以內。若 GPS 訊號弱,稍等片刻再試。戶外效果更好。' },
      { q: '上傳錯了照片。', a: '可在「我的」頁面重新上傳。' },
      { q: '雨滴可以退款嗎?', a: '雨滴是服務內積分,不支援現金退款。' },
      { q: '支援外語嗎?', a: '支援! 提供韓語·英語·日語·中文(簡體/繁體)五種語言。' },
    ],

    ctaText: '準備好了嗎?',
    ctaButton: '查看課程 →',
    stepLabel: 'STEP',
  },
}

export function getGuide(locale: string): GuideContent {
  return QUEST_GUIDE[locale as Lang] ?? QUEST_GUIDE.ko
}
