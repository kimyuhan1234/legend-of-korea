'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';
import { getRegionName } from '@/lib/constants/regions';
import Link from 'next/link';

export interface PostType {
  id: string;
  type: 'user' | 'ad';
  region: string;
  title: string;
  text: string;
  tags: string[];
  photos: string[];
  likes_count: number;
  comments_count: number;
  ad_company?: string;
  ad_link?: string;
  ad_banner?: string;
  is_sponsored?: boolean;
  created_at: string;
  user_id: string;
  user?: {
    nickname: string;
    avatar_url?: string;
  };
}

interface PostCardProps {
  post: PostType;
  locale: string;
  onLike: (id: string) => void;
}

function timeAgo(dateString: string, locale: string, t: any) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return diffInHours <= 0 ? t('justNow', { defaultValue: 'Just now' }) : t('hoursAgo', { hours: diffInHours });
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return t('daysAgo', { days: diffInDays });
  }
}

export function PostCard({ post, locale, onLike }: PostCardProps) {
  const t = useTranslations('community');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setLikesCount(prev => prev + 1);
    onLike(post.id);
  };

  const regionName = getRegionName(post.region, locale);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      {/* 1. Header: Avatar, Name, Time, Region */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
            {post.user?.avatar_url ? (
              <Image src={post.user.avatar_url} alt="avatar" fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                {post.user?.nickname?.[0] || 'A'}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{post.user?.nickname || 'Unknown'}</p>
            <p className="flex items-center text-xs text-slate-400 mt-0.5 gap-1.5 font-medium">
              {timeAgo(post.created_at, locale, t)}
              <span>·</span>
              <MapPin className="w-3 h-3 text-indigo-400" />
              {regionName}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Content: Title, Text */}
      <div className="mb-4 space-y-2">
        {post.title && <h3 className="text-lg font-black text-slate-800 leading-snug">{post.title}</h3>}
        <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed line-clamp-4">
          {post.text}
        </p>
      </div>

      {/* 3. Photos (Grid layout up to 5 photos) */}
      {post.photos && post.photos.length > 0 && (
        <div className={`grid gap-2 mb-4 rounded-2xl overflow-hidden
          ${post.photos.length === 1 ? 'grid-cols-1' : ''}
          ${post.photos.length === 2 ? 'grid-cols-2 aspect-[2/1]' : ''}
          ${post.photos.length >= 3 ? 'grid-cols-3 aspect-[3/2]' : ''}
        `}>
          {post.photos.slice(0, 3).map((photo, idx) => (
            <div key={idx} className="relative w-full h-full min-h-[160px] bg-slate-100 group">
              <Image src={photo} alt={`Photo ${idx}`} fill className="object-cover" unoptimized />
              {/* If it's the 3rd image and there are more than 3, show overlay */}
              {idx === 2 && post.photos.length > 3 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-black text-xl">+{post.photos.length - 3}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4. Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0">
            <MapPin className="w-3 h-3" /> {regionName}
          </div>
          {post.tags.map((tag, idx) => (
            <span key={idx} className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg hover:bg-indigo-100 cursor-pointer transition-colors">
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      )}

      {/* 5. Footer Interaction: Likes, Comments, Share */}
      <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
        <button 
          onClick={handleLike} 
          className={`flex items-center gap-2 text-sm font-bold transition-colors group
            ${liked ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Heart className={`w-5 h-5 transition-transform group-active:scale-90 ${liked ? 'fill-current' : ''}`} />
          {likesCount}
        </button>
        <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors group">
          <MessageCircle className="w-5 h-5 transition-transform group-active:scale-90" />
          {post.comments_count || 0}
        </button>
        <button className="ml-auto flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors group">
          <Share2 className="w-4 h-4 transition-transform group-active:scale-90" />
        </button>
      </div>
    </div>
  );
}
