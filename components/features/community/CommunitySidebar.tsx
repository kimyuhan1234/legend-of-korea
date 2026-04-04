'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PopularPosts } from './PopularPosts';
import { useTranslations } from 'next-intl';


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
      {/* Top Ad Banners */}
      {topAds.length > 0 && (
        <div className="flex flex-col gap-4">
          {topAds.map(ad => (
            <Link key={ad.id} href={ad.link} target="_blank" className="block relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-sm group">
              <Image src={ad.image} alt={ad.company} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-black text-slate-800 uppercase tracking-widest">
                AD
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Popular Posts */}
      <PopularPosts />

      {/* Bottom Ad Banners */}
      {bottomAds.length > 0 && (
        <div className="flex flex-col gap-4">
          {bottomAds.map(ad => (
            <Link key={ad.id} href={ad.link} target="_blank" className="block relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-sm group">
              <Image src={ad.image} alt={ad.company} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-black text-slate-800 uppercase tracking-widest">
                AD
              </div>
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}
