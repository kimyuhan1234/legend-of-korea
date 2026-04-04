'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import { PostType } from './PostCard';

interface AdCardProps {
  ad: PostType;
  locale: string;
}

export function AdCard({ ad, locale }: AdCardProps) {
  const t = useTranslations('community');

  return (
    <div className="bg-slate-50 rounded-3xl p-5 md:p-6 border border-slate-200">
      {/* Ad Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200">
            <Building2 className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm">{ad.ad_company || 'Sponsor'}</p>
            <p className="text-[10px] uppercase font-black text-slate-400 mt-0.5 tracking-wider">
              {t('adLabel')} · {t('sponsored')}
            </p>
          </div>
        </div>
      </div>

      {/* Ad Banner Image */}
      {ad.ad_banner && (
        <Link href={ad.ad_link || '#'} target="_blank" className="block relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-4 group shadow-sm">
          <Image src={ad.ad_banner} alt={ad.title || 'Ad Image'} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
        </Link>
      )}

      {/* Ad Content */}
      <div className="mb-5">
        <h3 className="text-lg font-black text-slate-800 leading-snug mb-2">{ad.title}</h3>
        <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed line-clamp-3">
          {ad.text}
        </p>
      </div>

      {/* CTA Button */}
      <Link href={ad.ad_link || '#'} target="_blank" className="w-full h-12 flex items-center justify-center gap-2 bg-white text-indigo-600 rounded-xl font-black border-2 border-indigo-100 hover:border-indigo-200 hover:bg-slate-50 transition-all active:scale-[0.98]">
        {t('viewDetail')}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
