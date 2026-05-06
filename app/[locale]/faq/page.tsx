import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props { params: { locale: string } }

const META: Record<string, { title: string; desc: string }> = {
  ko: { title: '자주 묻는 질문 | Clouds with you', desc: '서비스 이용 관련 자주 묻는 질문' },
  en: { title: 'FAQ | Clouds with you', desc: 'Frequently asked questions' },
  ja: { title: 'よくある質問 | Clouds with you', desc: 'サービス利用に関するよくある質問' },
  'zh-CN': { title: '常见问题 | Clouds with you', desc: '服务使用相关常见问题' },
  'zh-TW': { title: '常見問題 | Clouds with you', desc: '服務使用相關常見問題' },
}

type QA = { q: string; a: string }

const CONTENT: Record<string, { title: string; subtitle: string; items: QA[] }> = {
  ko: {
    title: '자주 묻는 질문',
    subtitle: '여행 전 궁금한 것을 빠르게 확인해 보세요',
    items: [
      { q: '미션 패스는 어떻게 사용하나요?', a: '구매 즉시 디지털 미션 패스가 활성화됩니다. 코스 페이지에서 미션을 자유롭게 진행하세요. 한국 도착 전 미리 코스 탐색이 가능하며 별도 배송이나 수령 절차가 없습니다.' },
      { q: '혼자서도 즐길 수 있나요?', a: '물론입니다! 1인용과 2인용이 모두 준비되어 있으며, 나 홀로 여행자도 충분히 즐길 수 있도록 설계되었습니다.' },
      { q: '한국어 외 다른 언어도 지원하나요?', a: '네. 한국어 / 일본어 / 영어 / 간체중국어 / 번체중국어 5개 언어를 모두 지원합니다.' },
      { q: '취소 및 환불은 어떻게 되나요?', a: '미사용 패스는 구매 후 7일 이내 100% 환불 가능합니다. 미션 활동을 1건이라도 인증한 경우 환불이 제한될 수 있습니다. 자세한 내용은 고객센터로 문의해 주세요.' },
      { q: '여행 패스는 어떻게 구매하나요?', a: '코스 페이지의 "패스 구매" 버튼을 통해 토스페이먼츠로 결제 후 즉시 활성화됩니다. Short / Standard / Long 3종 중 선택 가능합니다.' },
      { q: '미션 인증은 어떻게 하나요?', a: '현장에 도착하면 키트의 QR 코드를 스캔하거나 스마트폰 앱으로 GPS 인증을 진행합니다. 인증 완료 시 빗방울이 자동 적립됩니다.' },
      { q: '빗방울은 어디에 사용하나요?', a: '레벨 업, 한국 문화 카테고리 사진 해금, 할인 쿠폰 교환 등 서비스 내 다양한 활동에 사용됩니다. 현금 환급은 불가능합니다.' },
      { q: 'ZEP 가상 모임은 무엇인가요?', a: '활성 패스 보유 사용자가 입장 가능한 가상 만남 공간입니다. 다른 모험가들과 만나 여행 전 인사를 나누고, 코스별 정보를 공유할 수 있습니다.' },
    ],
  },
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Quick answers to common questions before your trip',
    items: [
      { q: 'How do I use the Mission Pass?', a: 'Your digital Mission Pass activates the moment you purchase it. Open the course page and start any mission freely. You can browse courses before arriving in Korea — no shipping or pickup needed.' },
      { q: 'Can I enjoy this alone?', a: 'Absolutely. Both solo and duo kits are available, and the experience is designed to work great for solo travellers as well.' },
      { q: 'Are languages other than Korean supported?', a: 'Yes — Korean, Japanese, English, Simplified Chinese, and Traditional Chinese are all supported.' },
      { q: 'How does cancellation and refund work?', a: 'Unused passes can be fully refunded within 7 days of purchase. Once any mission has been verified, refunds may be limited. Contact customer support for details.' },
      { q: 'How do I buy a travel pass?', a: 'Use the "Buy Pass" button on the course page to pay via Toss Payments — your pass activates immediately. Choose between Short / Standard / Long.' },
      { q: 'How do I verify mission completion?', a: 'On site, scan the kit\'s QR code or use GPS verification via the app. Raindrops are automatically credited upon successful verification.' },
      { q: 'What can I do with Raindrops?', a: 'Use them for levelling up, unlocking K-culture category photos, redeeming discount coupons, and other in-service activities. Cash refunds are not available.' },
      { q: 'What is the ZEP virtual gathering?', a: 'A virtual meeting space accessible to users with an active pass. Meet other adventurers, exchange greetings before the trip, and share information about each course.' },
    ],
  },
  ja: {
    title: 'よくある質問',
    subtitle: 'ご旅行前に気になる点をすぐに確認できます',
    items: [
      { q: 'ミッションパスはどう使いますか?', a: 'ご購入と同時にデジタルミッションパスが有効化されます。コースページからミッションを自由に進めてください。韓国到着前にコースの下見も可能で、配送や受け取り手続きはありません。' },
      { q: '一人でも楽しめますか?', a: 'もちろんです。1名様用と2名様用の両方をご用意しており、お一人旅にも最適な設計になっています。' },
      { q: '韓国語以外の言語にも対応していますか?', a: 'はい。韓国語 / 日本語 / 英語 / 簡体中国語 / 繁体中国語の5言語に対応しています。' },
      { q: 'キャンセル・返金はどのようになりますか?', a: '未使用のパスは購入後7日以内であれば100%返金可能です。1件でもミッションを認証された場合は返金が制限されることがあります。詳細はカスタマーサポートまでお問い合わせください。' },
      { q: '旅行パスはどう購入しますか?', a: 'コースページの「パス購入」ボタンからTossペイメンツで決済後、即時に有効化されます。Short / Standard / Long の3種類からお選びいただけます。' },
      { q: 'ミッションの認証はどうしますか?', a: '現地でキットのQRコードをスキャンするか、アプリのGPS認証をご利用ください。認証完了で雨滴が自動で付与されます。' },
      { q: '雨滴は何に使いますか?', a: 'レベルアップ、韓国文化カテゴリ写真の解放、割引クーポン交換など、サービス内の様々な活動に使用できます。現金への払い戻しはできません。' },
      { q: 'ZEPバーチャル集会とは?', a: '有効なパスをお持ちの方が入れる仮想交流スペースです。他の冒険者と出会い、旅前の挨拶やコース情報の共有ができます。' },
    ],
  },
  'zh-CN': {
    title: '常见问题',
    subtitle: '旅行前快速了解常见疑问',
    items: [
      { q: '任务通行证如何使用?', a: '购买后数字任务通行证立即激活。在课程页面自由进行任务。抵达韩国前即可预先浏览课程，无需配送或领取。' },
      { q: '一个人也能玩吗?', a: '当然可以。我们提供单人套件和双人套件，独自旅行者也能尽情体验。' },
      { q: '是否支持韩语以外的其他语言?', a: '支持。韩语 / 日语 / 英语 / 简体中文 / 繁体中文 共五种语言。' },
      { q: '如何取消和退款?', a: '未使用的通行证在购买后 7 日内可全额退款。任何任务一旦完成认证，退款可能会受限。详情请联系客服。' },
      { q: '如何购买旅行通行证?', a: '通过课程页面的"购买通行证"按钮使用Toss Payments付款后即可立即激活。可选择 Short / Standard / Long 三种。' },
      { q: '任务如何认证?', a: '现场扫描套件中的二维码或使用应用的GPS认证。认证成功后雨滴会自动入账。' },
      { q: '雨滴可以做什么?', a: '可用于升级、解锁韩国文化分类图片、兑换折扣券等服务内活动。不支持现金退款。' },
      { q: 'ZEP虚拟聚会是什么?', a: '持有有效通行证的用户可进入的虚拟交流空间。可以遇见其他冒险者，旅行前打招呼并分享课程信息。' },
    ],
  },
  'zh-TW': {
    title: '常見問題',
    subtitle: '旅行前快速了解常見疑問',
    items: [
      { q: '任務通行證如何使用?', a: '購買後數位任務通行證立即啟用。在課程頁面自由進行任務。抵達韓國前即可預先瀏覽課程，無需配送或領取。' },
      { q: '一個人也能玩嗎?', a: '當然可以。我們提供單人套件和雙人套件，獨自旅行者也能盡情體驗。' },
      { q: '是否支援韓語以外的其他語言?', a: '支援。韓語 / 日語 / 英語 / 簡體中文 / 繁體中文 共五種語言。' },
      { q: '如何取消和退款?', a: '未使用的通行證在購買後 7 日內可全額退款。任何任務一旦完成認證，退款可能會受限。詳情請聯絡客服。' },
      { q: '如何購買旅行通行證?', a: '透過課程頁面的「購買通行證」按鈕使用 Toss Payments 付款後即可立即啟用。可選擇 Short / Standard / Long 三種。' },
      { q: '任務如何認證?', a: '現場掃描套件中的 QR Code 或使用應用程式的 GPS 認證。認證成功後雨滴會自動入帳。' },
      { q: '雨滴可以做什麼?', a: '可用於升級、解鎖韓國文化分類圖片、兌換折扣券等服務內活動。不支援現金退款。' },
      { q: 'ZEP 虛擬聚會是什麼?', a: '持有有效通行證的使用者可進入的虛擬交流空間。可以遇見其他冒險者，旅行前打招呼並分享課程資訊。' },
    ],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = META[params.locale] ?? META.ko
  return { title: m.title, description: m.desc }
}

export default function FaqPage({ params }: Props) {
  const c = CONTENT[params.locale] ?? CONTENT.ko
  return (
    <div className="min-h-screen bg-snow">
      <div className="bg-gradient-to-br from-mint to-blossom text-ink py-20 px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black">{c.title}</h1>
        <p className="mt-3 text-sm opacity-70">{c.subtitle}</p>
      </div>
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16 space-y-3">
        {c.items.map((item, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-mist bg-white open:shadow-md transition-shadow"
          >
            <summary className="cursor-pointer list-none flex items-start gap-3 p-5 font-bold text-ink hover:bg-cloud/40 rounded-2xl">
              <span className="text-mint-deep text-sm font-black shrink-0 mt-0.5">Q{i + 1}.</span>
              <span className="flex-1">{item.q}</span>
              <span className="text-stone group-open:rotate-180 transition-transform shrink-0" aria-hidden>▾</span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-slate text-sm leading-relaxed whitespace-pre-line border-t border-mist/60">
              <div className="pt-4">{item.a}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
