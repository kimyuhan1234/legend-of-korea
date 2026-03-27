'use client';

import { useState, useEffect, useRef } from 'react';
import { CommunityPost } from './CommunityPost';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, PenLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Post {
  id: string;
  text: string;
  photos: string[];
  likes_count: number;
  is_spoiler: boolean;
  created_at: string;
  user_id: string; // post creator id
  user: {
    nickname: string;
    avatar_url?: string;
    current_tier: number;
  };
  course?: {
    title: { [key: string]: string };
  };
}

interface CommunityFeedProps {
  locale: string;
}

export function CommunityFeed({ locale }: CommunityFeedProps) {
  const t = useTranslations('community');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState('all');
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef(null);

  const fetchPosts = async (currentCursor: string | null = null, isNewFilter = false) => {
    try {
      if (currentCursor) setLoadingMore(true);
      else setLoading(true);

      const url = new URL('/api/community/posts', window.location.origin);
      if (currentCursor) url.searchParams.set('cursor', currentCursor);
      if (courseFilter !== 'all') url.searchParams.set('courseId', courseFilter);

      const res = await fetch(url.toString());
      const data = await res.json();

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
  }, [courseFilter]);

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
    // Optimistic UI handled in CommunityPost
    await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {/* Header & Filter */}
      <div className="flex items-center justify-between sticky top-[72px] z-30 bg-white/80 backdrop-blur-md p-4 -mx-4 rounded-b-3xl shadow-sm border-b border-slate-100">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('title')}</h1>
        <div className="flex items-center gap-2">
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-32 rounded-full border-none bg-slate-100 font-bold text-xs h-9">
              <SelectValue placeholder={t('latest')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('latest')}</SelectItem>
              {/* Courses would be fetched and mapped here if filtering by course is needed */}
            </SelectContent>
          </Select>
          <Link href={`/${locale}/community/write`}>
            <Button size="icon" className="w-9 h-9 rounded-full shadow-lg shadow-indigo-200">
              <Plus className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-slate-400 font-bold animate-pulse">전설을 불러오는 중...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="text-6xl">🗺️</div>
          <p className="text-slate-500 font-black text-lg">{t('noPosts')}</p>
          <Link href={`/${locale}/courses`}>
            <Button className="rounded-full font-black">첫 번째 모험가가 되어보세요</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <CommunityPost 
              key={post.id} 
              post={post} 
              locale={locale} 
              onLike={handleLike}
            />
          ))}

          {/* Observer Target */}
          <div ref={observerTarget} className="h-20 flex items-center justify-center">
            {loadingMore && <Loader2 className="w-8 h-8 animate-spin text-slate-300" />}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <Link href={`/${locale}/community/write`} className="fixed bottom-24 right-6 lg:hidden z-40">
        <Button size="lg" className="rounded-full shadow-2xl h-14 w-14 p-0 shadow-indigo-400 border-4 border-white">
          <PenLine className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
}
