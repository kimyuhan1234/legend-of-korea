'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PopularPosts } from './PopularPosts';

interface AdBannerItem {
  id: string;
  position: string;
  image: string;
  link: string;
  company: string;
}

export function CommunitySidebar() {
  const [topAds, setTopAds] = useState<AdBannerItem[]>([]);
  const [bottomAds, setBottomAds] = useState<AdBannerItem[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch('/api/community/ads');
        const data = await res.json();
        if (data.ads) {
          setTopAds(data.ads.filter((ad: AdBannerItem) => ad.position === 'sidebar_top'));
          setBottomAds(data.ads.filter((ad: AdBannerItem) => ad.position === 'sidebar_bottom'));
        }
      } catch (error) {
        console.error('Failed to fetch sidebar ads:', error);
      }
    };
    fetchAds();
  }, []);

  return (
    <aside className="w-full flex flex-col gap-6 sticky top-[100px]">
      {/* Top Ad Banners — real ads if available, else placeholder */}
      {topAds.length > 0 ? (
        <div className="flex flex-col gap-4">
          {topAds.map(ad => (
            <Link
              key={ad.id}
              href={ad.link}
              target="_blank"
              className="block relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-sm group"
            >
              <Image
                src={ad.image}
                alt={ad.company}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-black text-slate-800 uppercase tracking-widest">
                AD
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* TODO: 나중에 ad_banners 테이블에서 동적 로드 */
        <div className="rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-br from-[#2D1B69] via-[#4a2f8f] to-[#6b46c1] p-6 text-white text-center">
            <div className="text-3xl mb-3">📢</div>
            <p className="font-black text-base mb-1">광고 문의</p>
            <p className="text-xs text-white/70 mb-3">전설 모험가들에게 알려보세요</p>
            <a
              href="mailto:ad@legendofkorea.com"
              className="inline-block text-xs bg-white/20 hover:bg-white/30 text-white font-bold
                         px-4 py-2 rounded-full transition-colors"
            >
              ad@legendofkorea.com
            </a>
          </div>
        </div>
      )}

      {/* Popular Posts */}
      <PopularPosts />

      {/* Bottom Ad Banners — real ads if available, else placeholder */}
      {bottomAds.length > 0 ? (
        <div className="flex flex-col gap-4">
          {bottomAds.map(ad => (
            <Link
              key={ad.id}
              href={ad.link}
              target="_blank"
              className="block relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-sm group"
            >
              <Image
                src={ad.image}
                alt={ad.company}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-black text-slate-800 uppercase tracking-widest">
                AD
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* TODO: 나중에 ad_banners 테이블에서 동적 로드 */
        <div className="rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-br from-[#FF6B35] via-[#ff8c5a] to-[#ffa070] p-6 text-white text-center">
            <div className="text-3xl mb-3">🚀</div>
            <p className="font-black text-base mb-1">Legend of Korea와 함께하세요</p>
            <p className="text-xs text-white/80 mb-3">당신의 전설을 기록하고 LP를 쌓으세요</p>
            <Link
              href="/ko/courses"
              className="inline-block text-xs bg-white/20 hover:bg-white/30 text-white font-bold
                         px-4 py-2 rounded-full transition-colors"
            >
              코스 둘러보기 →
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
