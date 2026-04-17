-- ============================================================
-- Legend of Korea — Party Chat
-- 024_party_chat.sql
-- 파티원 실시간 채팅 + 미션 완료 알림 메시지
-- ============================================================

CREATE TABLE IF NOT EXISTS public.party_chat (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id     UUID        NOT NULL REFERENCES public.quest_parties(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES auth.users(id),
  message      TEXT        NOT NULL,
  message_type TEXT        NOT NULL DEFAULT 'text'
                           CHECK (message_type IN ('text', 'mission_complete', 'system')),
  mission_id   UUID        REFERENCES public.missions(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.party_chat ENABLE ROW LEVEL SECURITY;

-- 같은 파티 멤버만 조회 가능
CREATE POLICY "party_chat_select" ON public.party_chat
  FOR SELECT USING (
    party_id IN (
      SELECT party_id FROM public.quest_party_members WHERE user_id = auth.uid()
    )
  );

-- 같은 파티 멤버만 전송 가능
CREATE POLICY "party_chat_insert" ON public.party_chat
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND party_id IN (
      SELECT party_id FROM public.quest_party_members WHERE user_id = auth.uid()
    )
  );

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_party_chat_party ON public.party_chat(party_id, created_at);
CREATE INDEX IF NOT EXISTS idx_party_chat_user  ON public.party_chat(user_id);

-- Supabase Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE public.party_chat;
