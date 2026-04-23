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
    updated: '최종 수정일: 2026년 4월 23일',
    sections: [
      {
        heading: '제1조 (목적)',
        body: '본 약관은 Cloud with you(이하 "회사")가 운영하는 Legend of Korea 서비스(이하 "서비스")의 이용 조건 및 절차에 관한 사항과 회사와 이용자의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.',
      },
      {
        heading: '제2조 (정의)',
        body: '• "서비스": 회사가 제공하는 미션 키트 판매, QR 미션 게임, LP 시스템, 커뮤니티 등 모든 온라인 서비스\n• "이용자": 본 약관에 동의하고 서비스를 이용하는 회원 및 비회원\n• "회원": 회사에 개인정보를 제공하여 회원 등록을 완료한 자\n• "LP(Legend Point)": 서비스 내 미션 완료 등으로 적립되는 가상 포인트',
      },
      {
        heading: '제3조 (서비스 이용)',
        body: '① 회원가입은 만 14세 이상이어야 합니다.\n② 이용자는 자신의 계정을 제3자에게 양도하거나 공유할 수 없습니다.\n③ 회사는 서비스 품질 향상 등을 위해 사전 공지 후 서비스 내용을 변경하거나 종료할 수 있습니다.\n④ 서비스 이용료: 미션 키트 구매 시 상품 안내 페이지에 표시된 금액을 지불하며, 결제는 토스페이먼츠 또는 Stripe를 통해 처리됩니다.\n⑤ 청약 철회: 전자상거래법 제17조에 따라 구매일로부터 7일 이내 청약 철회가 가능합니다. 단, 이미 사용된 QR 코드(미션 진행 이력이 있는 경우) 또는 키트 포장이 개봉된 경우 청약 철회가 제한될 수 있습니다.',
      },
      {
        heading: '제4조 (개인정보 보호)',
        body: '회사는 이용자의 개인정보를 개인정보처리방침에 따라 보호합니다. 개인정보처리방침은 서비스 내 별도 페이지에서 확인할 수 있으며, 본 약관의 일부를 구성합니다.',
      },
      {
        heading: '제5조 (지적재산권)',
        body: '① 서비스 내 모든 콘텐츠(텍스트, 이미지, 코스 정보, 미션 내용 등)의 저작권은 회사 또는 원저작권자에게 있습니다.\n② 이용자는 회사의 사전 서면 동의 없이 서비스 콘텐츠를 복제·배포·판매·편집하거나 2차 저작물을 작성할 수 없습니다.\n③ 이용자가 서비스에 등록한 게시물(커뮤니티 글, 사진 등)의 저작권은 해당 이용자에게 있습니다. 단, 이용자는 회사에 서비스 개선 및 홍보 목적으로 해당 게시물을 사용할 수 있는 비독점적·무상·전 세계적 라이선스를 부여합니다.',
      },
      {
        heading: '제6조 (면책 및 책임 제한)',
        body: '① 회사는 천재지변, 서버 장애 등 불가항력적 사유로 인해 서비스를 제공하지 못한 경우 책임을 지지 않습니다.\n② 회사는 이용자 간 또는 이용자와 제3자 간의 분쟁에 대하여 개입 의무가 없으며 이로 인한 손해를 배상할 책임이 없습니다.\n③ 서비스와 연결된 외부 사이트(제휴처 링크 등)에 대한 내용과 신뢰성에 대해 회사는 책임지지 않습니다.\n④ 회사의 귀책사유로 인한 손해배상 범위는 이용자가 해당 서비스에 실제 지불한 금액을 초과하지 않습니다.',
      },
      {
        heading: '제7조 (분쟁 해결 및 준거법)',
        body: '① 서비스 이용과 관련하여 발생한 분쟁은 회사와 이용자가 성실히 협의하여 해결합니다.\n② 협의로 해결되지 않은 경우, 소비자분쟁조정위원회 또는 관할 법원에 해결을 요청할 수 있습니다.\n③ 본 약관은 대한민국 법률에 따라 규율되며, 분쟁 발생 시 관할 법원은 회사 본사 소재지 관할 법원으로 합니다.',
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: April 23, 2026',
    sections: [
      {
        heading: 'Article 1 — Purpose',
        body: 'These Terms of Service govern the use of the Legend of Korea service ("Service") operated by Cloud with you ("Company"), and define the rights, obligations, and responsibilities of the Company and users.',
      },
      {
        heading: 'Article 2 — Definitions',
        body: '• "Service": all online services provided by the Company, including mission kit sales, QR mission game, LP system, and community features\n• "User": any person who agrees to these Terms and uses the Service\n• "Member": a person who has completed membership registration\n• "LP (Legend Point)": virtual points earned through mission completion and other activities',
      },
      {
        heading: 'Article 3 — Use of Service',
        body: '① Users must be at least 14 years of age to register.\n② Users may not transfer or share their account with third parties.\n③ The Company may modify or terminate service content with prior notice.\n④ Fees: Mission kit prices are displayed on the product page. Payments are processed via Toss Payments or Stripe.\n⑤ Cancellation: Users may cancel within 7 days of purchase pursuant to applicable e-commerce law, except where a QR code has already been used or kit packaging has been opened.',
      },
      {
        heading: 'Article 4 — Privacy',
        body: 'The Company protects user personal data in accordance with its Privacy Policy, which is incorporated herein by reference and available as a separate page within the Service.',
      },
      {
        heading: 'Article 5 — Intellectual Property',
        body: '① All Service content (text, images, course information, mission content, etc.) is owned by the Company or respective rights holders.\n② Users may not reproduce, distribute, sell, edit, or create derivative works from Service content without prior written consent.\n③ Posts submitted by users (community posts, photos, etc.) remain the user\'s property, but users grant the Company a non-exclusive, royalty-free, worldwide license to use such content for service improvement and promotion.',
      },
      {
        heading: 'Article 6 — Disclaimer and Limitation of Liability',
        body: '① The Company is not liable for service interruptions caused by force majeure events (natural disasters, server failures, etc.).\n② The Company has no obligation to intervene in disputes between users or between users and third parties.\n③ The Company is not responsible for the content or reliability of external sites linked from the Service.\n④ The Company\'s liability for damages caused by its fault shall not exceed the amount actually paid by the user for the relevant service.',
      },
      {
        heading: 'Article 7 — Governing Law and Dispute Resolution',
        body: '① Disputes arising from use of the Service shall be resolved through good-faith negotiation between the Company and the user.\n② If unresolved, disputes may be submitted to the Consumer Dispute Mediation Committee or a competent court.\n③ These Terms are governed by the laws of the Republic of Korea.',
      },
    ],
  },
  ja: {
    title: '利用規約',
    updated: '最終更新日: 2026年4月23日',
    sections: [
      {
        heading: '第1条（目的）',
        body: '本規約は、Cloud with you（以下「当社」）が運営するLegend of Koreaサービス（以下「サービス」）の利用条件および手続きに関する事項と、当社と利用者の権利・義務・責任を規定することを目的とします。',
      },
      {
        heading: '第2条（定義）',
        body: '• 「サービス」: 当社が提供するミッションキット販売、QRミッションゲーム、LPシステム、コミュニティ等すべてのオンラインサービス\n• 「利用者」: 本規約に同意してサービスを利用する会員および非会員\n• 「会員」: 個人情報を提供して会員登録を完了した者\n• 「LP（Legend Point）」: ミッション完了などにより付与される仮想ポイント',
      },
      {
        heading: '第3条（サービスの利用）',
        body: '① 会員登録は14歳以上であることが必要です。\n② 利用者は自身のアカウントを第三者に譲渡・共有することができません。\n③ 当社はサービス品質向上等のため、事前告知の上でサービス内容を変更・終了できます。\n④ 利用料金: ミッションキット購入時は商品ページに表示された金額を支払います。決済はトスペイメンツまたはStripeで処理されます。\n⑤ キャンセル: 電子商取引法に基づき購入日から7日以内に申し込みの撤回が可能です。ただし、QRコードが使用済みまたはキットの梱包が開封された場合は制限されることがあります。',
      },
      {
        heading: '第4条（個人情報の保護）',
        body: '当社はプライバシーポリシーに従って利用者の個人情報を保護します。プライバシーポリシーは本規約の一部を構成し、サービス内の別ページで確認できます。',
      },
      {
        heading: '第5条（知的財産権）',
        body: '① サービス内のすべてのコンテンツ（テキスト、画像、コース情報、ミッション内容等）の著作権は当社または原著作権者に帰属します。\n② 利用者は当社の事前書面による同意なしにコンテンツの複製・配布・販売・編集・二次著作物の作成を行うことができません。\n③ 利用者が投稿したコンテンツ（コミュニティ投稿・写真等）の著作権は当該利用者に帰属します。ただし、利用者は当社にサービス改善・宣伝目的での使用について非独占的・無償・全世界的ライセンスを付与するものとします。',
      },
      {
        heading: '第6条（免責および責任の制限）',
        body: '① 当社は天災地変・サーバー障害等の不可抗力によりサービスを提供できなかった場合、責任を負いません。\n② 当社は利用者間または利用者と第三者間の紛争への介入義務を負わず、これによる損害を賠償する責任もありません。\n③ サービスからリンクされた外部サイトの内容・信頼性について当社は責任を負いません。\n④ 当社の責に帰すべき事由による損害賠償の範囲は、利用者が当該サービスに実際に支払った金額を超えないものとします。',
      },
      {
        heading: '第7条（紛争解決・準拠法）',
        body: '① サービスの利用に関して生じた紛争は、当社と利用者が誠実に協議して解決します。\n② 協議により解決しない場合は、消費者紛争調整委員会または管轄裁判所に解決を申し立てることができます。\n③ 本規約は大韓民国法律に準拠し、紛争発生時の管轄裁判所は当社本社所在地の管轄裁判所とします。',
      },
    ],
  },
  'zh-CN': {
    title: '服务条款',
    updated: '最后更新：2026年4月23日',
    sections: [
      {
        heading: '第一条（目的）',
        body: '本条款旨在规定Cloud with you（以下简称"本公司"）运营的Legend of Korea服务（以下简称"服务"）的使用条件与程序，以及本公司与用户之间的权利、义务与责任事项。',
      },
      {
        heading: '第二条（定义）',
        body: '• "服务"：本公司提供的任务套件销售、二维码任务游戏、LP系统、社区等所有在线服务\n• "用户"：同意本条款并使用服务的会员及非会员\n• "会员"：提供个人信息并完成会员注册的人员\n• "LP（Legend Point）"：通过完成任务等获得的虚拟积分',
      },
      {
        heading: '第三条（服务使用）',
        body: '① 注册会员需年满14周岁。\n② 用户不得将账号转让或共享给第三方。\n③ 本公司可在事先公告后变更或终止服务内容。\n④ 使用费用：购买任务套件时按商品页面显示的金额支付，通过Toss Payments或Stripe处理。\n⑤ 取消：依据电子商务法，购买之日起7天内可申请撤销。但二维码已使用或套件包装已开封的情况下可能受到限制。',
      },
      {
        heading: '第四条（个人信息保护）',
        body: '本公司依据隐私政策保护用户个人信息。隐私政策作为本条款的组成部分，可在服务内独立页面查阅。',
      },
      {
        heading: '第五条（知识产权）',
        body: '① 服务内所有内容（文字、图片、路线信息、任务内容等）的版权归本公司或原版权人所有。\n② 用户未经本公司事先书面同意，不得复制、分发、销售、编辑或制作二次创作内容。\n③ 用户发布的内容（社区帖子、照片等）版权归该用户所有，但用户授予本公司用于服务改善及推广的非独占、免费、全球性许可。',
      },
      {
        heading: '第六条（免责及责任限制）',
        body: '① 因不可抗力（自然灾害、服务器故障等）导致无法提供服务时，本公司不承担责任。\n② 本公司对用户间或用户与第三方间的纠纷无介入义务，对此造成的损害不承担赔偿责任。\n③ 本公司对服务所链接的外部网站的内容及可靠性不承担责任。\n④ 因本公司过失造成的损害赔偿范围不超过用户就该服务实际支付的金额。',
      },
      {
        heading: '第七条（争议解决及适用法律）',
        body: '① 因使用服务产生的争议，由本公司与用户诚信协商解决。\n② 协商未能解决的，可向消费者纠纷调解委员会或有管辖权的法院申请解决。\n③ 本条款受大韩民国法律管辖。',
      },
    ],
  },
  'zh-TW': {
    title: '服務條款',
    updated: '最後更新：2026年4月23日',
    sections: [
      {
        heading: '第一條（目的）',
        body: '本條款旨在規定Cloud with you（以下簡稱「本公司」）營運的Legend of Korea服務（以下簡稱「服務」）之使用條件與程序，以及本公司與使用者之間的權利、義務與責任事項。',
      },
      {
        heading: '第二條（定義）',
        body: '• 「服務」：本公司提供的任務套件銷售、QR碼任務遊戲、LP系統、社群等所有線上服務\n• 「使用者」：同意本條款並使用服務的會員及非會員\n• 「會員」：提供個人資料並完成會員註冊的人員\n• 「LP（Legend Point）」：透過完成任務等獲得的虛擬積分',
      },
      {
        heading: '第三條（服務使用）',
        body: '① 會員須年滿14歲方可註冊。\n② 使用者不得將帳號轉讓或共享給第三方。\n③ 本公司可在事先公告後變更或終止服務內容。\n④ 使用費用：購買任務套件時依商品頁面所示金額支付，透過Toss Payments或Stripe處理。\n⑤ 取消：依電子商務法規定，購買日起7天內可申請撤銷。但QR碼已使用或套件包裝已開封的情況下可能受到限制。',
      },
      {
        heading: '第四條（個人資料保護）',
        body: '本公司依據隱私權政策保護使用者個人資料。隱私權政策為本條款之組成部分，可在服務內獨立頁面查閱。',
      },
      {
        heading: '第五條（智慧財產權）',
        body: '① 服務內所有內容（文字、圖片、路線資訊、任務內容等）之著作權歸本公司或原著作權人所有。\n② 使用者未經本公司事先書面同意，不得複製、散布、銷售、編輯或製作二次創作內容。\n③ 使用者發布的內容（社群貼文、照片等）著作權歸該使用者所有，但使用者授予本公司用於服務改善及推廣的非獨家、免費、全球性授權。',
      },
      {
        heading: '第六條（免責及責任限制）',
        body: '① 因不可抗力（天災、伺服器故障等）導致無法提供服務時，本公司不承擔責任。\n② 本公司對使用者間或使用者與第三方間的糾紛無介入義務，對此造成的損害不承擔賠償責任。\n③ 本公司對服務所連結的外部網站內容及可靠性不承擔責任。\n④ 因本公司過失造成的損害賠償範圍不超過使用者就該服務實際支付的金額。',
      },
      {
        heading: '第七條（爭議解決及準據法）',
        body: '① 因使用服務產生的爭議，由本公司與使用者誠信協商解決。\n② 協商未能解決的，可向消費者爭議調解委員會或有管轄權的法院申請解決。\n③ 本條款受大韓民國法律管轄。',
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
