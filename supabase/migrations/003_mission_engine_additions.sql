-- ============================================================
-- Legend of Korea — Phase 7 Additions
-- 003_mission_engine_additions.sql
-- ============================================================

-- ──────────────────────────────────────────
-- 1. mission_logs (Audit/Anti-cheat)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mission_logs (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mission_id   UUID        NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    action       TEXT        NOT NULL, -- 'scan', 'submit_quiz', 'upload_photo'
    payload      JSONB,
    is_success   BOOLEAN     NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for mission logs
CREATE INDEX IF NOT EXISTS idx_mission_logs_user_mission ON public.mission_logs(user_id, mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_logs_created_at ON public.mission_logs(created_at DESC);

-- ──────────────────────────────────────────
-- 2. mission_progress refinement
-- ──────────────────────────────────────────
-- Add attempt tracking to mission_progress
ALTER TABLE public.mission_progress
ADD COLUMN IF NOT EXISTS attempt_count    INTEGER     NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_attempted_at TIMESTAMPTZ;

-- ──────────────────────────────────────────
-- 3. RLS for mission_logs
-- ──────────────────────────────────────────
ALTER TABLE public.mission_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "logs_select_own" ON public.mission_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "logs_admin_all" ON public.mission_logs
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
    ));

-- mission_logs are typically system-generated, but if we need a policy for client-side logging (if not using RPC/Server Action)
-- Standard practice is to have the server insert these.
