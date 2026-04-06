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
    thumbnail: '/images/courses/jeonju-dokkaebi-thumb.jpg',
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
    thumbnail: '/images/courses/tongyeong-byeoljubu-thumb.jpg',
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
    thumbnail: '/images/courses/cheonan-nungso-thumb.jpg',
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
    thumbnail: '/images/courses/yongin-fairytale-thumb.jpg',
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
    thumbnail: '/images/courses/icheon-fairy-thumb.jpg',
    status: 'coming_soon',
    food: ['이천 쌀밥 정식', '이천 복숭아', '산수유차'],
    japanConnection: {
      ko: '일본의 하고로모 전설(羽衣伝説)과 거의 동일한 구조의 이야기입니다.',
      ja: '日本の羽衣伝説とほぼ同じ構造の物語です。',
      en: 'Nearly identical in structure to the Japanese Hagoromo legend.'
    },
    targetAudience: ['couple', 'family']
  }
];
