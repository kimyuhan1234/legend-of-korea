-- =============================================
-- COURSES 테이블 시드 데이터 (5개 코스)
-- DB 스키마: id (UUID), legend_type, region, difficulty, duration_text,
--            title, description, thumbnail_url, video_url,
--            price_1p, price_2p, is_active, season, created_at
-- =============================================
-- Course UUID 매핑:
--   전주 도깨비          → 11111111-1111-1111-1111-000000000001
--   통영 별주부전         → 11111111-1111-1111-1111-000000000002
--   천안 능소전          → 11111111-1111-1111-1111-000000000003
--   용인 동화            → 11111111-1111-1111-1111-000000000004
--   이천 선녀와 나무꾼    → 11111111-1111-1111-1111-000000000005
-- =============================================

INSERT INTO courses (id, legend_type, region, difficulty, duration_text, title, description, thumbnail_url, video_url, price_1p, price_2p, is_active, created_at)
VALUES

-- 코스 1: 전주 도깨비
('11111111-1111-1111-1111-000000000001',
 'dokkaebi',
 'jeonju',
 'easy',
 '{"ko": "1일", "ja": "1日", "en": "1 day"}',
 '{"ko": "도깨비의 선물", "ja": "トッケビの贈り物", "en": "Gift of the Dokkaebi"}',
 '{"ko": "착한 나무꾼이 도깨비에게 노래를 불러주자 금은보화가 나오는 방망이를 선물 받는 이야기를 따라, 전주 한옥마을과 도깨비숲을 탐험합니다.", "ja": "優しい木こりがトッケビに歌を歌い、金銀財宝が出る棒をもらった物語に沿って、全州韓屋村とトッケビの森を探検します。", "en": "Follow the tale of a kind woodcutter who sang for the Dokkaebi and received a magical club, exploring Jeonju Hanok Village and Dokkaebi Forest."}',
 '/images/courses/jeonju-dokkaebi-thumb.jpg',
 NULL,
 29000,
 39000,
 true,
 NOW()
),

-- 코스 2: 통영 별주부전
('11111111-1111-1111-1111-000000000002',
 'byeoljubu',
 'tongyeong',
 'medium',
 '{"ko": "1박 2일", "ja": "1泊2日", "en": "2 days"}',
 '{"ko": "별주부의 모험", "ja": "ピョルジュブの冒険", "en": "Adventure of Byeoljubu"}',
 '{"ko": "바다 용왕의 병을 고치기 위해 토끼의 간을 구하러 육지로 올라온 자라(별주부)와, 꾀로 탈출하는 영리한 토끼의 이야기를 따라 통영과 비토섬을 탐험합니다.", "ja": "海の龍王の病を治すためにウサギの肝を求めて陸に上がったスッポン（ピョルジュブ）と、知恵で脱出する賢いウサギの物語に沿って、統営とビト島を探検します。", "en": "Follow the tale of the turtle Byeoljubu who came ashore to find a rabbit liver to cure the Sea King, and the clever rabbit who escaped by wit, exploring Tongyeong and Bito Island."}',
 '/images/courses/tongyeong-byeoljubu-thumb.jpg',
 NULL,
 29000,
 39000,
 true,
 NOW()
),

-- 코스 3: 천안 능소전
('11111111-1111-1111-1111-000000000003',
 'nungso',
 'cheonan',
 'easy',
 '{"ko": "반나절~1일", "ja": "半日〜1日", "en": "Half day to 1 day"}',
 '{"ko": "능소의 기다림", "ja": "ヌンソの待ち人", "en": "Nungso''s Waiting"}',
 '{"ko": "아버지를 기다리며 버드나무를 심던 소녀 능소와, 과거 보러 가던 선비 박현수의 사랑 이야기를 따라 천안삼거리공원과 중앙시장을 탐험합니다.", "ja": "父を待ちながら柳を植えた少女ヌンソと、科挙試験に向かう書生パク・ヒョンスの愛の物語に沿って、天安三叉路公園と中央市場を探検します。", "en": "Follow the love story of Nungso, a girl who planted willows waiting for her father, and scholar Park Hyun-su, exploring Cheonan Samgeori Park and the central market."}',
 '/images/courses/cheonan-nungso-thumb.jpg',
 NULL,
 29000,
 39000,
 false,
 NOW()
),

-- 코스 4: 용인 동화
('11111111-1111-1111-1111-000000000004',
 'fairytale',
 'yongin',
 'easy',
 '{"ko": "반나절", "ja": "半日", "en": "Half day"}',
 '{"ko": "동화 속으로", "ja": "童話の中へ", "en": "Into the Fairy Tales"}',
 '{"ko": "콩쥐팥쥐, 흥부놀부, 혹부리영감, 선녀와 나무꾼, 금도끼 은도끼 — 한국 전래동화 다섯 편의 주인공들을 한국민속촌 안에서 한 번에 만나는 종합 모험 코스입니다.", "ja": "コンジュパッジュ、フンブノルブ、コブトリじいさん、仙女と木こり、金の斧銀の斧 — 韓国昔話5作品の主人公たちを韓国民俗村で一度に出会う総合冒険コースです。", "en": "Kongjwi & Patjwi, Heungbu & Nolbu, Old Man Wart, Fairy & Woodcutter, Gold Axe & Silver Axe — an all-in-one adventure meeting heroes of five Korean fairy tales at Korean Folk Village."}',
 '/images/courses/yongin-fairytale-thumb.jpg',
 NULL,
 29000,
 39000,
 false,
 NOW()
),

-- 코스 5: 이천 선녀와 나무꾼
('11111111-1111-1111-1111-000000000005',
 'fairy',
 'icheon',
 'easy',
 '{"ko": "반나절~1일", "ja": "半日〜1日", "en": "Half day to 1 day"}',
 '{"ko": "선녀의 날개옷", "ja": "仙女の羽衣", "en": "The Fairy''s Feathered Robe"}',
 '{"ko": "가난한 나무꾼이 사슴의 도움으로 선녀를 만나 결혼하지만, 날개옷을 돌려주자 선녀는 하늘로 돌아가는 이야기를 따라 이천 효양산과 설봉공원을 탐험합니다.", "ja": "貧しい木こりが鹿の助けで仙女に出会い結婚しますが、羽衣を返すと仙女は天に帰る物語に沿って、利川ヒョヤン山と雪峰公園を探検します。", "en": "Follow the tale of a poor woodcutter who met a fairy with a deer''s help and married her, but returned her robe and she flew back to heaven, exploring Icheon''s Hyoyangsan and Seolbong Park."}',
 '/images/courses/icheon-fairy-thumb.jpg',
 NULL,
 29000,
 39000,
 false,
 NOW()
)

ON CONFLICT (id) DO NOTHING;


-- =============================================
-- MISSIONS 테이블 시드 데이터 (38개 미션)
-- DB 스키마: id (UUID), course_id (UUID FK), sequence, type,
--            title, description, hint_1, correct_answer, lp_reward,
--            is_hidden, location_name, latitude, longitude, created_at
-- type: 'quiz' | 'photo' | 'open' | 'boss' | 'hidden'
-- correct_answer: plain string (Korean)
-- =============================================
-- Mission UUID 패턴: 22222222-2222-2222-2222-0000000001YZ
--   1YZ = 코스번호(1~5) + 미션순번(01~08)
--   전주(1xx): 101~108 / 통영(2xx): 201~208
--   천안(3xx): 301~307 / 용인(4xx): 401~408 / 이천(5xx): 501~507
-- =============================================

INSERT INTO missions (id, course_id, sequence, type, title, description, hint_1, correct_answer, lp_reward, is_hidden, location_name, latitude, longitude)
VALUES

-- ── 전주 도깨비 (8 미션, course_id: 11111111-1111-1111-1111-000000000001) ──

('22222222-2222-2222-2222-000000000101',
 '11111111-1111-1111-1111-000000000001', 1,
 'quiz',
 '{"ko": "도깨비의 첫 번째 수수께끼", "ja": "トッケビの最初のなぞなぞ", "en": "The Dokkaebi''s First Riddle"}',
 '{"ko": "경기전에 도착해서 도깨비 전래동화의 첫 번째 퀴즈를 풀어보세요.", "ja": "慶基殿に到着して、トッケビ昔話の最初のクイズに挑戦しましょう。", "en": "Arrive at Gyeonggijeon and solve the first quiz about the Dokkaebi fairy tale."}',
 '{"ko": "도깨비가 나무꾼에게 원한 것은?", "ja": "トッケビが木こりに求めたものは？", "en": "What did the Dokkaebi want from the woodcutter?"}',
 '노래',
 100, false,
 '{"ko": "경기전", "ja": "慶基殿", "en": "Gyeonggijeon"}',
 35.8151, 127.1500),

('22222222-2222-2222-2222-000000000102',
 '11111111-1111-1111-1111-000000000001', 2,
 'photo',
 '{"ko": "도깨비숲 탐험", "ja": "トッケビの森探検", "en": "Dokkaebi Forest Expedition"}',
 '{"ko": "전주 도깨비숲에서 도깨비 조형물을 찾아 인증샷을 찍으세요.", "ja": "全州トッケビの森でトッケビの像を見つけて記念撮影しましょう。", "en": "Find the Dokkaebi statue at Jeonju Dokkaebi Forest and take a photo."}',
 '{"ko": "완산칠봉 근처 숲놀이터를 찾아보세요", "ja": "完山七峰近くの森の遊び場を探してみましょう", "en": "Look for the forest playground near Wansan Chilbong"}',
 NULL,
 150, false,
 '{"ko": "전주 도깨비숲", "ja": "全州トッケビの森", "en": "Jeonju Dokkaebi Forest"}',
 35.8098, 127.1467),

('22222222-2222-2222-2222-000000000103',
 '11111111-1111-1111-1111-000000000001', 3,
 'photo',
 '{"ko": "벽화 속 도깨비 찾기", "ja": "壁画の中のトッケビ探し", "en": "Find the Dokkaebi in Murals"}',
 '{"ko": "자만벽화마을 골목을 걸으며 벽화 속에 숨겨진 도깨비를 찾아보세요.", "ja": "自慢壁画村の路地を歩きながら、壁画の中に隠れたトッケビを探しましょう。", "en": "Walk through Jaman Mural Village alleys and find the hidden Dokkaebi in the murals."}',
 '{"ko": "골목 곳곳의 벽화를 자세히 살펴보세요", "ja": "路地のあちこちの壁画をよく見てみましょう", "en": "Look carefully at murals throughout the alleys"}',
 NULL,
 150, false,
 '{"ko": "자만벽화마을", "ja": "自慢壁画村", "en": "Jaman Mural Village"}',
 35.8127, 127.1529),

('22222222-2222-2222-2222-000000000104',
 '11111111-1111-1111-1111-000000000001', 4,
 'photo',
 '{"ko": "오목대에서 전주를 내려다보다", "ja": "梧木台から全州を見下ろす", "en": "Overlook Jeonju from Omokdae"}',
 '{"ko": "오목대 전망대에 올라 전주 한옥마을 전경을 촬영하세요.", "ja": "梧木台展望台に登り、全州韓屋村の全景を撮影しましょう。", "en": "Climb Omokdae viewpoint and photograph the panoramic view of Jeonju Hanok Village."}',
 '{"ko": "한옥마을 뒤쪽 언덕 위로 올라가세요", "ja": "韓屋村の裏の丘の上に登りましょう", "en": "Go up the hill behind Hanok Village"}',
 NULL,
 100, false,
 '{"ko": "오목대", "ja": "梧木台", "en": "Omokdae"}',
 35.8133, 127.1538),

('22222222-2222-2222-2222-000000000105',
 '11111111-1111-1111-1111-000000000001', 5,
 'quiz',
 '{"ko": "도깨비시장의 맛", "ja": "トッケビ市場の味", "en": "Taste of Dokkaebi Market"}',
 '{"ko": "남부시장에서 전주 대표 먹거리를 시식하고 퀴즈를 풀어보세요.", "ja": "南部市場で全州の代表的なグルメを試食してクイズに挑戦しましょう。", "en": "Try Jeonju''s signature street food at Nambu Market and solve the quiz."}',
 '{"ko": "전주를 대표하는 음식은?", "ja": "全州を代表する食べ物は？", "en": "What is Jeonju''s signature dish?"}',
 '비빔밥',
 100, false,
 '{"ko": "전주 남부시장", "ja": "全州南部市場", "en": "Jeonju Nambu Market"}',
 35.8107, 127.1479),

('22222222-2222-2222-2222-000000000106',
 '11111111-1111-1111-1111-000000000001', 6,
 'quiz',
 '{"ko": "한지의 비밀", "ja": "韓紙の秘密", "en": "Secret of Hanji"}',
 '{"ko": "전주한지박물관에서 한지에 대한 퀴즈를 풀어보세요.", "ja": "全州韓紙博物館で韓紙に関するクイズに挑戦しましょう。", "en": "Solve a quiz about Hanji (traditional Korean paper) at the Jeonju Hanji Museum."}',
 '{"ko": "한지의 주원료가 되는 나무는?", "ja": "韓紙の主原料となる木は？", "en": "What tree is the main material for Hanji?"}',
 '닥나무',
 100, false,
 '{"ko": "전주한지박물관", "ja": "全州韓紙博物館", "en": "Jeonju Hanji Museum"}',
 35.8143, 127.1521),

('22222222-2222-2222-2222-000000000107',
 '11111111-1111-1111-1111-000000000001', 7,
 'photo',
 '{"ko": "한복과 성당", "ja": "韓服と聖堂", "en": "Hanbok and Cathedral"}',
 '{"ko": "한복을 입고 전동성당 앞에서 인증샷을 찍으세요.", "ja": "韓服を着て殿洞聖堂の前で記念撮影しましょう。", "en": "Wear a Hanbok and take a photo in front of Jeondong Cathedral."}',
 '{"ko": "한옥마을 입구 근처의 로마네스크 양식 성당입니다", "ja": "韓屋村入口近くのロマネスク様式の聖堂です", "en": "A Romanesque-style cathedral near the Hanok Village entrance"}',
 NULL,
 150, false,
 '{"ko": "전동성당", "ja": "殿洞聖堂", "en": "Jeondong Cathedral"}',
 35.8147, 127.1497),

('22222222-2222-2222-2222-000000000108',
 '11111111-1111-1111-1111-000000000001', 8,
 'boss',
 '{"ko": "도깨비방망이를 찾아라!", "ja": "トッケビの棒を探せ！", "en": "Find the Dokkaebi Club!"}',
 '{"ko": "전주향교에서 최종 보스 미션! 도깨비 전래동화에 대한 종합 퀴즈를 풀어보세요.", "ja": "全州郷校で最終ボスミッション！トッケビ昔話の総合クイズに挑戦しましょう。", "en": "Final boss mission at Jeonju Hyanggyo! Solve the comprehensive quiz about the Dokkaebi fairy tale."}',
 '{"ko": "도깨비가 나무꾼에게 선물한 것은?", "ja": "トッケビが木こりに贈ったものは？", "en": "What did the Dokkaebi give the woodcutter?"}',
 '방망이',
 300, false,
 '{"ko": "전주향교", "ja": "全州郷校", "en": "Jeonju Hyanggyo"}',
 35.8126, 127.1550),


-- ── 통영 별주부전 (8 미션, course_id: 11111111-1111-1111-1111-000000000002) ──

('22222222-2222-2222-2222-000000000201',
 '11111111-1111-1111-1111-000000000002', 1,
 'quiz',
 '{"ko": "용왕의 부름", "ja": "龍王の呼び声", "en": "The Sea King''s Call"}',
 '{"ko": "강구안 관광안내소에서 별주부전 이야기의 첫 번째 퀴즈를 풀어보세요.", "ja": "カングアン観光案内所でピョルジュブ伝の最初のクイズに挑戦しましょう。", "en": "Solve the first quiz about the Byeoljubu tale at Ganggu-an tourist center."}',
 '{"ko": "용왕이 토끼에게서 필요로 한 것은?", "ja": "龍王がウサギから必要としたものは？", "en": "What did the Sea King need from the rabbit?"}',
 '간',
 100, false,
 '{"ko": "강구안", "ja": "カングアン", "en": "Ganggu-an Harbor"}',
 34.8422, 128.4231),

('22222222-2222-2222-2222-000000000202',
 '11111111-1111-1111-1111-000000000002', 2,
 'photo',
 '{"ko": "동피랑의 토끼와 자라", "ja": "東ピランのウサギとスッポン", "en": "Rabbit & Turtle of Dongpirang"}',
 '{"ko": "동피랑 벽화마을에서 토끼와 자라가 그려진 벽화를 찾아 인증샷을 찍으세요.", "ja": "東ピラン壁画村でウサギとスッポンが描かれた壁画を見つけて記念撮影しましょう。", "en": "Find murals depicting the rabbit and turtle at Dongpirang Mural Village and take a photo."}',
 '{"ko": "동피랑 골목 곳곳에 바다 동물 벽화가 있어요", "ja": "東ピランの路地のあちこちに海の動物の壁画があります", "en": "Look for sea animal murals throughout Dongpirang alleys"}',
 NULL,
 150, false,
 '{"ko": "동피랑 벽화마을", "ja": "東ピラン壁画村", "en": "Dongpirang Mural Village"}',
 34.8438, 128.4258),

('22222222-2222-2222-2222-000000000203',
 '11111111-1111-1111-1111-000000000002', 3,
 'photo',
 '{"ko": "용궁으로 가는 길", "ja": "龍宮への道", "en": "Path to the Dragon Palace"}',
 '{"ko": "통영 해저터널을 통과하며 용궁에 들어가는 기분을 느껴보세요. 터널 끝에서 GPS 체크인!", "ja": "統営海底トンネルを通り抜けながら龍宮に入る気分を味わいましょう。トンネルの出口でGPSチェックイン！", "en": "Walk through Tongyeong Undersea Tunnel and feel like you''re entering the Dragon Palace. GPS check-in at the tunnel exit!"}',
 '{"ko": "1931년 만들어진 동양 최초 해저터널입니다", "ja": "1931年に造られた東洋初の海底トンネルです", "en": "This is the first undersea tunnel in the East, built in 1931"}',
 NULL,
 150, false,
 '{"ko": "통영 해저터널", "ja": "統営海底トンネル", "en": "Tongyeong Undersea Tunnel"}',
 34.8396, 128.4194),

('22222222-2222-2222-2222-000000000204',
 '11111111-1111-1111-1111-000000000002', 4,
 'quiz',
 '{"ko": "바다의 맛", "ja": "海の味", "en": "Taste of the Sea"}',
 '{"ko": "통영 중앙시장에서 충무김밥 또는 꿀빵을 시식하고 퀴즈를 풀어보세요.", "ja": "統営中央市場で忠武キンパまたはハニーブレッドを試食してクイズに挑戦しましょう。", "en": "Try Chungmu Gimbap or honey bread at Tongyeong Central Market and solve the quiz."}',
 '{"ko": "통영의 대표 음식은?", "ja": "統営の代表的な食べ物は？", "en": "What is Tongyeong''s signature food?"}',
 '충무김밥',
 100, false,
 '{"ko": "통영 중앙시장", "ja": "統営中央市場", "en": "Tongyeong Central Market"}',
 34.8431, 128.4227),

('22222222-2222-2222-2222-000000000205',
 '11111111-1111-1111-1111-000000000002', 5,
 'photo',
 '{"ko": "서피랑 99계단", "ja": "西ピラン99段", "en": "Seobirang 99 Steps"}',
 '{"ko": "서피랑 99계단을 올라 꼭대기에서 강구안 전경을 촬영하세요.", "ja": "西ピラン99段を登り、頂上からカングアンの全景を撮影しましょう。", "en": "Climb the 99 steps of Seobirang and photograph the panoramic view of Ganggu-an from the top."}',
 '{"ko": "서피랑 정상의 서포루에서 통영 시내가 한눈에 보입니다", "ja": "西ピラン頂上の西浦楼から統営市内が一望できます", "en": "You can see all of Tongyeong from Seoporu at the top of Seobirang"}',
 NULL,
 150, false,
 '{"ko": "서피랑 99계단", "ja": "西ピラン99段", "en": "Seobirang 99 Steps"}',
 34.8445, 128.4198),

('22222222-2222-2222-2222-000000000206',
 '11111111-1111-1111-1111-000000000002', 6,
 'photo',
 '{"ko": "토끼가 날아오른 섬", "ja": "ウサギが飛び立った島", "en": "The Island Where the Rabbit Flew"}',
 '{"ko": "비토섬 토끼섬 트레일을 완주하고 포토를 찍으세요.", "ja": "ビト島のウサギ島トレイルを完走して写真を撮りましょう。", "en": "Complete the Bito Island Rabbit Island trail and take a photo."}',
 '{"ko": "비토(飛兎)는 토끼가 날아오른 섬이라는 뜻이에요", "ja": "ビト（飛兎）はウサギが飛び立った島という意味です", "en": "Bito (飛兎) means the island where the rabbit flew away"}',
 NULL,
 200, false,
 '{"ko": "비토섬 토끼섬", "ja": "ビト島ウサギ島", "en": "Bito Island - Rabbit Island"}',
 34.9135, 128.3254),

('22222222-2222-2222-2222-000000000207',
 '11111111-1111-1111-1111-000000000002', 7,
 'quiz',
 '{"ko": "자라의 속임수", "ja": "スッポンの計略", "en": "The Turtle''s Trick"}',
 '{"ko": "거북섬에서 별주부전 관련 퀴즈를 풀어보세요.", "ja": "亀島でピョルジュブ伝に関するクイズに挑戦しましょう。", "en": "Solve a Byeoljubu tale quiz at Turtle Island."}',
 '{"ko": "토끼가 용궁에서 탈출한 방법은?", "ja": "ウサギが龍宮から脱出した方法は？", "en": "How did the rabbit escape from the Dragon Palace?"}',
 '육지에 두고 왔다',
 100, false,
 '{"ko": "비토섬 거북섬", "ja": "ビト島亀島", "en": "Bito Island - Turtle Island"}',
 34.9128, 128.3248),

('22222222-2222-2222-2222-000000000208',
 '11111111-1111-1111-1111-000000000002', 8,
 'boss',
 '{"ko": "용왕에게 보고하라!", "ja": "龍王に報告せよ！", "en": "Report to the Sea King!"}',
 '{"ko": "별주부전 테마파크에서 최종 보스 미션! 종합 퀴즈를 풀고 용왕에게 보고서를 작성하세요.", "ja": "ピョルジュブ伝テーマパークで最終ボスミッション！総合クイズを解いて龍王に報告書を作成しましょう。", "en": "Final boss mission at the Byeoljubu Theme Park! Solve the comprehensive quiz and write a report to the Sea King."}',
 '{"ko": "별주부전 전체 이야기를 떠올리며 자유롭게 작성하세요", "ja": "ピョルジュブ伝の全体の物語を思い出しながら自由に書きましょう", "en": "Recall the entire Byeoljubu story and write freely"}',
 NULL,
 300, false,
 '{"ko": "별주부전 테마파크", "ja": "ピョルジュブ伝テーマパーク", "en": "Byeoljubu Theme Park"}',
 34.9140, 128.3260),


-- ── 천안 능소전 (7 미션, course_id: 11111111-1111-1111-1111-000000000003) ──

('22222222-2222-2222-2222-000000000301',
 '11111111-1111-1111-1111-000000000003', 1,
 'quiz',
 '{"ko": "능소전의 시작", "ja": "ヌンソ伝の始まり", "en": "The Beginning of Nungso''s Tale"}',
 '{"ko": "천안삼거리공원 입구에서 능소전 이야기의 첫 번째 퀴즈를 풀어보세요.", "ja": "天安三叉路公園入口でヌンソ伝の最初のクイズに挑戦しましょう。", "en": "Solve the first Nungso tale quiz at the entrance of Cheonan Samgeori Park."}',
 '{"ko": "능소의 아버지가 능소를 맡긴 사람은?", "ja": "ヌンソの父がヌンソを預けた人は？", "en": "Who did Nungso''s father entrust her to?"}',
 '충주댁',
 100, false,
 '{"ko": "천안삼거리공원 입구", "ja": "天安三叉路公園入口", "en": "Cheonan Samgeori Park Entrance"}',
 36.7978, 127.1522),

('22222222-2222-2222-2222-000000000302',
 '11111111-1111-1111-1111-000000000003', 2,
 'photo',
 '{"ko": "능수버들 아래에서", "ja": "しだれ柳の下で", "en": "Beneath the Weeping Willow"}',
 '{"ko": "능소 조형물과 능수버들 길에서 인증샷을 찍으세요.", "ja": "ヌンソの像としだれ柳の道で記念撮影しましょう。", "en": "Take a photo with the Nungso statue along the weeping willow path."}',
 '{"ko": "공원 안쪽의 능수버들 가로수길을 따라 걸어보세요", "ja": "公園内のしだれ柳の並木道を歩いてみましょう", "en": "Walk along the weeping willow tree-lined path inside the park"}',
 NULL,
 150, false,
 '{"ko": "능소 조형물 & 능수버들 길", "ja": "ヌンソ像 & しだれ柳の道", "en": "Nungso Statue & Willow Path"}',
 36.7982, 127.1518),

('22222222-2222-2222-2222-000000000303',
 '11111111-1111-1111-1111-000000000003', 3,
 'open',
 '{"ko": "능소에게 편지 쓰기", "ja": "ヌンソへの手紙", "en": "Letter to Nungso"}',
 '{"ko": "능소각 정자에서 능소에게 보내는 짧은 편지를 작성하세요.", "ja": "ヌンソ閣の東屋でヌンソに送る短い手紙を書きましょう。", "en": "Write a short letter to Nungso at Nunso-gak pavilion."}',
 '{"ko": "기다림과 사랑에 대해 자유롭게 써보세요", "ja": "待つことと愛について自由に書いてみましょう", "en": "Write freely about waiting and love"}',
 NULL,
 200, false,
 '{"ko": "능소각", "ja": "ヌンソ閣", "en": "Nunso-gak Pavilion"}',
 36.7985, 127.1515),

('22222222-2222-2222-2222-000000000304',
 '11111111-1111-1111-1111-000000000003', 4,
 'quiz',
 '{"ko": "박현수가 쓰러진 곳", "ja": "パク・ヒョンスが倒れた場所", "en": "Where Park Hyun-su Collapsed"}',
 '{"ko": "영남루 터에서 능소전 스토리 관련 퀴즈를 풀어보세요.", "ja": "嶺南楼跡でヌンソ伝のストーリーに関するクイズに挑戦しましょう。", "en": "Solve a Nungso tale quiz at the Yeongnam-ru site."}',
 '{"ko": "박현수가 천안을 지나가던 이유는?", "ja": "パク・ヒョンスが天安を通りかかった理由は？", "en": "Why was Park Hyun-su passing through Cheonan?"}',
 '과거시험',
 100, false,
 '{"ko": "영남루 터", "ja": "嶺南楼跡", "en": "Yeongnam-ru Site"}',
 36.7975, 127.1525),

('22222222-2222-2222-2222-000000000305',
 '11111111-1111-1111-1111-000000000003', 5,
 'quiz',
 '{"ko": "천안의 맛", "ja": "天安の味", "en": "Taste of Cheonan"}',
 '{"ko": "천안중앙시장에서 호두과자 또는 병천순대를 시식하고 퀴즈를 풀어보세요.", "ja": "天安中央市場でクルミ菓子または餅天スンデを試食してクイズに挑戦しましょう。", "en": "Try walnut cookies or Byeongcheon sundae at Cheonan Central Market and solve the quiz."}',
 '{"ko": "천안의 대표 간식은?", "ja": "天安の代表的なおやつは？", "en": "What is Cheonan''s signature snack?"}',
 '호두과자',
 100, false,
 '{"ko": "천안중앙시장", "ja": "天安中央市場", "en": "Cheonan Central Market"}',
 36.8114, 127.1468),

('22222222-2222-2222-2222-000000000306',
 '11111111-1111-1111-1111-000000000003', 6,
 'photo',
 '{"ko": "봉서산에서 바라본 천안", "ja": "鳳棲山から見た天安", "en": "Cheonan from Bongseosan"}',
 '{"ko": "봉서산 전망대에서 천안 시내 전경을 촬영하세요.", "ja": "鳳棲山展望台から天安市内の全景を撮影しましょう。", "en": "Photograph the panoramic view of Cheonan from Bongseosan viewpoint."}',
 '{"ko": "공원 뒤쪽 산책로를 따라 올라가면 전망대가 있어요", "ja": "公園裏の散策路を登ると展望台があります", "en": "Follow the walking trail behind the park to find the viewpoint"}',
 NULL,
 150, false,
 '{"ko": "봉서산 전망대", "ja": "鳳棲山展望台", "en": "Bongseosan Viewpoint"}',
 36.8048, 127.1445),

('22222222-2222-2222-2222-000000000307',
 '11111111-1111-1111-1111-000000000003', 7,
 'boss',
 '{"ko": "흥타령을 완성하라!", "ja": "フンタリョンを完成させよ！", "en": "Complete the Heungtaryeong!"}',
 '{"ko": "흥타령 거리에서 최종 보스 미션! 흥타령 가사 빈칸 채우기와 종합 퀴즈를 풀어보세요.", "ja": "フンタリョン通りで最終ボスミッション！フンタリョンの歌詞の穴埋めと総合クイズに挑戦しましょう。", "en": "Final boss mission on Heungtaryeong Street! Fill in the blanks of the Heungtaryeong lyrics and solve the comprehensive quiz."}',
 '{"ko": "천안삼거리 ○~ 에서 빈칸에 들어갈 글자는?", "ja": "天安三叉路○〜の空欄に入る文字は？", "en": "What letter fills the blank in Cheonan Samgeori ○~?"}',
 '흥',
 300, false,
 '{"ko": "흥타령 거리", "ja": "フンタリョン通り", "en": "Heungtaryeong Street"}',
 36.8020, 127.1500),


-- ── 용인 동화 (8 미션, course_id: 11111111-1111-1111-1111-000000000004) ──

('22222222-2222-2222-2222-000000000401',
 '11111111-1111-1111-1111-000000000004', 1,
 'quiz',
 '{"ko": "동화의 문을 열다", "ja": "童話の扉を開く", "en": "Open the Door to Fairy Tales"}',
 '{"ko": "한국민속촌 입구에서 한국 전래동화 5개의 이름을 맞춰보세요.", "ja": "韓国民俗村入口で韓国昔話5作品の名前を当てましょう。", "en": "Name five Korean fairy tales at the Korean Folk Village entrance."}',
 '{"ko": "이 코스에서 만나게 될 다섯 편의 동화 이름을 떠올려보세요", "ja": "このコースで出会う5つの童話の名前を思い出しましょう", "en": "Think of the five fairy tales you''ll encounter on this course"}',
 '콩쥐팥쥐, 흥부놀부, 혹부리영감, 선녀와 나무꾼, 금도끼 은도끼',
 100, false,
 '{"ko": "한국민속촌 정문", "ja": "韓国民俗村正門", "en": "Korean Folk Village Main Gate"}',
 37.2590, 127.1185),

('22222222-2222-2222-2222-000000000402',
 '11111111-1111-1111-1111-000000000004', 2,
 'photo',
 '{"ko": "콩쥐가 되어보기", "ja": "コンジュになってみよう", "en": "Become Kongjwi"}',
 '{"ko": "콩쥐팥쥐 포토존에서 한복을 입고 인증샷을 찍으세요.", "ja": "コンジュパッジュフォトゾーンで韓服を着て記念撮影しましょう。", "en": "Wear a Hanbok and take a photo at the Kongjwi Patjwi photo zone."}',
 '{"ko": "동화마을 구역에 포토존이 있어요", "ja": "童話村エリアにフォトゾーンがあります", "en": "The photo zone is in the fairy tale village area"}',
 NULL,
 150, false,
 '{"ko": "콩쥐팥쥐 포토존", "ja": "コンジュパッジュフォトゾーン", "en": "Kongjwi Patjwi Photo Zone"}',
 37.2578, 127.1192),

('22222222-2222-2222-2222-000000000403',
 '11111111-1111-1111-1111-000000000004', 3,
 'photo',
 '{"ko": "흥부의 박 터뜨리기", "ja": "フンブのひょうたん割り", "en": "Heungbu''s Gourd Smash"}',
 '{"ko": "흥부놀부 체험존에서 박 터뜨리기 포토를 찍거나 퀴즈를 풀어보세요.", "ja": "フンブ・ノルブ体験ゾーンでひょうたん割りの写真を撮るかクイズに挑戦しましょう。", "en": "Take a gourd-smashing photo or solve a quiz at the Heungbu Nolbu experience zone."}',
 '{"ko": "흥부가 박을 타면 보물이, 놀부가 박을 타면...?", "ja": "フンブがひょうたんを割ると宝が、ノルブが割ると...？", "en": "When Heungbu opens a gourd, treasure comes out. When Nolbu opens one...?"}',
 NULL,
 150, false,
 '{"ko": "흥부놀부 체험존", "ja": "フンブ・ノルブ体験ゾーン", "en": "Heungbu Nolbu Experience Zone"}',
 37.2572, 127.1198),

('22222222-2222-2222-2222-000000000404',
 '11111111-1111-1111-1111-000000000004', 4,
 'quiz',
 '{"ko": "도깨비가 좋아하는 것", "ja": "トッケビの好きなもの", "en": "What the Dokkaebi Loves"}',
 '{"ko": "혹부리영감 도깨비방망이 포인트에서 퀴즈를 풀어보세요.", "ja": "コブトリ爺さんトッケビの棒ポイントでクイズに挑戦しましょう。", "en": "Solve a quiz at the Old Man Wart Dokkaebi club point."}',
 '{"ko": "혹부리영감이 도깨비에게 해준 것은?", "ja": "コブトリ爺さんがトッケビにしてあげたことは？", "en": "What did Old Man Wart do for the Dokkaebi?"}',
 '노래',
 100, false,
 '{"ko": "혹부리영감 포인트", "ja": "コブトリ爺さんポイント", "en": "Old Man Wart Point"}',
 37.2565, 127.1205),

('22222222-2222-2222-2222-000000000405',
 '11111111-1111-1111-1111-000000000004', 5,
 'photo',
 '{"ko": "선녀의 깃옷을 찾아라", "ja": "仙女の羽衣を探せ", "en": "Find the Fairy''s Robe"}',
 '{"ko": "선녀와 나무꾼 연못 주변에서 숨겨진 깃옷 포인트를 찾아보세요.", "ja": "仙女と木こりの池の周りで隠された羽衣ポイントを探しましょう。", "en": "Find the hidden feathered robe point around the Fairy and Woodcutter pond."}',
 '{"ko": "연못 주변을 천천히 살펴보세요", "ja": "池の周りをゆっくり見てみましょう", "en": "Look carefully around the pond"}',
 NULL,
 200, true,
 '{"ko": "선녀와 나무꾼 연못", "ja": "仙女と木こりの池", "en": "Fairy & Woodcutter Pond"}',
 37.2558, 127.1210),

('22222222-2222-2222-2222-000000000406',
 '11111111-1111-1111-1111-000000000004', 6,
 'quiz',
 '{"ko": "달고나의 추억", "ja": "タルゴナの思い出", "en": "Dalgona Memories"}',
 '{"ko": "전통시장 거리에서 달고나를 만들고 전통 음식 퀴즈를 풀어보세요.", "ja": "伝統市場通りでタルゴナを作り、伝統料理クイズに挑戦しましょう。", "en": "Make dalgona at the traditional market street and solve a traditional food quiz."}',
 '{"ko": "설탕을 녹여 만드는 한국의 전통 간식은?", "ja": "砂糖を溶かして作る韓国の伝統おやつは？", "en": "What Korean traditional snack is made by melting sugar?"}',
 '달고나',
 100, false,
 '{"ko": "전통시장 거리", "ja": "伝統市場通り", "en": "Traditional Market Street"}',
 37.2582, 127.1175),

('22222222-2222-2222-2222-000000000407',
 '11111111-1111-1111-1111-000000000004', 7,
 'quiz',
 '{"ko": "풍물놀이의 박자", "ja": "プンムルノリのリズム", "en": "Rhythm of Pungmul"}',
 '{"ko": "풍물놀이 마당에서 공연을 관람하고 악기 이름 퀴즈를 풀어보세요.", "ja": "プンムルノリ広場で公演を観覧し、楽器の名前クイズに挑戦しましょう。", "en": "Watch a performance at the Pungmul yard and solve a musical instrument name quiz."}',
 '{"ko": "사물놀이에 쓰이는 4가지 악기는?", "ja": "サムルノリに使われる4つの楽器は？", "en": "What are the 4 instruments used in Samulnori?"}',
 '꽹과리, 장구, 북, 징',
 100, false,
 '{"ko": "풍물놀이 마당", "ja": "プンムルノリ広場", "en": "Pungmul Performance Yard"}',
 37.2575, 127.1168),

('22222222-2222-2222-2222-000000000408',
 '11111111-1111-1111-1111-000000000004', 8,
 'boss',
 '{"ko": "산신령의 시험", "ja": "山の神の試練", "en": "The Mountain Spirit''s Test"}',
 '{"ko": "금도끼 은도끼 산신령 동상 앞에서 최종 보스 미션! 종합 퀴즈를 풀어보세요.", "ja": "金の斧銀の斧の山の神の像の前で最終ボスミッション！総合クイズに挑戦しましょう。", "en": "Final boss mission at the Gold Axe Silver Axe mountain spirit statue! Solve the comprehensive quiz."}',
 '{"ko": "정직한 나무꾼이 고른 도끼는?", "ja": "正直な木こりが選んだ斧は？", "en": "Which axe did the honest woodcutter choose?"}',
 '쇠도끼',
 300, false,
 '{"ko": "산신령 동상", "ja": "山の神像", "en": "Mountain Spirit Statue"}',
 37.2560, 127.1180),


-- ── 이천 선녀와 나무꾼 (7 미션, course_id: 11111111-1111-1111-1111-000000000005) ──

('22222222-2222-2222-2222-000000000501',
 '11111111-1111-1111-1111-000000000005', 1,
 'quiz',
 '{"ko": "사슴의 보은", "ja": "鹿の恩返し", "en": "The Deer''s Gratitude"}',
 '{"ko": "효양산 입구 안내판에서 선녀와 나무꾼 이야기의 첫 번째 퀴즈를 풀어보세요.", "ja": "ヒョヤン山入口の案内板で仙女と木こりの最初のクイズに挑戦しましょう。", "en": "Solve the first Fairy and Woodcutter quiz at the Hyoyangsan entrance sign."}',
 '{"ko": "사슴이 나무꾼에게 알려준 장소는?", "ja": "鹿が木こりに教えた場所は？", "en": "What place did the deer tell the woodcutter about?"}',
 '연못',
 100, false,
 '{"ko": "효양산 입구", "ja": "ヒョヤン山入口", "en": "Hyoyangsan Entrance"}',
 37.2745, 127.4352),

('22222222-2222-2222-2222-000000000502',
 '11111111-1111-1111-1111-000000000005', 2,
 'photo',
 '{"ko": "선녀의 연못", "ja": "仙女の池", "en": "The Fairy''s Pond"}',
 '{"ko": "효양산 선녀 연못 터에서 인증샷을 찍고 날개옷 포인트를 찾아보세요.", "ja": "ヒョヤン山の仙女の池跡で記念撮影し、羽衣ポイントを探しましょう。", "en": "Take a photo at the fairy pond site on Hyoyangsan and look for the feathered robe point."}',
 '{"ko": "효양산 중턱에 연못 터가 있어요", "ja": "ヒョヤン山の中腹に池の跡があります", "en": "The pond site is on the middle slope of Hyoyangsan"}',
 NULL,
 200, false,
 '{"ko": "선녀 연못 터", "ja": "仙女の池跡", "en": "Fairy Pond Site"}',
 37.2760, 127.4368),

('22222222-2222-2222-2222-000000000503',
 '11111111-1111-1111-1111-000000000005', 3,
 'quiz',
 '{"ko": "삼형제바위의 비밀", "ja": "三兄弟岩の秘密", "en": "Secret of the Three Brothers Rock"}',
 '{"ko": "설봉산 삼형제바위에서 설화 관련 퀴즈를 풀어보세요.", "ja": "雪峰山三兄弟岩で説話に関するクイズに挑戦しましょう。", "en": "Solve a folklore quiz at the Three Brothers Rock on Seolbongsan."}',
 '{"ko": "삼형제바위 설화에서 바위로 변한 것은?", "ja": "三兄弟岩の説話で岩に変わったのは？", "en": "What turned into rocks in the Three Brothers legend?"}',
 '세 형제',
 100, false,
 '{"ko": "설봉산 삼형제바위", "ja": "雪峰山三兄弟岩", "en": "Seolbongsan Three Brothers Rock"}',
 37.2698, 127.4401),

('22222222-2222-2222-2222-000000000504',
 '11111111-1111-1111-1111-000000000005', 4,
 'photo',
 '{"ko": "설봉호의 풍경", "ja": "雪峰湖の風景", "en": "Scenery of Seolbongho"}',
 '{"ko": "설봉호 수변공원에서 경치를 감상하고 포토를 찍으세요.", "ja": "雪峰湖水辺公園で景色を楽しみ写真を撮りましょう。", "en": "Enjoy the scenery at Seolbongho lakeside park and take a photo."}',
 '{"ko": "설봉공원 내 호수 주변을 산책해보세요", "ja": "雪峰公園内の湖の周りを散歩してみましょう", "en": "Take a walk around the lake in Seolbong Park"}',
 NULL,
 100, false,
 '{"ko": "설봉호 수변공원", "ja": "雪峰湖水辺公園", "en": "Seolbongho Lakeside Park"}',
 37.2715, 127.4385),

('22222222-2222-2222-2222-000000000505',
 '11111111-1111-1111-1111-000000000005', 5,
 'quiz',
 '{"ko": "도자기의 고장", "ja": "陶磁器の里", "en": "Home of Ceramics"}',
 '{"ko": "이천 도예마을에서 도자기 관련 퀴즈를 풀어보세요.", "ja": "利川陶芸村で陶磁器に関するクイズに挑戦しましょう。", "en": "Solve a ceramics quiz at Icheon Pottery Village."}',
 '{"ko": "고려시대를 대표하는 도자기는?", "ja": "高麗時代を代表する陶磁器は？", "en": "What type of pottery represents the Goryeo Dynasty?"}',
 '청자',
 100, false,
 '{"ko": "이천 도예마을", "ja": "利川陶芸村", "en": "Icheon Pottery Village"}',
 37.2631, 127.4512),

('22222222-2222-2222-2222-000000000506',
 '11111111-1111-1111-1111-000000000005', 6,
 'quiz',
 '{"ko": "이천 쌀밥의 맛", "ja": "利川ご飯の味", "en": "Taste of Icheon Rice"}',
 '{"ko": "이천 쌀밥거리에서 쌀밥 정식을 시식하고 재료 맞추기 퀴즈를 풀어보세요.", "ja": "利川ご飯通りでご飯定食を試食して食材当てクイズに挑戦しましょう。", "en": "Try Icheon rice set meal on Rice Street and solve a food ingredient quiz."}',
 '{"ko": "이천 쌀밥이 유명한 조리 방식은?", "ja": "利川ご飯が有名な調理法は？", "en": "What cooking method is Icheon rice famous for?"}',
 '돌솥밥',
 100, false,
 '{"ko": "이천 쌀밥거리", "ja": "利川ご飯通り", "en": "Icheon Rice Street"}',
 37.2789, 127.4345),

('22222222-2222-2222-2222-000000000507',
 '11111111-1111-1111-1111-000000000005', 7,
 'boss',
 '{"ko": "반룡송의 약속", "ja": "盤龍松の約束", "en": "Promise of the Banyongsong"}',
 '{"ko": "500년 된 소나무 반룡송 앞에서 최종 보스 미션! 나무꾼이 약속을 지켰다면 어떻게 되었을까? 자유롭게 답변하세요.", "ja": "樹齢500年の松・盤龍松の前で最終ボスミッション！木こりが約束を守っていたらどうなっていたでしょう？自由に答えてください。", "en": "Final boss mission at the 500-year-old Banyongsong pine! What would have happened if the woodcutter had kept his promise? Answer freely."}',
 '{"ko": "사슴이 나무꾼에게 한 충고를 떠올려보세요", "ja": "鹿が木こりにした忠告を思い出しましょう", "en": "Recall the advice the deer gave the woodcutter"}',
 NULL,
 300, false,
 '{"ko": "반룡송", "ja": "盤龍松", "en": "Banyongsong Pine Tree"}',
 37.3012, 127.4890)

ON CONFLICT (id) DO NOTHING;


-- =============================================
-- 신규 지역 코스 추가 (4개 코스)
-- 경주, 부산, 서울, 제주
-- =============================================

INSERT INTO courses (id, legend_type, region, difficulty, duration_text, title, description, thumbnail_url, price_1p, price_2p, is_active, created_at)
VALUES

-- 코스 6: 경주 만파식적
('33333333-3333-3333-3333-000000000001',
 'manpa',
 'gyeongju',
 'medium',
 '{"ko": "1일", "ja": "1日", "en": "1 day"}',
 '{"ko": "용이 깃든 마법 피리", "ja": "龍が宿る魔法の笛", "en": "The Magic Flute of the Dragon"}',
 '{"ko": "신라 문무왕과 김유신이 죽어서도 나라를 지키려 보냈다는 신비한 대나무 피리 이야기입니다. 이 피리를 불면 적군이 물러가고 가뭄에 비가 내렸다고 합니다.", "ja": "新羅の文武王と金庾信が死後も国を守ろうと送った神秘的な竹の笛の物語です。この笛を吹けば敵軍が退き、干ばつに雨が降ったと言われています。", "en": "A legendary bamboo flute sent by King Munmu and General Kim Yu-sin to protect the nation. It was said that blowing this flute would repel enemies and bring rain to droughts."}',
 '/images/courses/gyeongju-manpa-thumb.jpg',
 29000,
 39000,
 true,
 NOW()
),

-- 코스 7: 부산 황옥공주
('33333333-3333-3333-3333-000000000002',
 'mermaid',
 'busan',
 'easy',
 '{"ko": "반나절~1일", "ja": "半日〜1日", "en": "Half day to 1 day"}',
 '{"ko": "동백섬 인어공주", "ja": "冬柏島の人魚姫", "en": "The Mermaid of Dongbaek Island"}',
 '{"ko": "멀리 인도에서 시집온 황옥공주가 보름달 아래서 고향을 그리워하며 구슬을 바라보았다는 애틋한 인어 전설입니다.", "ja": "遠くインドから嫁いできた黄玉王女が、満月の下で故郷を懐かしみながら玉を眺めていたという切ない人魚の伝説です。", "en": "A poignant mermaid legend of Princess Hwangok, who traveled from India to marry and gazed at her bead under the full moon, longing for home."}',
 '/images/courses/busan-mermaids-thumb.jpg',
 29000,
 39000,
 true,
 NOW()
),

-- 코스 8: 서울 해치
('33333333-3333-3333-3333-000000000003',
 'haechi',
 'seoul',
 'easy',
 '{"ko": "1일", "ja": "1日", "en": "1 day"}',
 '{"ko": "불을 먹는 수호신", "ja": "火を食べる守護神", "en": "The Fire-Eating Guardian"}',
 '{"ko": "화재와 재앙을 막아주고 시비와 선악을 판단하는 상상의 동물 해치가 서울 도심 곳곳에 숨겨놓은 수호의 기운을 찾아 떠납니다.", "ja": "火災と災いを防ぎ、是非と善悪を判断する想像上の動物ヘチが、ソウル市内のあ치こちに隠した守護の気運を探しに出かけます。", "en": "Journey to find the protective energy hidden throughout Seoul by Haechi, the mythical creature that prevents fire and disaster."}',
 '/images/courses/seoul-haechi-thumb.jpg',
 29000,
 39000,
 true,
 NOW()
),

-- 코스 9: 제주 설문대할망
('33333333-3333-3333-3333-000000000004',
 'giant',
 'jeju',
 'medium',
 '{"ko": "1박 2일", "ja": "1泊2日", "en": "2 days"}',
 '{"ko": "제주를 빚은 거인", "ja": "済州を創った巨人", "en": "The Giant Who Shaped Jeju"}',
 '{"ko": "제주도 섬 자체를 만들었다는 거인 설문대할망이 육지와 연결하기 위해 다리를 놓으려던 미완의 전설과 그가 남긴 오름들을 탐험합니다.", "ja": "済州島そのものを創ったという巨人ソルムンデハルマンが、陸と繋ぐために橋を架けようとした未完の伝説と、彼女が残したオルム（寄生火山）を探検します。", "en": "Explore the unfinished legend of the giant Seolmundae Halmang, who created Jeju Island and tried to build a bridge to the mainland."}',
 '/images/courses/jeju-giant-thumb.jpg',
 29000,
 39000,
 true,
 NOW()
)

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active;


-- =============================================
-- 신규 미션 데이터 (26개 미션)
-- =============================================

INSERT INTO missions (id, course_id, sequence, type, title, description, hint_1, correct_answer, lp_reward, is_hidden, location_name, latitude, longitude)
VALUES

-- ── 경주 만파식적 (7 미션) ──
('33333333-2222-2222-2222-000000000601', '33333333-3333-3333-3333-000000000001', 1, 'quiz', '{"ko": "피리의 기원", "ja": "笛の起源", "en": "Origin of the Flute"}', '{"ko": "문무대왕릉이 보이는 곳에서 피리의 기원에 대한 퀴즈를 풀어보세요.", "ja": "文武大王陵が見える場所で笛の起源に関するクイズに挑戦しましょう。", "en": "Solve a quiz about the origin of the flute at a spot overlooking King Munmu''s Tomb."}', '{"ko": "바다의 용이 된 신라의 왕은?", "ja": "海の龍になった新羅の王は？", "en": "Which Silla king became a sea dragon?"}', '문무왕', 100, false, '{"ko": "문무대왕릉", "ja": "文武大王陵", "en": "King Munmu''s Tomb"}', 35.7381, 129.4891),
('33333333-2222-2222-2222-000000000602', '33333333-3333-3333-3333-000000000001', 2, 'photo', '{"ko": "이견대에서 바라본 바다", "ja": "利見台から見た海", "en": "Sea from Igyeondae"}', '{"ko": "이견대에 올라 대왕암을 배경으로 사진을 찍으세요.", "ja": "利見台に登り、大王岩を背景に写真を撮りましょう。", "en": "Climb Igyeondae and take a photo with Daewangam in the background."}', '{"ko": "언덕 위 정자에서 바다를 바라보세요", "ja": "丘の上の東屋から海を眺めてみましょう", "en": "Look at the sea from the pavilion on the hill"}', NULL, 150, false, '{"ko": "이견대", "ja": "利見台", "en": "Igyeondae Pavilion"}', 35.7410, 129.4870),
('33333333-2222-2222-2222-000000000603', '33333333-3333-3333-3333-000000000001', 3, 'quiz', '{"ko": "대나무의 신비", "ja": "竹の神秘", "en": "Mystery of the Bamboo"}', '{"ko": "감은사지 삼층석탑 앞에서 대나무의 비밀에 대한 퀴즈를 풀어보세요.", "ja": "感恩寺跡三層石塔の前で竹の秘密に関するクイズに挑戦しましょう。", "en": "Solve a quiz about the secret of the bamboo at the Gameunsaji Three-story Pagoda."}', '{"ko": "낮에는 둘이었다가 밤에는 하나가 된 것은?", "ja": "昼は二つで、夜は一つになったものは？", "en": "What was two in the day but became one at night?"}', '대나무', 100, false, '{"ko": "감은사지", "ja": "感恩寺跡", "en": "Gameunsaji Temple Site"}', 35.7412, 129.4795),
('33333333-2222-2222-2222-000000000604', '33333333-3333-3333-3333-000000000001', 4, 'photo', '{"ko": "용의 길을 따라", "ja": "龍の道をたどって", "en": "Following the Dragon''s Path"}', '{"ko": "기림사에서 용과 관련된 유물을 찾아 촬영하세요.", "ja": "祇林寺で龍に関連する遺物を見つけて撮影しましょう。", "en": "Find and photograph a dragon-related artifact at Girimsa Temple."}', '{"ko": "사찰 내부의 조각이나 벽화를 살펴보세요", "ja": "寺院内部の彫刻や壁画を見てみましょう", "en": "Examine the carvings or murals inside the temple"}', NULL, 150, false, '{"ko": "기림사", "ja": "祇林寺", "en": "Girimsa Temple"}', 35.8075, 129.3872),
('33333333-2222-2222-2222-000000000605', '33333333-3333-3333-3333-000000000001', 5, 'quiz', '{"ko": "피리의 이름", "ja": "笛の名前", "en": "Name of the Flute"}', '{"ko": "월정교에서 피리의 이름에 담긴 뜻을 맞추는 퀴즈를 풀어보세요.", "ja": "月精橋で笛の名前に込められた意味を当てるクイズに挑戦しましょう。", "en": "Solve a quiz about the meaning behind the flute''s name at Woljeonggyo Bridge."}', '{"ko": "만 개의 파도를 잠재우는 피리라는 뜻의 이름은?", "ja": "万の波を静める笛という意味の名前は？", "en": "Which name means the flute that calms ten thousand waves?"}', '만파식적', 100, false, '{"ko": "월정교", "ja": "月精橋", "en": "Woljeonggyo Bridge"}', 35.8300, 129.2185),
('33333333-2222-2222-2222-000000000606', '33333333-3333-3333-3333-000000000001', 6, 'photo', '{"ko": "천년 고도의 야경", "ja": "千年の古都の夜景", "en": "Night View of the Ancient City"}', '{"ko": "동궁과 월지에서 아름다운 야경을 배경으로 인증샷을 찍으세요.", "ja": "東宮と月池で美しい夜景を背景に記念撮影しましょう。", "en": "Take a photo with the beautiful night view at Donggung Palace and Wolji Pond."}', '{"ko": "안압지로 불리던 통일신라의 궁궐터입니다", "ja": "雁鴨池と呼ばれた統一新羅の宮殿跡です", "en": "This is a Unified Silla palace site formerly known as Anapji"}', NULL, 150, false, '{"ko": "동궁과 월지", "ja": "東宮と月池", "en": "Donggung Palace & Wolji Pond"}', 35.8342, 129.2265),
('33333333-2222-2222-2222-000000000607', '33333333-3333-3333-3333-000000000001', 7, 'boss', '{"ko": "태평성대를 향한 연주", "ja": "泰平の世への演奏", "en": "Performance for Prosperity"}', '{"ko": "대릉원에서 최종 보스 미션! 만파식전의 전설을 요약하고 교훈을 기록하세요.", "ja": "大陵苑で最終ボスミッション！萬波息笛の伝説を要約し、教訓を記録しましょう。", "en": "Final boss mission at Daereungwon! Summarize the Manpa-sikjeok legend and record its lesson."}', '{"ko": "나라가 평안해지기를 바라는 마음으로 작성하세요", "ja": "国が平和になることを願う気持ちで書きましょう", "en": "Write with a wish for the nation''s peace and prosperity"}', NULL, 300, false, '{"ko": "대릉원", "ja": "大陵苑", "en": "Daereungwon Royal Tombs"}', 35.8391, 129.2128),

-- ── 부산 황옥공주 (6 미션) ──
('33333333-2222-2222-2222-000000000701', '33333333-3333-3333-3333-000000000002', 1, 'quiz', '{"ko": "나랑국의 공주", "ja": "ナラン国の王女", "en": "Princess of Narang"}', '{"ko": "해운대 해수욕장에서 황옥공주의 고향에 대한 퀴즈를 풀어보세요.", "ja": "海雲台海水浴場で黄玉王女の故郷に関するクイズに挑戦しましょう。", "en": "Solve a quiz about Princess Hwangok''s homeland at Haeundae Beach."}', '{"ko": "공주가 온 먼 나라는?", "ja": "王女が来た遠い国は？", "en": "Which distant land did the princess come from?"}', '인도', 100, false, '{"ko": "해운대 해수욕장", "ja": "海雲台海水浴場", "en": "Haeundae Beach"}', 35.1587, 129.1603),
('33333333-2222-2222-2222-000000000702', '33333333-3333-3333-3333-000000000002', 2, 'photo', '{"ko": "인어상을 찾아서", "ja": "人魚像を探して", "en": "Searching for the Mermaid"}', '{"ko": "동백섬 해안산책로에 있는 황옥공주 인어상을 찾아 인증샷을 찍으세요.", "ja": "冬柏島の海岸散歩道にある黄玉王女の人魚像を見つけて記念撮影しましょう。", "en": "Find and photograph the Princess Hwangok mermaid statue on Dongbaek Island trail."}', '{"ko": "동백섬 끝자락 바위 위에 인어상이 있어요", "ja": "冬柏島の端の岩の上に人魚像があります", "en": "The mermaid statue sits on a rock at the edge of Dongbaek Island"}', NULL, 150, false, '{"ko": "황옥공주 인어상", "ja": "黄玉王女の人魚像", "en": "Princess Hwangok Mermaid Statue"}', 35.1542, 129.1555),
('33333333-2222-2222-2222-000000000703', '33333333-3333-3333-3333-000000000002', 3, 'quiz', '{"ko": "거북이의 비밀", "ja": "亀の秘密", "en": "Secret of the Turtle"}', '{"ko": "누리마루 APEC 하우스 근처에서 전설 속 조력자에 대한 퀴즈를 풀어보세요.", "ja": "ヌリマルAPECハウスの近くで伝説の協力者に関するクイズに挑戦しましょう。", "en": "Solve a quiz about the legendary helper near Nurimaru APEC House."}', '{"ko": "공주를 바다 너머로 데려다준 동물은?", "ja": "王女を海の外へ連れて行った動物は？", "en": "Which animal carried the princess across the sea?"}', '거북이', 100, false, '{"ko": "누리마루", "ja": "ヌリマル", "en": "Nurimaru APEC House"}', 35.1528, 129.1523),
('33333333-2222-2222-2222-000000000704', '33333333-3333-3333-3333-000000000002', 4, 'open', '{"ko": "고향을 그리는 마음", "ja": "故郷への想い", "en": "Longing for Home"}', '{"ko": "등대가 보이는 곳에서 황옥공주가 느꼈을 그리움을 짧은 기록으로 남겨보세요.", "ja": "灯台が見える場所で黄玉王女が感じたであろう慕情を短い記録として残しましょう。", "en": "Record a short note about the longing Princess Hwangok might have felt, near the lighthouse."}', '{"ko": "먼 타국에서 가족을 그리는 마음을 적어보세요", "ja": "遠い他国で家族を想う気持ちを書いてみましょう", "en": "Write about longing for family from a distant land"}', NULL, 200, false, '{"ko": "동백섬 등대", "ja": "冬柏島灯台", "en": "Dongbaek Island Lighthouse"}', 35.1535, 129.1530),
('33333333-2222-2222-2222-000000000705', '33333333-3333-3333-3333-000000000002', 5, 'photo', '{"ko": "미포항의 노을", "ja": "尾浦港の夕焼け", "en": "Sunset at Mipo Port"}', '{"ko": "미포항 철길 근처에서 바다를 배경으로 아름다운 노을을 촬영하세요.", "ja": "尾浦港の線路近くで海を背景に美しい夕焼けを撮影しましょう。", "en": "Photograph the sunset with the sea in the background near Mipo Port railway."}', '{"ko": "해운대 해수욕장 끝자락에 위치한 작은 항구입니다", "ja": "海雲台海水浴場の端に位置する小さな港です", "en": "A small port located at the end of Haeundae Beach"}', NULL, 150, false, '{"ko": "미포항", "ja": "尾浦港", "en": "Mipo Port"}', 35.1598, 129.1695),
('33333333-2222-2222-2222-000000000706', '33333333-3333-3333-3333-000000000002', 6, 'boss', '{"ko": "진실된 사랑과 그리움", "ja": "真実の愛と慕情", "en": "True Love and Longing"}', '{"ko": "청사포 다릿돌 전망대에서 최종 보스 미션! 인어 전설이 현대인에게 주는 의미를 기록하세요.", "ja": "青沙浦のタリットル展望台で最終ボスミッション！人魚の伝説が現代人に与える意味を記録しましょう。", "en": "Final boss mission at Cheongsapo Daritdol Observatory! Record what the mermaid legend means to us today."}', '{"ko": "사랑과 그리움의 가치에 대해 자유롭게 답변하세요", "ja": "愛と慕情の価値について自由に答えてください", "en": "Answer freely about the value of love and longing"}', NULL, 300, false, '{"ko": "청사포 전망대", "ja": "青沙浦展望台", "en": "Cheongsapo Observatory"}', 35.1610, 129.1915),

-- ── 서울 해치 (7 미션) ──
('33333333-2222-2222-2222-000000000801', '33333333-3333-3333-3333-000000000003', 1, 'quiz', '{"ko": "궁궐의 수호자", "ja": "宮殿の守護者", "en": "Guardian of the Palace"}', '{"ko": "광화문 해치상 앞에서 해치의 역할에 대한 퀴즈를 풀어보세요.", "ja": "光化門のヘチ像の前でヘチの役割に関するクイズに挑戦しましょう。", "en": "Solve a quiz about Haechi''s role in front of the Gwanghwamun Haechi statue."}', '{"ko": "해치가 막아준다고 믿었던 것은?", "ja": "ヘチが防いでくれると信じられていたものは？", "en": "What was Haechi believed to prevent?"}', '화재', 100, false, '{"ko": "광화문 해치상", "ja": "光化門ヘ치像", "en": "Gwanghwamun Haechi Statue"}', 37.5759, 126.9768),
('33333333-2222-2222-2222-000000000802', '33333333-3333-3333-3333-000000000003', 2, 'photo', '{"ko": "수호신 해치 찾기", "ja": "守護神ヘチ探し", "en": "Finding Guardian Haechi"}', '{"ko": "경복궁 내부에 있는 해치 조각을 찾아 인증샷을 찍으세요.", "ja": "景福宮の内部にあるヘチの彫刻を見つけて記念撮影しましょう。", "en": "Find and photograph a Haechi carving inside Gyeongbokgung Palace."}', '{"ko": "다리의 난간이나 계단 주변을 살펴보세요", "ja": "橋の欄干や階段の周辺を見てみましょう", "en": "Look around bridge railings or stairs"}', NULL, 150, false, '{"ko": "경복궁 근정전", "ja": "景福宮勤政殿", "en": "Gyeongbokgung Geunjeongjeon"}', 37.5786, 126.9772),
('33333333-2222-2222-2222-000000000803', '33333333-3333-3333-3333-000000000003', 3, 'quiz', '{"ko": "선과 악의 판단", "ja": "善悪の判断", "en": "Judging Good and Evil"}', '{"ko": "서울역사박물관 마당에서 해치의 상징인 뿔에 대한 퀴즈를 풀어보세요.", "ja": "ソウル歴史博物館の中庭でヘチの象徴である角に関するクイズに挑戦しましょう。", "en": "Solve a quiz about Haechi''s horn symbol at Seoul Museum of History yard."}', '{"ko": "상상의 동물 해치는 머리에 무엇이 관찰될까요?", "ja": "想像上の動物ヘチの頭には何が見られるでしょうか？", "en": "What part is observed on the head of the mythical creature Haechi?"}', '뿔', 100, false, '{"ko": "서울역사박물관", "ja": "ソウル歴史博物館", "en": "Seoul Museum of History"}', 37.5707, 126.9708),
('33333333-2222-2222-2222-000000000804', '33333333-3333-3333-3333-000000000003', 4, 'photo', '{"ko": "과거와 현재의 공존", "ja": "過去と現代の共存", "en": "Coexistence of Past and Present"}', '{"ko": "북촌 한옥마을의 전통 가옥과 현대적 도심이 어우러진 풍경을 촬영하세요.", "ja": "北村韓屋村の伝統家屋と現代的な都心が融合した風景を撮影しましょう。", "en": "Photograph the scenery blending traditional houses and modern city at Bukchon Hanok Village."}', '{"ko": "골목길 가장 높은 곳으로 올라가보세요", "ja": "路地の最も高い場所へ登ってみましょう", "en": "Go to the highest point of the alleyway"}', NULL, 150, false, '{"ko": "북촌 한옥마을", "ja": "北村韓屋村", "en": "Bukchon Hanok Village"}', 37.5826, 126.9836),
('33333333-2222-2222-2222-000000000805', '33333333-3333-3333-3333-000000000003', 5, 'quiz', '{"ko": "서울의 상징", "ja": "ソウルの象徴", "en": "Symbol of Seoul"}', '{"ko": "DDP(동대문 디자인 플라자)에서 현대적으로 재해석된 해치에 대한 퀴즈를 풀어보세요.", "ja": "DDP（東大門デザインプラザ）で現代的に再解釈されたヘチに関するクイズに挑戦しましょう。", "en": "Solve a quiz about modern Haechi interpretations at DDP."}', '{"ko": "서울시의 공식 캐릭터 이름은?", "ja": "ソウル市の公式キャラクターの名前は？", "en": "What is the name of Seoul''s official character?"}', '해치', 100, false, '{"ko": "동대문 디자인 플라자", "ja": "東大門デザインプラザ", "en": "Dongdaemun Design Plaza"}', 37.5665, 127.0092),
('33333333-2222-2222-2222-000000000806', '33333333-3333-3333-3333-000000000003', 6, 'photo', '{"ko": "성벽 너머 서울", "ja": "城壁の向こうのソウル", "en": "Seoul Beyond the Walls"}', '{"ko": "낙산공원 한양도성 성벽을 배경으로 서울의 도심 전경을 인증샷으로 찍으세요.", "ja": "駱山公園の漢陽都城の城壁を背景にソウルの都心の全景を記念撮影しましょう。", "en": "Take a photo of Seoul''s skyline with Hanyangdoseong fortress walls at Naksan Park."}', '{"ko": "야경이 특히 아름다운 곳입니다", "ja": "夜景が特に美しい場所です", "en": "This spot is especially beautiful for night views"}', NULL, 150, false, '{"ko": "낙산공원", "ja": "駱山公園", "en": "Naksan Park"}', 37.5807, 127.0064),
('33333333-2222-2222-2222-000000000807', '33333333-3333-3333-3333-000000000003', 7, 'boss', '{"ko": "도시의 안녕을 지키는 힘", "ja": "都市の安泰を守る力", "en": "Power to Guard the City"}', '{"ko": "세종대로 해치마당에서 최종 보스 미션! 서울의 역사와 해치의 연관성을 기록하세요.", "ja": "世宗通りヘチ広場で最終ボスミッション！ソウルの歴史とヘチの関連性を記録しましょう。", "en": "Final boss mission at Haechi Madang! Record the connection between Seoul''s history and Haechi."}', '{"ko": "서울을 지키는 수호신으로서의 해치를 떠올려보세요", "ja": "ソウルを守る守護神としてのヘチを思い出しましょう", "en": "Think of Haechi as the guardian shielding Seoul"}', NULL, 300, false, '{"ko": "해치마당", "ja": "ヘチ広場", "en": "Haechi Madang"}', 37.5721, 126.9768),

-- ── 제주 설문대할망 (6 미션) ──
('33333333-2222-2222-2222-000000000901', '33333333-3333-3333-3333-000000000004', 1, 'quiz', '{"ko": "창조의 거인", "ja": "創造の巨人", "en": "Giant of Creation"}', '{"ko": "제주 돌문화공원에서 설문대할망 신화에 대한 첫 번째 퀴즈를 풀어보세요.", "ja": "済州石文化公園でソルムンデハルマン神話に関する最初のクイズに挑戦しましょう。", "en": "Solve the first quiz about the Seolmundae Halmang myth at Jeju Stone Park."}', '{"ko": "제주도 섬을 만들었다고 전해지는 거인신은?", "ja": "済州島を創ったと言い伝えられる巨神は？", "en": "Which giant god is said to have created Jeju Island?"}', '설문대할망', 100, false, '{"ko": "제주 돌문화공원", "ja": "済州石文化公園", "en": "Jeju Stone Park"}', 33.4398, 126.6667),
('33333333-2222-2222-2222-000000000902', '33333333-3333-3333-3333-000000000004', 2, 'photo', '{"ko": "거인의 유물을 찾아", "ja": "巨人の遺物を探して", "en": "Searching for Giant Artifacts"}', '{"ko": "설문대할망 조각상이나 관련 돌 전시물 앞에서 인증샷을 찍으세요.", "ja": "ソルムンデハルマン像や関連する石の展示物の前で記念撮影しましょう。", "en": "Take a photo in front of the Seolmundae Halmang statue or related stone exhibits."}', '{"ko": "야외 전시장의 거대한 돌 조각을 찾아보세요", "ja": "屋外展示場の巨大な石の彫刻を探してみましょう", "en": "Look for the large stone sculptures in the outdoor exhibition area"}', NULL, 150, false, '{"ko": "설문대할망 조각상", "ja": "ソルムンデハルマン像", "en": "Seolmundae Halmang Statue"}', 33.4412, 126.6655),
('33333333-2222-2222-2222-000000000903', '33333333-3333-3333-3333-000000000004', 3, 'quiz', '{"ko": "미완의 다리", "ja": "未完の橋", "en": "The Unfinished Bridge"}', '{"ko": "성산 일출봉 근처에서 설문대할망의 다리 놓기 시도에 대한 퀴즈를 풀어보세요.", "ja": "城山日出峰の近くでソルムンデハルマンの橋架けの試みに関するクイズに挑戦しましょう。", "en": "Solve a quiz about the bridge-building attempt near Seongsan Ilchulbong."}', '{"ko": "할망이 육지로 다리를 놓기 위해 바다에 부은 흙은?", "ja": "ハルマンが陸に橋を架けるために海に注いだ土は？", "en": "What amount of soil did Halmang pour into the sea to build a bridge?"}', '아흔아홉 바구니', 100, false, '{"ko": "성산 일출봉", "ja": "城山日出峰", "en": "Seongsan Ilchulbong"}', 33.4582, 126.9426),
('33333333-2222-2222-2222-000000000904', '33333333-3333-3333-3333-000000000004', 4, 'photo', '{"ko": "성산 해안의 비경", "ja": "城山海岸の秘境", "en": "Secret Scenery of Seongsan Coast"}', '{"ko": "성산 일출봉을 배경으로 해안가에서 멋진 풍경 사진을 남기세요.", "ja": "城山日出峰を背景に海岸沿いで素晴らしい風景写真を残しましょう。", "en": "Take a scenic photo at the coast with Seongsan Ilchulbong in the background."}', '{"ko": "바닷물과 어우러진 일출봉의 모습을 담아보세요", "ja": "海水と調和した日出峰の姿を写してみましょう", "en": "Capture Ilchulbong in harmony with the sea water"}', NULL, 150, false, '{"ko": "성산 연안", "ja": "城山沿岸", "en": "Seongsan Coast"}', 33.4550, 126.9380),
('33333333-2222-2222-2222-000000000905', '33333333-3333-3333-3333-000000000004', 5, 'quiz', '{"ko": "할망의 부엌", "ja": "ハルマンの台所", "en": "Halmang''s Kitchen"}', '{"ko": "만장굴 입구에서 할망이 요리했다는 전설이 깃든 장소에 대한 퀴즈를 풀어보세요.", "ja": "万丈窟の入口で、ハルマンが料理したという伝説が残る場所に関するクイズに挑戦しましょう。", "en": "Solve a quiz at Manjanggul Entrance about the place where legend says Halmang cooked."}', '{"ko": "화산 활동으로 만들어진 제주의 신비로운 동굴은?", "ja": "火山活動で造られた済州の神秘的な洞窟は？", "en": "What mysterious Jeju cave was formed by volcanic activity?"}', '만장굴', 100, false, '{"ko": "만장굴 입구", "ja": "万丈窟入口", "en": "Manjanggul Cave Entrance"}', 33.5283, 126.7715),
('33333333-2222-2222-2222-000000000906', '33333333-3333-3333-3333-000000000004', 6, 'boss', '{"ko": "자연을 빚은 거대한 어머니", "ja": "自然を創った巨大な母", "en": "The Great Mother Who Shaped Nature"}', '{"ko": "사려니숲길 입구에서 최종 보스 미션! 설문대할망 신화가 제주 자연을 사랑하게 만드는 이유를 기록하세요.", "ja": "サリョニ森の道入口で最終ボスミッション！ソルムンデハルマン神話が済州の自然を愛するようにさせる理由を記録しましょう。", "en": "Final boss mission at Saryeoni Forest Path! Record how the Seolmundae Halmang myth inspires love for Jeju''s nature."}', '{"ko": "거인의 손길이 닿은 숲의 기운을 느끼며 작성하세요", "ja": "巨人の手が触れた森の気配を感じながら書きましょう", "en": "Write while feeling the forest energy touched by the giant"}', NULL, 300, false, '{"ko": "사려니숲길", "ja": "サリョニ森の道", "en": "Saryeoni Forest Path"}', 33.4072, 126.6572)

ON CONFLICT (id) DO NOTHING;
