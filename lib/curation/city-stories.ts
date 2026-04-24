import { CITY_TAG_SCORES } from './scoring'
import type { UserPreference } from './types'

type I18n = { ko: string; en: string; ja: string; 'zh-CN': string; 'zh-TW': string }

export interface CityStory {
  region: string
  emoji: string
  vibe: I18n
  reasonTemplates: Record<string, I18n>
}

export const CITY_STORIES: CityStory[] = [
  {
    region: 'jeonju',
    emoji: '🏮',
    vibe: { ko: '전통과 맛의 도시', en: 'City of Tradition & Taste', ja: '伝統と味の街', 'zh-CN': '传统与美食之城', 'zh-TW': '傳統與美食之城' },
    reasonTemplates: {
      traditional: { ko: '한옥마을을 거닐며 조선시대의 아름다움을 느낄 수 있어요', en: 'Walk through Hanok Village and feel the beauty of the Joseon era', ja: '韓屋村を歩いて朝鮮時代の美しさを感じられます', 'zh-CN': '漫步韩屋村，感受朝鲜时代之美', 'zh-TW': '漫步韓屋村，感受朝鮮時代之美' },
      food: { ko: '비빔밥의 본고장에서 진짜 한국의 맛을 경험할 수 있어요', en: 'Experience authentic Korean flavors in the birthplace of bibimbap', ja: 'ビビンバの本場で本物の韓国の味を体験できます', 'zh-CN': '在拌饭的发源地体验正宗韩国味道', 'zh-TW': '在拌飯的發源地體驗正宗韓國味道' },
      experience: { ko: '한지공예, 부채만들기 등 직접 체험할 수 있는 공방이 가득해요', en: 'Filled with workshops for hanji crafts, fan-making and more', ja: '韓紙工芸や扇子作りなど体験できる工房がいっぱい', 'zh-CN': '韩纸工艺、扇子制作等工坊体验丰富', 'zh-TW': '韓紙工藝、扇子製作等工坊體驗豐富' },
      market: { ko: '남부시장 야시장에서 먹방 투어를 즐겨보세요', en: 'Enjoy a food tour at Nambu Night Market', ja: '南部市場の夜市でグルメツアーを楽しんで', 'zh-CN': '在南部市场夜市享受美食之旅', 'zh-TW': '在南部市場夜市享受美食之旅' },
      walking: { ko: '한옥마을 골목골목이 포토스팟이에요. 걸으면서 발견하는 재미!', en: 'Every alley in Hanok Village is a photo spot. Fun discoveries on foot!', ja: '韓屋村の路地はどこもフォトスポット。歩いて発見する楽しさ！', 'zh-CN': '韩屋村的小巷处处是拍照点，步行发现乐趣！', 'zh-TW': '韓屋村的小巷處處是拍照點，步行發現樂趣！' },
      photo: { ko: '전동성당, 경기전, 오목대까지 인생샷 명소가 즐비해요', en: 'Stunning photo spots from Jeondong Cathedral to Gyeonggijeon', ja: '殿洞聖堂から慶基殿まで最高の撮影スポットが並びます', 'zh-CN': '从殿洞圣堂到庆基殿，绝美拍照地连绵不断', 'zh-TW': '從殿洞聖堂到慶基殿，絕美拍照地連綿不斷' },
      budget: { ko: '저렴한 가격에 최고의 한식을 맛볼 수 있는 가성비 도시예요', en: 'Best value city for authentic Korean cuisine at great prices', ja: 'リーズナブルに最高の韓食を味わえるコスパの街', 'zh-CN': '以实惠价格品尝最棒韩食的高性价比城市', 'zh-TW': '以實惠價格品嚐最棒韓食的高性價比城市' },
    },
  },
  {
    region: 'gyeongju',
    emoji: '👑',
    vibe: { ko: '천년 고도의 고즈넉한 여행', en: 'Serene journey through ancient capital', ja: '千年古都の静かな旅', 'zh-CN': '千年古都的宁静之旅', 'zh-TW': '千年古都的寧靜之旅' },
    reasonTemplates: {
      traditional: { ko: '신라 천년의 유적이 도시 곳곳에 살아 숨쉬고 있어요', en: 'Thousand-year Silla heritage lives throughout the city', ja: '新羅千年の遺跡が街中に息づいています', 'zh-CN': '新罗千年遗迹遍布城市各处', 'zh-TW': '新羅千年遺跡遍布城市各處' },
      historic: { ko: '불국사, 석굴암, 첨성대 등 유네스코 세계유산을 직접 만나보세요', en: 'Meet UNESCO World Heritage sites like Bulguksa and Seokguram', ja: '仏国寺、石窟庵、瞻星台などユネスコ世界遺産に出会えます', 'zh-CN': '亲临佛国寺、石窟庵等联合国教科文组织世界遗产', 'zh-TW': '親臨佛國寺、石窟庵等聯合國教科文組織世界遺產' },
      scenic: { ko: '보문호, 안압지의 야경은 한국에서 가장 아름다운 풍경 중 하나예요', en: 'Night views of Bomun Lake and Anapji are among Korea\'s most beautiful', ja: '普門湖と雁鴨池の夜景は韓国で最も美しい風景の一つ', 'zh-CN': '普门湖和雁鸭池的夜景是韩国最美风景之一', 'zh-TW': '普門湖和雁鴨池的夜景是韓國最美風景之一' },
      relax: { ko: '느리게 걸으며 천년의 시간을 느끼기에 완벽한 도시예요', en: 'Perfect city to walk slowly and feel a thousand years of history', ja: 'ゆっくり歩いて千年の時間を感じるのに完璧な街', 'zh-CN': '漫步感受千年时光的完美城市', 'zh-TW': '漫步感受千年時光的完美城市' },
      romantic: { ko: '동궁과 월지의 야경 앞에서 로맨틱한 추억을 만들어보세요', en: 'Create romantic memories at Donggung and Wolji night view', ja: '東宮と月池の夜景でロマンチックな思い出を', 'zh-CN': '在东宫月池夜景前创造浪漫回忆', 'zh-TW': '在東宮月池夜景前創造浪漫回憶' },
    },
  },
  {
    region: 'busan',
    emoji: '🌊',
    vibe: { ko: '바다와 도시가 만나는 활기찬 항구', en: 'Vibrant port where ocean meets city', ja: '海と都市が出会う活気ある港', 'zh-CN': '海洋与城市相遇的活力港口', 'zh-TW': '海洋與城市相遇的活力港口' },
    reasonTemplates: {
      ocean: { ko: '해운대, 광안리, 태종대까지 끝없는 바다가 기다리고 있어요', en: 'Endless ocean awaits from Haeundae to Gwangalli to Taejongdae', ja: '海雲台、広安里、太宗台まで果てしない海が待っています', 'zh-CN': '从海云台到广安里到太宗台，无尽大海等着你', 'zh-TW': '從海雲台到廣安里到太宗台，無盡大海等著你' },
      nightlife: { ko: '광안대교 야경과 서면의 활기찬 밤문화를 즐겨보세요', en: 'Enjoy Gwangan Bridge night views and Seomyeon nightlife', ja: '広安大橋の夜景と西面のナイトライフを楽しんで', 'zh-CN': '欣赏广安大桥夜景，体验西面夜生活', 'zh-TW': '欣賞廣安大橋夜景，體驗西面夜生活' },
      food: { ko: '자갈치시장 회, 밀면, 씨앗호떡 등 부산만의 맛이 가득해요', en: 'Jagalchi fish market, milmyeon noodles, ssiat hotteok - unique Busan flavors', ja: 'チャガルチの刺身、ミルミョン、シアッホットクなど釜山だけの味', 'zh-CN': '扎嘎其市场生鱼片、面条、坚果糖饼等釜山特色美食', 'zh-TW': '扎嘎其市場生魚片、麵條、堅果糖餅等釜山特色美食' },
      instagram: { ko: '감천문화마을, 흰여울마을 등 컬러풀한 포토스팟이 가득해요', en: 'Colorful photo spots like Gamcheon Culture Village and Huinnyeoul', ja: '甘川文化村やフィニョウル村などカラフルなフォトスポットがいっぱい', 'zh-CN': '甘川文化村等色彩缤纷的拍照点', 'zh-TW': '甘川文化村等色彩繽紛的拍照點' },
      active: { ko: '해안 산책로, 서핑, 요트까지 바다와 함께하는 액티비티!', en: 'Coastal walks, surfing, yachting - activities with the ocean!', ja: '海岸散策、サーフィン、ヨットまで海と一緒のアクティビティ！', 'zh-CN': '海岸漫步、冲浪、游艇——与大海共享活动！', 'zh-TW': '海岸漫步、衝浪、遊艇——與大海共享活動！' },
      sunset: { ko: '다대포 해수욕장의 일몰은 한국 최고의 석양이에요', en: 'Dadaepo Beach sunset is one of Korea\'s finest', ja: '多大浦海水浴場の夕日は韓国最高のサンセット', 'zh-CN': '多大浦海水浴场的日落是韩国最美', 'zh-TW': '多大浦海水浴場的日落是韓國最美' },
    },
  },
  {
    region: 'seoul',
    emoji: '🏙️',
    vibe: { ko: '전통과 최첨단이 공존하는 메가시티', en: 'Megacity where tradition meets cutting-edge', ja: '伝統と最先端が共存するメガシティ', 'zh-CN': '传统与尖端共存的大都市', 'zh-TW': '傳統與尖端共存的大都市' },
    reasonTemplates: {
      modern: { ko: '강남, 홍대, 이태원에서 K-컬처의 최전선을 경험하세요', en: 'Experience the frontline of K-Culture in Gangnam, Hongdae, Itaewon', ja: '江南、弘大、梨泰院でK-カルチャーの最前線を体験', 'zh-CN': '在江南、弘大、梨泰院体验K文化最前沿', 'zh-TW': '在江南、弘大、梨泰院體驗K文化最前沿' },
      trendy: { ko: '성수동 카페골목, 을지로 힙플레이스까지 트렌드의 중심지예요', en: 'From Seongsu cafes to Euljiro hip places - center of trends', ja: '聖水洞カフェ通りから乙支路のヒップスポットまでトレンドの中心', 'zh-CN': '从圣水洞咖啡街到乙支路潮流地标，潮流中心', 'zh-TW': '從聖水洞咖啡街到乙支路潮流地標，潮流中心' },
      shopping: { ko: '명동, 강남, 동대문에서 한국 패션과 뷰티를 쇼핑하세요', en: 'Shop Korean fashion and beauty in Myeongdong, Gangnam, Dongdaemun', ja: '明洞、江南、東大門で韓国ファッション＆ビューティをショッピング', 'zh-CN': '在明洞、江南、东大门购买韩国时尚美妆', 'zh-TW': '在明洞、江南、東大門購買韓國時尚美妝' },
      nightlife: { ko: '이태원, 홍대의 밤은 끝나지 않아요', en: 'The night never ends in Itaewon and Hongdae', ja: '梨泰院と弘大の夜は終わらない', 'zh-CN': '梨泰院和弘大的夜晚永不结束', 'zh-TW': '梨泰院和弘大的夜晚永不結束' },
      traditional: { ko: '경복궁, 북촌한옥마을에서 600년 조선의 역사를 만나보세요', en: 'Meet 600 years of Joseon history at Gyeongbokgung and Bukchon', ja: '景福宮と北村韓屋村で600年の朝鮮の歴史に出会えます', 'zh-CN': '在景福宫和北村韩屋村邂逅600年朝鲜历史', 'zh-TW': '在景福宮和北村韓屋村邂逅600年朝鮮歷史' },
      luxury: { ko: '청담동, 압구정에서 프리미엄 다이닝과 럭셔리 쇼핑을', en: 'Premium dining and luxury shopping in Cheongdam and Apgujeong', ja: '清潭洞と狎鴎亭でプレミアムダイニングとラグジュアリーショッピング', 'zh-CN': '在清潭洞和狎鸥亭享受高端餐饮和奢华购物', 'zh-TW': '在清潭洞和狎鷗亭享受高端餐飲和奢華購物' },
    },
  },
  {
    region: 'jeju',
    emoji: '🌴',
    vibe: { ko: '자연이 만든 힐링 섬', en: 'Healing island crafted by nature', ja: '自然が作ったヒーリングの島', 'zh-CN': '自然打造的疗愈之岛', 'zh-TW': '自然打造的療癒之島' },
    reasonTemplates: {
      nature: { ko: '한라산, 성산일출봉, 주상절리까지 유네스코 자연유산의 보고예요', en: 'UNESCO natural heritage from Hallasan to Seongsan and Jusangjeolli', ja: '漢拏山、城山日出峰、柱状節理までユネスコ自然遺産の宝庫', 'zh-CN': '从汉拿山到城山日出峰，联合国教科文组织自然遗产宝库', 'zh-TW': '從漢拿山到城山日出峰，聯合國教科文組織自然遺產寶庫' },
      driving: { ko: '해안도로 드라이브는 제주 여행의 꽃이에요', en: 'Coastal road drive is the highlight of Jeju travel', ja: '海岸道路ドライブは済州旅行のハイライト', 'zh-CN': '海岸公路自驾是济州旅行的精华', 'zh-TW': '海岸公路自駕是濟州旅行的精華' },
      relax: { ko: '올레길을 걸으며 바람과 파도 소리에 힐링하세요', en: 'Heal with wind and waves walking the Olle Trail', ja: 'オルレ道を歩きながら風と波の音でヒーリング', 'zh-CN': '走偶来小路，在风声和波涛中疗愈', 'zh-TW': '走偶來小路，在風聲和波濤中療癒' },
      cafe: { ko: '제주만의 감성 카페에서 바다를 바라보며 쉬어가세요', en: 'Rest at Jeju\'s unique cafes overlooking the ocean', ja: '済州ならではのカフェで海を眺めながら休憩', 'zh-CN': '在济州特色咖啡馆望着大海休息', 'zh-TW': '在濟州特色咖啡館望著大海休息' },
      romantic: { ko: '협재해변의 에메랄드빛 바다는 연인에게 최고의 선물이에요', en: 'Hyeopjae Beach\'s emerald waters are the perfect gift for couples', ja: '挟才海岸のエメラルドの海はカップルへの最高の贈り物', 'zh-CN': '挟才海边的翡翠色大海是情侣最好的礼物', 'zh-TW': '挾才海邊的翡翠色大海是情侶最好的禮物' },
      family: { ko: '에코랜드, 아쿠아플라넷 등 가족과 즐길 곳이 가득해요', en: 'Ecoland, Aqua Planet and more - fun for the whole family', ja: 'エコランド、アクアプラネットなど家族で楽しめるスポットがいっぱい', 'zh-CN': '生态乐园、水族馆等全家欢乐的场所', 'zh-TW': '生態樂園、水族館等全家歡樂的場所' },
    },
  },
  {
    region: 'tongyeong',
    emoji: '⛵',
    vibe: { ko: '한국의 나폴리, 낭만의 항구', en: 'Korea\'s Naples, romantic port city', ja: '韓国のナポリ、ロマンの港', 'zh-CN': '韩国的那不勒斯，浪漫港口', 'zh-TW': '韓國的那不勒斯，浪漫港口' },
    reasonTemplates: {
      scenic: { ko: '한려수도의 다도해 풍경은 한국에서 가장 아름다운 바다 뷰예요', en: 'Hallyeosudo archipelago views are Korea\'s most beautiful sea views', ja: '閑麗水道の多島海風景は韓国で最も美しい海の景色', 'zh-CN': '闲丽水道的多岛海风景是韩国最美海景', 'zh-TW': '閑麗水道的多島海風景是韓國最美海景' },
      ocean: { ko: '케이블카 타고 내려다보는 통영 바다는 잊지 못할 풍경이에요', en: 'The Tongyeong sea from the cable car is unforgettable', ja: 'ケーブルカーから見下ろす統営の海は忘れられない景色', 'zh-CN': '从缆车俯瞰的统营大海是难忘的风景', 'zh-TW': '從纜車俯瞰的統營大海是難忘的風景' },
      food: { ko: '충무김밥, 꿀빵, 해물탕까지 항구 도시의 맛이 가득해요', en: 'Chungmu gimbap, honey bread, seafood stew - port city flavors', ja: '忠武キンパ、蜜パン、海鮮鍋まで港町の味がいっぱい', 'zh-CN': '忠武紫菜包饭、蜜面包、海鲜汤，港口城市美味', 'zh-TW': '忠武紫菜包飯、蜜麵包、海鮮湯，港口城市美味' },
      relax: { ko: '동피랑 벽화마을에서 여유롭게 산책하며 예술을 감상하세요', en: 'Leisurely stroll and art appreciation at Dongpirang Mural Village', ja: '東ピランの壁画村でのんびり散歩しながらアートを鑑賞', 'zh-CN': '在东皮郎壁画村悠闲散步欣赏艺术', 'zh-TW': '在東皮郎壁畫村悠閒散步欣賞藝術' },
      romantic: { ko: '미륵산 케이블카에서 바라보는 석양은 연인에게 최고의 선물', en: 'Sunset from Mireuksan cable car is the ultimate romantic gift', ja: '弥勒山ケーブルカーからの夕日はカップルへの最高のプレゼント', 'zh-CN': '弥勒山缆车上看日落，情侣最佳礼物', 'zh-TW': '彌勒山纜車上看日落，情侶最佳禮物' },
    },
  },
  {
    region: 'cheonan',
    emoji: '🎋',
    vibe: { ko: '편안한 근교 여행의 시작점', en: 'Starting point for a cozy getaway', ja: '快適な近郊旅行の出発点', 'zh-CN': '舒适近郊旅行的起点', 'zh-TW': '舒適近郊旅行的起點' },
    reasonTemplates: {
      active: { ko: '독립기념관과 유관순열사 유적지에서 한국의 역사를 체험하세요', en: 'Experience Korean history at Independence Hall and Yu Gwan-sun sites', ja: '独立記念館と柳寛順烈士遺跡で韓国の歴史を体験', 'zh-CN': '在独立纪念馆和柳宽顺烈士遗址体验韩国历史', 'zh-TW': '在獨立紀念館和柳寬順烈士遺址體驗韓國歷史' },
      nature: { ko: '태조산과 성성호수공원에서 자연 속 힐링 산책을 즐기세요', en: 'Enjoy healing walks at Taejosan and Seongseong Lake Park', ja: '太祖山と星星湖水公園で自然の中のヒーリング散歩を', 'zh-CN': '在太祖山和星星湖公园享受自然疗愈散步', 'zh-TW': '在太祖山和星星湖公園享受自然療癒散步' },
      budget: { ko: '서울에서 KTX 30분! 가성비 최고의 당일치기 여행지예요', en: '30 min from Seoul by KTX! Best value day trip destination', ja: 'ソウルからKTXで30分！コスパ最高の日帰り旅行先', 'zh-CN': '从首尔坐KTX 30分钟！性价比最高的一日游目的地', 'zh-TW': '從首爾坐KTX 30分鐘！性價比最高的一日遊目的地' },
      food: { ko: '호두과자의 원조 도시! 천안의 숨은 맛집을 탐방하세요', en: 'Original city of walnut cookies! Explore hidden food gems', ja: 'クルミ菓子の元祖の街！天安の隠れたグルメを探訪', 'zh-CN': '核桃饼的发源地！探索天安隐藏美食', 'zh-TW': '核桃餅的發源地！探索天安隱藏美食' },
    },
  },
  {
    region: 'yongin',
    emoji: '🎢',
    vibe: { ko: '테마파크와 전통이 만나는 놀이터', en: 'Playground where theme parks meet tradition', ja: 'テーマパークと伝統が出会う遊び場', 'zh-CN': '主题乐园与传统相遇的游乐场', 'zh-TW': '主題樂園與傳統相遇的遊樂場' },
    reasonTemplates: {
      themepark: { ko: '에버랜드에서 스릴 넘치는 하루를 보내세요!', en: 'Spend a thrilling day at Everland!', ja: 'エバーランドでスリル満点の一日を！', 'zh-CN': '在爱宝乐园度过刺激的一天！', 'zh-TW': '在愛寶樂園度過刺激的一天！' },
      family: { ko: '한국민속촌에서 조선시대로 시간여행! 가족 모두가 즐거워요', en: 'Time travel to Joseon at Korean Folk Village! Fun for all ages', ja: '韓国民俗村で朝鮮時代へタイムトリップ！家族みんなが楽しめる', 'zh-CN': '在韩国民俗村穿越回朝鲜时代！全家欢乐', 'zh-TW': '在韓國民俗村穿越回朝鮮時代！全家歡樂' },
      group: { ko: '친구들과 에버랜드+민속촌 콤보로 완벽한 하루를 만들어보세요', en: 'Create a perfect day with friends: Everland + Folk Village combo', ja: '友達とエバーランド＋民俗村コンボで完璧な一日を', 'zh-CN': '和朋友一起，爱宝乐园+民俗村完美一日组合', 'zh-TW': '和朋友一起，愛寶樂園+民俗村完美一日組合' },
      traditional: { ko: '한국민속촌에서 전통 공연과 체험을 한 번에 즐기세요', en: 'Enjoy traditional performances and experiences at Folk Village', ja: '民俗村で伝統公演と体験を一度に楽しめます', 'zh-CN': '在民俗村一次享受传统表演和体验', 'zh-TW': '在民俗村一次享受傳統表演和體驗' },
    },
  },
  {
    region: 'icheon',
    emoji: '🏺',
    vibe: { ko: '도자기와 쌀의 고장, 느린 여행', en: 'Land of ceramics and rice, slow travel', ja: '陶磁器と米の故郷、スローな旅', 'zh-CN': '陶瓷与稻米之乡，慢旅行', 'zh-TW': '陶瓷與稻米之鄉，慢旅行' },
    reasonTemplates: {
      experience: { ko: '도자기 만들기 체험으로 세계적인 이천 도자 문화를 직접 느껴보세요', en: 'Experience world-class Icheon ceramic culture hands-on', ja: '陶芸体験で世界的な利川の陶磁文化を直接感じて', 'zh-CN': '通过陶艺体验感受世界级利川陶瓷文化', 'zh-TW': '通過陶藝體驗感受世界級利川陶瓷文化' },
      relax: { ko: '온천과 스파에서 몸과 마음을 쉬어가세요', en: 'Rest body and mind at hot springs and spas', ja: '温泉とスパで体と心を休めて', 'zh-CN': '在温泉和水疗中心休息身心', 'zh-TW': '在溫泉和水療中心休息身心' },
      food: { ko: '이천 쌀밥은 한국 최고의 맛! 쌀 문화 체험까지 즐기세요', en: 'Icheon rice is Korea\'s finest! Enjoy rice culture experiences too', ja: '利川のご飯は韓国最高の味！米文化体験も楽しんで', 'zh-CN': '利川米饭是韩国最好吃的！还能体验稻米文化', 'zh-TW': '利川米飯是韓國最好吃的！還能體驗稻米文化' },
      nature: { ko: '설봉공원의 벚꽃과 산수유마을의 봄은 천국이에요', en: 'Cherry blossoms at Seolbong Park and spring at Sansuyou Village', ja: '雪峰公園の桜とサンスユ村の春は天国', 'zh-CN': '雪峰公园的樱花和山茱萸村的春天如天堂', 'zh-TW': '雪峰公園的櫻花和山茱萸村的春天如天堂' },
      spa: { ko: '이천 온천은 피부미용에 좋은 천연 광천수로 유명해요', en: 'Icheon hot springs are famous for natural mineral water', ja: '利川温泉は美肌に良い天然鉱泉水で有名', 'zh-CN': '利川温泉以对皮肤好的天然矿泉水闻名', 'zh-TW': '利川溫泉以對皮膚好的天然礦泉水聞名' },
    },
  },

  // ── 14개 광역시도 추가 (전국 확장) ─────────────────────────────
  {
    region: 'incheon',
    emoji: '✈️',
    vibe: { ko: '공항과 바다가 만나는 국제 관문', en: 'International gateway where airport meets the sea', ja: '空港と海が出会う国際ゲートウェイ', 'zh-CN': '机场与海洋相遇的国际门户', 'zh-TW': '機場與海洋相遇的國際門戶' },
    reasonTemplates: {
      city: { ko: '송도 국제도시의 현대적인 스카이라인이 인상적이에요', en: "Songdo's futuristic skyline is stunning", ja: '松島国際都市のモダンなスカイラインが印象的', 'zh-CN': '松岛国际都市的现代天际线令人印象深刻', 'zh-TW': '松島國際都市的現代天際線令人印象深刻' },
      food: { ko: '차이나타운에서 자장면의 원조를 맛보세요', en: 'Taste the origin of jajangmyeon in Chinatown', ja: 'チャイナタウンでジャージャー麺の元祖を味わえます', 'zh-CN': '在中国城品尝炸酱面的起源', 'zh-TW': '在中國城品嚐炸醬麵的起源' },
      'street-food': { ko: '신포국제시장·월미도 먹거리는 인천 여행의 맛이에요', en: 'Sinpo Market and Wolmido food define Incheon travel', ja: '新浦国際市場と月尾島の屋台が仁川旅行の味', 'zh-CN': '新浦国际市场与月尾岛小吃是仁川旅行的味道', 'zh-TW': '新浦國際市場與月尾島小吃是仁川旅行的味道' },
      ocean: { ko: '월미도와 을왕리 해변에서 서해 노을을 감상하세요', en: 'Watch West Sea sunsets at Wolmido and Eurwangni Beach', ja: '月尾島と乙旺里海岸で西海の夕焼けを', 'zh-CN': '在月尾岛和乙旺里海滩欣赏西海日落', 'zh-TW': '在月尾島和乙旺里海灘欣賞西海日落' },
      shopping: { ko: '송도 트리플스트리트에서 쇼핑과 미식을 한번에', en: 'Shopping and dining together at Songdo Triple Street', ja: '松島トリプルストリートでショッピングとグルメを一度に', 'zh-CN': '在松岛Triple Street一站式购物美食', 'zh-TW': '在松島Triple Street一站式購物美食' },
    },
  },
  {
    region: 'daejeon',
    emoji: '🔬',
    vibe: { ko: '과학과 온천이 흐르는 중부 허브', en: 'Central hub flowing with science and hot springs', ja: '科学と温泉が流れる中部ハブ', 'zh-CN': '科学与温泉交汇的中部枢纽', 'zh-TW': '科學與溫泉交匯的中部樞紐' },
    reasonTemplates: {
      modern: { ko: '대덕연구단지와 국립중앙과학관에서 첨단 과학을 체험하세요', en: 'Experience cutting-edge science at Daedeok and the National Science Museum', ja: '大徳研究団地と国立中央科学館で最先端科学を体験', 'zh-CN': '在大德研究园区和国立中央科学馆体验尖端科学', 'zh-TW': '在大德研究園區和國立中央科學館體驗尖端科學' },
      spa: { ko: '유성온천에서 피로를 씻어내는 여유를 즐기세요', en: 'Unwind at Yuseong Hot Springs', ja: '儒城温泉で疲れを癒すひとときを', 'zh-CN': '在儒城温泉洗去疲惫', 'zh-TW': '在儒城溫泉洗去疲憊' },
      food: { ko: '성심당 튀김소보로는 꼭 맛봐야 하는 대전의 상징이에요', en: 'Sungsimdang fried soboro is a must-try Daejeon icon', ja: '聖心堂のフライドソボロは大田の名物', 'zh-CN': '圣心堂炸酥菠萝面包是必尝大田名物', 'zh-TW': '聖心堂炸酥菠蘿麵包是必嚐大田名物' },
      relax: { ko: '한밭수목원과 뿌리공원에서 여유로운 도심 산책을', en: 'Easy urban strolls at Hanbat Arboretum and Root Park', ja: 'ハンバッ樹木園とプリ公園でのんびり散策', 'zh-CN': '在韩巴特植物园和根公园悠闲漫步', 'zh-TW': '在韓巴特植物園和根公園悠閒漫步' },
    },
  },
  {
    region: 'daegu',
    emoji: '🌶️',
    vibe: { ko: '뜨거운 여름과 매운 음식의 도시', en: 'City of hot summers and spicy food', ja: '熱い夏とスパイシーな食の都市', 'zh-CN': '炎热夏日与辣味美食之城', 'zh-TW': '炎熱夏日與辣味美食之城' },
    reasonTemplates: {
      food: { ko: '따로국밥·납작만두·막창까지 대구 10味는 놓칠 수 없어요', en: "Don't miss Daegu's 10 specialties: ttaroguk, flat dumplings, makchang", ja: 'タロクッパ・ぺチャンマンドゥ・マッチャンなど大邱10味は必食', 'zh-CN': '独菜汤饭、扁饺子、烤肠——大邱10味不可错过', 'zh-TW': '獨菜湯飯、扁餃子、烤腸——大邱10味不可錯過' },
      market: { ko: '서문시장은 한국 3대 전통시장, 야시장까지 먹방 성지', en: "Seomun Market is one of Korea's top 3 traditional markets with epic night market", ja: '西門市場は韓国三大伝統市場、夜市もグルメ聖地', 'zh-CN': '西门市场是韩国三大传统市场之一，夜市美食天堂', 'zh-TW': '西門市場是韓國三大傳統市場之一，夜市美食天堂' },
      'street-food': { ko: '서문시장 야시장의 길거리 음식은 진짜 대구의 맛이에요', en: 'Seomun Night Market street food is the real Daegu flavor', ja: '西門夜市の屋台こそ本物の大邱の味', 'zh-CN': '西门夜市小吃是最正宗的大邱味道', 'zh-TW': '西門夜市小吃是最正宗的大邱味道' },
      historic: { ko: '근대골목 투어로 1900년대 대구로 시간 여행을 떠나요', en: 'Time travel to 1900s Daegu on the Modern History Alley tour', ja: '近代路地ツアーで1900年代の大邱へタイムトリップ', 'zh-CN': '近代小巷之旅穿越1900年代大邱', 'zh-TW': '近代小巷之旅穿越1900年代大邱' },
      hiking: { ko: '팔공산 케이블카에서 도심과 자연을 한눈에', en: 'Palgongsan cable car shows city and nature in one view', ja: '八公山ケーブルカーで都心と自然を一望', 'zh-CN': '八公山缆车将城市与自然尽收眼底', 'zh-TW': '八公山纜車將城市與自然盡收眼底' },
    },
  },
  {
    region: 'gwangju',
    emoji: '🎨',
    vibe: { ko: '예술과 맛이 살아있는 남도의 중심', en: 'Heart of the south, alive with art and cuisine', ja: '芸術と味が息づく南道の中心', 'zh-CN': '艺术与美食鲜活的南道中心', 'zh-TW': '藝術與美食鮮活的南道中心' },
    reasonTemplates: {
      food: { ko: '광주는 남도 한정식과 오리탕의 본고장이에요', en: 'Gwangju is the home of Namdo hanjeongsik and duck stew', ja: '光州は南道韓定食とアヒル鍋の本場', 'zh-CN': '光州是南道韩定食与鸭汤的发源地', 'zh-TW': '光州是南道韓定食與鴨湯的發源地' },
      historic: { ko: '국립아시아문화전당에서 아시아 현대 예술을 만나보세요', en: 'Meet Asian contemporary art at the Asia Culture Center', ja: '国立アジア文化殿堂でアジア現代アートに出会う', 'zh-CN': '在国立亚洲文化殿堂邂逅亚洲当代艺术', 'zh-TW': '在國立亞洲文化殿堂邂逅亞洲當代藝術' },
      hiking: { ko: '무등산에서 도심 속 명산의 힘찬 능선을 걸어보세요', en: 'Walk the mighty ridges of Mudeungsan rising from the city', ja: '無等山で都心にそびえる霊峰の稜線を歩いて', 'zh-CN': '在无等山漫步都市名山的雄伟山脊', 'zh-TW': '在無等山漫步都市名山的雄偉山脊' },
      cafe: { ko: '양림동 근대거리의 감성 카페에서 예술과 커피를 함께', en: 'Art and coffee together at Yangnim-dong cafes', ja: '楊林洞近代通りのカフェでアートとコーヒーを', 'zh-CN': '在杨林洞近代街咖啡馆享受艺术与咖啡', 'zh-TW': '在楊林洞近代街咖啡館享受藝術與咖啡' },
      traditional: { ko: '충장로와 대인예술시장이 만드는 옛날과 오늘의 조화', en: 'Past and present meet in Chungjang-ro and Daein Art Market', ja: '忠壮路と大仁芸術市場が織りなす昔と今の調和', 'zh-CN': '忠壮路与大仁艺术市场交织的过去与现在', 'zh-TW': '忠壯路與大仁藝術市場交織的過去與現在' },
    },
  },
  {
    region: 'ulsan',
    emoji: '🐳',
    vibe: { ko: '고래와 일출이 함께하는 동해의 시작', en: 'Start of the East Sea, where whales meet the sunrise', ja: 'クジラと日の出が迎える東海の始まり', 'zh-CN': '鲸鱼与日出相伴的东海起点', 'zh-TW': '鯨魚與日出相伴的東海起點' },
    reasonTemplates: {
      ocean: { ko: '대왕암공원의 파도와 절벽이 만드는 드라마틱한 해안', en: 'Dramatic coast of waves and cliffs at Daewangam Park', ja: '大王岩公園の波と絶壁が織りなすドラマチックな海岸', 'zh-CN': '大王岩公园的波涛与峭壁演绎壮美海岸', 'zh-TW': '大王岩公園的波濤與峭壁演繹壯美海岸' },
      sunset: { ko: '간절곶은 한국에서 가장 먼저 해가 뜨는 명소예요', en: 'Ganjeolgot — the first sunrise point in Korea', ja: '艮絶串は韓国で最も早く日が昇る名所', 'zh-CN': '艮绝串——韩国最早的日出名所', 'zh-TW': '艮絕串——韓國最早的日出名所' },
      nature: { ko: '태화강 국가정원은 도심 한가운데 흐르는 초록 오아시스', en: 'Taehwagang National Garden is a green oasis in the city', ja: '太和江国家庭園は都心に流れるグリーンオアシス', 'zh-CN': '太和江国家庭园是都市中的绿色绿洲', 'zh-TW': '太和江國家庭園是都市中的綠色綠洲' },
      coastal: { ko: '일산해수욕장과 주전 몽돌해변은 울산만의 바다 매력', en: 'Ilsan Beach and Jujeon pebble beach are peak Ulsan sea vibes', ja: '日山海水浴場と注田の丸石浜は蔚山ならではの海の魅力', 'zh-CN': '日山海水浴场和注田鹅卵石海滩——蔚山特有海洋魅力', 'zh-TW': '日山海水浴場和注田鵝卵石海灘——蔚山特有海洋魅力' },
    },
  },
  {
    region: 'sejong',
    emoji: '🏛️',
    vibe: { ko: '계획도시의 여유, 호수와 정부청사', en: 'The calm of a planned city with lakes and government halls', ja: '計画都市の余裕、湖と行政庁舎', 'zh-CN': '规划城市的悠然，湖水与政府机关', 'zh-TW': '規劃城市的悠然，湖水與政府機關' },
    reasonTemplates: {
      modern: { ko: '세종시 행정중심복합도시의 미래 지향적인 도시 설계를 만나보세요', en: 'Experience the future-forward urban design of Sejong', ja: '世宗市の未来志向的な都市デザインに出会えます', 'zh-CN': '邂逅世宗市面向未来的都市设计', 'zh-TW': '邂逅世宗市面向未來的都市設計' },
      relax: { ko: '세종호수공원에서 도심 속 호숫가 산책을 즐겨요', en: 'Enjoy lakeside strolls at Sejong Lake Park', ja: '世宗湖水公園で都心の湖畔散歩を', 'zh-CN': '在世宗湖水公园享受都市湖畔漫步', 'zh-TW': '在世宗湖水公園享受都市湖畔漫步' },
      nature: { ko: '영평사의 구절초 꽃밭은 가을 세종의 숨은 명소예요', en: 'Yeongpyeongsa chrysanthemum fields are a hidden autumn gem', ja: '霊平寺の九節草畑は秋の世宗の隠れた名所', 'zh-CN': '灵平寺九节草花田是秋季世宗的隐藏名所', 'zh-TW': '靈平寺九節草花田是秋季世宗的隱藏名所' },
      walking: { ko: '금강 보행교에서 강을 건너며 세종의 풍경을 감상하세요', en: 'Cross the Geumgang pedestrian bridge for panoramic Sejong views', ja: '錦江歩行橋を渡りながら世宗の風景を', 'zh-CN': '漫步锦江人行桥欣赏世宗全景', 'zh-TW': '漫步錦江人行橋欣賞世宗全景' },
    },
  },
  {
    region: 'gyeonggi',
    emoji: '🌆',
    vibe: { ko: '수도권의 모든 것, 자연과 테마파크', en: 'Everything around Seoul: nature, theme parks, heritage', ja: '首都圏のすべて、自然とテーマパーク', 'zh-CN': '首都圈一切，自然与主题乐园', 'zh-TW': '首都圈一切，自然與主題樂園' },
    reasonTemplates: {
      historic: { ko: '수원화성은 유네스코 세계유산이 된 조선의 과학 건축이에요', en: 'Suwon Hwaseong is a UNESCO-listed Joseon scientific fortress', ja: '水原華城はユネスコ世界遺産の朝鮮科学建築', 'zh-CN': '水原华城是联合国教科文组织世界遗产的朝鲜科学建筑', 'zh-TW': '水原華城是聯合國教科文組織世界遺產的朝鮮科學建築' },
      nature: { ko: '가평·양평·포천의 계곡과 호수는 서울에서 가장 가까운 자연이에요', en: "Gapyeong, Yangpyeong, Pocheon — Seoul's nearest nature escape", ja: '加平・楊平・抱川の渓谷と湖はソウルから最も近い自然', 'zh-CN': '加平、杨平、抱川的溪谷与湖泊是首尔最近的自然', 'zh-TW': '加平、楊平、抱川的溪谷與湖泊是首爾最近的自然' },
      themepark: { ko: '에버랜드·한국민속촌·캐리비안베이까지 가족 여행 완벽', en: 'Everland, Folk Village, Caribbean Bay — perfect for families', ja: 'エバーランド・韓国民俗村・カリビアンベイで家族旅行完璧', 'zh-CN': '爱宝乐园、民俗村、加勒比湾——家庭出游完美', 'zh-TW': '愛寶樂園、民俗村、加勒比灣——家庭出遊完美' },
      driving: { ko: '북한강변과 남한강변은 수도권 최고의 드라이브 코스', en: 'North and South Han River roads — top drives near Seoul', ja: '北漢江・南漢江沿いは首都圏最高のドライブコース', 'zh-CN': '北汉江、南汉江沿岸是首都圈最佳自驾路线', 'zh-TW': '北漢江、南漢江沿岸是首都圈最佳自駕路線' },
      cafe: { ko: '양평·가평의 감성 베이커리 카페는 주말의 완벽한 힐링', en: 'Yangpyeong & Gapyeong bakery cafes — perfect weekend healing', ja: '楊平・加平の感性ベーカリーカフェは週末の完璧な癒し', 'zh-CN': '杨平、加平的情调面包咖啡馆——完美周末疗愈', 'zh-TW': '楊平、加平的情調麵包咖啡館——完美週末療癒' },
    },
  },
  {
    region: 'gangwon',
    emoji: '⛰️',
    vibe: { ko: '산과 바다, 눈과 파도가 만나는 사계절', en: 'Four seasons where mountains meet the sea', ja: '山と海、雪と波が出会う四季', 'zh-CN': '山与海、雪与浪交汇的四季', 'zh-TW': '山與海、雪與浪交匯的四季' },
    reasonTemplates: {
      nature: { ko: '설악산의 기암절벽은 한국을 대표하는 자연 유산이에요', en: "Seoraksan's crags are one of Korea's iconic natural heritages", ja: '雪岳山の奇岩絶壁は韓国を代表する自然遺産', 'zh-CN': '雪岳山奇岩绝壁是韩国代表自然遗产', 'zh-TW': '雪嶽山奇岩絕壁是韓國代表自然遺產' },
      hiking: { ko: '설악산·오대산·태백산까지 국립공원 트레킹의 성지예요', en: 'Seorak, Odae, Taebaek — mecca of national park trekking', ja: '雪岳山・五台山・太白山まで国立公園トレッキングの聖地', 'zh-CN': '雪岳山、五台山、太白山——国立公园徒步圣地', 'zh-TW': '雪嶽山、五台山、太白山——國立公園徒步聖地' },
      ocean: { ko: '속초·양양·강릉의 동해 바다는 서핑과 일출 명소로 유명해요', en: 'Sokcho, Yangyang, Gangneung — famed for surfing and sunrises', ja: '束草・襄陽・江陵の東海は サーフィンと日の出の名所', 'zh-CN': '束草、襄阳、江陵的东海以冲浪和日出闻名', 'zh-TW': '束草、襄陽、江陵的東海以衝浪和日出聞名' },
      adventure: { ko: '양양 서핑, 평창 스키, 영월 래프팅까지 액티비티 천국', en: 'Yangyang surfing, Pyeongchang skiing, Yeongwol rafting — activity heaven', ja: '襄陽サーフィン、平昌スキー、寧越ラフティングのアクティビティ天国', 'zh-CN': '襄阳冲浪、平昌滑雪、宁越漂流——活动天堂', 'zh-TW': '襄陽衝浪、平昌滑雪、寧越漂流——活動天堂' },
      cafe: { ko: '강릉 안목해변 카페거리는 동해 바다와 커피의 성지', en: "Gangneung Anmok Beach is the shrine of sea-view coffee", ja: '江陵安木海岸のカフェ通りは東海とコーヒーの聖地', 'zh-CN': '江陵安木海滩咖啡街——东海与咖啡圣地', 'zh-TW': '江陵安木海灘咖啡街——東海與咖啡聖地' },
      'scenic-road': { ko: '미시령·한계령 드라이브는 강원도 최고의 풍경 도로예요', en: 'Misiryeong and Hangyeryeong — best scenic drives in Gangwon', ja: '弥矢嶺・寒渓嶺のドライブは江原道最高の絶景道路', 'zh-CN': '弥矢岭、寒溪岭自驾——江原道最美风景公路', 'zh-TW': '彌矢嶺、寒溪嶺自駕——江原道最美風景公路' },
    },
  },
  {
    region: 'chungbuk',
    emoji: '🌾',
    vibe: { ko: '호수와 산이 어우러진 내륙의 여유', en: 'Inland calm woven by lakes and mountains', ja: '湖と山が調和する内陸のゆとり', 'zh-CN': '湖光山色交织的内陆悠然', 'zh-TW': '湖光山色交織的內陸悠然' },
    reasonTemplates: {
      nature: { ko: '단양팔경의 기암괴석과 충주호의 푸른 물결이 환상적이에요', en: "Danyang's crags and Chungju Lake's blue waves are breathtaking", ja: '丹陽八景の奇岩と忠州湖の青い波が幻想的', 'zh-CN': '丹阳八景奇岩与忠州湖碧波如梦似幻', 'zh-TW': '丹陽八景奇岩與忠州湖碧波如夢似幻' },
      hiking: { ko: '속리산과 월악산에서 내륙의 명산을 만나보세요', en: 'Meet inland peaks at Songnisan and Woraksan', ja: '俗離山と月岳山で内陸の霊峰に出会う', 'zh-CN': '在俗离山和月岳山邂逅内陆名山', 'zh-TW': '在俗離山和月岳山邂逅內陸名山' },
      temple: { ko: '법주사 팔상전은 한국 유일의 5층 목탑이에요', en: "Beopjusa's Palsangjeon is Korea's only 5-story wooden pagoda", ja: '法住寺の捌相殿は韓国唯一の五層木塔', 'zh-CN': '法住寺捌相殿是韩国唯一五层木塔', 'zh-TW': '法住寺捌相殿是韓國唯一五層木塔' },
      'scenic-road': { ko: '단양 수양개길과 청풍호반 드라이브는 환상의 코스예요', en: "Danyang Suyanggae road and Cheongpung Lake drive are stunning", ja: '丹陽水楊介ギルと清風湖畔ドライブは絶景コース', 'zh-CN': '丹阳水杨介路与清风湖畔自驾——梦幻路线', 'zh-TW': '丹陽水楊介路與清風湖畔自駕——夢幻路線' },
      countryside: { ko: '청주·제천의 시골 풍경은 조용한 여행을 원하는 이들의 안식처', en: 'Cheongju and Jecheon countryside offer quiet sanctuary', ja: '清州・堤川の田園風景は静かな旅を求める人の安らぎ', 'zh-CN': '清州、堤川的乡村风景——安静旅行者的港湾', 'zh-TW': '清州、堤川的鄉村風景——安靜旅行者的港灣' },
    },
  },
  {
    region: 'chungnam',
    emoji: '🏯',
    vibe: { ko: '백제의 숨결과 서해의 노을', en: 'Breath of Baekje and West Sea sunsets', ja: '百済の息吹と西海の夕焼け', 'zh-CN': '百济气息与西海日落', 'zh-TW': '百濟氣息與西海日落' },
    reasonTemplates: {
      historic: { ko: '공주·부여는 백제 700년의 숨결을 간직한 고도예요', en: 'Gongju and Buyeo hold 700 years of Baekje heritage', ja: '公州と扶余は百済700年の息吹を宿す古都', 'zh-CN': '公州、扶余是百济700年气息的古都', 'zh-TW': '公州、扶餘是百濟700年氣息的古都' },
      traditional: { ko: '부소산성과 정림사지에서 백제의 아름다움을 직접 만나요', en: 'Meet Baekje beauty at Busosanseong and Jeongnimsa-ji', ja: '扶蘇山城と定林寺址で百済の美しさに出会う', 'zh-CN': '在扶苏山城和定林寺址邂逅百济之美', 'zh-TW': '在扶蘇山城和定林寺址邂逅百濟之美' },
      ocean: { ko: '태안·보령의 서해 해수욕장과 낙조가 잊지 못할 추억을 만들어요', en: "Taean and Boryeong's West Sea sunsets create unforgettable memories", ja: '泰安と保寧の西海海水浴場と落日が忘れられない思い出を', 'zh-CN': '泰安、保宁的西海海滩与落日难以忘怀', 'zh-TW': '泰安、保寧的西海海灘與落日難以忘懷' },
      spa: { ko: '덕산·온양온천은 왕이 사랑했던 유서 깊은 온천이에요', en: "Deoksan and Onyang were hot springs beloved by kings", ja: '徳山・温陽温泉は王に愛された由緒ある温泉', 'zh-CN': '德山、温阳温泉是国王钟爱的历史温泉', 'zh-TW': '德山、溫陽溫泉是國王鍾愛的歷史溫泉' },
      food: { ko: '서해 제철 해산물과 예산 사과 와인은 꼭 맛봐야 해요', en: 'Seasonal West Sea seafood and Yesan apple wine are must-tries', ja: '西海の旬の海産物と礼山のリンゴワインは必食', 'zh-CN': '西海时令海鲜和礼山苹果酒必尝', 'zh-TW': '西海時令海鮮和禮山蘋果酒必嚐' },
    },
  },
  {
    region: 'gyeongbuk',
    emoji: '🏮',
    vibe: { ko: '선비 정신이 살아있는 한국 전통의 뿌리', en: 'Root of Korean tradition, where scholar spirit lives on', ja: '両班の精神が息づく韓国伝統のルーツ', 'zh-CN': '士大夫精神鲜活的韩国传统之根', 'zh-TW': '士大夫精神鮮活的韓國傳統之根' },
    reasonTemplates: {
      traditional: { ko: '안동 하회마을은 유네스코 세계유산으로 지정된 살아있는 전통마을', en: 'Andong Hahoe Village is a UNESCO living traditional village', ja: '安東河回村はユネスコ世界遺産の生きた伝統村', 'zh-CN': '安东河回村是联合国教科文组织的活态传统村落', 'zh-TW': '安東河回村是聯合國教科文組織的活態傳統村落' },
      historic: { ko: '도산서원·병산서원은 조선 선비 문화의 정수예요', en: 'Dosan and Byeongsan Seowon are the essence of Joseon scholar culture', ja: '陶山書院・屛山書院は朝鮮両班文化の真髄', 'zh-CN': '陶山书院、屏山书院是朝鲜士大夫文化精髓', 'zh-TW': '陶山書院、屏山書院是朝鮮士大夫文化精髓' },
      temple: { ko: '영주 부석사 무량수전은 한국에서 가장 오래된 목조건물 중 하나예요', en: "Yeongju Buseoksa Muryangsujeon is among Korea's oldest wooden halls", ja: '栄州浮石寺無量寿殿は韓国最古の木造建築の一つ', 'zh-CN': '荣州浮石寺无量寿殿是韩国最古老的木造建筑之一', 'zh-TW': '榮州浮石寺無量壽殿是韓國最古老的木造建築之一' },
      meditation: { ko: '청송·문경의 고즈넉한 산사에서 템플스테이의 여유를 경험하세요', en: 'Templestay tranquility at quiet temples in Cheongsong and Mungyeong', ja: '青松・聞慶の静かな山寺でテンプルステイの余裕を', 'zh-CN': '在青松、闻庆宁静山寺体验寺院生活的悠然', 'zh-TW': '在青松、聞慶寧靜山寺體驗寺院生活的悠然' },
      experience: { ko: '한지, 탈춤, 안동 소주 등 살아있는 전통 체험이 가득해요', en: 'Hands-on living traditions: hanji, mask dance, Andong soju', ja: '韓紙・仮面舞・安東焼酎など生きた伝統体験がいっぱい', 'zh-CN': '韩纸、假面舞、安东烧酒等活态传统体验丰富', 'zh-TW': '韓紙、假面舞、安東燒酒等活態傳統體驗豐富' },
    },
  },
  {
    region: 'gyeongnam',
    emoji: '⛵',
    vibe: { ko: '남해의 섬과 절경이 펼쳐지는 해안 낙원', en: 'Coastal paradise of southern isles and stunning views', ja: '南海の島々と絶景が広がる海岸の楽園', 'zh-CN': '南海岛屿与绝景延展的海岸乐园', 'zh-TW': '南海島嶼與絕景延展的海岸樂園' },
    reasonTemplates: {
      scenic: { ko: '남해 독일마을과 다랭이마을의 계단식 논은 그림 같은 풍경', en: 'German Village and Darangyi terraced rice paddies look painted', ja: '南海ドイツ村とタレンイ村の棚田は絵のような風景', 'zh-CN': '南海德国村与多浪宜村梯田宛如画卷', 'zh-TW': '南海德國村與多浪宜村梯田宛如畫卷' },
      ocean: { ko: '거제·통영·남해로 이어지는 다도해는 한국의 지중해', en: "Geoje, Tongyeong, Namhae archipelago — Korea's Mediterranean", ja: '巨済・統営・南海へと続く多島海は韓国の地中海', 'zh-CN': '巨济、统营、南海多岛海——韩国的地中海', 'zh-TW': '巨濟、統營、南海多島海——韓國的地中海' },
      'scenic-road': { ko: '남해안의 해안 드라이브는 한국 최고의 풍경 도로', en: "South coast drive is one of Korea's most scenic roads", ja: '南海岸のドライブは韓国最高の絶景道路', 'zh-CN': '南海岸自驾——韩国最美风景公路之一', 'zh-TW': '南海岸自駕——韓國最美風景公路之一' },
      sunset: { ko: '삼천포·한려수도의 노을은 남해 여행의 하이라이트', en: 'Samcheonpo and Hallyeosudo sunsets are the travel highlight', ja: '三千浦・閑麗水道の夕焼けは南海旅行のハイライト', 'zh-CN': '三千浦、闲丽水道的晚霞是南海旅行亮点', 'zh-TW': '三千浦、閑麗水道的晚霞是南海旅行亮點' },
      food: { ko: '통영 굴·거제 대구탕·진주 냉면까지 남해의 맛은 특별해요', en: "Tongyeong oysters, Geoje cod stew, Jinju naengmyeon — special southern flavors", ja: '統営の牡蠣・巨済のタラ鍋・晋州の冷麺など南海の味は特別', 'zh-CN': '统营牡蛎、巨济鳕鱼汤、晋州冷面——南海特色美食', 'zh-TW': '統營牡蠣、巨濟鱈魚湯、晉州冷麵——南海特色美食' },
    },
  },
  {
    region: 'jeonbuk',
    emoji: '🍚',
    vibe: { ko: '맛과 자연이 풍성한 남도 관문', en: 'Gateway to the south, rich in flavor and nature', ja: '味と自然が豊かな南道のゲートウェイ', 'zh-CN': '美食与自然丰饶的南道门户', 'zh-TW': '美食與自然豐饒的南道門戶' },
    reasonTemplates: {
      food: { ko: '전주비빔밥부터 군산 짬뽕까지 전북은 한국 미식의 정점', en: 'From Jeonju bibimbap to Gunsan jjamppong — Jeonbuk is Korean gastronomy at its peak', ja: '全州ビビンバから群山チャンポンまで全北は韓国美食の頂点', 'zh-CN': '从全州拌饭到群山炒码面——全北是韩国美食巅峰', 'zh-TW': '從全州拌飯到群山炒碼麵——全北是韓國美食巔峰' },
      traditional: { ko: '남원 광한루원과 고창 판소리가 전북의 전통을 빛내요', en: 'Namwon Gwanghallu and Gochang pansori illuminate Jeonbuk traditions', ja: '南原広寒楼苑と高敞パンソリが全北の伝統を輝かせる', 'zh-CN': '南原广寒楼与高敞板索里闪耀全北传统', 'zh-TW': '南原廣寒樓與高敞板索里閃耀全北傳統' },
      nature: { ko: '변산반도와 덕유산은 산과 바다를 한번에 즐길 수 있는 보석', en: 'Byeonsan Peninsula and Deogyusan — gems where mountain meets sea', ja: '辺山半島と徳裕山は山と海を一度に楽しめる宝石', 'zh-CN': '边山半岛与德裕山——一次享受山海的珍宝', 'zh-TW': '邊山半島與德裕山——一次享受山海的珍寶' },
      hiking: { ko: '마이산·내장산의 단풍은 가을 전북의 대표 풍경', en: 'Autumn foliage at Maisan and Naejangsan is classic Jeonbuk', ja: '馬耳山・内蔵山の紅葉は秋の全北を代表する風景', 'zh-CN': '马耳山、内藏山的红叶是秋季全北代表风景', 'zh-TW': '馬耳山、內藏山的紅葉是秋季全北代表風景' },
      experience: { ko: '전주 한옥마을·고창 선운사에서 전통 체험을 깊이 즐겨보세요', en: 'Deeper traditional experiences at Jeonju Hanok Village and Gochang Seonunsa', ja: '全州韓屋村・高敞禅雲寺で伝統体験をじっくり', 'zh-CN': '在全州韩屋村、高敞禅云寺深入体验传统', 'zh-TW': '在全州韓屋村、高敞禪雲寺深入體驗傳統' },
    },
  },
  {
    region: 'jeonnam',
    emoji: '🌅',
    vibe: { ko: '밤바다와 섬이 노래하는 남쪽 끝', en: "Southern edge where night seas and islands sing", ja: '夜の海と島が歌う南の果て', 'zh-CN': '夜海与岛屿歌唱的南端', 'zh-TW': '夜海與島嶼歌唱的南端' },
    reasonTemplates: {
      ocean: { ko: '여수·목포·완도의 남해 바다는 섬과 조명이 빚는 환상 풍경', en: "Yeosu, Mokpo, Wando — southern seas dressed in islands and lights", ja: '麗水・木浦・莞島の南海は島と灯りが作る幻想風景', 'zh-CN': '丽水、木浦、莞岛南海——岛屿与灯火的梦幻风景', 'zh-TW': '麗水、木浦、莞島南海——島嶼與燈火的夢幻風景' },
      sunset: { ko: '여수 밤바다와 증도 노을은 전남 여행의 클라이맥스', en: "Yeosu's night sea and Jeungdo sunset are Jeonnam's climax", ja: '麗水の夜の海と曽島の夕焼けは全南旅行のクライマックス', 'zh-CN': '丽水夜海与曾岛日落——全南旅行高潮', 'zh-TW': '麗水夜海與曾島日落——全南旅行高潮' },
      nature: { ko: '순천만 갈대밭과 담양 죽녹원은 남도의 초록 오아시스', en: "Suncheonman reeds and Damyang bamboo forest — southern green oases", ja: '順天湾の葦原と潭陽の竹緑苑は南道の緑のオアシス', 'zh-CN': '顺天湾芦苇田与潭阳竹绿苑——南道绿色绿洲', 'zh-TW': '順天灣蘆葦田與潭陽竹綠苑——南道綠色綠洲' },
      food: { ko: '남도 한정식과 목포 세발낙지, 보성 녹차까지 맛의 성지', en: "Namdo hanjeongsik, Mokpo octopus, Boseong green tea — culinary shrine", ja: '南道韓定食・木浦の細足タコ・宝城緑茶まで美食の聖地', 'zh-CN': '南道韩定食、木浦小章鱼、宝城绿茶——美食圣地', 'zh-TW': '南道韓定食、木浦小章魚、寶城綠茶——美食聖地' },
      coastal: { ko: '다도해 해상국립공원의 섬 여행은 한국에서만 볼 수 있는 풍경', en: 'Dadohaehaesang Marine Park island hopping is uniquely Korean', ja: '多島海海上国立公園の島巡りは韓国ならではの風景', 'zh-CN': '多岛海海上国立公园跳岛——韩国独有风景', 'zh-TW': '多島海海上國立公園跳島——韓國獨有風景' },
      'scenic-road': { ko: '남해안 77번 국도는 섬과 다리를 잇는 드라이브 명작', en: 'Route 77 along the south coast is a scenic driving masterpiece', ja: '南海岸77号線は島と橋を繋ぐドライブの名作', 'zh-CN': '南海岸77号国道——连接岛屿桥梁的自驾杰作', 'zh-TW': '南海岸77號國道——連接島嶼橋樑的自駕傑作' },
    },
  },
]

export function generateReasons(cityRegion: string, matchedTags: string[], locale: string): string[] {
  const story = CITY_STORIES.find(s => s.region === cityRegion)
  if (!story) return []

  const reasons: string[] = []
  const seen = new Set<string>()

  for (const tag of matchedTags) {
    if (seen.has(tag)) continue
    const template = story.reasonTemplates[tag]
    if (template) {
      const text = (template as Record<string, string>)[locale] || template.en || template.ko
      reasons.push(text)
      seen.add(tag)
      if (reasons.length >= 3) break
    }
  }

  if (reasons.length === 0) {
    const keys = Object.keys(story.reasonTemplates)
    for (const k of keys.slice(0, 3)) {
      const tpl = story.reasonTemplates[k]
      reasons.push((tpl as Record<string, string>)[locale] || tpl.en || tpl.ko)
    }
  }

  return reasons
}

export function getTopMatchedTags(cityRegion: string, preference: UserPreference): string[] {
  const cityTags = CITY_TAG_SCORES[cityRegion] || {}
  const scored = Object.entries(cityTags)
    .map(([tag, cityWeight]) => ({
      tag,
      score: (preference.tags[tag] || 0) * cityWeight,
      cityWeight,
    }))
    .filter(s => s.score > 0)
    .sort((a, b) => {
      // 점수 거의 같으면 도시 고유 강점(cityWeight) 높은 것 우선 → 도시별 차별화
      if (Math.abs(b.score - a.score) < 0.1) return b.cityWeight - a.cityWeight
      return b.score - a.score
    })

  return scored.slice(0, 5).map(s => s.tag)
}

/** 태그 → 로케일별 표시명 */
export const TAG_DISPLAY_NAMES: Record<string, I18n> = {
  traditional: { ko: '전통', en: 'Traditional', ja: '伝統', 'zh-CN': '传统', 'zh-TW': '傳統' },
  food: { ko: '맛집', en: 'Food', ja: 'グルメ', 'zh-CN': '美食', 'zh-TW': '美食' },
  nature: { ko: '자연', en: 'Nature', ja: '自然', 'zh-CN': '自然', 'zh-TW': '自然' },
  ocean: { ko: '바다', en: 'Ocean', ja: '海', 'zh-CN': '大海', 'zh-TW': '大海' },
  city: { ko: '도시', en: 'City', ja: '都市', 'zh-CN': '城市', 'zh-TW': '城市' },
  nightlife: { ko: '야경', en: 'Nightlife', ja: 'ナイトライフ', 'zh-CN': '夜生活', 'zh-TW': '夜生活' },
  hiking: { ko: '등산', en: 'Hiking', ja: 'ハイキング', 'zh-CN': '登山', 'zh-TW': '登山' },
  instagram: { ko: '인스타', en: 'Insta', ja: 'インスタ', 'zh-CN': '打卡', 'zh-TW': '打卡' },
  experience: { ko: '체험', en: 'Experience', ja: '体験', 'zh-CN': '体验', 'zh-TW': '體驗' },
  relax: { ko: '힐링', en: 'Relax', ja: 'ヒーリング', 'zh-CN': '疗愈', 'zh-TW': '療癒' },
  shopping: { ko: '쇼핑', en: 'Shopping', ja: 'ショッピング', 'zh-CN': '购物', 'zh-TW': '購物' },
  historic: { ko: '역사', en: 'Historic', ja: '歴史', 'zh-CN': '历史', 'zh-TW': '歷史' },
  temple: { ko: '사찰', en: 'Temple', ja: '寺院', 'zh-CN': '寺庙', 'zh-TW': '寺廟' },
  scenic: { ko: '풍경', en: 'Scenic', ja: '景色', 'zh-CN': '风景', 'zh-TW': '風景' },
  modern: { ko: '현대', en: 'Modern', ja: 'モダン', 'zh-CN': '现代', 'zh-TW': '現代' },
  trendy: { ko: '트렌디', en: 'Trendy', ja: 'トレンディ', 'zh-CN': '潮流', 'zh-TW': '潮流' },
  cafe: { ko: '카페', en: 'Cafe', ja: 'カフェ', 'zh-CN': '咖啡馆', 'zh-TW': '咖啡館' },
  romantic: { ko: '로맨틱', en: 'Romantic', ja: 'ロマンチック', 'zh-CN': '浪漫', 'zh-TW': '浪漫' },
  themepark: { ko: '테마파크', en: 'Theme Park', ja: 'テーマパーク', 'zh-CN': '主题乐园', 'zh-TW': '主題樂園' },
  family: { ko: '가족', en: 'Family', ja: '家族', 'zh-CN': '家庭', 'zh-TW': '家庭' },
  active: { ko: '액티브', en: 'Active', ja: 'アクティブ', 'zh-CN': '运动', 'zh-TW': '運動' },
  market: { ko: '시장', en: 'Market', ja: '市場', 'zh-CN': '市场', 'zh-TW': '市場' },
  sunset: { ko: '석양', en: 'Sunset', ja: '夕日', 'zh-CN': '夕阳', 'zh-TW': '夕陽' },
  driving: { ko: '드라이브', en: 'Drive', ja: 'ドライブ', 'zh-CN': '自驾', 'zh-TW': '自駕' },
  coastal: { ko: '해안', en: 'Coastal', ja: '海岸', 'zh-CN': '海岸', 'zh-TW': '海岸' },
  solo: { ko: '혼자', en: 'Solo', ja: 'ひとり', 'zh-CN': '独自', 'zh-TW': '獨自' },
  group: { ko: '그룹', en: 'Group', ja: 'グループ', 'zh-CN': '团体', 'zh-TW': '團體' },
  festival: { ko: '축제', en: 'Festival', ja: 'フェスティバル', 'zh-CN': '节日', 'zh-TW': '節日' },
  spa: { ko: '온천', en: 'Spa', ja: '温泉', 'zh-CN': '温泉', 'zh-TW': '溫泉' },
  budget: { ko: '알뜰', en: 'Budget', ja: '節約', 'zh-CN': '经济', 'zh-TW': '經濟' },
  luxury: { ko: '럭셔리', en: 'Luxury', ja: 'ラグジュアリー', 'zh-CN': '奢华', 'zh-TW': '奢華' },
  walking: { ko: '도보', en: 'Walking', ja: '歩き', 'zh-CN': '步行', 'zh-TW': '步行' },
  adventure: { ko: '모험', en: 'Adventure', ja: '冒険', 'zh-CN': '冒险', 'zh-TW': '冒險' },
  workshop: { ko: '공방', en: 'Workshop', ja: '工房', 'zh-CN': '工坊', 'zh-TW': '工坊' },
  photo: { ko: '사진', en: 'Photo', ja: '写真', 'zh-CN': '拍照', 'zh-TW': '拍照' },
  'street-food': { ko: '길거리음식', en: 'Street Food', ja: '屋台', 'zh-CN': '街头小吃', 'zh-TW': '街頭小吃' },
  'night-market': { ko: '야시장', en: 'Night Market', ja: '夜市', 'zh-CN': '夜市', 'zh-TW': '夜市' },
  meditation: { ko: '명상', en: 'Meditation', ja: '瞑想', 'zh-CN': '冥想', 'zh-TW': '冥想' },
  daytime: { ko: '낮활동', en: 'Daytime', ja: '昼間', 'zh-CN': '白天', 'zh-TW': '白天' },
  'scenic-road': { ko: '드라이브길', en: 'Scenic Road', ja: 'ドライブコース', 'zh-CN': '风景公路', 'zh-TW': '風景公路' },
  countryside: { ko: '시골', en: 'Countryside', ja: '田舎', 'zh-CN': '乡村', 'zh-TW': '鄉村' },
  bar: { ko: '바', en: 'Bar', ja: 'バー', 'zh-CN': '酒吧', 'zh-TW': '酒吧' },
  'fine-dining': { ko: '파인다이닝', en: 'Fine Dining', ja: 'ファインダイニング', 'zh-CN': '高级餐厅', 'zh-TW': '高級餐廳' },
}

export function getTagLabel(tag: string, locale: string): string {
  const entry = TAG_DISPLAY_NAMES[tag]
  if (!entry) return tag
  return (entry as Record<string, string>)[locale] || entry.en || entry.ko || tag
}
