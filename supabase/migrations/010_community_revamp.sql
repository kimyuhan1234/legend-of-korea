-- 010_community_revamp.sql
-- 커뮤니티 전면 개편을 위한 필드 및 테이블 추가

-- 1. community_posts 테이블 수정
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'user' CHECK (type IN ('user', 'ad')),
  ADD COLUMN IF NOT EXISTS region TEXT NOT NULL DEFAULT 'all',
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS comments_count INTEGER NOT NULL DEFAULT 0,
  -- 1-2. 피드 내 광고 전용 필드
  ADD COLUMN IF NOT EXISTS ad_company TEXT,
  ADD COLUMN IF NOT EXISTS ad_link TEXT,
  ADD COLUMN IF NOT EXISTS ad_banner TEXT,
  ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT false;

-- 기존 데이터 마이그레이션 (기존 글들은 모두 일반 사용자 글)
UPDATE public.community_posts SET type = 'user', title = substring(text from 1 for 30) WHERE title IS NULL;

-- 2. ad_banners 테이블 신설 (사이드바 등 옥외 배너용)
CREATE TABLE IF NOT EXISTS public.ad_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position TEXT NOT NULL CHECK (position IN ('sidebar_top', 'sidebar_bottom')),
  image TEXT NOT NULL,
  link TEXT NOT NULL,
  company TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for ad_banners
ALTER TABLE public.ad_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ad_banners_select_all" ON public.ad_banners
  FOR SELECT USING (active = true);

-- admin inserts/updates/deletes (보안을 위해 admin role 체크, 기본 RLS 기반)
CREATE POLICY "ad_banners_admin_all" ON public.ad_banners
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));
