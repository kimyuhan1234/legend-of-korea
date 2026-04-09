export interface CourseData {
  id: string;
  region: string;
  title: { ko: string; ja: string; en: string };
  subtitle: { ko: string; ja: string; en: string };
  legendSummary: { ko: string; ja: string; en: string };
  difficulty: 'easy' | 'medium' | 'hard';
  missionCount: number;
  duration: { ko: string; ja: string; en: string };
  price1p: number;
  price2p: number;
  thumbnail: string;
  status: 'active' | 'coming_soon';
  food: string[];
  japanConnection: { ko: string; ja: string; en: string };
  targetAudience: string[];
}

export const courses: CourseData[] = [
  {
    id: '11111111-1111-1111-1111-000000000001',
    region: 'jeonju',
    title: { ko: '도깨비의 선물', ja: 'トッケビの贈り物', en: 'Gift of the Dokkaebi' },
    subtitle: { ko: '전주 한옥마을에서 도깨비를 만나다', ja: '全州韓屋村でトッケビに出会う', en: 'Meet the Dokkaebi in Jeonju Hanok Village' },
    legendSummary: {
      ko: '착한 나무꾼이 산에서 도깨비를 만나 노래를 불러주자, 도깨비들이 기뻐하며 금은보화가 나오는 방망이를 선물했습니다. 이를 본 욕심쟁이 이웃이 따라했다가 오히려 벌을 받았습니다.',
      ja: '心優しい木こりが山でトッケビに出会い歌を歌うと、トッケビたちは喜んで金銀財宝が出る魔法の棒を贈りました。これを見た欲張りな隣人が真似をしましたが、逆に罰を受けました。',
      en: 'A kind woodcutter met Dokkaebi in the mountains and sang for them. Delighted, the Dokkaebi gifted him a magical club that produced gold and silver. A greedy neighbor tried to copy him but was punished instead.'
    },
    difficulty: 'easy',
    missionCount: 8,
    duration: { ko: '1일', ja: '1日', en: '1 day' },
    price1p: 29000,
    price2p: 39000,
    thumbnail: '/images/courses/jeonju.png',
    status: 'active',
    food: ['전주비빔밥', '콩나물국밥', '초코파이', 'PNB 풍년제과'],
    japanConnection: {
      ko: '일본의 오니(鬼)와 비슷하지만, 한국 도깨비는 장난스럽고 친근한 존재입니다.',
      ja: '日本の鬼に似ていますが、韓国のトッケビはいたずら好きで親しみやすい存在です。',
      en: 'Similar to Japanese Oni, but Korean Dokkaebi are playful and friendly creatures.'
    },
    targetAudience: ['family', 'couple', 'mz']
  },
  {
    id: '11111111-1111-1111-1111-000000000002',
    region: 'tongyeong',
    title: { ko: '별주부의 모험', ja: 'ピョルジュブの冒険', en: 'Adventure of Byeoljubu' },
    subtitle: { ko: '토끼와 자라의 바다 용궁 이야기', ja: 'ウサギとスッポンの海の龍宮物語', en: 'The Sea Palace Tale of Rabbit and Turtle' },
    legendSummary: {
      ko: '바다 용왕이 병에 걸려 토끼의 간이 필요하다는 처방을 받았습니다. 충신 자라(별주부)가 육지로 올라가 토끼를 속여 바다로 데려갔지만, 영리한 토끼는 간을 꺼내 육지에 두고 왔다는 꾀로 탈출했습니다.',
      ja: '海の龍王が病にかかり、ウサギの肝が必要だという処方を受けました。忠臣のスッポン（ピョルジュブ）が陸に上がりウサギを騙して海に連れて行きましたが、賢いウサギは「肝を取り出して陸に置いてきた」という知恵で脱出しました。',
      en: 'The Sea King fell ill and was prescribed rabbit liver. The loyal turtle Byeoljubu tricked a rabbit into coming to the sea palace, but the clever rabbit escaped by claiming he had left his liver on land.'
    },
    difficulty: 'medium',
    missionCount: 8,
    duration: { ko: '1박 2일', ja: '1泊2日', en: '2 days' },
    price1p: 29000,
    price2p: 39000,
    thumbnail: '/images/courses/tongyeong.jpg',
    status: 'active',
    food: ['충무김밥', '통영 굴구이', '꿀빵', '멍게비빔밥'],
    japanConnection: {
      ko: '일본의 우라시마 타로(浦島太郎)처럼 바다 용궁이 등장하는 이야기입니다.',
      ja: '日本の浦島太郎のように海の龍宮が登場する物語です。',
      en: 'Like the Japanese tale of Urashima Taro, this story features an underwater Dragon Palace.'
    },
    targetAudience: ['couple', 'mz']
  },
  {
    id: '11111111-1111-1111-1111-000000000003',
    region: 'cheonan',
    title: { ko: '능소의 기다림', ja: 'ヌンソの待ち人', en: "Nungso's Waiting" },
    subtitle: { ko: '천안삼거리 능수버들 아래 사랑 이야기', ja: '天安三叉路のしだれ柳の下の愛の物語', en: 'A Love Story Beneath the Willows of Cheonan' },
    legendSummary: {
      ko: '아버지 유봉서가 전쟁터로 떠나며 어린 딸 능소를 천안삼거리 주막에 맡겼습니다. 능소는 아버지를 기다리며 매일 버드나무를 심었고, 훗날 과거 보러 가던 선비 박현수를 간병하며 사랑에 빠져 백년가약을 맺었습니다.',
      ja: '父ユ・ボンソが戦場に向かう際、幼い娘ヌンソを天安三叉路の宿屋に預けました。ヌンソは父を待ちながら毎日柳を植え、やがて科挙に向かう途中で倒れた書生パク・ヒョンスを看病し、恋に落ちて結婚しました。',
      en: "Father Yu Bong-seo left his young daughter Nungso at a Cheonan inn before heading to war. Nungso planted willows daily waiting for him. Years later, she nursed the scholar Park Hyun-su, fell in love, and they married."
    },
    difficulty: 'easy',
    missionCount: 7,
    duration: { ko: '반나절~1일', ja: '半日〜1日', en: 'Half day to 1 day' },
    price1p: 29000,
    price2p: 39000,
    thumbnail: '/images/courses/cheonan.png',
    status: 'coming_soon',
    food: ['호두과자', '병천순대', '호두강정'],
    japanConnection: {
      ko: '기다림과 재회의 순정 로맨스로 일본 순정만화 팬들에게 공감을 줍니다.',
      ja: '待つことと再会の純愛ロマンスは、日本の少女漫画ファンに共感を与えます。',
      en: 'A pure love romance of waiting and reunion that resonates with fans of Japanese romance manga.'
    },
    targetAudience: ['couple']
  },
  {
    id: '11111111-1111-1111-1111-000000000004',
    region: 'yongin',
    title: { ko: '동화 속으로', ja: '童話の中へ', en: 'Into the Fairy Tales' },
    subtitle: { ko: '한국민속촌에서 전래동화 올스타를 만나다', ja: '韓国民俗村で昔話オールスターに出会う', en: 'Meet All-Star Korean Fairy Tales at Folk Village' },
    legendSummary: {
      ko: '한국의 대표 전래동화 다섯 편을 한 곳에서 체험합니다. 콩쥐팥쥐, 흥부놀부, 혹부리영감, 선녀와 나무꾼, 금도끼 은도끼 — 착한 마음이 복을 부르는 이야기들입니다.',
      ja: '韓国を代表する昔話5編を一か所で体験します。コンジュパッジュ、フンブノルブ、コブトリ爺さん、仙女と木こり、金の斧銀の斧 — 善い心が福を呼ぶ物語です。',
      en: "Experience five iconic Korean fairy tales in one place: Kongjwi & Patjwi, Heungbu & Nolbu, Old Man Wart, Fairy & Woodcutter, Gold Axe & Silver Axe — tales where kindness brings good fortune."
    },
    difficulty: 'easy',
    missionCount: 8,
    duration: { ko: '반나절', ja: '半日', en: 'Half day' },
    price1p: 29000,
    price2p: 39000,
    thumbnail: '/images/courses/yongin.jpg',
    status: 'coming_soon',
    food: ['달고나', '전통 떡', '도토리묵', '파전·막걸리'],
    japanConnection: {
      ko: '한국 전래동화를 한 번에 체험할 수 있는 테마파크형 코스입니다.',
      ja: '韓国の昔話を一度に体験できるテーマパーク型コースです。',
      en: 'A theme park-style course where you can experience Korean fairy tales all at once.'
    },
    targetAudience: ['family']
  },
  {
    id: '11111111-1111-1111-1111-000000000005',
    region: 'icheon',
    title: { ko: '선녀의 날개옷', ja: '仙女の羽衣', en: "The Fairy's Feathered Robe" },
    subtitle: { ko: '이천 효양산에서 하고로모 전설을 만나다', ja: '利川ヒョヤン山で羽衣伝説に出会う', en: 'Discover the Hagoromo Legend at Icheon' },
    legendSummary: {
      ko: '가난한 나무꾼이 사슴을 숨겨줬더니, 사슴이 보은으로 선녀가 목욕하는 연못을 알려주었습니다. 나무꾼은 날개옷을 숨겨 선녀와 결혼했지만, 약속을 잊고 날개옷을 돌려주자 선녀는 하늘로 돌아갔습니다.',
      ja: '貧しい木こりが鹿を匿うと、鹿は恩返しで仙女が沐浴する池を教えました。木こりは羽衣を隠して仙女と結婚しましたが、約束を忘れて羽衣を返すと仙女は天に帰りました。',
      en: "A poor woodcutter hid a deer, which in gratitude revealed where fairies bathed. He hid a fairy's robe and married her, but when he forgot his promise and returned it, she flew back to heaven."
    },
    difficulty: 'easy',
    missionCount: 7,
    duration: { ko: '반나절~1일', ja: '半日〜1日', en: 'Half day to 1 day' },
    price1p: 29000,
    price2p: 39000,
    thumbnail: '/images/courses/icheon.png',
    status: 'coming_soon',
    food: ['이천 쌀밥 정식', '이천 복숭아', '산수유차'],
    japanConnection: {
      ko: '일본의 하고로모 전설(羽衣伝説)과 거의 동일한 구조의 이야기입니다.',
      ja: '日本の羽衣伝説とほぼ同じ構造の物語です.',
      en: 'Nearly identical in structure to the Japanese Hagoromo legend.'
    },
    targetAudience: ['couple', 'family']
  },
  {
    id: '33333333-3333-3333-3333-000000000001',
    region: 'gyeongju',
    title: { ko: '용이 깃든 마법 피리', ja: '龍が宿る魔法の笛', en: 'The Magic Flute of the Dragon' },
    subtitle: { ko: '천년 고도 경주에서 찾는 만파식전의 전설', ja: '千年の古都、慶州で探す萬波息笛の伝説', en: 'The Legend of Manpa-sikjeok in Ancient Gyeongju' },
    legendSummary: {
      ko: '신라 문무왕과 김유신이 죽어서도 나라를 지키려 보냈다는 신비한 대나무 피리 이야기입니다. 이 피리를 불면 적군이 물러가고 가뭄에 비가 내렸다고 합니다.',
      ja: '新羅の文武王と金庾信が死後も国を守ろうと送った神秘的な竹の笛の物語です。この笛を吹けば敵軍が退き、干ばつに雨が降ったと言われています。',
      en: 'A legendary bamboo flute sent by King Munmu and General Kim Yu-sin to protect the nation. It was said that blowing this flute would repel enemies and bring rain to droughts.'
    },
    difficulty: 'medium',
    missionCount: 7,
    duration: { ko: '1일', ja: '1日', en: '1 day' },
    price1p: 29000,
    price2p: 39000,
    thumbnail: '/images/courses/gyeongju.jpg',
    status: 'coming_soon',
    food: ['경주빵', '황남빵', '교리김밥', '순두부찌개'],
    japanConnection: {
      ko: '삼국시대 신라와 교류가 깊었던 일본 역사와 연결된 지점이 많아 일본 관광객들이 선호하는 지역입니다.',
      ja: '三国時代の新羅と交流が深かった日本の歴史と繋がる点が多く、日本人観光客に人気の地域です。',
      en: 'Many historical links to Japan from the Silla period make Gyeongju a favorite for Japanese tourists.'
    },
    targetAudience: ['family', 'history-lover']
  },
  {
    id: '33333333-3333-3333-3333-000000000002',
    region: 'busan',
    title: { ko: '동백섬 인어공주', ja: '冬柏島の人魚姫', en: 'The Mermaid of Dongbaek Island' },
    subtitle: { ko: '해운대 바다에 새겨진 황옥공주의 그리움', ja: '海雲台の海に刻まれた黄玉王女の慕情', en: 'Princess Hwangok\'s Longing Carved in Haeundae Sea' },
    legendSummary: {
      ko: '멀리 인도에서 시집온 황옥공주가 보름달 아래서 고향을 그리워하며 구슬을 바라보았다는 애틋한 인어 전설입니다.',
      ja: '遠くインドから嫁いできた黄玉王女が、満月の下で故郷を懐かしみながら玉を眺めていたという切ない人魚の伝説です。',
      en: 'A poignant mermaid legend of Princess Hwangok, who traveled from India to marry and gazed at her bead under the full moon, longing for home.'
    },
    difficulty: 'easy',
    missionCount: 6,
    duration: { ko: '반나절~1일', ja: '半日〜1日', en: 'Half day to 1 day' },
    price1p: 29000,
    price2p: 39000,
    thumbnail: '/images/courses/busan.jpg',
    status: 'coming_soon',
    food: ['돼지국밥', '씨앗호떡', '밀면', '어묵'],
    japanConnection: {
      ko: '일본과 가장 가까운 항구 도시로, 일본인들에게 가장 익숙한 한국의 모습이 담겨 있습니다.',
      ja: '日本に最も近い港町で、日本人にとって最も馴染みのある韓国の姿が詰まっています。',
      en: 'The closest port city to Japan, Busan embodies the side of Korea most familiar to Japanese people.'
    },
    targetAudience: ['couple', 'mz']
  },
  {
    id: '33333333-3333-3333-3333-000000000003',
    region: 'seoul',
    title: { ko: '불을 먹는 수호신', ja: '火を食べる守護神', en: 'The Fire-Eating Guardian' },
    subtitle: { ko: '경복궁을 지키는 해치의 비밀을 찾아서', ja: '景福宮を守るヘチの秘密を探して', en: 'Searching for the Secrets of Haechi Guarding the Palace' },
    legendSummary: {
      ko: '화재와 재앙을 막아주고 시비와 선악을 판단하는 상상의 동물 해치가 서울 도심 곳곳에 숨겨놓은 수호의 기운을 찾아 떠납니다.',
      ja: '火災と災いを防ぎ、是非と善悪を判断する想像上の動物ヘチが、ソウル市内のあちこちに隠した守護の気運を探しに出かけます。',
      en: 'Journey to find the protective energy hidden throughout Seoul by Haechi, the mythical creature that prevents fire and disaster.'
    },
    difficulty: 'easy',
    missionCount: 7,
    duration: { ko: '1일', ja: '1日', en: '1 day' },
    price1p: 29000,
    price2p: 39000,
    thumbnail: '/images/courses/seoul.jpg',
    status: 'coming_soon',
    food: ['설렁탕', '광장시장 빈대떡', '마약김밥', '궁중음식'],
    japanConnection: {
      ko: '서울의 상징인 해치는 일본의 고마이누(狛犬)와 수호신적 성격에서 유사점을 가집니다.',
      ja: 'ソウルの象徴であるヘチは、日本の狛犬と守護神的な性格において類似点があります。',
      en: 'Haechi, the symbol of Seoul, shares similarities in its protective nature with the Japanese Komainu.'
    },
    targetAudience: ['family', 'foreigner']
  },
  {
    id: '33333333-3333-3333-3333-000000000004',
    region: 'jeju',
    title: { ko: '제주를 빚은 거인', ja: '済州を創った巨人', en: 'The Giant Who Shaped Jeju' },
    subtitle: { ko: '설문대할망의 거대한 발자취를 따라서', ja: '説門大婆（ソルムンデハルマン）の巨大な足跡をたどって', en: 'Following the Massive Footsteps of Seolmundae Halmang' },
    legendSummary: {
      ko: '제주도 섬 자체를 만들었다는 거인 설문대할망이 육지와 연결하기 위해 다리를 놓으려던 미완의 전설과 그가 남긴 오름들을 탐험합니다.',
      ja: '済州島そのものを創ったという巨人ソルムンデハルマンが、陸と繋ぐために橋を架けようとした未完の伝説と、彼女が残したオルム（寄生火山）を探検します。',
      en: 'Explore the unfinished legend of the giant Seolmundae Halmang, who created Jeju Island and tried to build a bridge to the mainland.'
    },
    difficulty: 'medium',
    missionCount: 6,
    duration: { ko: '1박 2일', ja: '1泊2日', en: '2 days' },
    price1p: 29000,
    price2p: 39000,
    thumbnail: '/images/courses/jeju.jpg',
    status: 'coming_soon',
    food: ['흑돼지구이', '고기국수', '오메기떡', '갈치조림'],
    japanConnection: {
      ko: '제주도의 해녀(해녀) 문화는 일본의 아마(海女) 문화와 역사적, 문화적 연계성이 매우 높습니다.',
      ja: '済州島の海女文化は、日本の海女文化と歴史的・文化的な関連性が非常に高いです。',
      en: 'Jeju\'s Haenyeo culture has strong historical and cultural links with the Japanese Ama culture.'
    },
    targetAudience: ['family', 'nature-lover']
  }
];
