/**
 * GDPR / EU 사용자 대응 placeholder 섹션.
 *
 * 정식 오픈 전 변호사 자문을 거친 후 본문을 채워 넣는다.
 * 외부 사용자가 약관/개인정보 페이지에서 다음 정보를 명확히 인지할 수 있도록
 * 골격만 미리 노출한다:
 *   1. 데이터 수집 항목 / 이용 목적 / 보관 기간
 *   2. GDPR 권리 (이동권 / 삭제권 / 정정권 / 이용제한권)
 *   3. 데이터 처리 책임자 연락처
 */

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

interface GdprBlock {
  notice: string
  collectionTitle: string
  collectionBody: string
  rightsTitle: string
  rightsBody: string
  controllerTitle: string
  controllerBody: string
  placeholder: string
}

const TEXT: Record<Lang, GdprBlock> = {
  ko: {
    notice: 'GDPR / EU 사용자 권리 안내 (베타 단계 — 변호사 자문 후 본문 갱신 예정)',
    collectionTitle: '데이터 수집 항목 / 이용 목적 / 보관 기간',
    collectionBody: '[변호사 자문 후 본문 작성 — 정식 오픈 전 갱신 예정]',
    rightsTitle: 'GDPR 권리 (이동권 / 삭제권 / 정정권 / 이용제한권)',
    rightsBody: '[변호사 자문 후 본문 작성 — 정식 오픈 전 갱신 예정]\n\n현 시점 코드 레벨에서 제공되는 권리:\n• 이동권: 마이페이지 → 내 데이터 다운로드 (JSON 내보내기)\n• 삭제권: 마이페이지 → 회원 탈퇴',
    controllerTitle: '데이터 처리 책임자 연락처',
    controllerBody: '[변호사 자문 후 본문 작성 — 정식 오픈 전 갱신 예정]',
    placeholder: '— 변호사 자문 진행 중 —',
  },
  ja: {
    notice: 'GDPR / EUユーザー権利のお知らせ（ベータ段階 — 弁護士相談後に本文更新予定）',
    collectionTitle: 'データ収集項目 / 利用目的 / 保管期間',
    collectionBody: '[弁護士相談後に本文作成 — 正式オープン前に更新予定]',
    rightsTitle: 'GDPR権利（ポータビリティ / 削除権 / 訂正権 / 利用制限権）',
    rightsBody: '[弁護士相談後に本文作成 — 正式オープン前に更新予定]\n\n現時点でコードレベルで提供される権利:\n• ポータビリティ: マイページ → マイデータをダウンロード（JSON出力）\n• 削除権: マイページ → 退会',
    controllerTitle: 'データ処理責任者連絡先',
    controllerBody: '[弁護士相談後に本文作成 — 正式オープン前に更新予定]',
    placeholder: '— 弁護士相談中 —',
  },
  en: {
    notice: 'GDPR / EU User Rights Notice (Beta — body will be updated after legal review)',
    collectionTitle: 'Data Collection / Purpose / Retention Period',
    collectionBody: '[To be drafted after legal review — will be updated before official launch]',
    rightsTitle: 'GDPR Rights (Portability / Erasure / Rectification / Restriction)',
    rightsBody: '[To be drafted after legal review — will be updated before official launch]\n\nRights currently available at the code level:\n• Portability: My Page → Download My Data (JSON export)\n• Erasure: My Page → Delete Account',
    controllerTitle: 'Data Controller Contact',
    controllerBody: '[To be drafted after legal review — will be updated before official launch]',
    placeholder: '— legal review in progress —',
  },
  'zh-CN': {
    notice: 'GDPR / 欧盟用户权利通知（测试版 — 律师咨询后将更新正文）',
    collectionTitle: '数据收集项 / 使用目的 / 保留期限',
    collectionBody: '[律师咨询后撰写正文 — 正式上线前更新]',
    rightsTitle: 'GDPR 权利（数据可携权 / 删除权 / 更正权 / 限制处理权）',
    rightsBody: '[律师咨询后撰写正文 — 正式上线前更新]\n\n当前在代码层面提供的权利:\n• 数据可携权: 我的页面 → 下载我的数据（JSON 导出）\n• 删除权: 我的页面 → 注销账号',
    controllerTitle: '数据处理负责人联系方式',
    controllerBody: '[律师咨询后撰写正文 — 正式上线前更新]',
    placeholder: '— 律师咨询中 —',
  },
  'zh-TW': {
    notice: 'GDPR / 歐盟使用者權利通知（測試版 — 律師諮詢後將更新正文）',
    collectionTitle: '資料蒐集項 / 使用目的 / 保留期限',
    collectionBody: '[律師諮詢後撰寫正文 — 正式上線前更新]',
    rightsTitle: 'GDPR 權利（資料可攜權 / 刪除權 / 更正權 / 限制處理權）',
    rightsBody: '[律師諮詢後撰寫正文 — 正式上線前更新]\n\n目前在程式碼層級提供的權利:\n• 資料可攜權: 我的頁面 → 下載我的資料（JSON 匯出）\n• 刪除權: 我的頁面 → 註銷帳號',
    controllerTitle: '資料處理負責人聯絡方式',
    controllerBody: '[律師諮詢後撰寫正文 — 正式上線前更新]',
    placeholder: '— 律師諮詢中 —',
  },
}

interface Props {
  locale: string
}

export function GdprPlaceholderSections({ locale }: Props) {
  const lang: Lang = (['ko', 'ja', 'en', 'zh-CN', 'zh-TW'] as const).includes(locale as Lang)
    ? (locale as Lang)
    : 'ko'
  const t = TEXT[lang]

  const sections = [
    { heading: t.collectionTitle, body: t.collectionBody },
    { heading: t.rightsTitle, body: t.rightsBody },
    { heading: t.controllerTitle, body: t.controllerBody },
  ]

  return (
    <div className="rounded-2xl border-2 border-dashed border-blossom bg-blossom-light/30 p-5 md:p-6 mt-10">
      <p className="text-xs font-bold text-blossom-deep uppercase tracking-wider mb-1">
        ⓘ {t.placeholder}
      </p>
      <p className="text-sm font-bold text-ink mb-5">{t.notice}</p>
      <div className="space-y-5">
        {sections.map((s) => (
          <section key={s.heading}>
            <h3 className="text-sm font-bold text-ink mb-2">{s.heading}</h3>
            <p className="text-stone text-xs leading-relaxed whitespace-pre-line">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
