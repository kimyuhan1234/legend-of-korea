const REGION_PREFIXES = ['서울', '부산', '제주', '전주', '경주', '통영', '천안', '용인', '이천']

export const KOREAN_FOOD_MAP: Record<string, string> = {
  // 밥·덮밥
  '비빔밥': 'bibimbap korean mixed rice bowl',
  '전주비빔밥': 'jeonju bibimbap korean rice bowl vegetables',
  '산채비빔밥': 'sanchaebibimbap wild vegetable bibimbap korean',
  '육회비빔밥': 'yukhoe bibimbap raw beef rice bowl korean',
  '멍게비빔밥': 'bibimbap korean rice bowl seafood',
  '꼬막비빔밥': 'cockle bibimbap korean rice bowl',
  '솥밥': 'sotbap korean stone pot rice',
  '이천 쌀밥 정식': 'icheon white rice set meal korean',
  '쌀밥 정식': 'korean rice set meal',
  '오곡밥': 'ogokbap five grain rice korean',
  '연잎밥 정식': 'lotus leaf rice korean traditional',
  '곤드레밥': 'gondeure rice korean herb mountain',
  '산사이 덮밥': 'mountain vegetable rice bowl korean',

  // 김밥·주먹밥
  '김밥': 'gimbap korean rice roll seaweed',
  '충무김밥': 'chungmu gimbap spicy rice roll korean',
  '교리김밥': 'gyori gimbap gyeongju rice roll',
  '광장시장 마약김밥': 'mayak gimbap mini rice roll korean',

  // 국·탕·찌개
  '설렁탕': 'seolleongtang ox bone soup korean milky',
  '갈비탕': 'galbitang short rib soup korean',
  '감자탕': 'gamjatang pork spine potato stew korean',
  '삼계탕': 'samgyetang ginseng chicken soup korean',
  '순두부찌개': 'sundubu jjigae soft tofu stew korean',
  '김치찌개': 'kimchi jjigae stew korean',
  '된장찌개': 'doenjang jjigae soybean paste stew korean',
  '청국장': 'cheonggukjang fermented soybean stew korean',
  '청국장찌개': 'cheonggukjang jjigae fermented soybean stew',
  '부대찌개': 'budae jjigae army stew sausage korean',
  '두부전골': 'dubu jeongol tofu hot pot korean',
  '버섯전골': 'mushroom hot pot korean',
  '능이버섯샤브샤브': 'korean mushroom shabu hot pot',
  '육개장': 'yukgaejang spicy shredded beef soup',
  '곰탕': 'gomtang korean ox bone soup clear',
  '순대국밥': 'sundae gukbap blood sausage rice soup korean',
  '순대국': 'sundae guk blood sausage soup korean',
  '콩나물국밥': 'kongnamul gukbap bean sprout rice soup',
  '돼지국밥': 'pork rice soup korean busan',
  '해장국': 'haejangguk hangover soup korean',
  '소머리국밥': 'ox head soup rice korean',
  '대구탕': 'daegu tang cod fish soup korean',
  '복어탕': 'blowfish soup korean',
  '굴국밥': 'oyster rice soup korean',
  '성게미역국': 'sea urchin seaweed soup jeju korean',
  '도다리쑥국': 'flounder mugwort soup korean spring',
  '몸국': 'momguk seaweed pork soup jeju traditional',
  '보말죽': 'bomal juk sea snail porridge jeju',
  '접짝뼈국': 'pork bone soup jeju korean',
  '해물뚝배기': 'haemul ttukbaegi seafood clay pot korean',
  '해물탕': 'haemul tang spicy seafood stew korean',
  '해물짬뽕': 'haemul jjamppong spicy seafood noodle soup',
  '물메기탕': 'water catfish soup korean tongyeong',
  '바지락칼국수': 'clam kalguksu knife noodles soup korean',
  '홍합탕': 'mussel soup korean',
  '통영 해물잡탕': 'mixed seafood stew korean tongyeong',
  '전복뚝배기': 'abalone stew clay pot korean',
  '민속촌 장터국밥': 'traditional market rice soup korean folk village',
  '천안 콩나물국밥': 'kongnamul gukbap bean sprout rice soup',
  '오모가리탕': 'freshwater fish soup korean',
  '닭한마리': 'dak hanmari whole chicken soup korean',

  // 고기구이·볶음
  '삼겹살': 'samgyeopsal pork belly korean bbq grill',
  '흑돼지 구이': 'black pork belly jeju korean bbq',
  '갈비': 'galbi korean bbq short ribs grilled',
  '불고기': 'bulgogi korean marinated grilled beef',
  '떡갈비': 'tteokgalbi korean minced rib patty grilled',
  '도자기불고기': 'bulgogi ceramic pot korean',
  '안동찜닭': 'andong jjimdak braised chicken soy sauce',
  '제육볶음': 'jeyuk bokkeum spicy pork stir-fry korean',
  '낙지볶음': 'nakji bokkeum spicy stir-fried octopus',
  '오징어볶음': 'ojingeo bokkeum spicy squid stir-fry',
  '매운돼지갈비': 'spicy pork ribs korean',
  '낙곱새': 'nakgopsae octopus tripe shrimp spicy korean',
  '곱창구이': 'gopchang grilled intestines korean bbq',
  '양곱창': 'yang gopchang beef tripe bbq korean',
  '곰장어구이': 'conger eel grilled korean bbq',
  '장어구이': 'jangeo gui grilled eel korean',
  '아구찜': 'agujjim spicy monkfish stew korean',
  '갈치조림': 'galchi jorim braised hairtail fish korean',
  '생선구이': 'grilled fish korean traditional',
  '미더덕찜': 'mideodeok jjim sea squirt steamed korean',
  '활어회': 'hwal eo hoe fresh raw fish sashimi korean',

  // 해산물·회
  '전복죽': 'jeonbokjuk abalone porridge korean',
  '굴밥': 'gulmam oyster rice korean tongyeong',
  '굴전': 'guljeon oyster pancake korean',
  '피꼬막': 'kkkomak bibimbap cockle korean',
  '해물파전': 'haemul pajeon seafood pancake korean',
  '한우 물회': 'mulhoe cold spicy raw fish soup korean',
  '자리물회': 'jari mulhoe cold raw fish soup jeju',
  '한치물회': 'hanchi mulhoe cold raw squid soup jeju',
  '물회': 'mulhoe cold raw fish soup korean',
  '전복 구이': 'jeonbok gui grilled abalone korean',
  '통영 생선회 정식': 'sashimi set meal korean tongyeong',
  '학꽁치 회': 'halfbeak sashimi korean',

  // 면
  '칼국수': 'kalguksu knife-cut noodle soup korean',
  '냉면': 'naengmyeon cold noodles korean',
  '막국수': 'makguksu buckwheat noodles korean',
  '수제비': 'sujebi hand-torn noodle soup korean',
  '밀면': 'milmyeon cold wheat noodles busan korean',
  '꿩메밀국수': 'pheasant buckwheat noodles korean',
  '보리국수': 'barley noodle soup korean',
  '보말칼국수': 'sea snail kalguksu noodle soup jeju',
  '고기국수': 'gogi guksu pork noodle soup jeju korean',
  '콩국수': 'konguksu cold soybean noodles summer korean',

  // 전·부침
  '파전': 'pajeon green onion pancake korean',
  '해물파전': 'haemul pajeon seafood scallion pancake',
  '광장시장 빈대떡': 'bindaetteok mung bean pancake korean market',
  '빈대떡': 'bindaetteok mung bean pancake korean',
  '녹두전': 'nokdujeon mung bean pancake korean',
  '김치전': 'kimchi pancake korean jeon',
  '빙떡': 'bingtteok jeju savory rolled pancake',

  // 떡·한과·디저트
  '오메기떡': 'omegi tteok jeju mochi rice cake',
  '약과': 'yakgwa korean honey cookie traditional',
  '한과': 'hangwa korean traditional confectionery sweets',
  '황남빵': 'hwangnam bread gyeongju korean walnut',
  '호두과자': 'hoduguaja walnut shaped cookie cheonan',
  '꿀빵': 'kkul bbang honey bread tongyeong korean',
  '밤엿': 'chestnut taffy candy korean traditional',
  '찹쌀떡': 'chapssal tteok glutinous rice cake korean',
  '떡국': 'tteokguk rice cake soup korean new year',
  '감귤 파운드 케이크': 'citrus orange pound cake korean jeju',
  '한라봉 디저트': 'hallabong tangerine dessert jeju korean',
  '식혜': 'sikhye korean sweet rice punch drink',
  '수제 초코파이': 'homemade chocolate pie korean',
  '보정동 카페거리 디저트': 'korean dessert cafe pastry',

  // 술·음료
  '모주': 'moju korean traditional sweet rice wine',
  '막걸리': 'makgeolli korean rice wine traditional',
  '교동법주': 'beopju korean traditional rice wine gyeongju',
  '산수유 막걸리': 'cornelian cherry makgeolli korean',
  '수제맥주': 'craft beer korean',
  '감귤주스': 'jeju tangerine orange juice korean',

  // 기타 한식
  '잡채': 'japchae glass noodles vegetables korean',
  '보쌈': 'bossam steamed pork wrap korean',
  '족발': 'jokbal braised pork trotters korean',
  '냉채족발': 'cold pork trotter salad korean',
  '산채정식': 'mountain vegetable set meal korean',
  '쌈밥 정식': 'ssambap lettuce wrap rice korean',
  '한정식': 'hanjeongsik korean full course meal',
  '도토리묵 무침': 'dotori muk acorn jelly salad korean',
  '비빔당면': 'bibim dangmyeon spicy cold glass noodles',
  '임금님 수라상': 'korean royal court cuisine',
  '구절판': 'gujeolpan nine-section platter korean royal',
  '전통 와가시': 'korean traditional confectionery',
  '병천순대': 'byeongcheon sundae blood sausage korean',
  '백암순대': 'baekam sundae blood sausage korean',
  '순대': 'sundae korean blood sausage',
  '쌈밥': 'ssambap korean lettuce wrap',
  '야채 쌈': 'ssam korean vegetable wrap',
  '누룽지 백숙': 'scorched rice chicken soup korean',
  '연잎밥': 'lotus leaf rice korean',
  '볏짚 삼겹살': 'straw smoked pork belly korean',
  '육회': 'yukhoe korean beef tartare raw',
  '감자옹심이': 'gamja ongsimi potato dumpling soup',
  '조개구이': 'jokbal shellfish grilled korean bbq',
  '치맥': 'chimaek korean fried chicken beer',
  '한강 라면': 'ramyeon korean instant noodle river',
  '수육': 'suyuk boiled pork slices korean',
  '어묵': 'eomuk fish cake korean',
  '어묵탕': 'eomuk tang fish cake soup skewer korean',
  '떡볶이': 'tteokbokki spicy rice cake korean street food',
  '길거리 토스트': 'korean street toast egg sandwich',
  '씨앗호떡': 'ssiat hotteok seed-filled pancake busan',
  '서울 호떡': 'hotteok korean sweet pancake street food',
  '천안 수제비': 'sujebi hand-torn noodle dumpling soup',
}

export function cleanKoreanFoodName(name: string): string {
  let cleaned = name
  for (const prefix of REGION_PREFIXES) {
    cleaned = cleaned.replace(new RegExp(`^${prefix}\\s+`), '').trim()
  }
  return cleaned
}

export function toEnglishQuery(koreanName: string, tags?: string[]): string {
  if (KOREAN_FOOD_MAP[koreanName]) return KOREAN_FOOD_MAP[koreanName]

  const cleaned = cleanKoreanFoodName(koreanName)
  if (KOREAN_FOOD_MAP[cleaned]) return KOREAN_FOOD_MAP[cleaned]

  if (tags && tags.length > 0) {
    return `${tags.slice(0, 2).join(' ')} korean food traditional`
  }

  return `${cleaned} korean food`
}
