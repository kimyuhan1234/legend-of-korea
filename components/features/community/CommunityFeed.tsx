'use client';

import { useState, useEffect, useRef } from 'react';
import { PostCard, PostType } from './PostCard';
import { AdCard } from './AdCard';
import { CategoryTabs } from './CategoryTabs';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, PenLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface CommunityFeedProps {
  locale: string;
}

export function CommunityFeed({ locale }: CommunityFeedProps) {
  const t = useTranslations('community');
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState('all');
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef(null);

  const fetchPosts = async (currentCursor: string | null = null, isNewFilter = false) => {
    try {
      if (currentCursor) setLoadingMore(true);
      else setLoading(true);

      const url = new URL('/api/community/posts', window.location.origin);
      if (currentCursor) url.searchParams.set('cursor', currentCursor);
      if (regionFilter !== 'all') url.searchParams.set('region', regionFilter);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (!data.success) console.error('CommunityFeed fetch failed:', data);

      if (data.success) {
        if (isNewFilter) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      }
    } catch (error) {
      console.error('Fetch Posts Error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(null, true);
  }, [regionFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchPosts(cursor);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [cursor, hasMore, loadingMore, loading]);

  const handleLike = async (postId: string) => {
    await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
  };

  // UI rendering
  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header & Write Button */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('title')}</h1>
        <Link href={`/${locale}/community/write`} className="hidden md:block">
          <Button className="rounded-xl px-5 font-bold shadow-md hover:shadow-lg transition-all h-11 bg-indigo-600 hover:bg-indigo-700">
            <PenLine className="w-4 h-4 mr-2" />
            {t('writePost', { defaultValue: 'Write Post' })}
          </Button>
        </Link>
      </div>

      {/* Category Tabs */}
      <CategoryTabs 
        currentCategory={regionFilter} 
        onSelect={setRegionFilter} 
        locale={locale} 
      />

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-slate-400 font-bold animate-pulse">{t('loading', { defaultValue: 'Loading adventures...' })}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-10">
          <div className="text-6xl">🗺️</div>
          <p className="text-slate-500 font-black text-lg">{t('noPosts')}</p>
          <Link href={`/${locale}/community/write`}>
            <Button className="rounded-full font-black mt-4">{t('beFirst', { defaultValue: 'Be the first to share!' })}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, idx) => {
            // If the backend didn't inject ads, we could theoretically inject one every 4 items here,
            // but for now we assume backend or organic placement, AND we natively support post.type === 'ad'.
            if (post.type === 'ad' || post.is_sponsored) {
              return <AdCard key={post.id} ad={post} locale={locale} />;
            }
            return (
              <PostCard 
                key={post.id} 
                post={post} 
                locale={locale} 
                onLike={handleLike}
              />
            );
          })}

          {/* Observer Target */}
          <div ref={observerTarget} className="h-20 flex items-center justify-center">
            {loadingMore && <Loader2 className="w-8 h-8 animate-spin text-slate-300" />}
          </div>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      <Link href={`/${locale}/community/write`} className="fixed bottom-24 right-6 md:hidden z-40">
        <Button size="icon" className="rounded-full shadow-2xl h-14 w-14 p-0 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-400/50 border-4 border-white">
          <PenLine className="w-6 h-6 text-white" />
        </Button>
      </Link>
    </div>
  );
}
