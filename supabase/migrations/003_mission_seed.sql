-- ============================================================
-- Legend of Korea — Phase 7 Mission Seed Data
-- 003_mission_seed.sql
-- ============================================================

-- Jeonju Dokkaebi Course ID (from initial schema)
-- 'a1b2c3d4-0000-0000-0000-000000000001'

-- Clear existing missions for this course to avoid duplicates during development
DELETE FROM public.missions WHERE course_id = 'a1b2c3d4-0000-0000-0000-000000000001';

-- INSERT 8 Missions for Jeonju Dokkaebi Course
INSERT INTO public.missions (
  id, course_id, sequence, type, title, description,
  hint_1, hint_2, hint_3, correct_answer, lp_reward, is_hidden, qr_code
) VALUES
-- 1. Quiz - 경기전
(
  gen_random_uuid(), 'a1b2c3d4-0000-0000-0000-000000000001', 1, 'quiz',
  '{"ko":"경기전의 주인","ja":"慶基殿の 주인","en":"Owner of Gyeonggijeon"}',
  '{"ko":"경기전 정전에 모셔진 조선의 건국 시조는 누구일까요?","ja":"慶基殿の正殿に祀られている朝鮮の建国始祖は誰でしょう？","en":"Who is the founding father of Joseon enshrined in the main hall of Gyeonggijeon?"}',
  '{"ko":"이...","ja":"李...","en":"Yi..."}',
  '{"ko":"조선 제 1대 왕입니다.","ja":"朝鮮第1代王입니다.","en":"He is the 1st king of Joseon."}',
  '{"ko":"태조 이성계","ja":"太祖 李成桂","en":"Taejo Yi Seong-gye"}',
  '태조 이성계', 100, false, 'DOK001'
),
-- 2. Photo - 한옥마을 골목
(
  gen_random_uuid(), 'a1b2c3d4-0000-0000-0000-000000000001', 2, 'photo',
  '{"ko":"한옥마을 골목길","ja":"韓屋村の路地","en":"Hanok Village Alley"}',
  '{"ko":"가장 아름다운 한옥마을 골목길을 찾아 사진을 찍어주세요.","ja":"最も美しい韓屋村の路地を見つけて写真を撮ってください。","en":"Find the most beautiful alley in the Hanok Village and take a photo."}',
  '{"ko":"기와지붕이 겹겹이 보이는 곳을 찾아보세요.","ja":"瓦屋根が重なって見える場所を探してください。","en":"Look for a place where tiled roofs overlap."}',
  '{"ko":"오목대로 올라가는 길목이 좋습니다.","ja":"梧木台へ上がる道がおすすめです。","en":"The path leading up to Omokdae is good."}',
  '{"ko":"전주천이 내려다보이는 방향의 골목입니다.","ja":"全州川が見下ろせる方向の路地です。","en":"An alley overlooking the Jeonjucheon stream."}',
  NULL, 100, false, 'DOK002'
),
-- 3. Open - 전주 남부시장
(
  gen_random_uuid(), 'a1b2c3d4-0000-0000-0000-000000000001', 3, 'open',
  '{"ko":"전주 남부시장 미식 탐방","ja":"全州南部市場の美食探訪","en":"Jeonju Nambu Market Gastronomy"}',
  '{"ko":"남부시장에서 가장 맛있는 음식을 발견하고 그 소감을 적어주세요. 사진도 좋습니다!","ja":"南部市場で最も美味しい食べ物を見つけ、その感想を書いてください。写真も大歓迎です！","en":"Discover the most delicious food in Nambu Market and write your impressions. Photos are welcome too!"}',
  '{"ko":"피순대나 콩나물국밥이 유명합니다.","ja":"ピスンデや豆もやしクッパが有名です。","en":"Pi-sundae or Bean Sprout Soup is famous."}',
  '{"ko":"시장 2층 청년몰도 구경해보세요.","ja":"市場2階の青年モールも覗いてみてください.","en":"Check out the Youth Mall on the 2nd floor of the market."}',
  '{"ko":"야시장 시간대에는 더 다양한 먹거리가 있습니다.","ja":"夜市場の時間帯にはもっと多様な食べ物があります。","en":"There are more diverse foods during the night market."}',
  NULL, 100, false, 'DOK003'
),
-- 4. Quiz - 전동성당
(
  gen_random_uuid(), 'a1b2c3d4-0000-0000-0000-000000000001', 4, 'quiz',
  '{"ko":"전동성당의 양식","ja":"殿洞聖堂の様式","en":"Style of Jeondong Cathedral"}',
  '{"ko":"전동성당은 비잔틴 양식과 어떤 건축 양식이 혼합된 건물일까요?","ja":"殿洞聖堂はビザンチン様式とどの建築様식이 混合された建物でしょう？","en":"Jeondong Cathedral is a building that mixes Byzantine style with which architectural style?"}',
  '{"ko":"ㄹ...","ja":"ロ...","en":"R..."}',
  '{"ko":"유럽 중세 건축의 특징입니다.","ja":"ヨーロッパ中世建築の特徴です.","en":"It is a characteristic of medieval European architecture."}',
  '{"ko":"로마네스크","ja":"ロマネスク","en":"Romanesque"}',
  '로마네스크', 100, false, 'DOK004'
),
-- 5. Photo - 오목대
(
  gen_random_uuid(), 'a1b2c3d4-0000-0000-0000-000000000001', 5, 'photo',
  '{"ko":"오목대의 전경","ja":"梧木台の全景","en":"View from Omokdae"}',
  '{"ko":"오목대 정상에서 한옥마을 전체가 내려다보이는 인증샷을 찍어주세요.","ja":"梧木台の頂上で韓屋村全体が見下ろせる認証ショットを撮ってください。","en":"Take a certification shot from the top of Omokdae overlooking the entire Hanok Village."}',
  '{"ko":"포토존 표지판을 따라가세요.","ja":"フォトゾーンの案内板に従ってください.","en":"Follow the photo zone signs."}',
  '{"ko":"해질녘 풍경이 가장 아름답습니다.","ja":"夕暮れの風景が最も美しいです。","en":"The sunset scenery is the most beautiful."}',
  '{"ko":"한옥의 곡선미가 가장 잘 보이는 지점을 찾으세요.","ja":"韓屋の曲線美が最もよく見える地点を探してください。","en":"Find the point where the curved beauty of the hanok is best seen."}',
  NULL, 100, false, 'DOK002' -- Wait, DOK005 in user request
),
-- 6. Boss - 한벽당
(
  gen_random_uuid(), 'a1b2c3d4-0000-0000-0000-000000000001', 6, 'boss',
  '{"ko":"[보스] 한벽당의 도깨비","ja":"【ボス】寒碧堂のトッケビ","en":"[BOSS] Dokkaebi of Hanbyeokdang"}',
  '{"ko":"한벽당 절벽 아래 숨겨진 도깨비 굴을 찾으셨나요? 여기서 미션을 완료하고 300 LP를 획득하세요!","ja":"寒碧堂の絶壁の下に隠されたトッケビの洞窟を見つけましたか？ここでミッションを完了し、300 LPを獲得してください！","en":"Have you found the hidden Dokkaebi cave under the cliffs of Hanbyeokdang? Complete the mission here and earn 300 LP!"}',
  '{"ko":"터널 근처를 살펴보세요.","ja":"トンネルの近くを見てください.","en":"Look near the tunnel."}',
  '{"ko":"바위 틈새에 표식이 있습니다.","ja":"岩の隙間に標識があります。","en":"There is a mark in the crevices of the rocks."}',
  '{"ko":"전주천 산책로와 연결되어 있습니다.","ja":"全州川の遊歩道とつながっています。","en":"It is connected to the Jeonjucheon promenade."}',
  NULL, 300, false, 'DOK006'
),
-- 7. Hidden - 전주천
(
  gen_random_uuid(), 'a1b2c3d4-0000-0000-0000-000000000001', 7, 'hidden',
  '{"ko":"[히든] 전주천의 비밀","ja":"【隠し】全州川の秘密","en":"[HIDDEN] Secret of Jeonjucheon"}',
  '{"ko":"전주천 물빛에 비친 도깨비의 형상을 찾아보세요. (발견 시 500 LP)","ja":"全州川の水面に映るトッケビの形を探してください（発見時 500 LP）。","en":"Find the shape of a Dokkaebi reflected in the waters of Jeonjucheon (500 LP upon discovery)."}',
  '{"ko":"징검다리 주변을 확인하세요.","ja":"飛び石の周辺を確認してください.","en":"Check around the stepping stones."}',
  '{"ko":"특정 각도에서만 보입니다.","ja":"特定の角度からのみ見えます。","en":"It is only visible from a certain angle."}',
  '{"ko":"야간 조명이 켜질 때 더 선명합니다.","ja":"夜間照明が灯る時、より鮮明になります。","en":"It is clearer when night lights are on."}',
  NULL, 500, true, 'DOK007'
),
-- 8. Hidden - 자만벽화마을
(
  gen_random_uuid(), 'a1b2c3d4-0000-0000-0000-000000000001', 8, 'hidden',
  '{"ko":"[히든] 벽화 속 도깨비","ja":"【隠し】壁画の中のトッケビ","en":"[HIDDEN] Dokkaebi in the Mural"}',
  '{"ko":"자만벽화마을 수많은 그림 중 도깨비 방망이 그림을 찾으세요. (발견 시 500 LP)","ja":"滋満壁画村の数ある絵の中から、トッケビの棒の絵を探してください（発見時 500 LP）。","en":"Among the many paintings in Jaman Mural Village, find the painting of the Dokkaebi club (500 LP upon discovery)."}',
  '{"ko":"마을 높은 곳으로 올라가세요.","ja":"村の高いところへ登ってください.","en":"Go up to the higher part of the village."}',
  '{"ko":"화려한 색감의 벽화를 찾으세요.","ja":"華やかな色味の壁画を探してください。","en":"Look for a mural with vibrant colors."}',
  '{"ko":"카페 테라스 옆 벽면을 확인하세요.","ja":"カフェテラス横の壁面を確認してください。","en":"Check the wall next to the cafe terrace."}',
  NULL, 500, true, 'DOK008'
);

-- Fix sequence 5 qr_code (DOK002 was reused in my draft)
UPDATE public.missions SET qr_code = 'DOK005' WHERE sequence = 5 AND course_id = 'a1b2c3d4-0000-0000-0000-000000000001';
