export type FilterCategoryId =
  | 'all'
  | 'place'
  | 'season'
  | 'drama'
  | 'weather'
  | 'food'
  | 'culture'
  | 'building'

export interface FilterCategory {
  id: FilterCategoryId
  icon: string
  name: Record<string, string>
}

export const FILTER_CATEGORIES: FilterCategory[] = [
  { id: 'all', icon: '🎨', name: { ko: '전체', en: 'All', ja: 'すべて', 'zh-CN': '全部', 'zh-TW': '全部' } },
  { id: 'place', icon: '🏛️', name: { ko: '장소별', en: 'Place', ja: '場所別', 'zh-CN': '地点', 'zh-TW': '地點' } },
  { id: 'season', icon: '🌸', name: { ko: '계절별', en: 'Season', ja: '季節別', 'zh-CN': '季节', 'zh-TW': '季節' } },
  { id: 'drama', icon: '🎬', name: { ko: 'K-Drama', en: 'K-Drama', ja: 'K-Drama', 'zh-CN': 'K-Drama', 'zh-TW': 'K-Drama' } },
  { id: 'weather', icon: '☀️', name: { ko: '날씨별', en: 'Weather', ja: '天気別', 'zh-CN': '天气', 'zh-TW': '天氣' } },
  { id: 'food', icon: '🍜', name: { ko: '음식', en: 'Food', ja: 'グルメ', 'zh-CN': '美食', 'zh-TW': '美食' } },
  { id: 'culture', icon: '🏺', name: { ko: '문화재', en: 'Heritage', ja: '文化財', 'zh-CN': '文化遗产', 'zh-TW': '文化遺產' } },
  { id: 'building', icon: '🏙️', name: { ko: '건축', en: 'Architecture', ja: '建築', 'zh-CN': '建筑', 'zh-TW': '建築' } },
]

export interface RetroFilter {
  id: string
  name: Record<string, string>
  description: Record<string, string>
  icon: string
  category: FilterCategoryId
  cssFilter: string
  overlay?: { color: string; opacity: number; blendMode: GlobalCompositeOperation }
  vignette?: boolean
  grain?: boolean
}

export const RETRO_FILTERS: RetroFilter[] = [
  // ═══ 원본 ═══
  {
    id: 'original',
    category: 'all',
    name: { ko: '원본', en: 'Original', ja: 'オリジナル', 'zh-CN': '原图', 'zh-TW': '原圖' },
    description: { ko: '필터 없음', en: 'No filter', ja: 'フィルターなし', 'zh-CN': '无滤镜', 'zh-TW': '無濾鏡' },
    icon: '📷',
    cssFilter: 'none',
  },
  // ═══ 기존 5종 (category 할당) ═══
  {
    id: 'hanbok',
    category: 'culture',
    name: { ko: '한복', en: 'Hanbok', ja: '韓服', 'zh-CN': '韩服', 'zh-TW': '韓服' },
    description: { ko: '따뜻한 한국 전통 색감', en: 'Warm Korean traditional tone', ja: '温かい韓国伝統色', 'zh-CN': '温暖的韩国传统色调', 'zh-TW': '溫暖的韓國傳統色調' },
    icon: '🎎',
    cssFilter: 'saturate(1.3) contrast(1.1) brightness(1.05) sepia(0.15)',
    overlay: { color: '#D4A574', opacity: 0.08, blendMode: 'overlay' },
    vignette: true,
  },
  {
    id: 'joseon',
    category: 'culture',
    name: { ko: '조선시대', en: 'Joseon Era', ja: '朝鮮時代', 'zh-CN': '朝鲜时代', 'zh-TW': '朝鮮時代' },
    description: { ko: '고전적인 세피아 톤', en: 'Classic sepia tone', ja: 'クラシックなセピアトーン', 'zh-CN': '经典怀旧色调', 'zh-TW': '經典懷舊色調' },
    icon: '📜',
    cssFilter: 'sepia(0.6) contrast(1.15) brightness(0.95) saturate(0.8)',
    vignette: true,
    grain: true,
  },
  {
    id: 'dokkaebi',
    category: 'drama',
    name: { ko: '도깨비', en: 'Dokkaebi', ja: 'トッケビ', 'zh-CN': '独角鬼', 'zh-TW': '獨角鬼' },
    description: { ko: '신비로운 청록 톤', en: 'Mystical teal tone', ja: '神秘的なティールトーン', 'zh-CN': '神秘青色调', 'zh-TW': '神秘青色調' },
    icon: '👹',
    cssFilter: 'saturate(1.2) contrast(1.1) hue-rotate(-10deg) brightness(1.05)',
    overlay: { color: '#2DD4BF', opacity: 0.06, blendMode: 'soft-light' },
    vignette: true,
  },
  {
    id: 'film',
    category: 'place',
    name: { ko: '필름', en: 'Film', ja: 'フィルム', 'zh-CN': '胶片', 'zh-TW': '底片' },
    description: { ko: '90년대 필름 카메라 느낌', en: '90s film camera look', ja: '90年代フィルムカメラ風', 'zh-CN': '90年代胶片相机感', 'zh-TW': '90年代底片相機感' },
    icon: '🎞️',
    cssFilter: 'contrast(1.2) brightness(1.05) saturate(0.85)',
    overlay: { color: '#FFA500', opacity: 0.05, blendMode: 'overlay' },
    vignette: true,
    grain: true,
  },

  // ═══ 장소별 (place) ═══
  {
    id: 'hanok',
    category: 'place',
    icon: '🏠',
    name: { ko: '한옥 톤', en: 'Hanok Tone', ja: '韓屋トーン', 'zh-CN': '韩屋色调', 'zh-TW': '韓屋色調' },
    description: { ko: '따뜻한 나무 질감의 전통 한옥 감성', en: 'Warm wooden texture of traditional Hanok', ja: '温かい木の質感の伝統韓屋感', 'zh-CN': '温暖木质感的传统韩屋风', 'zh-TW': '溫暖木質感的傳統韓屋風' },
    cssFilter: 'saturate(1.1) contrast(1.05) brightness(1.05) sepia(0.25)',
    overlay: { color: '#C4956A', opacity: 0.12, blendMode: 'multiply' },
    vignette: true,
  },
  {
    id: 'ocean',
    category: 'place',
    icon: '🌊',
    name: { ko: '바다 톤', en: 'Ocean Tone', ja: '海トーン', 'zh-CN': '海洋色调', 'zh-TW': '海洋色調' },
    description: { ko: '시원한 블루 톤의 해변 감성', en: 'Cool blue tone beach vibes', ja: '涼しいブルートーンのビーチ感', 'zh-CN': '清凉蓝色调海滩风', 'zh-TW': '清涼藍色調海灘風' },
    cssFilter: 'saturate(1.2) contrast(1.1) brightness(1.05) hue-rotate(10deg)',
    overlay: { color: '#87CEEB', opacity: 0.1, blendMode: 'soft-light' },
  },
  {
    id: 'jeju',
    category: 'place',
    icon: '🌴',
    name: { ko: '제주 감성', en: 'Jeju Vibes', ja: '済州感性', 'zh-CN': '济州感性', 'zh-TW': '濟州感性' },
    description: { ko: '자연의 초록과 하늘의 파랑이 만나는 제주', en: 'Where green meets blue — Jeju island', ja: '自然の緑と空の青が出会う済州', 'zh-CN': '绿色与蓝色相遇的济州', 'zh-TW': '綠色與藍色相遇的濟州' },
    cssFilter: 'saturate(1.3) contrast(1.05) brightness(1.08)',
    overlay: { color: '#48BB78', opacity: 0.08, blendMode: 'soft-light' },
  },
  {
    id: 'seongsu',
    category: 'place',
    icon: '☕',
    name: { ko: '성수 카페', en: 'Seongsu Cafe', ja: '聖水カフェ', 'zh-CN': '圣水咖啡馆', 'zh-TW': '聖水咖啡館' },
    description: { ko: '힙하고 따뜻한 성수동 카페 감성', en: 'Hip and warm Seongsu-dong cafe mood', ja: 'ヒップで温かい聖水洞カフェ感', 'zh-CN': '时尚温暖的圣水洞咖啡馆感', 'zh-TW': '時尚溫暖的聖水洞咖啡館感' },
    cssFilter: 'saturate(0.9) contrast(1.08) brightness(1.1) sepia(0.15)',
    overlay: { color: '#D4A574', opacity: 0.08, blendMode: 'multiply' },
    grain: true,
  },
  {
    id: 'gangnam',
    category: 'place',
    icon: '💎',
    name: { ko: '강남 세련', en: 'Gangnam Chic', ja: '江南シック', 'zh-CN': '江南时尚', 'zh-TW': '江南時尚' },
    description: { ko: '도시적이고 세련된 강남 스타일', en: 'Urban and sophisticated Gangnam style', ja: '都会的で洗練された江南スタイル', 'zh-CN': '都市精致的江南风格', 'zh-TW': '都市精緻的江南風格' },
    cssFilter: 'saturate(0.85) contrast(1.15) brightness(1.02)',
    overlay: { color: '#C0C0C0', opacity: 0.06, blendMode: 'overlay' },
  },
  {
    id: 'nongchon',
    category: 'place',
    icon: '🌾',
    name: { ko: '농촌 감성', en: 'Rural Vibes', ja: '農村感性', 'zh-CN': '农村感性', 'zh-TW': '農村感性' },
    description: { ko: '포근하고 정겨운 한국 시골의 따뜻함', en: 'Cozy warmth of Korean countryside', ja: '温かく親しみやすい韓国の田舎', 'zh-CN': '温馨亲切的韩国乡村', 'zh-TW': '溫馨親切的韓國鄉村' },
    cssFilter: 'saturate(1.15) contrast(1.0) brightness(1.1) sepia(0.2)',
    overlay: { color: '#8B7355', opacity: 0.1, blendMode: 'multiply' },
    vignette: true,
    grain: true,
  },

  // ═══ 계절별 (season) ═══
  {
    id: 'cherry-blossom',
    category: 'season',
    icon: '🌸',
    name: { ko: '벚꽃', en: 'Cherry Blossom', ja: '桜', 'zh-CN': '樱花', 'zh-TW': '櫻花' },
    description: { ko: '분홍빛 봄의 설레임', en: 'Pink spring excitement', ja: 'ピンクの春のときめき', 'zh-CN': '粉色春天的悸动', 'zh-TW': '粉色春天的悸動' },
    cssFilter: 'saturate(1.2) contrast(1.0) brightness(1.1) hue-rotate(-5deg)',
    overlay: { color: '#FFB7C5', opacity: 0.12, blendMode: 'soft-light' },
  },
  {
    id: 'autumn',
    category: 'season',
    icon: '🍂',
    name: { ko: '단풍', en: 'Autumn Leaves', ja: '紅葉', 'zh-CN': '红叶', 'zh-TW': '紅葉' },
    description: { ko: '붉고 따뜻한 가을 감성', en: 'Warm red autumn vibes', ja: '赤く温かい秋の感性', 'zh-CN': '温暖红色秋天感', 'zh-TW': '溫暖紅色秋天感' },
    cssFilter: 'saturate(1.3) contrast(1.1) brightness(1.0) hue-rotate(-15deg)',
    overlay: { color: '#D2691E', opacity: 0.1, blendMode: 'multiply' },
    vignette: true,
  },
  {
    id: 'snow',
    category: 'season',
    icon: '❄️',
    name: { ko: '눈 내리는 겨울', en: 'Snowy Winter', ja: '雪の冬', 'zh-CN': '雪冬', 'zh-TW': '雪冬' },
    description: { ko: '차갑고 깨끗한 겨울 풍경', en: 'Cold and clean winter scene', ja: '冷たくきれいな冬の景色', 'zh-CN': '寒冷清新的冬天风景', 'zh-TW': '寒冷清新的冬天風景' },
    cssFilter: 'saturate(0.7) contrast(1.1) brightness(1.15)',
    overlay: { color: '#E0F0FF', opacity: 0.1, blendMode: 'soft-light' },
  },
  {
    id: 'summer',
    category: 'season',
    icon: '☀️',
    name: { ko: '여름 청량', en: 'Fresh Summer', ja: '爽やか夏', 'zh-CN': '清爽夏天', 'zh-TW': '清爽夏天' },
    description: { ko: '시원하고 선명한 여름 감성', en: 'Cool and vivid summer feel', ja: '涼しく鮮やかな夏の感性', 'zh-CN': '凉爽鲜明的夏天感', 'zh-TW': '涼爽鮮明的夏天感' },
    cssFilter: 'saturate(1.4) contrast(1.1) brightness(1.08)',
    overlay: { color: '#00CED1', opacity: 0.06, blendMode: 'soft-light' },
  },

  // ═══ K-Drama (drama) ═══
  {
    id: 'goblin',
    category: 'drama',
    icon: '🔥',
    name: { ko: '도깨비 감성', en: 'Goblin Mood', ja: 'トッケビ感性', 'zh-CN': '鬼怪感性', 'zh-TW': '鬼怪感性' },
    description: { ko: '신비롭고 따뜻한 도깨비 분위기', en: 'Mystical and warm Goblin atmosphere', ja: '神秘的で温かいトッケビの雰囲気', 'zh-CN': '神秘温暖的鬼怪氛围', 'zh-TW': '神秘溫暖的鬼怪氛圍' },
    cssFilter: 'saturate(1.1) contrast(1.15) brightness(0.95) sepia(0.15)',
    overlay: { color: '#FFD700', opacity: 0.08, blendMode: 'soft-light' },
    vignette: true,
  },
  {
    id: 'itaewon',
    category: 'drama',
    icon: '🍺',
    name: { ko: '이태원클라쓰', en: 'Itaewon Class', ja: '梨泰院クラス', 'zh-CN': '梨泰院Class', 'zh-TW': '梨泰院Class' },
    description: { ko: '강렬하고 도시적인 이태원 나이트', en: 'Intense urban Itaewon night', ja: '強烈で都会的な梨泰院ナイト', 'zh-CN': '强烈都市梨泰院之夜', 'zh-TW': '強烈都市梨泰院之夜' },
    cssFilter: 'saturate(1.2) contrast(1.2) brightness(0.9)',
    overlay: { color: '#FF4500', opacity: 0.08, blendMode: 'soft-light' },
    vignette: true,
  },
  {
    id: 'hotel-deluna',
    category: 'drama',
    icon: '🌙',
    name: { ko: '호텔 델루나', en: 'Hotel Del Luna', ja: 'ホテルデルーナ', 'zh-CN': '德鲁纳酒店', 'zh-TW': '德魯納酒店' },
    description: { ko: '몽환적이고 화려한 달빛 감성', en: 'Dreamy and glamorous moonlight feel', ja: '夢幻的で華やかな月光感', 'zh-CN': '梦幻华丽的月光感', 'zh-TW': '夢幻華麗的月光感' },
    cssFilter: 'saturate(1.1) contrast(1.05) brightness(0.92) hue-rotate(15deg)',
    overlay: { color: '#9370DB', opacity: 0.1, blendMode: 'soft-light' },
    vignette: true,
  },

  // ═══ 날씨별 (weather) ═══
  {
    id: 'sunny',
    category: 'weather',
    icon: '☀️',
    name: { ko: '화창한 날', en: 'Sunny Day', ja: '晴れの日', 'zh-CN': '晴天', 'zh-TW': '晴天' },
    description: { ko: '밝고 따뜻한 햇살 가득', en: 'Bright and warm sunshine', ja: '明るく温かい日差し', 'zh-CN': '明亮温暖的阳光', 'zh-TW': '明亮溫暖的陽光' },
    cssFilter: 'saturate(1.2) contrast(1.05) brightness(1.15)',
    overlay: { color: '#FFD700', opacity: 0.06, blendMode: 'soft-light' },
  },
  {
    id: 'cloudy',
    category: 'weather',
    icon: '☁️',
    name: { ko: '구름 낀 날', en: 'Cloudy Day', ja: '曇りの日', 'zh-CN': '阴天', 'zh-TW': '陰天' },
    description: { ko: '부드럽고 차분한 흐린 날 감성', en: 'Soft and calm overcast mood', ja: '柔らかく落ち着いた曇りの日', 'zh-CN': '柔和沉静的阴天感', 'zh-TW': '柔和沉靜的陰天感' },
    cssFilter: 'saturate(0.8) contrast(1.0) brightness(1.02)',
    overlay: { color: '#B0C4DE', opacity: 0.08, blendMode: 'soft-light' },
  },
  {
    id: 'rainy',
    category: 'weather',
    icon: '🌧️',
    name: { ko: '비 오는 날', en: 'Rainy Day', ja: '雨の日', 'zh-CN': '雨天', 'zh-TW': '雨天' },
    description: { ko: '촉촉하고 감성적인 빗소리 분위기', en: 'Moist and emotional rainy mood', ja: '潤いがあって感性的な雨の雰囲気', 'zh-CN': '湿润感性的雨天氛围', 'zh-TW': '濕潤感性的雨天氛圍' },
    cssFilter: 'saturate(0.7) contrast(1.1) brightness(0.92)',
    overlay: { color: '#708090', opacity: 0.1, blendMode: 'multiply' },
    vignette: true,
  },
  {
    id: 'foggy',
    category: 'weather',
    icon: '🌫️',
    name: { ko: '안개', en: 'Foggy', ja: '霧', 'zh-CN': '雾天', 'zh-TW': '霧天' },
    description: { ko: '몽환적인 안개 속 풍경', en: 'Dreamy foggy landscape', ja: '夢幻的な霧の中の景色', 'zh-CN': '梦幻雾中风景', 'zh-TW': '夢幻霧中風景' },
    cssFilter: 'saturate(0.6) contrast(0.9) brightness(1.1)',
    overlay: { color: '#DCDCDC', opacity: 0.15, blendMode: 'soft-light' },
  },

  // ═══ 음식 (food) ═══
  {
    id: 'warm-food',
    category: 'food',
    icon: '🍲',
    name: { ko: '따뜻한 음식', en: 'Warm Food', ja: '温かい料理', 'zh-CN': '热食', 'zh-TW': '熱食' },
    description: { ko: '따뜻하고 맛있어 보이는 음식 톤', en: 'Warm and appetizing food tone', ja: '温かくおいしそうな料理トーン', 'zh-CN': '温暖美味的美食色调', 'zh-TW': '溫暖美味的美食色調' },
    cssFilter: 'saturate(1.3) contrast(1.1) brightness(1.08) sepia(0.1)',
    overlay: { color: '#FF8C00', opacity: 0.06, blendMode: 'soft-light' },
  },
  {
    id: 'dessert',
    category: 'food',
    icon: '🧁',
    name: { ko: '디저트 파스텔', en: 'Dessert Pastel', ja: 'デザートパステル', 'zh-CN': '甜点粉彩', 'zh-TW': '甜點粉彩' },
    description: { ko: '달콤한 파스텔 톤의 디저트 감성', en: 'Sweet pastel tone dessert vibes', ja: '甘いパステルトーンのデザート感', 'zh-CN': '甜蜜粉彩甜点感', 'zh-TW': '甜蜜粉彩甜點感' },
    cssFilter: 'saturate(1.1) contrast(0.95) brightness(1.12)',
    overlay: { color: '#FFB6C1', opacity: 0.08, blendMode: 'soft-light' },
  },
  {
    id: 'night-market',
    category: 'food',
    icon: '🏮',
    name: { ko: '야시장 감성', en: 'Night Market', ja: '夜市感性', 'zh-CN': '夜市感性', 'zh-TW': '夜市感性' },
    description: { ko: '활기찬 야시장의 따뜻한 조명 감성', en: 'Warm glow of vibrant night markets', ja: '活気ある夜市の温かい照明感', 'zh-CN': '热闹夜市的温暖灯光感', 'zh-TW': '熱鬧夜市的溫暖燈光感' },
    cssFilter: 'saturate(1.2) contrast(1.15) brightness(0.95) sepia(0.1)',
    overlay: { color: '#FF6347', opacity: 0.08, blendMode: 'soft-light' },
    vignette: true,
  },

  // ═══ 문화재 (culture) ═══
  {
    id: 'palace-gold',
    category: 'culture',
    icon: '👑',
    name: { ko: '고궁 골드', en: 'Palace Gold', ja: '古宮ゴールド', 'zh-CN': '古宫金', 'zh-TW': '古宮金' },
    description: { ko: '궁궐의 황금빛 단청 감성', en: 'Golden Dancheong palace feel', ja: '宮殿の黄金色の丹青感', 'zh-CN': '宫殿的金色丹青感', 'zh-TW': '宮殿的金色丹青感' },
    cssFilter: 'saturate(1.15) contrast(1.1) brightness(1.0) sepia(0.2)',
    overlay: { color: '#DAA520', opacity: 0.08, blendMode: 'soft-light' },
    vignette: true,
  },
  {
    id: 'ceramic',
    category: 'culture',
    icon: '🏺',
    name: { ko: '도자기 매트', en: 'Ceramic Matte', ja: '陶磁器マット', 'zh-CN': '陶瓷哑光', 'zh-TW': '陶瓷啞光' },
    description: { ko: '이천 도자기의 차분한 매트 질감', en: 'Calm matte texture of Icheon ceramics', ja: '利川陶磁器の落ち着いたマット質感', 'zh-CN': '利川陶瓷沉稳哑光质感', 'zh-TW': '利川陶瓷沉穩啞光質感' },
    cssFilter: 'saturate(0.85) contrast(1.05) brightness(1.02) sepia(0.1)',
    overlay: { color: '#A0907E', opacity: 0.08, blendMode: 'multiply' },
  },

  // ═══ 건축 (building) ═══
  {
    id: 'modern-chrome',
    category: 'building',
    icon: '🏢',
    name: { ko: '모던 크롬', en: 'Modern Chrome', ja: 'モダンクローム', 'zh-CN': '现代铬', 'zh-TW': '現代鉻' },
    description: { ko: '깔끔하고 차가운 현대 건축 느낌', en: 'Clean and cool modern architecture', ja: 'すっきり冷たいモダン建築感', 'zh-CN': '干净冷酷的现代建筑感', 'zh-TW': '乾淨冷酷的現代建築感' },
    cssFilter: 'saturate(0.8) contrast(1.2) brightness(1.02)',
    overlay: { color: '#C0C0C0', opacity: 0.06, blendMode: 'overlay' },
  },
  {
    id: 'neon-night',
    category: 'building',
    icon: '🌃',
    name: { ko: '야경 네온', en: 'Neon Night', ja: 'ネオンナイト', 'zh-CN': '霓虹夜景', 'zh-TW': '霓虹夜景' },
    description: { ko: '화려한 네온사인의 도시 야경', en: 'Colorful neon city nightscape', ja: 'カラフルなネオンの都市夜景', 'zh-CN': '绚丽霓虹城市夜景', 'zh-TW': '絢麗霓虹城市夜景' },
    cssFilter: 'saturate(1.4) contrast(1.2) brightness(0.88)',
    overlay: { color: '#FF00FF', opacity: 0.06, blendMode: 'soft-light' },
    vignette: true,
  },
  {
    id: 'vintage-brick',
    category: 'building',
    icon: '🧱',
    name: { ko: '빈티지 벽돌', en: 'Vintage Brick', ja: 'ヴィンテージブリック', 'zh-CN': '复古砖墙', 'zh-TW': '復古磚牆' },
    description: { ko: '오래된 벽돌 건물의 따뜻한 빈티지', en: 'Warm vintage of old brick buildings', ja: '古いレンガ建物の温かいヴィンテージ', 'zh-CN': '老砖建筑的温暖复古', 'zh-TW': '老磚建築的溫暖復古' },
    cssFilter: 'saturate(1.0) contrast(1.1) brightness(1.0) sepia(0.25)',
    overlay: { color: '#8B4513', opacity: 0.08, blendMode: 'multiply' },
    vignette: true,
    grain: true,
  },
]

const MAX_DIMENSION = 1920

/** Canvas filter (max 1920px resize) */
export function applyFilterToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  filter: RetroFilter,
  maxDim = MAX_DIMENSION,
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let w = image.naturalWidth
  let h = image.naturalHeight
  if (maxDim && Math.max(w, h) > maxDim) {
    const scale = maxDim / Math.max(w, h)
    w = Math.round(w * scale)
    h = Math.round(h * scale)
  }
  canvas.width = w
  canvas.height = h

  // 1) CSS filter
  ctx.filter = filter.cssFilter
  ctx.drawImage(image, 0, 0, w, h)
  ctx.filter = 'none'

  // 2) Color overlay
  if (filter.overlay) {
    ctx.globalCompositeOperation = filter.overlay.blendMode
    ctx.fillStyle = filter.overlay.color
    ctx.globalAlpha = filter.overlay.opacity
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
  }

  // 3) Vignette
  if (filter.vignette) {
    const cx = w / 2
    const cy = h / 2
    const r = Math.max(w, h) * 0.5
    const gradient = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r)
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.35)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)
  }

  // 4) Film grain (step=16 for performance)
  if (filter.grain) {
    const imageData = ctx.getImageData(0, 0, w, h)
    const d = imageData.data
    for (let i = 0; i < d.length; i += 16) {
      const noise = (Math.random() - 0.5) * 25
      d[i] += noise
      d[i + 1] += noise
      d[i + 2] += noise
    }
    ctx.putImageData(imageData, 0, 0)
  }
}

/** Canvas to JPEG Blob */
export function canvasToBlob(canvas: HTMLCanvasElement, quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/jpeg',
      quality,
    )
  })
}

/** Apply filter to File, return new File */
export async function applyFilterToFile(file: File, filter: RetroFilter): Promise<File> {
  if (filter.id === 'original') return file

  const img = new globalThis.Image()
  const url = URL.createObjectURL(file)
  img.src = url

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Image load failed'))
  })

  const canvas = document.createElement('canvas')
  applyFilterToCanvas(canvas, img, filter)
  URL.revokeObjectURL(url)

  const blob = await canvasToBlob(canvas)
  const name = file.name.replace(/\.[^.]+$/, '.jpg')
  return new File([blob], name, { type: 'image/jpeg' })
}
