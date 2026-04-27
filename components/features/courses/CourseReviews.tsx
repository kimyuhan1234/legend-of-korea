import Link from "next/link"
import Image from "next/image"

interface ReviewPost {
  id: string
  text: string
  photos: string[] | null
  likes_count: number
  created_at: string
  is_spoiler: boolean
  users: {
    nickname: string
    avatar_url: string | null
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

export function CourseReviews({ posts, courseId: _courseId, locale }: CourseReviewsProps) {
  const label = LABEL[locale as keyof typeof LABEL] || LABEL.en || LABEL.ko

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#111]">
          🌟 {label.title}
        </h2>
        <Link
          href={`/${locale}/community`}
          className="text-sm text-blossom-deep hover:underline font-medium"
        >
          {label.viewAll} →
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-mist">
          <div className="text-5xl mb-3">🗺️</div>
          <p className="font-bold text-[#111] mb-1">{label.empty}</p>
          <p className="text-sm text-stone mb-6">{label.emptyDesc}</p>
          <Link
            href={`/${locale}/community/write`}
            className="inline-flex px-6 py-2.5 rounded-xl bg-gradient-to-br from-mint to-blossom text-ink font-semibold text-sm hover:bg-[#374151] transition-colors"
          >
            {label.writeReview}
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-mist overflow-hidden hover:shadow-sm transition-shadow"
            >
              {/* 사진 */}
              {post.photos && post.photos.length > 0 && !post.is_spoiler && (
                <div className="relative h-40 bg-cloud">
                  <Image
                    src={post.photos[0]}
                    alt={post.text ? post.text.slice(0, 40) : 'community post photo'}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
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
                <div className="relative h-40 bg-cloud/10 flex items-center justify-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-blossom-light text-blossom-deep border border-mint">
                    ⚠️ {label.spoiler}
                  </span>
                </div>
              )}

              <div className="p-4">
                {/* 유저 */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative w-7 h-7 rounded-full bg-cloud flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                    {post.users?.avatar_url ? (
                      <Image
                        src={post.users.avatar_url}
                        alt={post.users.nickname}
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    ) : (
                      post.users?.nickname?.[0]?.toUpperCase() || "?"
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#111]">
                      {post.users?.nickname || "—"}
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-stone">
                    {timeAgo(post.created_at, locale)}
                  </span>
                </div>

                {/* 내용 */}
                <p className="text-sm text-slate leading-relaxed line-clamp-3">
                  {post.text}
                </p>

                {/* 좋아요 */}
                <div className="flex items-center gap-1 mt-3 text-xs text-stone">
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
