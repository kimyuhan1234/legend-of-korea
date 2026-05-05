'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Heart, MessageCircle, Share2, MoreHorizontal,
  Pencil, Trash2, X, Send, ChevronDown, ChevronUp,
} from 'lucide-react';
import { getRegionName } from '@/lib/constants/regions';
import { getThemeLabel, getThemeEmoji } from '@/lib/data/post-themes';
import { toast } from '@/components/ui/use-toast';
import { RankBadge } from '@/components/features/rank/RankBadge';
import { resolveProfileAvatarSrc, hasProfileAvatar } from '@/lib/avatar/resolve';
import { useModalA11y } from '@/hooks/useModalA11y';

export interface PostType {
  id: string;
  type: 'user' | 'ad';
  region: string;
  theme?: string | null;
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
    current_level?: number;
    selected_avatar_filename?: string | null;
    selected_avatar_slug?: string | null;
  };
}

interface CommentType {
  id: string;
  text: string;
  created_at: string;
  user?: {
    nickname: string;
    avatar_url?: string;
    selected_avatar_filename?: string | null;
    selected_avatar_slug?: string | null;
  };
}

interface PostCardProps {
  post: PostType;
  locale: string;
  currentUserId?: string | null;
  onDelete?: (id: string) => void;
  onEdit?: (updated: PostType) => void;
}

function timeAgo(dateString: string, t: any) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 1) return t('justNow', { defaultValue: 'Just now' });
  if (diffInHours < 24) return t('hoursAgo', { count: diffInHours, defaultValue: `${diffInHours}h ago` });
  return t('daysAgo', { count: Math.floor(diffInHours / 24), defaultValue: `${Math.floor(diffInHours / 24)}d ago` });
}

export function PostCard({ post, locale, currentUserId, onDelete, onEdit }: PostCardProps) {
  const t = useTranslations('community');

  // Like state
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  // Comments state
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Photo lightbox
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // ⋯ menu
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Confirm delete modal
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // a11y: ESC + focus trap + previous active 복원 (lightbox / 삭제 확인)
  const lightboxRef = useModalA11y<HTMLDivElement>(
    lightboxIdx !== null,
    () => setLightboxIdx(null),
  );
  const deleteRef = useModalA11y<HTMLDivElement>(
    deleteConfirm,
    () => setDeleteConfirm(false),
  );

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title || '');
  const [editText, setEditText] = useState(post.text || '');
  const [editRegion, setEditRegion] = useState(post.region || 'all');
  const [editTags, setEditTags] = useState<string[]>(post.tags || []);
  const [editTagInput, setEditTagInput] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const isOwner = !!currentUserId && currentUserId === post.user_id;
  const themeLabel = getThemeLabel(post.theme, locale);
  const themeEmoji = getThemeEmoji(post.theme);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // ── Like ──────────────────────────────────────────────────────────────────
  async function handleLike() {
    if (likeLoading) return;
    if (!currentUserId) {
      toast({ title: t('loginRequired') });
      return;
    }
    setLikeLoading(true);
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(c => c + (newLiked ? 1 : -1));
    try {
      const res = await fetch(`/api/community/posts/${post.id}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLikesCount(data.likes_count);
        toast({ title: newLiked ? t('likeSuccess') : t('unlikeSuccess') });
      } else {
        // revert
        setLiked(!newLiked);
        setLikesCount(c => c + (newLiked ? -1 : 1));
      }
    } catch {
      setLiked(!newLiked);
      setLikesCount(c => c + (newLiked ? -1 : 1));
    } finally {
      setLikeLoading(false);
    }
  }

  // ── Comments ──────────────────────────────────────────────────────────────
  async function toggleComments() {
    const next = !commentsOpen;
    setCommentsOpen(next);
    if (next && !commentsLoaded) {
      try {
        const res = await fetch(`/api/community/posts/${post.id}/comments`);
        const data = await res.json();
        if (data.success) {
          setComments(data.comments);
          setCommentsLoaded(true);
        }
      } catch {}
    }
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || commentSubmitting) return;
    if (!currentUserId) {
      toast({ title: t('loginRequired') });
      return;
    }
    setCommentSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => [...prev, data.comment]);
        setCommentsCount(c => c + 1);
        setCommentText('');
      }
    } catch {}
    finally { setCommentSubmitting(false); }
  }

  // ── Share ─────────────────────────────────────────────────────────────────
  async function handleShare() {
    const url = `${window.location.origin}/${locale}/community/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: t('linkCopied') });
    } catch {
      toast({ title: t('linkCopied'), description: url });
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function confirmDelete() {
    try {
      const res = await fetch(`/api/community/posts/${post.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: t('deleteSuccess') });
        onDelete?.(post.id);
      }
    } catch {
      toast({ variant: 'destructive', title: t('deletePost'), description: '오류가 발생했습니다' });
    }
    setDeleteConfirm(false);
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  function addEditTag() {
    const tag = editTagInput.trim().replace(/^#+/, '');
    if (tag && !editTags.includes(tag) && editTags.length < 5) {
      setEditTags(prev => [...prev, tag]);
    }
    setEditTagInput('');
  }

  async function saveEdit() {
    if (editSaving) return;
    setEditSaving(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          text: editText,
          region: editRegion,
          tags: editTags,
          photos: post.photos,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: t('editSuccess') });
        onEdit?.({ ...post, ...data.post });
        setEditing(false);
      }
    } catch {
      toast({ variant: 'destructive', title: '저장 실패' });
    } finally {
      setEditSaving(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm  border-0 border-slate-100 hover:shadow-md transition-shadow">

        {/* ── Header ── */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative shrink-0  border-0 border-slate-200">
              {hasProfileAvatar(post.user) ? (
                <Image src={resolveProfileAvatarSrc(post.user)} alt="avatar" fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-sm">
                  {post.user?.nickname?.[0] || 'A'}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-slate-800 text-sm">{post.user?.nickname || 'Unknown'}</p>
                {post.user_id && <RankBadge userId={post.user_id} size="sm" />}
                {post.theme && themeLabel && (
                  <span className="inline-flex items-center gap-1 bg-mint-light text-mint-deep rounded-full px-2 py-0.5 text-xs font-bold">
                    <span>{themeEmoji}</span>
                    <span>{themeLabel}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{timeAgo(post.created_at, t)}</p>
            </div>
          </div>

          {/* ⋯ menu */}
          {isOwner && !editing && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-600 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg  border-0 border-slate-100 py-1 z-20">
                  <button
                    onClick={() => { setEditing(true); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="w-4 h-4" /> {t('editPost')}
                  </button>
                  <button
                    onClick={() => { setDeleteConfirm(true); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" /> {t('deletePost')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Content or Edit mode ── */}
        {editing ? (
          <div className="space-y-3 mb-4">
            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              placeholder="제목"
              className="w-full text-base font-bold  border-0 border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-mint-deep"
            />
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              rows={4}
              className="w-full text-sm  border-0 border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-mint-deep resize-none"
            />
            <select
              value={editRegion}
              onChange={e => setEditRegion(e.target.value)}
              className="w-full text-sm  border-0 border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-mint-deep"
            >
              {['all','jeonju','tongyeong','gyeongju','seoul','busan','jeju'].map(r => (
                <option key={r} value={r}>{getRegionName(r, locale)}</option>
              ))}
            </select>
            {/* tag editor */}
            <div className="flex flex-wrap gap-1.5">
              {editTags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs bg-sky-light text-sky px-2 py-1 rounded-lg">
                  #{tag}
                  <button onClick={() => setEditTags(prev => prev.filter(t => t !== tag))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={editTagInput}
                onChange={e => setEditTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEditTag(); } }}
                placeholder="#태그 추가"
                className="flex-1 text-sm  border-0 border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-mint-deep"
              />
              <button onClick={addEditTag} className="px-3 py-2 bg-slate-100 rounded-xl text-sm font-medium hover:bg-slate-200">
                추가
              </button>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={saveEdit}
                disabled={editSaving}
                className="flex-1 py-2.5 bg-gradient-to-br from-mint to-blossom text-ink rounded-xl text-sm font-bold hover:bg-[#374151] disabled:opacity-60 transition-colors"
              >
                {editSaving ? '저장 중...' : t('saveButton')}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                {t('cancelButton')}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4 space-y-2">
            {post.title && <h3 className="text-lg font-black text-slate-800 leading-snug">{post.title}</h3>}
            <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed line-clamp-4">{post.text}</p>
          </div>
        )}

        {/* ── Photos ── */}
        {!editing && post.photos && post.photos.length > 0 && (
          <div className={`grid gap-1 mb-4 rounded-2xl overflow-hidden
            ${post.photos.length === 1 ? 'grid-cols-1' : ''}
            ${post.photos.length === 2 ? 'grid-cols-2' : ''}
            ${post.photos.length >= 3 ? 'grid-cols-2' : ''}
          `}>
            {post.photos.slice(0, post.photos.length === 1 ? 1 : 3).map((photo, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIdx(idx)}
                className={`relative bg-slate-100 cursor-pointer overflow-hidden group
                  ${post.photos.length === 1 ? 'aspect-video' : 'aspect-square'}
                `}
              >
                <Image
                  src={photo}
                  alt={`Photo ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {idx === 2 && post.photos.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-black text-2xl">+{post.photos.length - 3}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Tags ── */}
        {!editing && post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-[#111] bg-mint-deep/10 rounded-full px-2.5 py-0.5"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}

        {/* ── Footer: Like / Comment / Share ── */}
        <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-2 text-sm font-bold transition-colors group
              ${liked ? 'text-rose-500' : 'text-slate-500 hover:text-slate-600'}`}
          >
            <Heart className={`w-5 h-5 transition-transform group-active:scale-90 ${liked ? 'fill-current' : ''}`} />
            {likesCount}
          </button>

          <button
            onClick={toggleComments}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-600 transition-colors group"
          >
            <MessageCircle className="w-5 h-5" />
            {commentsCount}
            {commentsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={handleShare}
            className="ml-auto flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-600 transition-colors group"
          >
            <Share2 className="w-4 h-4 transition-transform group-active:scale-90" />
          </button>
        </div>

        {/* ── Comments Accordion ── */}
        {commentsOpen && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-3">{t('noComments')}</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-xs font-bold text-slate-500  border-0 border-slate-200">
                      {c.user?.nickname?.[0] || 'A'}
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                      <p className="text-xs font-bold text-slate-700 mb-0.5">{c.user?.nickname || 'Unknown'}</p>
                      <p className="text-xs text-slate-600 whitespace-pre-wrap">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment input */}
            <form onSubmit={submitComment} className="flex gap-2">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={t('writeComment')}
                className="flex-1 text-sm  border-0 border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-mint-deep"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || commentSubmitting}
                className="px-3 py-2 bg-gradient-to-br from-mint to-blossom text-ink rounded-xl hover:bg-[#374151] disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label="photo viewer"
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            className="absolute top-4 right-4 text-slate hover:text-white p-2"
            onClick={() => setLightboxIdx(null)}
          >
            <X className="w-7 h-7" />
          </button>
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full" onClick={e => e.stopPropagation()}>
            <Image
              src={post.photos[lightboxIdx]}
              alt={`photo ${lightboxIdx + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          {post.photos.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
              {post.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setLightboxIdx(i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${i === lightboxIdx ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div
          ref={deleteRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="post-delete-confirm-title"
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 id="post-delete-confirm-title" className="text-lg font-black text-slate-800 mb-2">{t('deleteConfirmTitle')}</h3>
            <p className="text-sm text-slate-500 mb-6">{t('deleteConfirmMessage')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                {t('cancelButton')}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
              >
                {t('deleteConfirmButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
