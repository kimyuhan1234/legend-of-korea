import Link from "next/link"

interface ReviewPost {
  id: string
  content: string
  photos: string[] | null
  likes_count: number
  created_at: string
  is_spoiler: boolean
  users: {
    nickname: string
    avatar_url: string | null
    current_tier: number
  } | null
}

interface CourseReviewsProps {
  posts: ReviewPost[]
  courseId: string
  locale: string
}

const LABEL = {
  ko: {
    title: "모험가들의 후기",
    empty: "첫 전설의 주인공이 되어보세요",
    emptyDesc: "이 코스를 완주하고 기록을 남겨보세요",
    spoiler: "스포일러 포함",
    likes: "전설 박수",
    writeReview: "후기 남기기",
    viewAll: "전체 후기 보기",
  },
  ja: {
    title: "冒険者のレビュー",
    empty: "最初の伝説の主人公になりましょう",
    emptyDesc: "このコースを完走して記録を残してください",
    spoiler: "ネタバレあり",
    likes: "拍手",
    writeReview: "レビューを書く",
    viewAll: "すべてのレビューを見る",
  },
  en: {
    title: "Adventurer Reviews",
    empty: "Be the first legend",
    emptyDesc: "Complete this course and leave your story",
    spoiler: "Spoiler",
    likes: "Applause",
    writeReview: "Write a review",
    viewAll: "View all reviews",
  },
}

const TIER_NAMES = {
  ko: ["", "마을 주민", "나그네", "풍류객", "산신령", "도깨비왕", "전설의 영웅"],
  ja: ["", "村人", "旅人", "風流客", "山の神", "鬼王", "伝説の英雄"],
  en: ["", "Villager", "Wanderer", "Traveler", "Mountain God", "Dokkaebi King", "Legend Hero"],
}

function timeAgo(dateStr: string, locale: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (locale === "ko") {
    if (days === 0) return "오늘"
    if (days < 7) return `${days}일 전`
    if (days < 30) return `${Math.floor(days / 7)}주 전`
    return `${Math.floor(days / 30)}달 전`
  }
  if (locale === "ja") {
    if (days === 0) return "今日"
    if (days < 7) return `${days}日前`
    if (days < 30) return `${Math.floor(days / 7)}週間前`
    return `${Math.floor(days / 30)}ヶ月前`
  }
  if (days === 0) return "Today"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export function CourseReviews({ posts, courseId, locale }: CourseReviewsProps) {
  const label = LABEL[locale as keyof typeof LABEL] || LABEL.ko
  const tierNames = TIER_NAMES[locale as keyof typeof TIER_NAMES] || TIER_NAMES.ko

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#1B2A4A]">
          🌟 {label.title}
        </h2>
        <Link
          href={`/${locale}/community`}
          className="text-sm text-[#D4A843] hover:underline font-medium"
        >
          {label.viewAll} →
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#e8ddd0]">
          <div className="text-5xl mb-3">🗺️</div>
          <p className="font-bold text-[#1B2A4A] mb-1">{label.empty}</p>
          <p className="text-sm text-[#7a6a58] mb-6">{label.emptyDesc}</p>
          <Link
            href={`/${locale}/community/write`}
            className="inline-flex px-6 py-2.5 rounded-xl bg-[#1B2A4A] text-white font-semibold text-sm hover:bg-[#243a63] transition-colors"
          >
            {label.writeReview}
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden hover:shadow-sm transition-shadow"
            >
              {/* 사진 */}
              {post.photos && post.photos.length > 0 && !post.is_spoiler && (
                <div className="relative h-40 bg-[#F5F0E8]">
                  <img
                    src={post.photos[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {post.photos.length > 1 && (
                    <span className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
                      +{post.photos.length - 1}
                    </span>
                  )}
                </div>
              )}

              {/* 스포일러 블러 */}
              {post.photos && post.photos.length > 0 && post.is_spoiler && (
                <div className="relative h-40 bg-[#1B2A4A]/10 flex items-center justify-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600 border border-orange-200">
                    ⚠️ {label.spoiler}
                  </span>
                </div>
              )}

              <div className="p-4">
                {/* 유저 */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {post.users?.avatar_url ? (
                      <img
                        src={post.users.avatar_url}
                        alt={post.users.nickname}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      post.users?.nickname?.[0]?.toUpperCase() || "?"
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1B2A4A]">
                      {post.users?.nickname || "모험가"}
                    </p>
                    <p className="text-xs text-[#D4A843]">
                      {tierNames[post.users?.current_tier || 1]}
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-[#7a6a58]">
                    {timeAgo(post.created_at, locale)}
                  </span>
                </div>

                {/* 내용 */}
                <p className="text-sm text-[#3a3028] leading-relaxed line-clamp-3">
                  {post.content}
                </p>

                {/* 좋아요 */}
                <div className="flex items-center gap-1 mt-3 text-xs text-[#7a6a58]">
                  <span>👏</span>
                  <span>{post.likes_count} {label.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
