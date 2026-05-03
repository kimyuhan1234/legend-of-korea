import { Metadata } from 'next'

// hotfix v8: 빌드 타임 timeout 우회 (큰 i18n 약관 본문 정적 generation 지연).
export const dynamic = 'force-dynamic'

interface Props { params: { locale: string } }

const META: Record<string, { title: string; desc: string }> = {
  ko: { title: '위치기반 서비스 이용약관 | Clouds with you', desc: '위치기반 서비스 이용약관' },
  en: { title: 'Location-Based Service Terms | Clouds with you', desc: 'Terms of Use for Location-Based Services' },
  ja: { title: '位置情報サービス利用規約 | Clouds with you', desc: '位置情報サービスの利用規約' },
  'zh-CN': { title: '位置服务使用条款 | Clouds with you', desc: '基于位置服务的使用条款' },
  'zh-TW': { title: '位置服務使用條款 | Clouds with you', desc: '基於位置服務的使用條款' },
}

type Section = { heading: string; body: string }

const CONTENT: Record<string, { title: string; updated: string; sections: Section[] }> = {
  ko: {
    title: '위치기반 서비스 이용약관',
    updated: '시행일: 2026년 4월 30일',
    sections: [
      {
        heading: '제1조 (목적)',
        body: '본 약관은 Clouds with you(이하 "회사")가 운영하는 Legend of Korea 서비스에서 「위치정보의 보호 및 이용 등에 관한 법률」에 따라 이용자(이하 "위치정보주체")의 개인위치정보를 처리하는 데 필요한 사항을 규정함을 목적으로 합니다.',
      },
      {
        heading: '제2조 (약관의 효력 및 변경)',
        body: '① 본 약관은 위치정보주체가 동의 절차를 거친 시점부터 효력이 발생합니다.\n② 회사는 관련 법령 변경, 서비스 변경 등의 사유로 본 약관을 변경할 수 있으며, 변경 시 시행일 7일 전까지 서비스 내 공지사항으로 알립니다.\n③ 위치정보주체가 변경된 약관에 동의하지 않을 경우 동의 철회 또는 회원 탈퇴를 요청할 수 있습니다.',
      },
      {
        heading: '제3조 (서비스 내용)',
        body: '회사는 위치정보주체의 동의 하에 다음의 위치기반 서비스를 제공합니다.\n① 미션 위치 인증: GPS 좌표를 활용하여 미션 장소 도착 여부를 확인합니다.\n② 숙소·식당 거리 기반 검색: 위치정보주체의 현재 위치를 기준으로 가까운 숙소나 식당을 추천합니다.\n③ 지도 현재 위치 표시: 카카오맵 등 지도 화면에 사용자의 현재 위치를 마커로 표시합니다.',
      },
      {
        heading: '제4조 (이용 요금)',
        body: '회사가 제공하는 위치기반 서비스는 무료로 이용할 수 있습니다. 단, 모바일 데이터 사용에 따른 통신비는 위치정보주체가 부담합니다.',
      },
      {
        heading: '제5조 (개인위치정보의 이용 또는 제공)',
        body: '① 회사는 위치정보주체의 사전 동의 없이 개인위치정보를 제3자에게 제공하지 않습니다.\n② 위치 좌표는 본 서비스의 기능 제공 목적(미션 인증·거리 계산·지도 표시)으로만 일회성으로 사용되며, 별도 데이터베이스에 저장하지 않습니다.\n③ 다만 미션 인증 결과(완료 여부, 인증 시각)는 서비스 제공을 위해 보관됩니다.',
      },
      {
        heading: '제6조 (개인위치정보 이용·제공 사실 확인자료의 보유 근거 및 보유기간)',
        body: '① 회사는 「위치정보법」 제16조 제2항에 따라 위치정보 이용·제공사실 확인자료를 자동 기록·보존하며, 6개월간 보유합니다.\n② 보유 항목: 위치정보주체 식별자, 이용 일시, 이용 목적.',
      },
      {
        heading: '제7조 (위치정보주체의 권리)',
        body: '① 위치정보주체는 언제든지 다음의 권리를 행사할 수 있습니다.\n  • 개인위치정보 수집·이용·제공에 대한 동의 전부 또는 일부 철회\n  • 개인위치정보의 일시적 중지 요구\n  • 개인위치정보·이용제공사실 확인자료 등의 열람·고지 또는 정정 요구\n② 권리 행사 방법: 마이페이지의 설정 메뉴 또는 kimyuhan1989@gmail.com 으로 요청. 회사는 정당한 사유가 없는 한 10영업일 이내에 처리합니다.',
      },
      {
        heading: '제8조 (8세 이하 아동 등의 보호의무자의 권리·의무)',
        body: '① 회사는 만 14세 미만 아동 및 8세 이하 아동, 피성년후견인, 중증장애인의 개인위치정보를 처리할 경우 보호의무자의 동의를 별도로 받습니다.\n② 보호의무자는 본인의 권리에 준하여 동의 철회, 열람·고지·정정 요구를 행사할 수 있습니다.\n③ 베타 운영 기간 동안에는 만 14세 이상 이용자에 한하여 서비스를 제공합니다.',
      },
      {
        heading: '제9조 (위치정보관리책임자)',
        body: '회사는 위치정보주체의 권익 보호 및 민원 처리를 위해 다음과 같이 위치정보관리책임자를 지정합니다.\n• 성명: 김유한\n• 이메일: kimyuhan1989@gmail.com\n• 담당 업무: 위치정보 관련 문의·불만 처리, 권리 행사 요청 처리',
      },
      {
        heading: '제10조 (손해의 배상)',
        body: '회사가 「위치정보의 보호 및 이용 등에 관한 법률」 제15조 내지 제26조의 규정을 위반하여 위치정보주체에게 손해가 발생한 경우 위치정보주체는 회사에 대하여 손해배상을 청구할 수 있습니다. 회사는 고의 또는 과실이 없음을 입증하지 못하는 한 책임을 면할 수 없습니다.',
      },
      {
        heading: '제11조 (분쟁의 조정 및 기타)',
        body: '① 회사와 위치정보주체 간 위치정보 관련 분쟁이 발생한 경우 양 당사자 간 협의로 해결함을 원칙으로 합니다.\n② 협의가 이루어지지 않을 경우 「개인정보 보호법」에 따른 개인정보분쟁조정위원회 또는 「방송통신위원회의 설치 및 운영에 관한 법률」에 따른 방송통신위원회에 조정을 신청할 수 있습니다.',
      },
      {
        heading: '제12조 (회사의 연락처)',
        body: '• 상호: Clouds with you\n• 이메일: kimyuhan1989@gmail.com\n• 사업자 등록번호: 정식 출시 시 추가 예정 (베타 운영 기간 중)',
      },
      {
        heading: '부칙',
        body: '본 약관은 2026년 4월 30일부터 시행합니다.',
      },
    ],
  },

  en: {
    title: 'Location-Based Service Terms',
    updated: 'Effective Date: April 30, 2026',
    sections: [
      {
        heading: 'Article 1 (Purpose)',
        body: 'These Terms set forth the matters required to process personal location information of users (hereinafter "Location Information Subject") of the Legend of Korea service operated by Clouds with you (hereinafter "Company"), in accordance with the Republic of Korea\'s Act on the Protection and Use of Location Information (hereinafter "Location Information Act").',
      },
      {
        heading: 'Article 2 (Effect and Modification of Terms)',
        body: '① These Terms become effective the moment the Location Information Subject consents.\n② The Company may modify these Terms due to legal or service changes, with notice posted in-service at least 7 days before the effective date.\n③ If the Subject does not agree to modified Terms, they may withdraw consent or cancel membership.',
      },
      {
        heading: 'Article 3 (Service Description)',
        body: 'With the Subject\'s consent, the Company provides the following location-based services:\n① Mission location verification — uses GPS coordinates to confirm arrival at mission sites.\n② Distance-based search for stays and restaurants — recommends nearby venues based on the Subject\'s current location.\n③ Current location display on maps — shows the user\'s position as a marker on KakaoMap and similar map views.',
      },
      {
        heading: 'Article 4 (Service Fees)',
        body: 'Location-based services are provided free of charge. However, mobile data charges incurred during use are borne by the Subject.',
      },
      {
        heading: 'Article 5 (Use or Provision of Personal Location Information)',
        body: '① The Company shall not provide personal location information to third parties without prior consent.\n② Coordinates are used one-time only for the service\'s functional purposes (mission verification, distance calculation, map display) and are not stored in a separate database.\n③ However, mission verification results (completion status, timestamp) are retained for service operation.',
      },
      {
        heading: 'Article 6 (Retention of Confirmation Records of Location Information Use/Provision)',
        body: '① Pursuant to Article 16 (2) of the Location Information Act, the Company automatically records and retains confirmation records of location information use and provision for 6 months.\n② Retained items: Subject identifier, time of use, purpose of use.',
      },
      {
        heading: 'Article 7 (Rights of the Location Information Subject)',
        body: '① The Subject may exercise the following rights at any time:\n  • Withdraw consent (in whole or in part) to collection, use, or provision of personal location information\n  • Request a temporary suspension of personal location information processing\n  • Request access, notification, or correction of personal location information and confirmation records\n② How to exercise: via My Page settings or by emailing kimyuhan1989@gmail.com. The Company will respond within 10 business days unless there is a legitimate reason otherwise.',
      },
      {
        heading: 'Article 8 (Rights and Duties of Legal Guardians)',
        body: '① For users under age 14, children under 8, persons under guardianship, or persons with severe disabilities, the Company obtains separate consent from a legal guardian before processing personal location information.\n② The legal guardian may exercise the rights of withdrawal, access, notification, and correction on the Subject\'s behalf.\n③ During the beta period, the service is offered only to users aged 14 and above.',
      },
      {
        heading: 'Article 9 (Location Information Manager)',
        body: 'The Company designates the following Location Information Manager to protect Subjects\' rights and handle grievances:\n• Name: Yuhan Kim\n• Email: kimyuhan1989@gmail.com\n• Duties: handling inquiries/complaints related to location information, processing rights-exercise requests',
      },
      {
        heading: 'Article 10 (Damages)',
        body: 'If the Subject suffers harm due to the Company\'s violation of Articles 15 through 26 of the Location Information Act, the Subject may claim damages against the Company. The Company is not exempt from liability unless it proves the absence of intent or negligence.',
      },
      {
        heading: 'Article 11 (Dispute Resolution and Miscellaneous)',
        body: '① Disputes between the Company and the Subject regarding location information shall be resolved through good-faith consultation.\n② If consultation fails, the Subject may apply for mediation to the Personal Information Dispute Mediation Committee under the Personal Information Protection Act or to the Korea Communications Commission.',
      },
      {
        heading: 'Article 12 (Company Contact)',
        body: '• Trade name: Clouds with you\n• Email: kimyuhan1989@gmail.com\n• Business registration number: To be added at official launch (currently in beta operation)',
      },
      {
        heading: 'Addendum',
        body: 'These Terms are effective from April 30, 2026.',
      },
    ],
  },

  ja: {
    title: '位置情報サービス利用規約',
    updated: '施行日: 2026年4月30日',
    sections: [
      {
        heading: '第1条（目的）',
        body: '本規約は、Clouds with you（以下「当社」）が運営するLegend of Koreaサービスにおいて、「位置情報の保護及び利用等に関する法律」（以下「位置情報法」）に基づき利用者（以下「位置情報主体」）の個人位置情報を処理するために必要な事項を定めることを目的とします。',
      },
      {
        heading: '第2条（規約の効力及び変更）',
        body: '① 本規約は、位置情報主体が同意した時点から効力を発します。\n② 当社は関連法令の変更やサービス変更等により本規約を変更することがあり、その場合は施行日の7日前までにサービス内のお知らせで告知します。\n③ 変更後の規約に同意しない場合、位置情報主体は同意撤回または会員退会を申請することができます。',
      },
      {
        heading: '第3条（サービス内容）',
        body: '当社は位置情報主体の同意のもと、以下の位置情報サービスを提供します。\n① ミッション位置認証 — GPS座標を用いてミッション地点への到達を確認します。\n② 宿泊・飲食店の距離検索 — 位置情報主体の現在地から近い施設を推薦します。\n③ 地図上の現在位置表示 — KakaoMap等の地図画面に現在位置をマーカーで表示します。',
      },
      {
        heading: '第4条（利用料金）',
        body: '当社が提供する位置情報サービスは無料で利用できます。ただしモバイルデータ通信料は位置情報主体の負担とします。',
      },
      {
        heading: '第5条（個人位置情報の利用または提供）',
        body: '① 当社は位置情報主体の事前同意なく個人位置情報を第三者に提供しません。\n② 位置座標は本サービスの機能提供目的（ミッション認証・距離計算・地図表示）のみに一回限り使用し、別途データベースに保存しません。\n③ ただしミッション認証結果（完了可否・認証時刻）はサービス提供のため保存されます。',
      },
      {
        heading: '第6条（個人位置情報利用・提供事実確認資料の保有根拠及び保有期間）',
        body: '① 位置情報法第16条第2項により、当社は位置情報の利用・提供事実確認資料を自動記録・保存し、6ヶ月間保有します。\n② 保有項目: 位置情報主体の識別子、利用日時、利用目的。',
      },
      {
        heading: '第7条（位置情報主体の権利）',
        body: '① 位置情報主体はいつでも次の権利を行使することができます。\n  • 個人位置情報の収集・利用・提供への同意の全部または一部撤回\n  • 個人位置情報の一時的中止要求\n  • 個人位置情報および利用提供事実確認資料の閲覧・告知または訂正要求\n② 行使方法: マイページの設定メニューまたは kimyuhan1989@gmail.com まで請求。正当な事由がない限り、当社は10営業日以内に処理します。',
      },
      {
        heading: '第8条（8歳以下児童等の保護義務者の権利・義務）',
        body: '① 当社は満14歳未満児童、8歳以下児童、被成年後見人、重度障害者の個人位置情報を処理する際は保護義務者の同意を別途取得します。\n② 保護義務者は本人の権利に準じて同意撤回・閲覧・告知・訂正請求を行使することができます。\n③ ベータ運営期間中は満14歳以上の利用者に限ってサービスを提供します。',
      },
      {
        heading: '第9条（位置情報管理責任者）',
        body: '当社は位置情報主体の権益保護及び苦情処理のため、以下の通り位置情報管理責任者を指定します。\n• 氏名: キム・ユハン (Kim Yuhan)\n• メール: kimyuhan1989@gmail.com\n• 担当業務: 位置情報関連の問合せ・苦情処理、権利行使請求の処理',
      },
      {
        heading: '第10条（損害賠償）',
        body: '当社が「位置情報の保護及び利用等に関する法律」第15条から第26条の規定に違反し位置情報主体に損害が生じた場合、位置情報主体は当社に対し損害賠償を請求することができます。当社は故意または過失がないことを証明できない限り責任を免れません。',
      },
      {
        heading: '第11条（紛争の調整及びその他）',
        body: '① 当社と位置情報主体間で位置情報関連の紛争が発生した場合、両当事者間の協議により解決することを原則とします。\n② 協議で解決しない場合、「個人情報保護法」に基づく個人情報紛争調整委員会または「放送通信委員会の設置及び運営に関する法律」に基づく放送通信委員会に調整を申請することができます。',
      },
      {
        heading: '第12条（会社の連絡先）',
        body: '• 商号: Clouds with you\n• メール: kimyuhan1989@gmail.com\n• 事業者登録番号: 正式リリース時に追加予定（現在ベータ運営中）',
      },
      {
        heading: '附則',
        body: '本規約は2026年4月30日から施行します。',
      },
    ],
  },

  'zh-CN': {
    title: '位置服务使用条款',
    updated: '生效日期: 2026年4月30日',
    sections: [
      {
        heading: '第1条（目的）',
        body: '本条款规定了Clouds with you（以下简称"公司"）运营的Legend of Korea服务中，依据韩国《位置信息保护与利用法》（以下简称"位置信息法"）处理用户（以下简称"位置信息主体"）个人位置信息所需的事项。',
      },
      {
        heading: '第2条（条款效力及变更）',
        body: '① 本条款自位置信息主体同意时起生效。\n② 公司可因相关法律或服务变更而修改本条款，并在生效日前7天通过服务内公告告知。\n③ 若位置信息主体不同意修改后的条款，可申请撤回同意或注销会员资格。',
      },
      {
        heading: '第3条（服务内容）',
        body: '公司在获得位置信息主体同意的情况下提供以下位置服务：\n① 任务位置验证——使用GPS坐标确认是否到达任务地点。\n② 基于距离的住宿和餐厅搜索——根据位置信息主体的当前位置推荐附近的场所。\n③ 地图当前位置显示——在KakaoMap等地图界面以标记显示用户当前位置。',
      },
      {
        heading: '第4条（使用费用）',
        body: '公司提供的位置服务可免费使用。但移动数据通信费由位置信息主体承担。',
      },
      {
        heading: '第5条（个人位置信息的使用或提供）',
        body: '① 未经位置信息主体事先同意，公司不会向第三方提供个人位置信息。\n② 位置坐标仅用于本服务的功能目的（任务验证、距离计算、地图显示），一次性使用，不存入单独数据库。\n③ 但任务验证结果（完成情况、验证时间）将为服务运营而保留。',
      },
      {
        heading: '第6条（位置信息使用·提供事实确认资料的保有依据和保有期限）',
        body: '① 根据位置信息法第16条第2款，公司自动记录并保存位置信息使用·提供事实确认资料，保有6个月。\n② 保有项目：位置信息主体识别符、使用时间、使用目的。',
      },
      {
        heading: '第7条（位置信息主体的权利）',
        body: '① 位置信息主体可随时行使以下权利：\n  • 撤回对个人位置信息收集·使用·提供的全部或部分同意\n  • 要求暂时停止个人位置信息处理\n  • 要求查阅、告知或更正个人位置信息及使用提供事实确认资料\n② 行使方式：通过"我的页面"设置菜单或发送邮件至 kimyuhan1989@gmail.com。除非有正当理由，公司将在10个工作日内处理。',
      },
      {
        heading: '第8条（8岁以下儿童等的保护义务人的权利和义务）',
        body: '① 处理未满14岁儿童、8岁以下儿童、被监护成年人、重度残障人士的个人位置信息时，公司另行获取保护义务人同意。\n② 保护义务人可比照本人权利行使撤回、查阅、告知、更正请求。\n③ 测试运营期间，仅向满14岁以上用户提供服务。',
      },
      {
        heading: '第9条（位置信息管理责任人）',
        body: '为保护位置信息主体权益及处理投诉，公司指定如下位置信息管理责任人：\n• 姓名：金有韩（Kim Yuhan）\n• 邮箱：kimyuhan1989@gmail.com\n• 职责：处理位置信息相关咨询、投诉，处理权利行使请求',
      },
      {
        heading: '第10条（损害赔偿）',
        body: '若公司违反《位置信息保护与利用法》第15条至第26条规定致使位置信息主体受到损害，位置信息主体可向公司请求损害赔偿。除非公司能证明无故意或过失，否则不能免除责任。',
      },
      {
        heading: '第11条（争议调解及其他）',
        body: '① 公司与位置信息主体之间发生位置信息相关争议时，原则上由双方协商解决。\n② 协商不成时，可依据《个人信息保护法》向个人信息争议调解委员会，或依据《广播通信委员会设置与运营法》向广播通信委员会申请调解。',
      },
      {
        heading: '第12条（公司联系方式）',
        body: '• 商号：Clouds with you\n• 邮箱：kimyuhan1989@gmail.com\n• 营业执照号：正式发布时添加（目前为测试运营期）',
      },
      {
        heading: '附则',
        body: '本条款自2026年4月30日起施行。',
      },
    ],
  },

  'zh-TW': {
    title: '位置服務使用條款',
    updated: '生效日期: 2026年4月30日',
    sections: [
      {
        heading: '第1條（目的）',
        body: '本條款規定了Clouds with you（以下簡稱「本公司」）營運的Legend of Korea服務中，依據韓國《位置資訊保護與利用法》（以下簡稱「位置資訊法」）處理使用者（以下簡稱「位置資訊主體」）個人位置資訊所需的事項。',
      },
      {
        heading: '第2條（條款效力及變更）',
        body: '① 本條款自位置資訊主體同意時起生效。\n② 本公司可因相關法律或服務變更而修改本條款，並在生效日前7天透過服務內公告告知。\n③ 若位置資訊主體不同意修改後的條款，可申請撤回同意或註銷會員資格。',
      },
      {
        heading: '第3條（服務內容）',
        body: '本公司在獲得位置資訊主體同意的情況下提供以下位置服務：\n① 任務位置驗證——使用GPS座標確認是否到達任務地點。\n② 基於距離的住宿和餐廳搜尋——根據位置資訊主體的當前位置推薦附近的場所。\n③ 地圖當前位置顯示——在KakaoMap等地圖介面以標記顯示使用者當前位置。',
      },
      {
        heading: '第4條（使用費用）',
        body: '本公司提供的位置服務可免費使用。但行動數據通信費由位置資訊主體承擔。',
      },
      {
        heading: '第5條（個人位置資訊的使用或提供）',
        body: '① 未經位置資訊主體事先同意，本公司不會向第三方提供個人位置資訊。\n② 位置座標僅用於本服務的功能目的（任務驗證、距離計算、地圖顯示），一次性使用，不存入單獨資料庫。\n③ 但任務驗證結果（完成情況、驗證時間）將為服務營運而保留。',
      },
      {
        heading: '第6條（位置資訊使用·提供事實確認資料的保有依據和保有期限）',
        body: '① 根據位置資訊法第16條第2項，本公司自動記錄並保存位置資訊使用·提供事實確認資料，保有6個月。\n② 保有項目：位置資訊主體識別符、使用時間、使用目的。',
      },
      {
        heading: '第7條（位置資訊主體的權利）',
        body: '① 位置資訊主體可隨時行使以下權利：\n  • 撤回對個人位置資訊收集·使用·提供的全部或部分同意\n  • 要求暫時停止個人位置資訊處理\n  • 要求查閱、告知或更正個人位置資訊及使用提供事實確認資料\n② 行使方式：透過「我的頁面」設定選單或發送郵件至 kimyuhan1989@gmail.com。除非有正當理由，本公司將在10個工作日內處理。',
      },
      {
        heading: '第8條（8歲以下兒童等的保護義務人的權利和義務）',
        body: '① 處理未滿14歲兒童、8歲以下兒童、被監護成年人、重度障礙人士的個人位置資訊時，本公司另行取得保護義務人同意。\n② 保護義務人可比照本人權利行使撤回、查閱、告知、更正請求。\n③ 測試營運期間，僅向滿14歲以上使用者提供服務。',
      },
      {
        heading: '第9條（位置資訊管理責任人）',
        body: '為保護位置資訊主體權益及處理投訴，本公司指定如下位置資訊管理責任人：\n• 姓名：金有韓（Kim Yuhan）\n• 信箱：kimyuhan1989@gmail.com\n• 職責：處理位置資訊相關諮詢、投訴，處理權利行使請求',
      },
      {
        heading: '第10條（損害賠償）',
        body: '若本公司違反《位置資訊保護與利用法》第15條至第26條規定致使位置資訊主體受到損害，位置資訊主體可向本公司請求損害賠償。除非本公司能證明無故意或過失，否則不能免除責任。',
      },
      {
        heading: '第11條（爭議調解及其他）',
        body: '① 本公司與位置資訊主體之間發生位置資訊相關爭議時，原則上由雙方協商解決。\n② 協商不成時，可依據《個人資訊保護法》向個人資訊爭議調解委員會，或依據《廣播通信委員會設置與營運法》向廣播通信委員會申請調解。',
      },
      {
        heading: '第12條（本公司聯絡方式）',
        body: '• 商號：Clouds with you\n• 信箱：kimyuhan1989@gmail.com\n• 營業執照號：正式發布時新增（目前為測試營運期）',
      },
      {
        heading: '附則',
        body: '本條款自2026年4月30日起施行。',
      },
    ],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return { title: m.title, description: m.desc }
}

export default function LocationTermsPage({ params }: Props) {
  const c = CONTENT[params.locale] ?? CONTENT.ko
  return (
    <div className="min-h-screen bg-snow">
      <div className="bg-gradient-to-br from-mint to-blossom text-ink py-20 px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black">{c.title}</h1>
        <p className="mt-3 text-sm opacity-70">{c.updated}</p>
      </div>
      <div className="max-w-3xl mx-auto px-8 py-16 space-y-10">
        {c.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-lg font-bold text-[#111] mb-3">{s.heading}</h2>
            <p className="text-slate text-sm leading-relaxed whitespace-pre-line">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
