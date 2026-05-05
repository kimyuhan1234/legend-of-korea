import { Metadata } from 'next'
import { GdprPlaceholderSections } from '@/components/shared/GdprPlaceholderSections'

interface Props { params: { locale: string } }

const META: Record<string, { title: string; desc: string }> = {
  ko: { title: '개인정보처리방침 | Clouds with you', desc: '개인정보 보호 정책' },
  en: { title: 'Privacy Policy | Clouds with you', desc: 'Privacy Policy' },
  ja: { title: 'プライバシーポリシー | Clouds with you', desc: 'プライバシーポリシー' },
  'zh-CN': { title: '隐私政策 | Clouds with you', desc: '隐私保护政策' },
  'zh-TW': { title: '隱私權政策 | Clouds with you', desc: '隱私保護政策' },
}

type Section = { heading: string; body: string }

const CONTENT: Record<string, { title: string; updated: string; sections: Section[] }> = {
  ko: {
    title: '개인정보처리방침',
    updated: '최종 수정일: 2026년 4월 24일',
    sections: [
      {
        heading: '1. 개인정보의 처리 목적',
        body: 'Clouds with you(이하 "회사")는 다음 목적을 위해 개인정보를 처리합니다.\n• 회원 가입 및 관리: 서비스 이용계약 체결, 본인 확인, 회원 식별, 탈퇴 처리\n• 서비스 제공: 여행 패스 구독, 빗방울 적립, 여행 플래너, 커뮤니티 기능\n• 고객 지원: 불만 처리 및 공지사항 전달\n• 법적 의무 이행: 전자상거래법상 거래 기록 보관',
      },
      {
        heading: '2. 처리하는 개인정보의 항목',
        body: '수집 항목\n• 필수: 이메일 주소, 비밀번호(해시 저장), 닉네임, 서비스 이용 언어\n• 선택: 프로필 사진\n• 결제 시 추가: 결제자 이름, 결제 수단 정보(토스페이먼츠 처리), 주문 금액\n• 자동 수집: 접속 IP, 브라우저 종류, 서비스 이용 기록',
      },
      {
        heading: '3. 개인정보의 처리 및 보유 기간',
        body: '• 회원 정보: 회원 탈퇴 시까지\n• 탈퇴 후 익명화 보관: 거래 기록은 전자상거래법 제6조에 따라 5년 보관 (식별 정보 제거 후)\n• 탈퇴 요청 기록: 3년 보관 (분쟁 해결 목적)\n• 법령에 의한 보관이 필요한 경우 해당 법령에서 정한 기간 동안 보관',
      },
      {
        heading: '4. 개인정보의 제3자 제공',
        body: '회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우 예외입니다.\n• 이용자가 사전에 동의한 경우\n• 법령의 규정에 의한 경우 (수사기관의 요청 등)',
      },
      {
        heading: '5. 개인정보 처리 위탁',
        body: '회사는 서비스 제공을 위해 다음 업체에 개인정보 처리를 위탁합니다.\n• Supabase Inc. — 데이터베이스 및 인증 서버 운영 (AWS 클라우드)\n• Vercel Inc. — 웹 서버 호스팅\n• 토스페이먼츠(주) — 결제 처리\n각 위탁 업체는 위탁받은 목적 범위 내에서만 개인정보를 처리합니다.',
      },
      {
        heading: '6. 정보주체의 권리·의무 및 행사방법',
        body: '이용자는 언제든지 다음 권리를 행사할 수 있습니다.\n• 개인정보 열람 요청\n• 정정·삭제 요청\n• 처리 정지 요청\n• 동의 철회\n행사 방법: 마이페이지 내 회원 정보 수정 또는 고객센터(kimyuhan1989@gmail.com) 이메일 문의. 요청 접수 후 10영업일 이내 처리합니다.',
      },
      {
        heading: '7. 개인정보의 안전성 확보조치',
        body: '회사는 개인정보보호법 제29조에 따라 다음 안전성 확보조치를 취합니다.\n• 비밀번호 단방향 암호화(해시) 저장\n• HTTPS TLS 1.2 이상 적용\n• 접근 권한 최소화 (Row Level Security)\n• 정기적 취약점 점검',
      },
      {
        heading: '8. 개인정보 자동 수집 장치',
        body: '회사는 서비스 개선 및 이용자 경험 향상을 위해 쿠키 및 유사 기술을 사용합니다.\n• 쿠키 사용 목적: 로그인 세션 유지, 서비스 언어 설정 저장\n• 쿠키 거부 방법: 브라우저 설정에서 거부 가능. 단, 일부 서비스 이용이 제한될 수 있습니다.',
      },
      {
        heading: '9. 개인정보 보호책임자',
        body: '성명: 김유한\n이메일: kimyuhan1989@gmail.com\n개인정보 관련 문의, 불만 처리, 피해 구제 등에 관한 사항은 위 책임자에게 문의하시기 바랍니다. 개인정보 관련 분쟁 해결 기관: 개인정보분쟁조정위원회(www.kopico.go.kr), 개인정보침해신고센터(privacy.kisa.or.kr)',
      },
      {
        heading: '시행일',
        body: '본 방침은 2026년 4월 24일부터 시행됩니다.',
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: April 24, 2026',
    sections: [
      {
        heading: '1. Purposes of Processing Personal Data',
        body: 'Clouds with you ("Company") processes personal data for the following purposes:\n• Account registration and management: contract formation, identity verification, member identification, account deletion\n• Service delivery: travel pass subscriptions, Raindrop (빗방울) accrual, travel planner, community features\n• Customer support: complaint handling and notifications\n• Legal obligations: retention of transaction records under applicable e-commerce law',
      },
      {
        heading: '2. Categories of Personal Data Collected',
        body: 'Required at sign-up: email address, password (stored as hash), nickname, preferred language\nOptional: profile photo\nAdditional at checkout: payer name, payment method information (processed by Toss Payments), order amount\nAutomatically collected: IP address, browser type, service usage logs',
      },
      {
        heading: '3. Retention Period',
        body: '• Member information: retained until account deletion\n• After deletion: transaction records retained for 5 years in anonymized form (as required by Korean e-commerce law)\n• Withdrawal request records: retained for 3 years for dispute resolution\n• Records required by law: retained for the period specified by the applicable law',
      },
      {
        heading: '4. Sharing with Third Parties',
        body: 'The Company does not share personal data with third parties except:\n• When the user has given prior consent\n• When required by law (e.g., law enforcement requests)',
      },
      {
        heading: '5. Data Processing Subcontractors',
        body: 'The Company entrusts personal data processing to the following providers:\n• Supabase Inc. — database and authentication (AWS cloud)\n• Vercel Inc. — web hosting\n• Toss Payments — payment processing\nEach subcontractor processes data only within the scope of the entrusted purpose.',
      },
      {
        heading: '6. Your Rights',
        body: 'You may exercise the following rights at any time:\n• Access your personal data\n• Request correction or deletion\n• Request suspension of processing\n• Withdraw consent\nHow to exercise: via account settings in My Page or by emailing kimyuhan1989@gmail.com. Requests will be handled within 10 business days.',
      },
      {
        heading: '7. Security Measures',
        body: 'The Company takes the following measures to protect personal data:\n• One-way password hashing\n• HTTPS with TLS 1.2 or higher\n• Minimum privilege access controls (Row Level Security)\n• Regular vulnerability assessments',
      },
      {
        heading: '8. Cookies and Automated Data Collection',
        body: 'The Company uses cookies to maintain login sessions and save language preferences. You may refuse cookies via browser settings, though some service features may be limited as a result.',
      },
      {
        heading: '9. Data Protection Officer',
        body: 'Name: Yuhan Kim\nEmail: kimyuhan1989@gmail.com\nFor inquiries about personal data, complaints, or dispute resolution, please contact the officer above.',
      },
      {
        heading: 'Effective Date',
        body: 'This policy is effective as of April 24, 2026.',
      },
    ],
  },
  ja: {
    title: 'プライバシーポリシー',
    updated: '最終更新日: 2026年4月24日',
    sections: [
      {
        heading: '1. 個人情報の処理目的',
        body: 'Clouds with you（以下「当社」）は以下の目的で個人情報を処理します。\n• 会員登録・管理: 利用契約締結、本人確認、会員識別、退会処理\n• サービス提供: 旅行パスの購読、雨粒（빗방울）の付与、旅行プランナー、コミュニティ機能\n• カスタマーサポート: 問い合わせ対応・お知らせ配信\n• 法的義務: 電子商取引法に基づく取引記録の保管',
      },
      {
        heading: '2. 収集する個人情報の項目',
        body: '必須項目: メールアドレス、パスワード（ハッシュ保存）、ニックネーム、サービス利用言語\n任意項目: プロフィール写真\n購入時の追加情報: 決済者氏名、決済手段情報（トスペイメンツ処理）、注文金額\n自動収集: IPアドレス、ブラウザ種類、サービス利用履歴',
      },
      {
        heading: '3. 個人情報の保有期間',
        body: '• 会員情報: 退会まで\n• 退会後: 取引記録は韓国電子商取引法に基づき5年間匿名化して保管\n• 退会申請記録: 紛争解決を目的として3年間保管\n• 法令に定める保管期間がある場合は、当該法令の定める期間保管',
      },
      {
        heading: '4. 第三者への提供',
        body: '当社は原則として個人情報を第三者に提供しません。ただし以下の場合を除きます。\n• 利用者が事前に同意した場合\n• 法令の規定による場合（捜査機関の要請等）',
      },
      {
        heading: '5. 個人情報処理の委託',
        body: '当社はサービス提供のため、以下の事業者に個人情報処理を委託しています。\n• Supabase Inc. — データベース・認証サーバー（AWSクラウド）\n• Vercel Inc. — Webホスティング\n• トスペイメンツ — 決済処理\n各委託先は委託された目的の範囲内のみで個人情報を処理します。',
      },
      {
        heading: '6. 利用者の権利および行使方法',
        body: '利用者はいつでも以下の権利を行使できます。\n• 個人情報の閲覧請求\n• 訂正・削除の請求\n• 処理停止の請求\n• 同意の撤回\n行使方法: マイページの会員情報設定または kimyuhan1989@gmail.com へのメールにてお申し込みください。受付後10営業日以内に対応します。',
      },
      {
        heading: '7. 個人情報の安全管理措置',
        body: '当社は以下の安全管理措置を講じています。\n• パスワードの一方向ハッシュ化\n• HTTPS（TLS 1.2以上）の適用\n• 最小限のアクセス権限管理（行レベルセキュリティ）\n• 定期的な脆弱性診断',
      },
      {
        heading: '8. クッキーおよび自動収集装置',
        body: '当社はログインセッションの維持および言語設定の保存のためにクッキーを使用します。ブラウザ設定でクッキーを拒否することができますが、一部のサービス機能が制限される場合があります。',
      },
      {
        heading: '9. 個人情報保護責任者',
        body: '氏名: 김유한（キム・ユハン）\nメール: kimyuhan1989@gmail.com\n個人情報に関するお問い合わせ・苦情・被害救済については上記責任者にご連絡ください。',
      },
      {
        heading: '施行日',
        body: '本方針は2026年4月24日より施行されます。',
      },
    ],
  },
  'zh-CN': {
    title: '隐私政策',
    updated: '最后更新: 2026年4月24日',
    sections: [
      {
        heading: '1. 个人信息处理目的',
        body: 'Clouds with you（以下简称"本公司"）出于以下目的处理个人信息。\n• 会员注册与管理：签订服务协议、身份验证、会员识别、注销处理\n• 服务提供：旅行通行证订阅、雨滴（빗방울）积分累积、旅行规划器、社区功能\n• 客户支持：投诉处理及通知发送\n• 法律义务：依据电子商务法保存交易记录',
      },
      {
        heading: '2. 收集的个人信息项目',
        body: '必填项：电子邮件地址、密码（哈希存储）、昵称、服务语言\n可选项：个人资料照片\n结账时额外收集：付款人姓名、支付方式信息（由Toss Payments处理）、订单金额\n自动收集：IP地址、浏览器类型、服务使用记录',
      },
      {
        heading: '3. 个人信息保留期限',
        body: '• 会员信息：保留至注销为止\n• 注销后：交易记录依据韩国电子商务法以匿名化方式保留5年\n• 注销申请记录：为解决纠纷保留3年\n• 法律规定保留的情形：按相关法律规定的期限保留',
      },
      {
        heading: '4. 向第三方提供',
        body: '本公司原则上不向第三方提供个人信息。但以下情况除外：\n• 用户事先同意的情况\n• 法律法规要求的情况（如执法机关的请求）',
      },
      {
        heading: '5. 个人信息处理委托',
        body: '本公司将个人信息处理委托给以下机构：\n• Supabase Inc. — 数据库及认证服务器（AWS云）\n• Vercel Inc. — 网页托管\n• Toss Payments — 支付处理\n各受托方仅在委托目的范围内处理个人信息。',
      },
      {
        heading: '6. 用户权利及行使方式',
        body: '用户可随时行使以下权利：\n• 请求查阅个人信息\n• 请求更正或删除\n• 请求停止处理\n• 撤回同意\n行使方式：通过"我的主页"会员信息设置或发送邮件至 kimyuhan1989@gmail.com，收到请求后10个工作日内处理。',
      },
      {
        heading: '7. 个人信息安全措施',
        body: '本公司采取以下安全措施保护个人信息：\n• 密码单向哈希加密存储\n• HTTPS（TLS 1.2及以上）\n• 最小权限访问控制（行级安全）\n• 定期安全漏洞检测',
      },
      {
        heading: '8. Cookie及自动收集装置',
        body: '本公司使用Cookie以维持登录会话及保存语言设置。您可通过浏览器设置拒绝Cookie，但部分服务功能可能因此受限。',
      },
      {
        heading: '9. 个人信息保护负责人',
        body: '姓名：김유한（Kim Yuhan）\n邮箱：kimyuhan1989@gmail.com\n如有个人信息相关问题、投诉或损害救济事宜，请联系上述负责人。',
      },
      {
        heading: '施行日期',
        body: '本政策自2026年4月24日起施行。',
      },
    ],
  },
  'zh-TW': {
    title: '隱私權政策',
    updated: '最後更新：2026年4月24日',
    sections: [
      {
        heading: '1. 個人資料處理目的',
        body: 'Clouds with you（以下簡稱「本公司」）基於以下目的處理個人資料。\n• 會員註冊與管理：簽訂服務合約、身分驗證、會員識別、帳號刪除\n• 服務提供：旅行通行證訂閱、雨滴（빗방울）積分累積、旅行規劃器、社群功能\n• 客服支援：申訴處理及通知傳送\n• 法律義務：依電子商務法保存交易紀錄',
      },
      {
        heading: '2. 收集的個人資料項目',
        body: '必填項目：電子郵件地址、密碼（雜湊儲存）、暱稱、服務語言\n選填項目：個人資料照片\n結帳時額外收集：付款人姓名、付款方式資訊（由Toss Payments處理）、訂單金額\n自動收集：IP位址、瀏覽器類型、服務使用紀錄',
      },
      {
        heading: '3. 個人資料保留期限',
        body: '• 會員資料：保留至帳號刪除為止\n• 刪除後：交易紀錄依據韓國電子商務法以匿名化方式保留5年\n• 刪除申請紀錄：為解決爭議保留3年\n• 法律規定保留之情形：依相關法規規定期限保留',
      },
      {
        heading: '4. 提供第三方',
        body: '本公司原則上不向第三方提供個人資料。但下列情況除外：\n• 使用者事前同意時\n• 法律法規要求時（如執法機關請求）',
      },
      {
        heading: '5. 個人資料處理委託',
        body: '本公司將個人資料處理委託給以下機構：\n• Supabase Inc. — 資料庫及驗證伺服器（AWS雲端）\n• Vercel Inc. — 網頁託管\n• Toss Payments — 付款處理\n各受託方僅在委託目的範圍內處理個人資料。',
      },
      {
        heading: '6. 使用者權利及行使方式',
        body: '使用者可隨時行使以下權利：\n• 申請查閱個人資料\n• 申請更正或刪除\n• 申請停止處理\n• 撤回同意\n行使方式：透過「我的主頁」會員資料設定，或寄信至 kimyuhan1989@gmail.com，收到申請後10個工作日內處理。',
      },
      {
        heading: '7. 個人資料安全措施',
        body: '本公司採取以下安全措施保護個人資料：\n• 密碼單向雜湊加密儲存\n• HTTPS（TLS 1.2以上）\n• 最小授權存取控制（列層級安全性）\n• 定期安全弱點檢測',
      },
      {
        heading: '8. Cookie及自動收集裝置',
        body: '本公司使用Cookie以維持登入工作階段及儲存語言設定。您可透過瀏覽器設定拒絕Cookie，但部分服務功能可能因此受限。',
      },
      {
        heading: '9. 個人資料保護負責人',
        body: '姓名：김유한（Kim Yuhan）\n電子郵件：kimyuhan1989@gmail.com\n如有個人資料相關問題、申訴或損害救濟事宜，請聯繫上述負責人。',
      },
      {
        heading: '施行日期',
        body: '本政策自2026年4月24日起施行。',
      },
    ],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return { title: m.title, description: m.desc }
}

export default function PrivacyPage({ params }: Props) {
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
        {/* GDPR / EU 사용자 권리 placeholder — 변호사 자문 후 본문 갱신 예정 */}
        <GdprPlaceholderSections locale={params.locale} />
      </div>
    </div>
  )
}
