import { createClient } from '@/lib/supabase/server'
import { CourseCard } from '@/components/features/courses/CourseCard'
import Image from 'next/image'

interface CoursesTabProps {
  locale: string
}

const COMING_SOON = {
  ko: [
    { title: '별주부전 코스', region: '통영·거제', date: '2027년 상반기 예정', img: '/images/byeoljubu-coming.jpg' },
    { title: '세 번째 전설', region: '준비 중', date: '미정', img: '/images/third-legend-coming.jpg' },
  ],
  ja: [
    { title: '別主簿伝コース', region: '統営・巨済', date: '2027年上半期予定', img: '/images/byeoljubu-coming.jpg' },
    { title: '第三の伝説', region: '準備中', date: '未定', img: '/images/third-legend-coming.jpg' },
  ],
  en: [
    { title: 'Tale of Byeoljubu Course', region: 'Tongyeong·Geoje', date: 'Early 2027', img: '/images/byeoljubu-coming.jpg' },
    { title: 'The Third Legend', region: 'In preparation', date: 'TBD', img: '/images/third-legend-coming.jpg' },
  ],
}

export async function CoursesTab({ locale }: CoursesTabProps) {
  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, description, thumbnail_url, difficulty, region, duration_text, price_1p, price_2p')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const comingSoon = COMING_SOON[locale as keyof typeof COMING_SOON] || COMING_SOON.ko

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#2D1B69]">🗺️ 미션 키트</h2>
      </div>
      {!courses || courses.length === 0 ? (
        <div className="text-center py-20 text-[#7a6a58]">
          <div className="text-5xl mb-4">🌙</div>
          <p>곧 새로운 전설이 열립니다</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course as any} locale={locale} />
          ))}
          {comingSoon.map((item, i) => (
            <div key={i} className="relative bg-white rounded-3xl overflow-hidden border border-[#e8ddd0]/60 shadow-sm opacity-80 cursor-not-allowed">
              <div className="relative h-48 overflow-hidden">
                <Image src={item.img} alt={item.title} fill className="object-cover brightness-75" />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#2D1B69] text-white">곧 공개됩니다</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-[#7a6a58] mb-2">📍 {item.region}</p>
                <h3 className="font-bold text-[#2D1B69] mb-1">{item.title}</h3>
                <p className="text-sm text-[#FF6B35] font-medium">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
