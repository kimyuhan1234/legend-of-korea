type I18n3 = { ko: string; ja: string; en: string; 'zh-CN'?: string; 'zh-TW'?: string };

/**
 * 코스별 차별화 정보 (큐레이션 영역).
 *
 * 기존 CourseData.difficulty / duration 과 중복 회피 — 신규 3 필드만 보유.
 * QuestHighlights 컴포넌트는 difficulty / duration 을 별도 props 로 받아
 * 5 항목 카드 형태로 통합 노출한다.
 *
 * 모든 필드 optional — 점진적 도입 (작성된 코스만 섹션 노출).
 */
export interface CourseHighlights {
  recommendedRoute?: I18n3;
  bestSeason?: I18n3;
  companionSpots?: I18n3;
}

export interface CourseData {
  id: string;
  region: string;
  title: I18n3;
  subtitle: I18n3;
  legendSummary: I18n3;
  difficulty: 'easy' | 'medium' | 'hard';
  missionCount: number;
  duration: I18n3;
  price: number;
  thumbnail: string;
  status: 'active' | 'coming_soon';
  food: string[];
  japanConnection: I18n3;
  targetAudience: string[];
  highlights?: CourseHighlights;
}

export const courses: CourseData[] = [
  {
    id: '11111111-1111-1111-1111-000000000001',
    region: 'jeonju',
    title: { ko: '도깨비의 선물', ja: 'トッケビの贈り物', en: 'Gift of the Dokkaebi', 'zh-CN': '鬼怪的礼物', 'zh-TW': '鬼怪的禮物' },
    subtitle: { ko: '전주 한옥마을에서 도깨비를 만나다', ja: '全州韓屋村でトッケビに出会う', en: 'Meet the Dokkaebi in Jeonju Hanok Village', 'zh-CN': '在全州韩屋村遇见鬼怪', 'zh-TW': '在全州韓屋村遇見鬼怪' },
    legendSummary: {
      ko: '착한 나무꾼이 산에서 도깨비를 만나 노래를 불러주자, 도깨비들이 기뻐하며 금은보화가 나오는 방망이를 선물했습니다. 이를 본 욕심쟁이 이웃이 따라했다가 오히려 벌을 받았습니다.',
      ja: '心優しい木こりが山でトッケビに出会い歌を歌うと、トッケビたちは喜んで金銀財宝が出る魔法の棒を贈りました。これを見た欲張りな隣人が真似をしましたが、逆に罰を受けました。',
      en: 'A kind woodcutter met Dokkaebi in the mountains and sang for them. Delighted, the Dokkaebi gifted him a magical club that produced gold and silver. A greedy neighbor tried to copy him but was punished instead.',
      'zh-CN': '善良的樵夫在山中遇见鬼怪并为其唱歌，鬼怪高兴地赠给他一根能产出金银财宝的魔棒。贪心的邻居模仿他，却反而受到了惩罚。',
      'zh-TW': '善良的樵夫在山中遇見鬼怪並為其唱歌，鬼怪高興地贈給他一根能產出金銀財寶的魔棒。貪心的鄰居模仿他，卻反而受到了懲罰。',
    },
    difficulty: 'easy',
    missionCount: 8,
    duration: { ko: '1일', ja: '1日', en: '1 day', 'zh-CN': '1天', 'zh-TW': '1天' },
    price: 6900,
    thumbnail: '/images/courses/jeonju.png',
    status: 'active',
    food: ['전주비빔밥', '콩나물국밥', '초코파이', 'PNB 풍년제과'],
    japanConnection: {
      ko: '일본의 오니(鬼)와 비슷하지만, 한국 도깨비는 장난스럽고 친근한 존재입니다.',
      ja: '日本の鬼に似ていますが、韓国のトッケビはいたずら好きで親しみやすい存在です。',
      en: 'Similar to Japanese Oni, but Korean Dokkaebi are playful and friendly creatures.',
      'zh-CN': '与日本的鬼相似，但韩国鬼怪更加顽皮亲切。',
      'zh-TW': '與日本的鬼相似，但韓國鬼怪更加頑皮親切。',
    },
    targetAudience: ['family', 'couple', 'mz'],
    highlights: {
      recommendedRoute: {
        ko: '경기전 → 한옥마을 골목길 → 풍남문 → 남부시장 야시장',
        ja: '慶基殿 → 韓屋村の路地 → 豊南門 → 南部市場の夜市',
        en: 'Gyeonggijeon Shrine → Hanok Village alleys → Pungnammun Gate → Nambu Market night market',
        'zh-CN': '庆基殿 → 韩屋村小巷 → 丰南门 → 南部市场夜市',
        'zh-TW': '慶基殿 → 韓屋村小巷 → 豐南門 → 南部市場夜市',
      },
      bestSeason: {
        ko: '봄 (4-5월 한옥 정원 꽃) / 가을 (10-11월 단풍)',
        ja: '春（4〜5月：韓屋庭園の花）/ 秋（10〜11月：紅葉）',
        en: 'Spring (Apr–May, hanok garden blooms) / Autumn (Oct–Nov, fall foliage)',
        'zh-CN': '春季（4-5月韩屋庭园花开）/ 秋季（10-11月红叶）',
        'zh-TW': '春季（4-5月韓屋庭園花開）/ 秋季（10-11月紅葉）',
      },
      companionSpots: {
        ko: '덕진공원 연꽃 / 전주 동학혁명 기념관 / 오목대',
        ja: '徳津公園の蓮 / 全州東学革命記念館 / オモクデ',
        en: 'Deokjin Park lotus pond / Jeonju Donghak Revolution Memorial / Omokdae',
        'zh-CN': '德津公园荷花 / 全州东学革命纪念馆 / 梧木台',
        'zh-TW': '德津公園荷花 / 全州東學革命紀念館 / 梧木台',
      },
    },
  },
  {
    id: '11111111-1111-1111-1111-000000000002',
    region: 'tongyeong',
    title: { ko: '별주부의 모험', ja: 'ピョルジュブの冒険', en: 'Adventure of Byeoljubu', 'zh-CN': '鳖使者的冒险', 'zh-TW': '鱉使者的冒險' },
    subtitle: { ko: '토끼와 자라의 바다 용궁 이야기', ja: 'ウサギとスッポンの海の龍宮物語', en: 'The Sea Palace Tale of Rabbit and Turtle', 'zh-CN': '兔子与甲鱼的海底龙宫故事', 'zh-TW': '兔子與甲魚的海底龍宮故事' },
    legendSummary: {
      ko: '바다 용왕이 병에 걸려 토끼의 간이 필요하다는 처방을 받았습니다. 충신 자라(별주부)가 육지로 올라가 토끼를 속여 바다로 데려갔지만, 영리한 토끼는 간을 꺼내 육지에 두고 왔다는 꾀로 탈출했습니다.',
      ja: '海の龍王が病にかかり、ウサギの肝が必要だという処方を受けました。忠臣のスッポン（ピョルジュブ）が陸に上がりウサギを騙して海に連れて行きましたが、賢いウサギは「肝を取り出して陸に置いてきた」という知恵で脱出しました。',
      en: 'The Sea King fell ill and was prescribed rabbit liver. The loyal turtle Byeoljubu tricked a rabbit into coming to the sea palace, but the clever rabbit escaped by claiming he had left his liver on land.',
      'zh-CN': '海底龙王生病，需要兔子的肝脏。忠心的甲鱼鳖使者上岸骗来兔子，但聪明的兔子用「肝脏放在陆地上」的借口逃脱了。',
      'zh-TW': '海底龍王生病，需要兔子的肝臟。忠心的甲魚鱉使者上岸騙來兔子，但聰明的兔子用「肝臟放在陸地上」的藉口逃脫了。',
    },
    difficulty: 'medium',
    missionCount: 8,
    duration: { ko: '1박 2일', ja: '1泊2日', en: '2 days', 'zh-CN': '2天1夜', 'zh-TW': '2天1夜' },
    price: 6900,
    thumbnail: '/images/courses/tongyeong.jpg',
    status: 'active',
    food: ['충무김밥', '통영 굴구이', '꿀빵', '멍게비빔밥'],
    japanConnection: {
      ko: '일본의 우라시마 타로(浦島太郎)처럼 바다 용궁이 등장하는 이야기입니다.',
      ja: '日本の浦島太郎のように海の龍宮が登場する物語です。',
      en: 'Like the Japanese tale of Urashima Taro, this story features an underwater Dragon Palace.',
      'zh-CN': '与日本浦岛太郎类似，故事中出现了海底龙宫。',
      'zh-TW': '與日本浦島太郎類似，故事中出現了海底龍宮。',
    },
    targetAudience: ['couple', 'mz'],
    highlights: {
      recommendedRoute: {
        ko: '동피랑 벽화마을 → 중앙시장 → 케이블카 (미륵산) → 강구안 (1박) → 한산도',
        ja: 'トンピラン壁画村 → 中央市場 → ケーブルカー（弥勒山）→ 江口岸（1泊）→ 閑山島',
        en: 'Dongpirang Mural Village → Jungang Market → Cable car (Mireuksan) → Gangguan (1 night) → Hansando Island',
        'zh-CN': '东皮郎壁画村 → 中央市场 → 缆车（弥勒山）→ 江口岸（住1晚）→ 闲山岛',
        'zh-TW': '東皮郎壁畫村 → 中央市場 → 纜車（彌勒山）→ 江口岸（住1晚）→ 閑山島',
      },
      bestSeason: {
        ko: '늦봄~초여름 (5-6월 굴/멍게 제철) / 가을 (선선한 케이블카 전망)',
        ja: '晩春〜初夏（5〜6月：牡蠣・ホヤの旬）/ 秋（涼しいケーブルカー展望）',
        en: 'Late spring–early summer (May–Jun, oyster & sea pineapple season) / Autumn (cool cable-car views)',
        'zh-CN': '晚春至初夏（5-6月牡蛎/海菠萝当季）/ 秋季（凉爽的缆车风景）',
        'zh-TW': '晚春至初夏（5-6月牡蠣/海鳳梨當季）/ 秋季（涼爽的纜車風景）',
      },
      companionSpots: {
        ko: '소매물도 등대섬 / 욕지도 / 거제 학동몽돌해변 (당일치기 연계)',
        ja: '小毎勿島の灯台島 / 欲知島 / 巨済鶴洞モンドル海岸（日帰り連携）',
        en: 'Somaemuldo Lighthouse Island / Yokjido / Geoje Hakdong Pebble Beach (day-trip extensions)',
        'zh-CN': '小每勿岛灯塔岛 / 欲知岛 / 巨济鹤洞蒙石海滩（一日游延伸）',
        'zh-TW': '小每勿島燈塔島 / 欲知島 / 巨濟鶴洞蒙石海灘（一日遊延伸）',
      },
    },
  },
  {
    id: '11111111-1111-1111-1111-000000000003',
    region: 'cheonan',
    title: { ko: '능소의 기다림', ja: 'ヌンソの待ち人', en: "Nungso's Waiting", 'zh-CN': '凌霄的等待', 'zh-TW': '凌霄的等待' },
    subtitle: { ko: '천안삼거리 능수버들 아래 사랑 이야기', ja: '天安三叉路のしだれ柳の下の愛の物語', en: 'A Love Story Beneath the Willows of Cheonan', 'zh-CN': '天安三岔路垂柳下的爱情故事', 'zh-TW': '天安三叉路垂柳下的愛情故事' },
    legendSummary: {
      ko: '아버지 유봉서가 전쟁터로 떠나며 어린 딸 능소를 천안삼거리 주막에 맡겼습니다. 능소는 아버지를 기다리며 매일 버드나무를 심었고, 훗날 과거 보러 가던 선비 박현수를 간병하며 사랑에 빠져 백년가약을 맺었습니다.',
      ja: '父ユ・ボンソが戦場に向かう際、幼い娘ヌンソを天安三叉路の宿屋に預けました。ヌンソは父を待ちながら毎日柳を植え、やがて科挙に向かう途中で倒れた書生パク・ヒョンスを看病し、恋に落ちて結婚しました。',
      en: "Father Yu Bong-seo left his young daughter Nungso at a Cheonan inn before heading to war. Nungso planted willows daily waiting for him. Years later, she nursed the scholar Park Hyun-su, fell in love, and they married.",
      'zh-CN': '父亲柳凤瑞奔赴战场时，将幼女凌霄托付给天安三岔路的客栈。凌霄每日种柳树等待父亲归来，后来照料赶考途中病倒的书生朴贤秀，两人相爱结成百年之约。',
      'zh-TW': '父親柳鳳瑞奔赴戰場時，將幼女凌霄託付給天安三叉路的客棧。凌霄每日種柳樹等待父親歸來，後來照料趕考途中病倒的書生朴賢秀，兩人相愛結成百年之約。',
    },
    difficulty: 'easy',
    missionCount: 7,
    duration: { ko: '반나절~1일', ja: '半日〜1日', en: 'Half day to 1 day', 'zh-CN': '半天至1天', 'zh-TW': '半天至1天' },
    price: 6900,
    thumbnail: '/images/courses/cheonan.png',
    status: 'coming_soon',
    food: ['호두과자', '병천순대', '호두강정'],
    japanConnection: {
      ko: '기다림과 재회의 순정 로맨스로 일본 순정만화 팬들에게 공감을 줍니다.',
      ja: '待つことと再会の純愛ロマンスは、日本の少女漫画ファンに共感を与えます。',
      en: 'A pure love romance of waiting and reunion that resonates with fans of Japanese romance manga.',
      'zh-CN': '等待与重逢的纯爱浪漫故事，令日本少女漫画粉丝产生共鸣。',
      'zh-TW': '等待與重逢的純愛浪漫故事，令日本少女漫畫粉絲產生共鳴。',
    },
    targetAudience: ['couple']
  },
  {
    id: '11111111-1111-1111-1111-000000000004',
    region: 'yongin',
    title: { ko: '동화 속으로', ja: '童話の中へ', en: 'Into the Fairy Tales', 'zh-CN': '走进童话', 'zh-TW': '走進童話' },
    subtitle: { ko: '한국민속촌에서 전래동화 올스타를 만나다', ja: '韓国民俗村で昔話オールスターに出会う', en: 'Meet All-Star Korean Fairy Tales at Folk Village', 'zh-CN': '在韩国民俗村邂逅民间故事全明星', 'zh-TW': '在韓國民俗村邂逅民間故事全明星' },
    legendSummary: {
      ko: '한국의 대표 전래동화 다섯 편을 한 곳에서 체험합니다. 콩쥐팥쥐, 흥부놀부, 혹부리영감, 선녀와 나무꾼, 금도끼 은도끼 — 착한 마음이 복을 부르는 이야기들입니다.',
      ja: '韓国を代表する昔話5編を一か所で体験します。コンジュパッジュ、フンブノルブ、コブトリ爺さん、仙女と木こり、金の斧銀の斧 — 善い心が福を呼ぶ物語です。',
      en: "Experience five iconic Korean fairy tales in one place: Kongjwi & Patjwi, Heungbu & Nolbu, Old Man Wart, Fairy & Woodcutter, Gold Axe & Silver Axe — tales where kindness brings good fortune.",
      'zh-CN': '在一处体验韩国五大代表民间故事：豆娘与红娘、兴夫与扭夫、疙瘩老头、仙女与樵夫、金斧银斧——善心带来福报的故事。',
      'zh-TW': '在一處體驗韓國五大代表民間故事：豆娘與紅娘、興夫與扭夫、疙瘩老頭、仙女與樵夫、金斧銀斧——善心帶來福報的故事。',
    },
    difficulty: 'easy',
    missionCount: 8,
    duration: { ko: '반나절', ja: '半日', en: 'Half day', 'zh-CN': '半天', 'zh-TW': '半天' },
    price: 6900,
    thumbnail: '/images/courses/yongin.jpg',
    status: 'coming_soon',
    food: ['달고나', '전통 떡', '도토리묵', '파전·막걸리'],
    japanConnection: {
      ko: '한국 전래동화를 한 번에 체험할 수 있는 테마파크형 코스입니다.',
      ja: '韓国の昔話を一度に体験できるテーマパーク型コースです。',
      en: 'A theme park-style course where you can experience Korean fairy tales all at once.',
      'zh-CN': '可以一次性体验韩国民间故事的主题公园型课程。',
      'zh-TW': '可以一次性體驗韓國民間故事的主題公園型課程。',
    },
    targetAudience: ['family']
  },
  {
    id: '11111111-1111-1111-1111-000000000005',
    region: 'icheon',
    title: { ko: '선녀의 날개옷', ja: '仙女の羽衣', en: "The Fairy's Feathered Robe", 'zh-CN': '仙女的羽衣', 'zh-TW': '仙女的羽衣' },
    subtitle: { ko: '이천 효양산에서 하고로모 전설을 만나다', ja: '利川ヒョヤン山で羽衣伝説に出会う', en: 'Discover the Hagoromo Legend at Icheon', 'zh-CN': '在利川孝养山邂逅羽衣传说', 'zh-TW': '在利川孝養山邂逅羽衣傳說' },
    legendSummary: {
      ko: '가난한 나무꾼이 사슴을 숨겨줬더니, 사슴이 보은으로 선녀가 목욕하는 연못을 알려주었습니다. 나무꾼은 날개옷을 숨겨 선녀와 결혼했지만, 약속을 잊고 날개옷을 돌려주자 선녀는 하늘로 돌아갔습니다.',
      ja: '貧しい木こりが鹿を匿うと、鹿は恩返しで仙女が沐浴する池を教えました。木こりは羽衣を隠して仙女と結婚しましたが、約束を忘れて羽衣を返すと仙女は天に帰りました。',
      en: "A poor woodcutter hid a deer, which in gratitude revealed where fairies bathed. He hid a fairy's robe and married her, but when he forgot his promise and returned it, she flew back to heaven.",
      'zh-CN': '贫穷的樵夫藏匿了一只鹿，鹿为报恩指引他找到仙女沐浴的水池。樵夫藏起羽衣与仙女成婚，却忘记承诺归还，仙女最终飞回了天界。',
      'zh-TW': '貧窮的樵夫藏匿了一隻鹿，鹿為報恩指引他找到仙女沐浴的水池。樵夫藏起羽衣與仙女成婚，卻忘記承諾歸還，仙女最終飛回了天界。',
    },
    difficulty: 'easy',
    missionCount: 7,
    duration: { ko: '반나절~1일', ja: '半日〜1日', en: 'Half day to 1 day', 'zh-CN': '半天至1天', 'zh-TW': '半天至1天' },
    price: 6900,
    thumbnail: '/images/courses/icheon.png',
    status: 'coming_soon',
    food: ['이천 쌀밥 정식', '이천 복숭아', '산수유차'],
    japanConnection: {
      ko: '일본의 하고로모 전설(羽衣伝説)과 거의 동일한 구조의 이야기입니다.',
      ja: '日本の羽衣伝説とほぼ同じ構造の物語です.',
      en: 'Nearly identical in structure to the Japanese Hagoromo legend.',
      'zh-CN': '与日本羽衣传说结构几乎完全相同。',
      'zh-TW': '與日本羽衣傳說結構幾乎完全相同。',
    },
    targetAudience: ['couple', 'family']
  },
  {
    id: '33333333-3333-3333-3333-000000000001',
    region: 'gyeongju',
    title: { ko: '용이 깃든 마법 피리', ja: '龍が宿る魔法の笛', en: 'The Magic Flute of the Dragon', 'zh-CN': '藏龙神笛', 'zh-TW': '藏龍神笛' },
    subtitle: { ko: '천년 고도 경주에서 찾는 만파식전의 전설', ja: '千年の古都、慶州で探す萬波息笛の伝説', en: 'The Legend of Manpa-sikjeok in Ancient Gyeongju', 'zh-CN': '在千年古都庆州寻访万波息笛传说', 'zh-TW': '在千年古都慶州尋訪萬波息笛傳說' },
    legendSummary: {
      ko: '신라 문무왕과 김유신이 죽어서도 나라를 지키려 보냈다는 신비한 대나무 피리 이야기입니다. 이 피리를 불면 적군이 물러가고 가뭄에 비가 내렸다고 합니다.',
      ja: '新羅の文武王と金庾信が死後も国を守ろうと送った神秘的な竹の笛の物語です。この笛を吹けば敵軍が退き、干ばつに雨が降ったと言われています。',
      en: 'A legendary bamboo flute sent by King Munmu and General Kim Yu-sin to protect the nation. It was said that blowing this flute would repel enemies and bring rain to droughts.',
      'zh-CN': '新罗文武王和金庾信死后为守护国家而送来的神秘竹笛。据说吹奏此笛，敌军会退却，干旱会降雨。',
      'zh-TW': '新羅文武王和金庾信死後為守護國家而送來的神秘竹笛。據說吹奏此笛，敵軍會退卻，乾旱會降雨。',
    },
    difficulty: 'medium',
    missionCount: 7,
    duration: { ko: '1일', ja: '1日', en: '1 day', 'zh-CN': '1天', 'zh-TW': '1天' },
    price: 6900,
    thumbnail: '/images/courses/gyeongju.jpg',
    status: 'coming_soon',
    food: ['경주빵', '황남빵', '교리김밥', '순두부찌개'],
    japanConnection: {
      ko: '삼국시대 신라와 교류가 깊었던 일본 역사와 연결된 지점이 많아 일본 관광객들이 선호하는 지역입니다.',
      ja: '三国時代の新羅と交流が深かった日本の歴史と繋がる点が多く、日本人観光客に人気の地域です。',
      en: 'Many historical links to Japan from the Silla period make Gyeongju a favorite for Japanese tourists.',
      'zh-CN': '与三国时代新罗有深厚交流的日本历史渊源众多，是日本游客最喜爱的地区。',
      'zh-TW': '與三國時代新羅有深厚交流的日本歷史淵源眾多，是日本遊客最喜愛的地區。',
    },
    targetAudience: ['family', 'history-lover']
  },
  {
    id: '33333333-3333-3333-3333-000000000002',
    region: 'busan',
    title: { ko: '동백섬 인어공주', ja: '冬柏島の人魚姫', en: 'The Mermaid of Dongbaek Island', 'zh-CN': '冬柏岛的美人鱼', 'zh-TW': '冬柏島的美人魚' },
    subtitle: { ko: '해운대 바다에 새겨진 황옥공주의 그리움', ja: '海雲台の海に刻まれた黄玉王女の慕情', en: 'Princess Hwangok\'s Longing Carved in Haeundae Sea', 'zh-CN': '刻印在海云台大海中的黄玉公主之思念', 'zh-TW': '刻印在海雲台大海中的黃玉公主之思念' },
    legendSummary: {
      ko: '멀리 인도에서 시집온 황옥공주가 보름달 아래서 고향을 그리워하며 구슬을 바라보았다는 애틋한 인어 전설입니다.',
      ja: '遠くインドから嫁いできた黄玉王女が、満月の下で故郷を懐かしみながら玉を眺めていたという切ない人魚の伝説です。',
      en: 'A poignant mermaid legend of Princess Hwangok, who traveled from India to marry and gazed at her bead under the full moon, longing for home.',
      'zh-CN': '从遥远印度远嫁而来的黄玉公主，在满月之下凝望宝珠思念故乡，令人心碎的美人鱼传说。',
      'zh-TW': '從遙遠印度遠嫁而來的黃玉公主，在滿月之下凝望寶珠思念故鄉，令人心碎的美人魚傳說。',
    },
    difficulty: 'easy',
    missionCount: 6,
    duration: { ko: '반나절~1일', ja: '半日〜1日', en: 'Half day to 1 day', 'zh-CN': '半天至1天', 'zh-TW': '半天至1天' },
    price: 6900,
    thumbnail: '/images/courses/busan.jpg',
    status: 'coming_soon',
    food: ['돼지국밥', '씨앗호떡', '밀면', '어묵'],
    japanConnection: {
      ko: '일본과 가장 가까운 항구 도시로, 일본인들에게 가장 익숙한 한국의 모습이 담겨 있습니다.',
      ja: '日本に最も近い港町で、日本人にとって最も馴染みのある韓国の姿が詰まっています。',
      en: 'The closest port city to Japan, Busan embodies the side of Korea most familiar to Japanese people.',
      'zh-CN': '距日本最近的港口城市，汇聚了日本人最熟悉的韩国风貌。',
      'zh-TW': '距日本最近的港口城市，匯聚了日本人最熟悉的韓國風貌。',
    },
    targetAudience: ['couple', 'mz']
  },
  {
    id: '33333333-3333-3333-3333-000000000003',
    region: 'seoul',
    title: { ko: '불을 먹는 수호신', ja: '火を食べる守護神', en: 'The Fire-Eating Guardian', 'zh-CN': '吃火的守护神', 'zh-TW': '吃火的守護神' },
    subtitle: { ko: '경복궁을 지키는 해치의 비밀을 찾아서', ja: '景福宮を守るヘチの秘密を探して', en: 'Searching for the Secrets of Haechi Guarding the Palace', 'zh-CN': '寻访守护景福宫的獬豸之秘', 'zh-TW': '尋訪守護景福宮的獬豸之秘' },
    legendSummary: {
      ko: '화재와 재앙을 막아주고 시비와 선악을 판단하는 상상의 동물 해치가 서울 도심 곳곳에 숨겨놓은 수호의 기운을 찾아 떠납니다.',
      ja: '火災と災いを防ぎ、是非と善悪を判断する想像上の動物ヘチが、ソウル市内のあちこちに隠した守護の気運を探しに出かけます。',
      en: 'Journey to find the protective energy hidden throughout Seoul by Haechi, the mythical creature that prevents fire and disaster.',
      'zh-CN': '踏上旅途，寻找首尔各处由神话动物獬豸（能防火避灾、明辨善恶）所藏护的守护之气。',
      'zh-TW': '踏上旅途，尋找首爾各處由神話動物獬豸（能防火避災、明辨善惡）所藏護的守護之氣。',
    },
    difficulty: 'easy',
    missionCount: 7,
    duration: { ko: '1일', ja: '1日', en: '1 day', 'zh-CN': '1天', 'zh-TW': '1天' },
    price: 6900,
    thumbnail: '/images/courses/seoul.jpg',
    status: 'coming_soon',
    food: ['설렁탕', '광장시장 빈대떡', '마약김밥', '궁중음식'],
    japanConnection: {
      ko: '서울의 상징인 해치는 일본의 고마이누(狛犬)와 수호신적 성격에서 유사점을 가집니다.',
      ja: 'ソウルの象徴であるヘチは、日本の狛犬と守護神的な性格において類似点があります。',
      en: 'Haechi, the symbol of Seoul, shares similarities in its protective nature with the Japanese Komainu.',
      'zh-CN': '首尔象征獬豸与日本狛犬在守护神性质上有相似之处。',
      'zh-TW': '首爾象徵獬豸與日本狛犬在守護神性質上有相似之處。',
    },
    targetAudience: ['family', 'foreigner']
  },
  {
    id: '33333333-3333-3333-3333-000000000004',
    region: 'jeju',
    title: { ko: '제주를 빚은 거인', ja: '済州を創った巨人', en: 'The Giant Who Shaped Jeju', 'zh-CN': '塑造济州的巨人', 'zh-TW': '塑造濟州的巨人' },
    subtitle: { ko: '설문대할망의 거대한 발자취를 따라서', ja: '説門大婆（ソルムンデハルマン）の巨大な足跡をたどって', en: 'Following the Massive Footsteps of Seolmundae Halmang', 'zh-CN': '追随雪门大婆的巨大足迹', 'zh-TW': '追隨雪門大婆的巨大足跡' },
    legendSummary: {
      ko: '제주도 섬 자체를 만들었다는 거인 설문대할망이 육지와 연결하기 위해 다리를 놓으려던 미완의 전설과 그가 남긴 오름들을 탐험합니다.',
      ja: '済州島そのものを創ったという巨人ソルムンデハルマンが、陸と繋ぐために橋を架けようとした未完の伝説と、彼女が残したオルム（寄生火山）を探検します。',
      en: 'Explore the unfinished legend of the giant Seolmundae Halmang, who created Jeju Island and tried to build a bridge to the mainland.',
      'zh-CN': '探索据说创造了济州岛的巨人雪门大婆，以及她为连接陆地而建桥却未完成的传说和留下的寄生火山。',
      'zh-TW': '探索據說創造了濟州島的巨人雪門大婆，以及她為連接陸地而建橋卻未完成的傳說和留下的寄生火山。',
    },
    difficulty: 'medium',
    missionCount: 6,
    duration: { ko: '1박 2일', ja: '1泊2日', en: '2 days', 'zh-CN': '2天1夜', 'zh-TW': '2天1夜' },
    price: 6900,
    thumbnail: '/images/courses/jeju.jpg',
    status: 'coming_soon',
    food: ['흑돼지구이', '고기국수', '오메기떡', '갈치조림'],
    japanConnection: {
      ko: '제주도의 해녀(해녀) 문화는 일본의 아마(海女) 문화와 역사적, 문화적 연계성이 매우 높습니다.',
      ja: '済州島の海女文化は、日本の海女文化と歴史的・文化的な関連性が非常に高いです。',
      en: 'Jeju\'s Haenyeo culture has strong historical and cultural links with the Japanese Ama culture.',
      'zh-CN': '济州岛的海女文化与日本海女文化有着深厚的历史文化联系。',
      'zh-TW': '濟州島的海女文化與日本海女文化有著深厚的歷史文化聯繫。',
    },
    targetAudience: ['family', 'nature-lover']
  }
];
