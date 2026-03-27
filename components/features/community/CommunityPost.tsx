'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TierBadge } from './TierBadge';
import { Heart, MessageSquare, Share2, MoreHorizontal, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

function timeAgo(dateStr: string, locale: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (locale === "ko") {
    if (days === 0) return "오늘";
    if (days < 7) return `${days}일 전`;
    if (days < 30) return `${Math.floor(days / 7)}주 전`;
    return `${Math.floor(days / 30)}달 전`;
  }
  if (locale === "ja") {
    if (days === 0) return "今日";
    if (days < 7) return `${days}日前`;
    if (days < 30) return `${Math.floor(days / 7)}週間前`;
    return `${Math.floor(days / 30)}ヶ月前`;
  }
  if (days === 0) return "Today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

interface CommunityPostProps {
  post: {
    id: string;
    text: string;
    photos: string[];
    likes_count: number;
    is_spoiler: boolean;
    created_at: string;
    user: {
      nickname: string;
      avatar_url?: string;
      current_tier: number;
    };
    course?: {
      title: { [key: string]: string };
    };
  };
  locale: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export function CommunityPost({ post, locale, onLike, onComment }: CommunityPostProps) {
  const t = useTranslations('community');
  const [showSpoiler, setShowSpoiler] = useState(!post.is_spoiler);
  const [isLiked, setIsLiked] = useState(false); // Local state for immediate feedback
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  return (
    <Card className="overflow-hidden border-none shadow-xl rounded-[2.5rem] bg-white transition-all hover:shadow-2xl">
      <CardHeader className="flex flex-row items-center gap-4 p-6 bg-slate-50/50">
        <Avatar className="w-12 h-12 border-2 border-white shadow-md">
          <AvatarImage src={post.user.avatar_url} />
          <AvatarFallback>{post.user.nickname[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-800">{post.user.nickname}</span>
            <TierBadge level={post.user.current_tier} />
          </div>
          <span className="text-xs text-slate-400 font-bold">
            {timeAgo(post.created_at, locale)}
            {post.course && ` • ${post.course.title[locale] || post.course.title.ko}`}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal className="w-5 h-5 text-slate-400" />
        </Button>
      </CardHeader>

      <CardContent className="p-0 relative">
        {post.photos.length > 0 && (
          <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
            <div 
              className={`w-full h-full transition-all duration-700 ${!showSpoiler ? 'blur-2xl scale-110' : ''}`}
            >
              <Image 
                src={post.photos[currentPhotoIndex]} 
                alt="Adventure" 
                fill 
                className="object-cover"
                unoptimized
              />
            </div>

            {!showSpoiler && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm p-6 text-center">
                <Eye className="w-12 h-12 text-white mb-4 animate-pulse" />
                <h3 className="text-white font-black text-xl mb-2">{t('spoilerWarning')}</h3>
                <Button 
                  onClick={() => setShowSpoiler(true)}
                  className="bg-white text-black hover:bg-white/90 rounded-full font-black"
                >
                  보여주세요
                </Button>
              </div>
            )}

            {post.photos.length > 1 && showSpoiler && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {post.photos.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all ${i === currentPhotoIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} 
                    />
                  ))}
                </div>
                {/* Simple side arrows could be added here */}
              </>
            )}
          </div>
        )}
        <div className="p-6">
          <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
            {post.text}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-slate-50 mt-2">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 rounded-full font-black ${isLiked ? 'text-rose-500 bg-rose-50' : 'text-slate-500'}`}
            onClick={handleLike}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current animate-bounce' : ''}`} />
            {post.likes_count + (isLiked ? 1 : 0)}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 rounded-full font-black text-slate-500"
            onClick={() => onComment?.(post.id)}
          >
            <MessageSquare className="w-5 h-5" />
            0
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Share2 className="w-5 h-5 text-slate-400" />
        </Button>
      </CardFooter>
    </Card>
  );
}
