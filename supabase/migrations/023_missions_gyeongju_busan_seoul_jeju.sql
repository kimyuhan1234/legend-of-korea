-- ============================================================
-- Legend of Korea — Mission Seed Data (4 Cities)
-- 023_missions_gyeongju_busan_seoul_jeju.sql
-- 경주(seq 3~8) / 부산(seq 2~8) / 서울(seq 2~8) / 제주(seq 2~8)
-- ============================================================

INSERT INTO public.missions (
  course_id, sequence, type, title, description,
  hint_1, hint_2, correct_answer,
  lp_reward, is_hidden,
  location_name, latitude, longitude, qr_code
) VALUES

-- ================================================
-- 경주 (33333333-3333-3333-3333-000000000001) — seq 3~8
-- 코스: 용이 깃든 마법 피리 (만파식적)
-- ================================================

-- seq 3: 첨성대 퀴즈
(
  '33333333-3333-3333-3333-000000000001', 3, 'quiz',
  '{"ko":"별을 세는 탑","en":"The Star-Counting Tower","ja":"星を数える塔"}',
  '{"ko":"첨성대를 쌓은 돌의 개수는 약 몇 개일까요?","en":"How many stones were used to build Cheomseongdae?","ja":"瞻星台を積んだ石の数は約何個でしょう？"}',
  '{"ko":"27단으로 쌓여 있어요","en":"It has 27 layers","ja":"27段で積まれています"}',
  '{"ko":"1년의 날수와 관련이 있어요","en":"It relates to the number of days in a year","ja":"1年の日数と関係があります"}',
  '365',
  100, false,
  '{"ko":"첨성대","en":"Cheomseongdae","ja":"瞻星台"}',
  35.83460000, 129.21900000, 'GYE003'
),

-- seq 4: 대릉원 사진
(
  '33333333-3333-3333-3333-000000000001', 4, 'photo',
  '{"ko":"천년의 잠","en":"A Thousand Years of Sleep","ja":"千年の眠り"}',
  '{"ko":"대릉원에서 가장 유명한 포토존을 찾아 사진을 찍으세요. 고분 사이 목련 나무가 힌트입니다!","en":"Find the most famous photo spot in Daereungwon. The magnolia tree between the tombs is your hint!","ja":"大陵苑で最も有名なフォトスポットを見つけて写真を撮ってください。古墳の間のモクレンの木がヒントです！"}',
  '{"ko":"천마총 근처를 걸어보세요","en":"Walk near Cheonmachong","ja":"天馬塚の近くを歩いてみてください"}',
  NULL,
  NULL,
  100, false,
  '{"ko":"대릉원","en":"Daereungwon","ja":"大陵苑"}',
  35.83550000, 129.21180000, 'GYE004'
),

-- seq 5: 동궁과 월지 오픈
(
  '33333333-3333-3333-3333-000000000001', 5, 'open',
  '{"ko":"달빛 연못의 비밀","en":"Secret of the Moonlit Pond","ja":"月光の池の秘密"}',
  '{"ko":"동궁과 월지의 야경을 감상하고, 이곳에서 어떤 행사가 열렸는지 상상하여 적어보세요.","en":"Enjoy the night view of Donggung and Wolji, and write what events you imagine were held here.","ja":"東宮と月池の夜景を鑑賞し、ここでどんな行事が開かれたか想像して書いてみてください。"}',
  '{"ko":"신라 왕자가 살던 곳이에요","en":"Silla princes lived here","ja":"新羅の王子が住んでいた場所です"}',
  NULL,
  NULL,
  100, false,
  '{"ko":"동궁과 월지","en":"Donggung and Wolji","ja":"東宮と月池"}',
  35.83110000, 129.22640000, 'GYE005'
),

-- seq 6: 황리단길 사진
(
  '33333333-3333-3333-3333-000000000001', 6, 'photo',
  '{"ko":"옛 거리의 새 얼굴","en":"New Face of the Old Street","ja":"古い通りの新しい顔"}',
  '{"ko":"황리단길에서 가장 한국적이라고 느끼는 가게나 카페를 찾아 사진을 찍고 이유를 적어보세요.","en":"Find the most Korean-feeling shop or cafe on Hwangridangil and take a photo with your reason.","ja":"皇理団キルで最も韓国的だと感じるお店やカフェを見つけて写真を撮り、理由を書いてください。"}',
  '{"ko":"한옥을 개조한 카페가 많아요","en":"Many cafes are renovated hanok houses","ja":"韓屋をリノベーションしたカフェが多いです"}',
  NULL,
  NULL,
  100, false,
  '{"ko":"황리단길","en":"Hwangridangil","ja":"皇理団キル"}',
  35.83400000, 129.21000000, 'GYE006'
),

-- seq 7: 불국사 보스
(
  '33333333-3333-3333-3333-000000000001', 7, 'boss',
  '{"ko":"만파식적의 울림","en":"Echo of Manpasikjeok","ja":"万波息笛の響き"}',
  '{"ko":"불국사에서 석가탑과 다보탑을 모두 찾아 각각 사진을 찍고, 두 탑의 차이점을 3가지 적어보세요.","en":"Find both Seokgatap and Dabotap at Bulguksa, take photos of each, and write 3 differences.","ja":"仏国寺で釈迦塔と多宝塔を両方見つけてそれぞれ写真を撮り、二つの塔の違いを3つ書いてください。"}',
  '{"ko":"하나는 단순하고 하나는 화려해요","en":"One is simple, one is ornate","ja":"一つはシンプルで、一つは華やかです"}',
  '{"ko":"대웅전 앞에 나란히 서 있어요","en":"They stand side by side in front of Daeungjeon","ja":"大雄殿の前に並んで立っています"}',
  NULL,
  300, false,
  '{"ko":"불국사","en":"Bulguksa","ja":"仏国寺"}',
  35.79000000, 129.33220000, 'GYE007'
),

-- seq 8: 월정교 히든
(
  '33333333-3333-3333-3333-000000000001', 8, 'hidden',
  '{"ko":"달빛 다리의 수호자","en":"Guardian of the Moonlight Bridge","ja":"月光の橋の守護者"}',
  '{"ko":"월정교 2층에 올라가 야경 사진을 찍으세요. 다리 위에서 보이는 것을 모두 적어보세요.","en":"Go up to the 2nd floor of Woljeongyo and take a night photo. Write everything you can see from the bridge.","ja":"月精橋の2階に上がって夜景写真を撮ってください。橋の上から見えるものを全て書いてください。"}',
  '{"ko":"해가 진 후에 가야 해요","en":"You need to go after sunset","ja":"日が沈んでから行く必要があります"}',
  NULL,
  NULL,
  500, true,
  '{"ko":"월정교","en":"Woljeongyo Bridge","ja":"月精橋"}',
  35.82820000, 129.22220000, 'GYE008'
),

-- ================================================
-- 부산 (33333333-3333-3333-3333-000000000002) — seq 2~8
-- 코스: 동백섬 인어공주
-- ================================================

-- seq 2: 해운대 퀴즈
(
  '33333333-3333-3333-3333-000000000002', 2, 'quiz',
  '{"ko":"모래 위의 전설","en":"Legend on the Sand","ja":"砂の上の伝説"}',
  '{"ko":"해운대라는 이름은 어떤 인물의 이름에서 유래했을까요?","en":"Whose name is Haeundae named after?","ja":"海雲台という名前は誰の名前に由来しているでしょう？"}',
  '{"ko":"신라 시대 학자예요","en":"A Silla dynasty scholar","ja":"新羅時代の学者です"}',
  '{"ko":"최씨 성을 가진 사람이에요","en":"His surname is Choi","ja":"崔という姓の人です"}',
  '최치원',
  100, false,
  '{"ko":"해운대 해수욕장","en":"Haeundae Beach","ja":"海雲台ビーチ"}',
  35.15870000, 129.16040000, 'BUS002'
),

-- seq 3: 감천문화마을 사진
(
  '33333333-3333-3333-3333-000000000002', 3, 'photo',
  '{"ko":"알록달록 언덕 마을","en":"Colorful Hillside Village","ja":"カラフルな丘の村"}',
  '{"ko":"감천문화마을에서 어린왕자 동상을 찾아 함께 사진을 찍으세요!","en":"Find the Little Prince statue in Gamcheon Culture Village and take a photo with it!","ja":"甘川文化村で星の王子さまの像を見つけて一緒に写真を撮ってください！"}',
  '{"ko":"마을 입구에서 계단을 따라 올라가세요","en":"Follow the stairs from the village entrance","ja":"村の入口から階段を上ってください"}',
  NULL,
  NULL,
  100, false,
  '{"ko":"감천문화마을","en":"Gamcheon Culture Village","ja":"甘川文化村"}',
  35.09750000, 129.01080000, 'BUS003'
),

-- seq 4: 자갈치시장 오픈
(
  '33333333-3333-3333-3333-000000000002', 4, 'open',
  '{"ko":"바다의 보물 찾기","en":"Treasures of the Sea","ja":"海の宝物探し"}',
  '{"ko":"자갈치시장에서 가장 신기한 해산물을 찾아 사진을 찍고, 이름과 맛을 상상하여 적어보세요.","en":"Find the most unusual seafood at Jagalchi Market, take a photo, and write its name and imagined taste.","ja":"チャガルチ市場で最も珍しい海産物を見つけて写真を撮り、名前と味を想像して書いてください。"}',
  '{"ko":"1층 실내 시장을 구석구석 돌아보세요","en":"Explore every corner of the 1st floor indoor market","ja":"1階の室内市場を隅々まで回ってください"}',
  NULL,
  NULL,
  100, false,
  '{"ko":"자갈치시장","en":"Jagalchi Market","ja":"チャガルチ市場"}',
  35.09690000, 129.03060000, 'BUS004'
),

-- seq 5: 태종대 퀴즈
(
  '33333333-3333-3333-3333-000000000002', 5, 'quiz',
  '{"ko":"절벽 끝의 등대","en":"Lighthouse at the Cliff Edge","ja":"崖の端の灯台"}',
  '{"ko":"태종대의 이름은 어떤 왕이 이곳의 경치에 반해 활을 쏘았다는 전설에서 유래했을까요?","en":"Which king was so impressed by Taejongdae that he shot arrows here, giving it its name?","ja":"太宗台の名前は、どの王がここの景色に魅せられて弓を射ったという伝説に由来するでしょう？"}',
  '{"ko":"신라가 아닌 다른 나라 왕이에요","en":"Not a Silla king","ja":"新羅ではない別の国の王です"}',
  '{"ko":"태종이라는 이름이 힌트예요","en":"The name Taejong is your hint","ja":"太宗という名前がヒントです"}',
  '태종무열왕',
  100, false,
  '{"ko":"태종대","en":"Taejongdae","ja":"太宗台"}',
  35.05170000, 129.08470000, 'BUS005'
),

-- seq 6: 광안대교 사진
(
  '33333333-3333-3333-3333-000000000002', 6, 'photo',
  '{"ko":"빛나는 바다 다리","en":"The Glowing Sea Bridge","ja":"輝く海の橋"}',
  '{"ko":"광안리 해수욕장에서 광안대교 야경 사진을 찍으세요. 가장 아름다운 각도를 찾아보세요!","en":"Take a night photo of Gwangandaegyo from Gwangalli Beach. Find the most beautiful angle!","ja":"広安里ビーチから広安大橋の夜景写真を撮ってください。最も美しい角度を見つけてください！"}',
  '{"ko":"해가 진 직후가 가장 예뻐요","en":"Right after sunset is the most beautiful","ja":"日が沈んだ直後が最も綺麗です"}',
  NULL,
  NULL,
  100, false,
  '{"ko":"광안리 해수욕장","en":"Gwangalli Beach","ja":"広安里ビーチ"}',
  35.15310000, 129.11860000, 'BUS006'
),

-- seq 7: 해동용궁사 보스
(
  '33333333-3333-3333-3333-000000000002', 7, 'boss',
  '{"ko":"용궁의 문을 열어라","en":"Open the Dragon Palace Gate","ja":"竜宮の門を開けよ"}',
  '{"ko":"해동용궁사에서 12지신상을 모두 찾아 각각의 동물 이름을 적어보세요. 바다가 보이는 곳에서 소원도 빌어보세요!","en":"Find all 12 zodiac statues at Haedong Yonggungsa and write each animal name. Make a wish where you can see the ocean!","ja":"海東龍宮寺で十二支像を全て見つけてそれぞれの動物の名前を書いてください。海が見える場所で願い事もしてみてください！"}',
  '{"ko":"108 계단을 내려가야 해요","en":"You need to go down 108 stairs","ja":"108段の階段を下りる必要があります"}',
  '{"ko":"절 입구부터 차근차근 찾아보세요","en":"Look carefully from the temple entrance","ja":"お寺の入口からゆっくり探してください"}',
  NULL,
  300, false,
  '{"ko":"해동용궁사","en":"Haedong Yonggungsa","ja":"海東龍宮寺"}',
  35.18840000, 129.22330000, 'BUS007'
),

-- seq 8: 흰여울문화마을 히든
(
  '33333333-3333-3333-3333-000000000002', 8, 'hidden',
  '{"ko":"인어의 숨겨진 마을","en":"The Mermaid Hidden Village","ja":"人魚の隠れ里"}',
  '{"ko":"흰여울문화마을의 절영해안산책로를 걸으며 바다와 마을이 함께 보이는 사진을 찍으세요.","en":"Walk the Jeolyeong Coastal Trail in Huinnyeoul Culture Village and take a photo showing both the sea and the village.","ja":"ヒニョウル文化村の絶影海岸散歩路を歩きながら海と村が一緒に見える写真を撮ってください。"}',
  '{"ko":"영도에 있어요","en":"It is in Yeongdo","ja":"影島にあります"}',
  NULL,
  NULL,
  500, true,
  '{"ko":"흰여울문화마을","en":"Huinnyeoul Culture Village","ja":"ヒニョウル文化村"}',
  35.07860000, 129.05020000, 'BUS008'
),

-- ================================================
-- 서울 (33333333-3333-3333-3333-000000000003) — seq 2~8
-- 코스: 불을 먹는 수호신
-- ================================================

-- seq 2: 경복궁 퀴즈
(
  '33333333-3333-3333-3333-000000000003', 2, 'quiz',
  '{"ko":"궁궐의 수호자","en":"Guardian of the Palace","ja":"宮殿の守護者"}',
  '{"ko":"경복궁 근정전 앞에 있는 동물 석상의 이름은 무엇일까요? 화재를 막아준다는 전설이 있어요.","en":"What is the name of the animal statues in front of Geunjeongjeon at Gyeongbokgung? Legend says they prevent fire.","ja":"景福宮の勤政殿前にある動物の石像の名前は何でしょう？火災を防ぐという伝説があります。"}',
  '{"ko":"상상 속의 동물이에요","en":"They are mythical creatures","ja":"想像上の動物です"}',
  '{"ko":"서울시 마스코트이기도 해요","en":"It is also the mascot of Seoul","ja":"ソウル市のマスコットでもあります"}',
  '해치',
  100, false,
  '{"ko":"경복궁","en":"Gyeongbokgung Palace","ja":"景福宮"}',
  37.57960000, 126.97700000, 'SEO002'
),

-- seq 3: 북촌한옥마을 사진
(
  '33333333-3333-3333-3333-000000000003', 3, 'photo',
  '{"ko":"지붕 위의 하늘","en":"Sky Above the Rooftops","ja":"屋根の上の空"}',
  '{"ko":"북촌한옥마을에서 한옥 지붕이 겹겹이 보이는 골목을 찾아 사진을 찍으세요!","en":"Find an alley in Bukchon Hanok Village where you can see layers of hanok rooftops and take a photo!","ja":"北村韓屋村で韓屋の屋根が重なって見える路地を見つけて写真を撮ってください！"}',
  '{"ko":"가회동 길에서 찾아보세요","en":"Look around Gahoe-dong streets","ja":"嘉会洞の道で探してみてください"}',
  NULL,
  NULL,
  100, false,
  '{"ko":"북촌한옥마을","en":"Bukchon Hanok Village","ja":"北村韓屋村"}',
  37.58260000, 126.98500000, 'SEO003'
),

-- seq 4: 남산타워 오픈
(
  '33333333-3333-3333-3333-000000000003', 4, 'open',
  '{"ko":"도시의 봉화","en":"Beacon of the City","ja":"都市の烽火"}',
  '{"ko":"N서울타워에서 서울 시내를 내려다보며, 옛날 봉화를 올리던 이유를 상상하여 적어보세요.","en":"Look down at Seoul from N Seoul Tower and imagine why beacons were lit here in ancient times.","ja":"Nソウルタワーからソウル市内を見下ろし、昔、烽火が上げられた理由を想像して書いてください。"}',
  '{"ko":"적의 침입을 알리기 위한 것이었어요","en":"It was to warn of enemy invasion","ja":"敵の侵入を知らせるためでした"}',
  NULL,
  NULL,
  100, false,
  '{"ko":"N서울타워","en":"N Seoul Tower","ja":"Nソウルタワー"}',
  37.55120000, 126.98820000, 'SEO004'
),

-- seq 5: 광장시장 사진
(
  '33333333-3333-3333-3333-000000000003', 5, 'photo',
  '{"ko":"시장의 맛","en":"Flavors of the Market","ja":"市場の味"}',
  '{"ko":"광장시장에서 빈대떡이나 마약김밥을 먹고 인증 사진을 찍으세요!","en":"Try bindaetteok or mayak gimbap at Gwangjang Market and take a food photo!","ja":"広蔵市場でビンデトッやマヤクキムパプを食べて認証写真を撮ってください！"}',
  '{"ko":"2층 빈대떡 골목이 유명해요","en":"The 2nd floor bindaetteok alley is famous","ja":"2階のビンデトッ路地が有名です"}',
  NULL,
  NULL,
  100, false,
  '{"ko":"광장시장","en":"Gwangjang Market","ja":"広蔵市場"}',
  37.57000000, 126.99980000, 'SEO005'
),

-- seq 6: 창덕궁 퀴즈
(
  '33333333-3333-3333-3333-000000000003', 6, 'quiz',
  '{"ko":"비밀의 정원","en":"The Secret Garden","ja":"秘密の庭園"}',
  '{"ko":"창덕궁 후원은 조선 왕실의 비밀 정원이었습니다. 후원의 연못 이름은 무엇일까요?","en":"Changdeokgung Huwon was the secret garden of Joseon royalty. What is the name of the pond?","ja":"昌徳宮の後苑は朝鮮王室の秘密の庭園でした。後苑の池の名前は何でしょう？"}',
  '{"ko":"부와 관련된 한자가 포함되어 있어요","en":"It contains a Chinese character related to wealth","ja":"富に関連する漢字が含まれています"}',
  '{"ko":"연꽃이 가득 피는 연못이에요","en":"It is a pond full of lotus flowers","ja":"蓮の花が咲き乱れる池です"}',
  '부용지',
  100, false,
  '{"ko":"창덕궁","en":"Changdeokgung Palace","ja":"昌徳宮"}',
  37.57940000, 126.99100000, 'SEO006'
),

-- seq 7: 국립중앙박물관 보스
(
  '33333333-3333-3333-3333-000000000003', 7, 'boss',
  '{"ko":"수호신의 시험","en":"Trial of the Guardian Spirit","ja":"守護神の試練"}',
  '{"ko":"국립중앙박물관에서 고려청자와 조선백자를 각각 찾아 사진을 찍고, 색상과 모양의 차이점을 3가지 적어보세요.","en":"Find Goryeo celadon and Joseon white porcelain at the National Museum of Korea, take photos, and write 3 differences.","ja":"国立中央博物館で高麗青磁と朝鮮白磁をそれぞれ見つけて写真を撮り、色と形の違いを3つ書いてください。"}',
  '{"ko":"도자기 전시실을 찾으세요","en":"Find the ceramic exhibition hall","ja":"陶磁器展示室を見つけてください"}',
  '{"ko":"색이 완전히 다른 두 종류예요","en":"They are two types with completely different colors","ja":"色が全く異なる2種類です"}',
  NULL,
  300, false,
  '{"ko":"국립중앙박물관","en":"National Museum of Korea","ja":"国立中央博物館"}',
  37.52390000, 126.98070000, 'SEO007'
),

-- seq 8: 인사동 쌈지길 히든
(
  '33333333-3333-3333-3333-000000000003', 8, 'hidden',
  '{"ko":"글자의 수호자","en":"Guardian of Letters","ja":"文字の守護者"}',
  '{"ko":"인사동 쌈지길에서 한글로 된 가장 재미있는 기념품을 찾아 사진을 찍고, 왜 골랐는지 적어보세요.","en":"Find the funniest Hangul souvenir at Ssamziegil in Insadong, take a photo, and write why you chose it.","ja":"仁寺洞サムジキルでハングルの最も面白いお土産を見つけて写真を撮り、なぜ選んだか書いてください。"}',
  '{"ko":"나선형 계단을 따라 올라가보세요","en":"Follow the spiral staircase up","ja":"らせん階段を上ってみてください"}',
  NULL,
  NULL,
  500, true,
  '{"ko":"인사동 쌈지길","en":"Ssamziegil, Insadong","ja":"仁寺洞サムジキル"}',
  37.57360000, 126.98560000, 'SEO008'
),

-- ================================================
-- 제주 (33333333-3333-3333-3333-000000000004) — seq 2~8
-- 코스: 제주를 빚은 거인 (설문대할망)
-- ================================================

-- seq 2: 성산일출봉 퀴즈
(
  '33333333-3333-3333-3333-000000000004', 2, 'quiz',
  '{"ko":"거인이 만든 봉우리","en":"The Peak Made by a Giant","ja":"巨人が作った峰"}',
  '{"ko":"성산일출봉은 어떻게 만들어졌을까요? 지질학적 원인을 맞혀보세요.","en":"How was Seongsan Ilchulbong formed? Guess the geological cause.","ja":"城山日出峰はどのようにできたでしょう？地質学的な原因を当ててみてください。"}',
  '{"ko":"바다 속에서 일어난 일이에요","en":"It happened under the sea","ja":"海の中で起きたことです"}',
  '{"ko":"뜨거운 것이 분출했어요","en":"Something hot erupted","ja":"熱いものが噴出しました"}',
  '해저 화산 폭발',
  100, false,
  '{"ko":"성산일출봉","en":"Seongsan Ilchulbong","ja":"城山日出峰"}',
  33.45900000, 126.94250000, 'JEJ002'
),

-- seq 3: 만장굴 사진
(
  '33333333-3333-3333-3333-000000000004', 3, 'photo',
  '{"ko":"거인의 숨은 길","en":"The Giant Hidden Path","ja":"巨人の隠れ道"}',
  '{"ko":"만장굴 내부에서 용암 석주를 찾아 사진을 찍으세요. 세계에서 가장 큰 용암 석주입니다!","en":"Find the lava column inside Manjanggul and take a photo. It is the world largest lava column!","ja":"万丈窟内部で溶岩石柱を見つけて写真を撮ってください。世界最大の溶岩石柱です！"}',
  '{"ko":"동굴 끝까지 걸어가야 해요","en":"You need to walk to the end of the cave","ja":"洞窟の終わりまで歩く必要があります"}',
  NULL,
  NULL,
  100, false,
  '{"ko":"만장굴","en":"Manjanggul Cave","ja":"万丈窟"}',
  33.52830000, 126.77130000, 'JEJ003'
),

-- seq 4: 제주 올레길 오픈
(
  '33333333-3333-3333-3333-000000000004', 4, 'open',
  '{"ko":"설문대할망의 발자국","en":"Footsteps of Seolmundae Halmang","ja":"ソルムンデハルマンの足跡"}',
  '{"ko":"올레길을 걸으며 제주의 돌담과 바다를 배경으로 사진을 찍고, 거인 할머니가 이 길을 만든 이유를 상상하여 적어보세요.","en":"Walk the Olle Trail, take a photo with Jeju stone walls and the sea, and imagine why the giant grandmother made this path.","ja":"オルレギルを歩きながら済州の石垣と海を背景に写真を撮り、巨人のおばあさんがこの道を作った理由を想像して書いてください。"}',
  '{"ko":"7코스가 가장 유명해요","en":"Course 7 is the most famous","ja":"7コースが最も有名です"}',
  NULL,
  NULL,
  100, false,
  '{"ko":"제주 올레길","en":"Jeju Olle Trail","ja":"済州オルレギル"}',
  33.24700000, 126.56800000, 'JEJ004'
),

-- seq 5: 한라산 퀴즈
(
  '33333333-3333-3333-3333-000000000004', 5, 'quiz',
  '{"ko":"거인의 산","en":"The Giant Mountain","ja":"巨人の山"}',
  '{"ko":"한라산 정상에 있는 화구호의 이름은 무엇일까요?","en":"What is the name of the crater lake at the summit of Hallasan?","ja":"漢拏山の頂上にある火口湖の名前は何でしょう？"}',
  '{"ko":"흰 사슴과 관련이 있어요","en":"It relates to white deer","ja":"白い鹿に関係があります"}',
  '{"ko":"못(池)이라는 글자가 들어가요","en":"It contains the character for pond","ja":"池という字が入っています"}',
  '백록담',
  100, false,
  '{"ko":"한라산","en":"Hallasan Mountain","ja":"漢拏山"}',
  33.36170000, 126.52920000, 'JEJ005'
),

-- seq 6: 협재해수욕장 사진
(
  '33333333-3333-3333-3333-000000000004', 6, 'photo',
  '{"ko":"에메랄드 바다의 비밀","en":"Secret of the Emerald Sea","ja":"エメラルドの海の秘密"}',
  '{"ko":"협재해수욕장에서 비양도가 보이는 각도로 사진을 찍으세요. 에메랄드빛 바다가 포인트!","en":"Take a photo at Hyeopjae Beach with Biyangdo Island visible. The emerald sea is the key!","ja":"挟才ビーチから飛揚島が見える角度で写真を撮ってください。エメラルド色の海がポイント！"}',
  '{"ko":"서쪽을 바라보세요","en":"Look to the west","ja":"西を向いてください"}',
  NULL,
  NULL,
  100, false,
  '{"ko":"협재해수욕장","en":"Hyeopjae Beach","ja":"挟才ビーチ"}',
  33.39400000, 126.23960000, 'JEJ006'
),

-- seq 7: 돌하르방 보스
(
  '33333333-3333-3333-3333-000000000004', 7, 'boss',
  '{"ko":"돌 거인의 수수께끼","en":"Riddle of the Stone Giant","ja":"石の巨人の謎"}',
  '{"ko":"제주 여행 중 돌하르방을 5개 이상 찾아 각각 다른 장소에서 사진을 찍으세요. 각 돌하르방의 표정 차이를 적어보세요.","en":"Find 5 or more Dol Hareubang during your Jeju trip, take photos at different locations, and describe their different expressions.","ja":"済州旅行中にトルハルバンを5つ以上見つけてそれぞれ違う場所で写真を撮り、各トルハルバンの表情の違いを書いてください。"}',
  '{"ko":"공항, 민속마을, 관광지 곳곳에 있어요","en":"They are at the airport, folk villages, and tourist spots","ja":"空港、民俗村、観光地のあちこちにあります"}',
  '{"ko":"코 모양이 다 달라요","en":"Each nose shape is different","ja":"鼻の形がそれぞれ違います"}',
  NULL,
  300, false,
  '{"ko":"제주 곳곳","en":"Various places in Jeju","ja":"済州各地"}',
  33.45000000, 126.57000000, 'JEJ007'
),

-- seq 8: 주상절리 히든
(
  '33333333-3333-3333-3333-000000000004', 8, 'hidden',
  '{"ko":"거인이 새긴 기둥","en":"Pillars Carved by the Giant","ja":"巨人が刻んだ柱"}',
  '{"ko":"중문 주상절리에서 파도가 부딪히는 순간을 촬영하세요. 자연이 만든 육각형 기둥의 비밀을 적어보세요.","en":"Capture the moment waves crash at Jungmun Jusangjeolli. Write about the secret of these hexagonal columns made by nature.","ja":"中文柱状節理で波がぶつかる瞬間を撮影してください。自然が作った六角形の柱の秘密を書いてください。"}',
  '{"ko":"서귀포 중문에 있어요","en":"It is in Jungmun, Seogwipo","ja":"西帰浦の中文にあります"}',
  NULL,
  NULL,
  500, true,
  '{"ko":"중문 주상절리대","en":"Jungmun Jusangjeolli","ja":"中文柱状節理帯"}',
  33.23810000, 126.42560000, 'JEJ008'
);
