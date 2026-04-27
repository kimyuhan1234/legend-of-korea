'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';
import { getRegionName } from '@/lib/constants/regions';
import { PostType } from './PostCard';

export function PopularPosts() {
  const t = useTranslations('community');
  const locale = useLocale();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch('/api/community/posts?sort=popular&limit=5');
        const data = await res.json();
        if (data.posts) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Failed to fetch popular posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm animate-pulse h-[300px]"></div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
      <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2">
        🔥 {t('popularPosts')}
      </h3>
      <div className="space-y-4">
        {posts.map((post, idx) => (
          <Link key={post.id} href={`/${locale}/community?post=${post.id}`} className="group block">
            <div className="flex gap-3">
              <span className="font-black text-slate-300 text-lg tabular-nums shrink-0 mt-0.5 group-hover:text-blossom-deep transition-colors">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="font-bold text-slate-800 text-sm truncate group-hover:text-sky transition-colors">
                  {post.title || post.text.slice(0, 30) + '...'}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{getRegionName(post.region, locale)}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-400 fill-current" />{post.likes_count}</span>
                </div>
              </div>
              {post.photos && post.photos.length > 0 && (
                <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden relative border border-slate-100">
                  <Image src={post.photos[0]} alt="Thumbnail" fill className="object-cover" unoptimized />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
