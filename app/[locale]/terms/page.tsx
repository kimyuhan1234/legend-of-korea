import { Metadata } from 'next'

interface Props { params: { locale: string } }

const META: Record<string, { title: string; desc: string }> = {
  ko: { title: '이용약관 | Cloud with you', desc: '서비스 이용약관' },
  en: { title: 'Terms of Service | Cloud with you', desc: 'Terms of Service' },
  ja: { title: '利用規約 | Cloud with you', desc: 'サービス利用規約' },
  'zh-CN': { title: '服务条款 | Cloud with you', desc: '服务使用条款' },
  'zh-TW': { title: '服務條款 | Cloud with you', desc: '服務使用條款' },
}

type Section = { heading: string; body: string }

const CONTENT: Record<string, { title: string; updated: string; sections: Section[] }> = {
  ko: {
    title: '이용약관',
    updated: '최종 수정일: 2026년 4월 27일',
    sections: [
      {
        heading: '제1조 (목적)',
        body: '본 약관은 Cloud with you(이하 "회사")가 운영하는 Legend of Korea 서비스(이하 "서비스")의 이용 조건 및 절차에 관한 사항과 회사와 이용자의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.',
      },
      {
        heading: '제2조 (정의)',
        body: '• "서비스": 회사가 제공하는 여행 패스 구독, 여행 코스 체험, 미션 퀘스트, 커뮤니티 등 모든 온라인 서비스\n• "이용자": 본 약관에 동의하고 서비스를 이용하는 회원 및 비회원\n• "회원": 회사에 개인정보를 제공하여 회원 등록을 완료한 자\n• "빗방울(Raindrop)": 서비스 내 활동으로 적립되는 가상 포인트. 랭크업 및 쿠폰 교환에 사용',
      },
      {
        heading: '제3조 (서비스 이용)',
        body: '① 회원가입은 만 14세 이상이어야 합니다.\n② 이용자는 자신의 계정을 제3자에게 양도하거나 공유할 수 없습니다.\n③ 회사는 서비스 품질 향상 등을 위해 사전 공지 후 서비스 내용을 변경하거나 종료할 수 있습니다.\n④ 서비스 이용료: 여행 패스(Move/Live/Story/All-in-One) 구독 시 상품 페이지에 표시된 금액을 지불하며, 결제는 토스페이먼츠를 통해 처리됩니다.\n⑤ 청약 철회: 전자상거래법 제17조에 따라 구독 결제일로부터 7일 이내 청약 철회가 가능합니다. 단, 서비스 이용 이력이 있는 경우(미션 완료, 빗방울 적립 등) 청약 철회가 제한될 수 있습니다.\n⑥ 빗방울은 현금으로 환급되지 않으며, 서비스 내에서만 사용 가능합니다. 회원 탈퇴 시 잔여 빗방울은 소멸됩니다.',
      },
      {
        heading: '제3조의2 (만 14세 미만 보호)',
        body: '① 회사는 회원가입 시 만 14세 이상임을 전제로 서비스를 제공합니다.\n② 만 14세 미만 아동이 법정대리인 동의 없이 가입한 경우, 회사는 인지 즉시 해당 계정을 정지하고 개인정보를 파기합니다.\n③ 다만, 법정대리인의 동의 절차를 통해 가입한 경우는 예외로 합니다.\n④ 이용자는 가입 시 제공한 정보의 정확성에 대한 책임을 부담합니다.',
      },
      {
        heading: '제4조 (개인정보 보호)',
        body: '회사는 이용자의 개인정보를 개인정보처리방침에 따라 보호합니다. 개인정보처리방침은 서비스 내 별도 페이지에서 확인할 수 있으며, 본 약관의 일부를 구성합니다.',
      },
      {
        heading: '제5조 (지적재산권)',
        body: '① 서비스 내 모든 콘텐츠(텍스트, 이미지, 코스 정보, 미션 내용, 여행 코스 큐레이션, 음식 매칭 데이터 등)의 저작권은 회사 또는 원저작권자에게 있습니다.\n② 이용자는 회사의 사전 서면 동의 없이 서비스 콘텐츠를 복제·배포·판매·편집하거나 2차 저작물을 작성할 수 없습니다.\n③ 이용자가 서비스에 등록한 게시물(커뮤니티 글, 사진 등)의 저작권은 해당 이용자에게 있습니다. 단, 이용자는 회사에 서비스 개선 및 홍보 목적으로 해당 게시물을 사용할 수 있는 비독점적·무상·전 세계적 라이선스를 부여합니다.',
      },
      {
        heading: '제6조 (면책 및 책임 제한)',
        body: '① 회사는 천재지변, 서버 장애 등 불가항력적 사유로 인해 서비스를 제공하지 못한 경우 책임을 지지 않습니다.\n② 회사는 이용자 간 또는 이용자와 제3자 간의 분쟁에 대하여 개입 의무가 없으며 이로 인한 손해를 배상할 책임이 없습니다.\n③ 서비스와 연결된 외부 사이트(제휴처 링크 등)에 대한 내용과 신뢰성에 대해 회사는 책임지지 않습니다.\n④ 회사의 귀책사유로 인한 손해배상 범위는 이용자가 해당 서비스에 실제 지불한 금액을 초과하지 않습니다.',
      },
      {
        heading: '제7조 (분쟁 해결 및 준거법)',
        body: '① 서비스 이용과 관련하여 발생한 분쟁은 회사와 이용자가 성실히 협의하여 해결합니다.\n② 협의로 해결되지 않은 경우, 소비자분쟁조정위원회 또는 관할 법원에 해결을 요청할 수 있습니다.\n③ 본 약관은 대한민국 법률에 따라 규율되며, 분쟁 발생 시 관할 법원은 회사 본사 소재지 관할 법원으로 합니다.',
      },
      {
        heading: '부칙',
        body: '본 약관은 2026년 4월 24일부터 시행됩니다.',
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: April 27, 2026',
    sections: [
      {
        heading: 'Article 1 — Purpose',
        body: 'These Terms of Service govern the use of the Legend of Korea service ("Service") operated by Cloud with you ("Company"), and define the rights, obligations, and responsibilities of the Company and users.',
      },
      {
        heading: 'Article 2 — Definitions',
        body: '• "Service": all online services provided by the Company, including travel pass subscriptions, journey course experiences, mission quests, and community features\n• "User": any person who agrees to these Terms and uses the Service\n• "Member": a person who has completed membership registration\n• "Raindrop (빗방울)": virtual points earned through service activities, used for rank-up rewards and coupon exchange',
      },
      {
        heading: 'Article 3 — Use of Service',
        body: '① Users must be at least 14 years of age to register.\n② Users may not transfer or share their account with third parties.\n③ The Company may modify or terminate service content with prior notice.\n④ Fees: Travel pass (Move/Live/Story/All-in-One) subscription prices are displayed on the product page. Payments are processed via Toss Payments.\n⑤ Cancellation: Users may cancel within 7 days of the subscription payment date pursuant to applicable e-commerce law, except where service usage history exists (mission completion, Raindrop accrual, etc.).\n⑥ Raindrops are non-refundable and may only be used within the Service. Any remaining Raindrops are forfeited upon account deletion.',
      },
      {
        heading: 'Article 3-2 — Protection of Users Under 14',
        body: '① The Service is provided on the premise that members are aged 14 or older.\n② If a child under 14 registers without parental consent, the Company will immediately suspend the account and destroy the personal data upon discovery.\n③ However, this does not apply when parental consent has been obtained through the designated procedure.\n④ Users are responsible for the accuracy of the information provided at registration.',
      },
      {
        heading: 'Article 4 — Privacy',
        body: 'The Company protects user personal data in accordance with its Privacy Policy, which is incorporated herein by reference and available as a separate page within the Service.',
      },
      {
        heading: 'Article 5 — Intellectual Property',
        body: '① All Service content (text, images, course information, mission content, travel course curation, food-matching data, etc.) is owned by the Company or respective rights holders.\n② Users may not reproduce, distribute, sell, edit, or create derivative works from Service content without prior written consent.\n③ Posts submitted by users (community posts, photos, etc.) remain the user\'s property, but users grant the Company a non-exclusive, royalty-free, worldwide license to use such content for service improvement and promotion.',
      },
      {
        heading: 'Article 6 — Disclaimer and Limitation of Liability',
        body: '① The Company is not liable for service interruptions caused by force majeure events (natural disasters, server failures, etc.).\n② The Company has no obligation to intervene in disputes between users or between users and third parties.\n③ The Company is not responsible for the content or reliability of external sites linked from the Service.\n④ The Company\'s liability for damages caused by its fault shall not exceed the amount actually paid by the user for the relevant service.',
      },
      {
        heading: 'Article 7 — Governing Law and Dispute Resolution',
        body: '① Disputes arising from use of the Service shall be resolved through good-faith negotiation between the Company and the user.\n② If unresolved, disputes may be submitted to the Consumer Dispute Mediation Committee or a competent court.\n③ These Terms are governed by the laws of the Republic of Korea.',
      },
      {
        heading: 'Supplementary Provision',
        body: 'These Terms are effective as of April 24, 2026.',
      },
    ],
  },
  ja: {
    title: '利用規約',
    updated: '最終更新日: 2026年4月27日',
    sections: [
      {
        heading: '第1条（目的）',
        body: '本規約は、Cloud with you（以下「当社」）が運営するLegend of Koreaサービス（以下「サービス」）の利用条件および手続きに関する事項と、当社と利用者の権利・義務・責任を規定することを目的とします。',
      },
      {
        heading: '第2条（定義）',
        body: '• 「サービス」: 当社が提供する旅行パスの購読、旅行コース体験、ミッションクエスト、コミュニティ等すべてのオンラインサービス\n• 「利用者」: 本規約に同意してサービスを利用する会員および非会員\n• 「会員」: 個人情報を提供して会員登録を完了した者\n• 「雨粒（빗방울 / Raindrop）」: サービス内の活動により付与される仮想ポイント。ランクアップおよびクーポン交換に使用',
      },
      {
        heading: '第3条（サービスの利用）',
        body: '① 会員登録は14歳以上であることが必要です。\n② 利用者は自身のアカウントを第三者に譲渡・共有することができません。\n③ 当社はサービス品質向上等のため、事前告知の上でサービス内容を変更・終了できます。\n④ 利用料金: 旅行パス（Move/Live/Story/All-in-One）購読時は商品ページに表示された金額を支払います。決済はトスペイメンツで処理されます。\n⑤ キャンセル: 電子商取引法に基づき購読決済日から7日以内に申し込みの撤回が可能です。ただし、サービス利用実績がある場合（ミッション完了、雨粒付与等）は制限されることがあります。\n⑥ 雨粒は現金での払い戻しはできず、サービス内でのみ使用可能です。会員退会時に残余の雨粒は消滅します。',
      },
      {
        heading: '第3条の2（14歳未満の保護）',
        body: '① 当社は会員登録時に14歳以上であることを前提にサービスを提供します。\n② 14歳未満の児童が法定代理人の同意なく登録した場合、当社は認知次第直ちに当該アカウントを停止し個人情報を破棄します。\n③ ただし、法定代理人の同意手続きを経て登録した場合は例外とします。\n④ 利用者は登録時に提供した情報の正確性について責任を負います。',
      },
      {
        heading: '第4条（個人情報の保護）',
        body: '当社はプライバシーポリシーに従って利用者の個人情報を保護します。プライバシーポリシーは本規約の一部を構成し、サービス内の別ページで確認できます。',
      },
      {
        heading: '第5条（知的財産権）',
        body: '① サービス内のすべてのコンテンツ（テキスト、画像、コース情報、ミッション内容、旅行コースキュレーション、フードマッチングデータ等）の著作権は当社または原著作権者に帰属します。\n② 利用者は当社の事前書面による同意なしにコンテンツの複製・配布・販売・編集・二次著作物の作成を行うことができません。\n③ 利用者が投稿したコンテンツ（コミュニティ投稿・写真等）の著作権は当該利用者に帰属します。ただし、利用者は当社にサービス改善・宣伝目的での使用について非独占的・無償・全世界的ライセンスを付与するものとします。',
      },
      {
        heading: '第6条（免責および責任の制限）',
        body: '① 当社は天災地変・サーバー障害等の不可抗力によりサービスを提供できなかった場合、責任を負いません。\n② 当社は利用者間または利用者と第三者間の紛争への介入義務を負わず、これによる損害を賠償する責任もありません。\n③ サービスからリンクされた外部サイトの内容・信頼性について当社は責任を負いません。\n④ 当社の責に帰すべき事由による損害賠償の範囲は、利用者が当該サービスに実際に支払った金額を超えないものとします。',
      },
      {
        heading: '第7条（紛争解決・準拠法）',
        body: '① サービスの利用に関して生じた紛争は、当社と利用者が誠実に協議して解決します。\n② 協議により解決しない場合は、消費者紛争調整委員会または管轄裁判所に解決を申し立てることができます。\n③ 本規約は大韓民国法律に準拠し、紛争発生時の管轄裁判所は当社本社所在地の管轄裁判所とします。',
      },
      {
        heading: '附則',
        body: '本規約は2026年4月24日より施行されます。',
      },
    ],
  },
  'zh-CN': {
    title: '服务条款',
    updated: '最后更新：2026年4月27日',
    sections: [
      {
        heading: '第一条（目的）',
        body: '本条款旨在规定Cloud with you（以下简称"本公司"）运营的Legend of Korea服务（以下简称"服务"）的使用条件与程序，以及本公司与用户之间的权利、义务与责任事项。',
      },
      {
        heading: '第二条（定义）',
        body: '• "服务"：本公司提供的旅行通行证订阅、旅行路线体验、任务探索、社区等所有在线服务\n• "用户"：同意本条款并使用服务的会员及非会员\n• "会员"：提供个人信息并完成会员注册的人员\n• "雨滴（빗방울 / Raindrop）"：通过服务内活动获得的虚拟积分，可用于升级奖励及兑换优惠券',
      },
      {
        heading: '第三条（服务使用）',
        body: '① 注册会员需年满14周岁。\n② 用户不得将账号转让或共享给第三方。\n③ 本公司可在事先公告后变更或终止服务内容。\n④ 使用费用：订阅旅行通行证（Move/Live/Story/All-in-One）时按商品页面显示的金额支付，通过Toss Payments处理。\n⑤ 取消：依据电子商务法，可在订阅付款日起7天内申请撤销。但有服务使用记录的情况下（任务完成、雨滴积累等）可能受到限制。\n⑥ 雨滴不可兑换现金，仅限在服务内使用。会员注销时剩余雨滴将消失。',
      },
      {
        heading: '第三条之二（未满14周岁保护）',
        body: '① 本公司以注册会员需年满14周岁为前提提供服务。\n② 未满14周岁儿童未经法定代理人同意注册的，本公司一经发现立即停用该账户并销毁个人信息。\n③ 但通过法定代理人同意程序注册的除外。\n④ 用户应对注册时提供信息的准确性承担责任。',
      },
      {
        heading: '第四条（个人信息保护）',
        body: '本公司依据隐私政策保护用户个人信息。隐私政策作为本条款的组成部分，可在服务内独立页面查阅。',
      },
      {
        heading: '第五条（知识产权）',
        body: '① 服务内所有内容（文字、图片、路线信息、任务内容、旅行路线策划、美食匹配数据等）的版权归本公司或原版权人所有。\n② 用户未经本公司事先书面同意，不得复制、分发、销售、编辑或制作二次创作内容。\n③ 用户发布的内容（社区帖子、照片等）版权归该用户所有，但用户授予本公司用于服务改善及推广的非独占、免费、全球性许可。',
      },
      {
        heading: '第六条（免责及责任限制）',
        body: '① 因不可抗力（自然灾害、服务器故障等）导致无法提供服务时，本公司不承担责任。\n② 本公司对用户间或用户与第三方间的纠纷无介入义务，对此造成的损害不承担赔偿责任。\n③ 本公司对服务所链接的外部网站的内容及可靠性不承担责任。\n④ 因本公司过失造成的损害赔偿范围不超过用户就该服务实际支付的金额。',
      },
      {
        heading: '第七条（争议解决及适用法律）',
        body: '① 因使用服务产生的争议，由本公司与用户诚信协商解决。\n② 协商未能解决的，可向消费者纠纷调解委员会或有管辖权的法院申请解决。\n③ 本条款受大韩民国法律管辖。',
      },
      {
        heading: '附则',
        body: '本条款自2026年4月24日起施行。',
      },
    ],
  },
  'zh-TW': {
    title: '服務條款',
    updated: '最後更新：2026年4月27日',
    sections: [
      {
        heading: '第一條（目的）',
        body: '本條款旨在規定Cloud with you（以下簡稱「本公司」）營運的Legend of Korea服務（以下簡稱「服務」）之使用條件與程序，以及本公司與使用者之間的權利、義務與責任事項。',
      },
      {
        heading: '第二條（定義）',
        body: '• 「服務」：本公司提供的旅行通行證訂閱、旅行路線體驗、任務探索、社群等所有線上服務\n• 「使用者」：同意本條款並使用服務的會員及非會員\n• 「會員」：提供個人資料並完成會員註冊的人員\n• 「雨滴（빗방울 / Raindrop）」：透過服務內活動獲得的虛擬積分，可用於升級獎勵及兌換優惠券',
      },
      {
        heading: '第三條（服務使用）',
        body: '① 會員須年滿14歲方可註冊。\n② 使用者不得將帳號轉讓或共享給第三方。\n③ 本公司可在事先公告後變更或終止服務內容。\n④ 使用費用：訂閱旅行通行證（Move/Live/Story/All-in-One）時依商品頁面所示金額支付，透過Toss Payments處理。\n⑤ 取消：依電子商務法規定，可在訂閱付款日起7天內申請撤銷。但有服務使用紀錄的情況下（任務完成、雨滴積累等）可能受到限制。\n⑥ 雨滴不可兌換現金，僅限在服務內使用。會員刪除帳號時剩餘雨滴將消滅。',
      },
      {
        heading: '第三條之二（未滿14歲保護）',
        body: '① 本公司以註冊會員須年滿14歲為前提提供服務。\n② 未滿14歲兒童未經法定代理人同意註冊的，本公司一經知悉立即停用該帳號並銷毀個人資料。\n③ 但透過法定代理人同意程序註冊的除外。\n④ 使用者應對註冊時提供資訊的準確性承擔責任。',
      },
      {
        heading: '第四條（個人資料保護）',
        body: '本公司依據隱私權政策保護使用者個人資料。隱私權政策為本條款之組成部分，可在服務內獨立頁面查閱。',
      },
      {
        heading: '第五條（智慧財產權）',
        body: '① 服務內所有內容（文字、圖片、路線資訊、任務內容、旅行路線策劃、美食配對資料等）之著作權歸本公司或原著作權人所有。\n② 使用者未經本公司事先書面同意，不得複製、散布、銷售、編輯或製作二次創作內容。\n③ 使用者發布的內容（社群貼文、照片等）著作權歸該使用者所有，但使用者授予本公司用於服務改善及推廣的非獨家、免費、全球性授權。',
      },
      {
        heading: '第六條（免責及責任限制）',
        body: '① 因不可抗力（天災、伺服器故障等）導致無法提供服務時，本公司不承擔責任。\n② 本公司對使用者間或使用者與第三方間的糾紛無介入義務，對此造成的損害不承擔賠償責任。\n③ 本公司對服務所連結的外部網站內容及可靠性不承擔責任。\n④ 因本公司過失造成的損害賠償範圍不超過使用者就該服務實際支付的金額。',
      },
      {
        heading: '第七條（爭議解決及準據法）',
        body: '① 因使用服務產生的爭議，由本公司與使用者誠信協商解決。\n② 協商未能解決的，可向消費者爭議調解委員會或有管轄權的法院申請解決。\n③ 本條款受大韓民國法律管轄。',
      },
      {
        heading: '附則',
        body: '本條款自2026年4月24日起施行。',
      },
    ],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return { title: m.title, description: m.desc }
}

export default function TermsPage({ params }: Props) {
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
