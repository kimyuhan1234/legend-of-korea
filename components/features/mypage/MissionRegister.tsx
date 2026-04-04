'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

// TODO: 나중에 Supabase에서 사용자가 구매한 코스 목록을 가져오기
// 지금은 하드코딩된 코스 데이터 사용
const AVAILABLE_COURSES = [
  {
    id: 'a1b2c3d4-0000-0000-0000-000000000001',
    name: { ko: '전주 도깨비 코스', ja: '全州トッケビコース', en: 'Jeonju Goblin Course' },
    region: { ko: '전주', ja: '全州', en: 'Jeonju' },
    emoji: '👹',
    totalMissions: 8,
    completedMissions: 2, // TODO: DB에서 가져올 것
  },
];

interface MissionRegisterProps {
  locale: string;
}

export default function MissionRegister({ locale }: MissionRegisterProps) {
  const t = useTranslations('mypage');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const lang = locale as 'ko' | 'ja' | 'en';

  return (
    <div className="space-y-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 bg-[#2D1B69] text-white rounded-xl font-bold text-base
                     hover:bg-[#3d2a7a] transition-colors flex items-center justify-center gap-2"
        >
          <span>📝</span>
          {t('registerCompletedMission')}
        </button>
      ) : (
        <div className="bg-white rounded-xl border-2 border-[#2D1B69] overflow-hidden">
          {/* 헤더 */}
          <div className="bg-[#2D1B69] px-5 py-3 flex items-center justify-between">
            <h3 className="text-white font-bold text-sm">
              {t('selectCourse')}
            </h3>
            <button
              onClick={() => { setIsOpen(false); setSelectedCourse(null); }}
              className="text-white/70 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* 코스 목록 */}
          <div className="p-4 space-y-3">
            {AVAILABLE_COURSES.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-sm text-gray-500">
                  {t('noPurchasedCourses')}
                </p>
                <Link
                  href={`/${locale}/courses`}
                  className="inline-block mt-3 px-4 py-2 bg-[#FF6B35] text-white
                             rounded-lg text-sm font-medium hover:bg-[#e55a2a] transition-colors"
                >
                  {t('goToCourses')}
                </Link>
              </div>
            ) : (
              <>
                {AVAILABLE_COURSES.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all
                      ${selectedCourse === course.id
                        ? 'border-[#FF6B35] bg-orange-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{course.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#2D1B69] text-sm md:text-base truncate">
                          {course.name[lang]}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          📍 {course.region[lang]}
                        </p>
                        {/* 진행률 바 */}
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#FF6B35] rounded-full transition-all"
                              style={{
                                width: `${(course.completedMissions / course.totalMissions) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {course.completedMissions}/{course.totalMissions}
                          </span>
                        </div>
                      </div>
                      {selectedCourse === course.id && (
                        <span className="text-[#FF6B35] text-xl flex-shrink-0">✓</span>
                      )}
                    </div>
                  </button>
                ))}

                {selectedCourse && (
                  <Link
                    href={`/${locale}/mypage/mission-register/${selectedCourse}`}
                    className="block w-full py-3.5 bg-[#FF6B35] text-white rounded-xl
                               font-bold text-center text-sm hover:bg-[#e55a2a]
                               transition-colors mt-4"
                  >
                    {t('proceedToRegister')} →
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
