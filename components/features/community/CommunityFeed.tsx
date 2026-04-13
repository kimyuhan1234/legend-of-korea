'use client';

import { useState, useEffect, useRef } from 'react';
import { PostCard, PostType } from './PostCard';
import { AdCard } from './AdCard';
import { CategoryTabs } from './CategoryTabs';
import { RecipeFeed } from './RecipeFeed';
import { Button } from '@/components/ui/button';
import { Loader2, PenLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// Hardcoded placeholder ads shown every 4th post when no sponsored posts in feed
const PLACEHOLDER_ADS: PostType[] = [
  {
    id: 'placeholder-ad-1',
    type: 'ad',
    is_sponsored: true,
    region: 'jeonju',
    title: '전주 한옥스테이 "고즈넉"',
    text: '전통 한옥에서 즐기는 하룻밤 — LOK 모험가 10% 특별 할인 쿠폰 증정',
    tags: ['전주숙소', '한옥'],
    photos: [],
    likes_count: 0,
    comments_count: 0,
    created_at: new Date().toISOString(),
    user_id: '',
    ad_company: '고즈넉 한옥스테이',
    ad_link: '#',
    ad_banner: '',
  },
  {
    id: 'placeholder-ad-2',
    type: 'ad',
    is_sponsored: true,
    region: 'jeonju',
    title: '전주 비빔밥 명가',
    text: '현지인이 추천하는 정통 전주 비빔밥 — 모험 후 든든하게',
    tags: ['전주맛집', '비빔밥'],
    photos: [],
    likes_count: 0,
    comments_count: 0,
    created_at: new Date().toISOString(),
    user_id: '',
    ad_company: '전주 비빔밥 명가',
    ad_link: '#',
    ad_banner: '',
  },
];

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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const isRecipeTab = regionFilter === 'recipe';

  const observerTarget = useRef(null);

  // Fetch current user
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    }).catch(() => {});
  }, []);

  const fetchPosts = async (currentCursor: string | null = null, isNewFilter = false) => {
    try {
      if (currentCursor) setLoadingMore(true);
      else setLoading(true);

      const url = new URL('/api/community/posts', window.location.origin);
      if (currentCursor) url.searchParams.set('cursor', currentCursor);
      if (regionFilter !== 'all') url.searchParams.set('region', regionFilter);

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
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [cursor, hasMore, loadingMore, loading]);

  function handleDelete(postId: string) {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }

  function handleEdit(updated: PostType) {
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  }

  // Build display list: inject placeholder ad every 4th real post
  function buildDisplayList() {
    const result: (PostType & { _adPlaceholder?: boolean })[] = [];
    let adIdx = 0;
    let realPostCount = 0;

    for (const post of posts) {
      if (post.type === 'ad' || post.is_sponsored) {
        result.push(post);
        continue;
      }
      result.push(post);
      realPostCount++;
      if (realPostCount % 4 === 0) {
        result.push({ ...PLACEHOLDER_ADS[adIdx % PLACEHOLDER_ADS.length], _adPlaceholder: true });
        adIdx++;
      }
    }
    return result;
  }

  const displayList = buildDisplayList();

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header & Write Button */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('title')}</h1>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setRegionFilter('recipe')}
            className={`px-5 font-bold shadow-md hover:shadow-lg transition-all h-11 rounded-xl border-none
              ${regionFilter === 'recipe'
                ? 'bg-[#7BC8BC] text-white ring-2 ring-blossom'
                : 'bg-gradient-to-br from-[#B8E8E0] to-[#F5D0D0] text-[#1F2937] hover:bg-[#7BC8BC]'
              }`}
          >
            🍳 요리 레시피
          </button>
          <Link href={`/${locale}/community/write`}>
            <Button className="rounded-xl px-5 font-bold shadow-md hover:shadow-lg transition-all h-11 bg-[#9DD8CE] hover:bg-[#7BC8BC] text-white border-none">
              <PenLine className="w-4 h-4 mr-2" />
              {t('writePost', { defaultValue: '기록 남기기' })}
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        currentCategory={regionFilter}
        onSelect={setRegionFilter}
        locale={locale}
      />

      {/* Recipe tab */}
      {isRecipeTab ? (
        <RecipeFeed locale={locale} />
      ) : loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-sky" />
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
          {displayList.map((post) => {
            if (post.type === 'ad' || post.is_sponsored) {
              return <AdCard key={post.id + (post as any)._adPlaceholder ? post.id + '-placeholder' : post.id} ad={post} locale={locale} />;
            }
            return (
              <PostCard
                key={post.id}
                post={post}
                locale={locale}
                currentUserId={currentUserId}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            );
          })}

          {/* Infinite scroll observer */}
          <div ref={observerTarget} className="h-20 flex items-center justify-center">
            {loadingMore && <Loader2 className="w-8 h-8 animate-spin text-slate-300" />}
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <Link href={`/${locale}/community/write`} className="fixed bottom-24 right-6 md:hidden z-40">
        <Button size="icon" className="rounded-full shadow-2xl h-14 w-14 p-0 bg-[#9DD8CE] hover:bg-[#7BC8BC] shadow-mint-light/50 border-4 border-white">
          <PenLine className="w-6 h-6 text-white" />
        </Button>
      </Link>
    </div>
  );
}
