'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, ChevronUp, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ChatMessage {
  id: string
  user_id: string
  message: string
  message_type: 'text' | 'mission_complete' | 'system'
  created_at: string
  users?: { nickname: string; language: string }
}

interface Props {
  partyId: string
  userId: string
}

const FLAG: Record<string, string> = {
  ko: '🇰🇷', ja: '🇯🇵', en: '🇺🇸', zh: '🇨🇳', fr: '🇫🇷',
}

export function PartyChat({ partyId, userId }: Props) {
  const t = useTranslations('mission')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [unread, setUnread] = useState(0)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    // 초기 메시지 로드
    async function load() {
      const res = await fetch(`/api/party/chat?partyId=${partyId}&limit=50`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    }
    load()

    // Realtime 구독
    const channel = supabase
      .channel(`chat-${partyId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'party_chat',
        filter: `party_id=eq.${partyId}`,
      }, (payload) => {
        const newMsg = payload.new as ChatMessage
        setMessages(prev => [...prev, newMsg])
        if (!expanded) setUnread(prev => prev + 1)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [partyId, expanded])

  useEffect(() => {
    if (expanded) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setUnread(0)
    }
  }, [messages, expanded])

  const handleSend = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      await fetch('/api/party/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partyId, message: input.trim() }),
      })
      setInput('')
    } catch {
      // 전송 실패 — 조용히 무시
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-2xl border border-mist overflow-hidden">
      {/* 헤더 — 토글 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-cloud/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-ink">💬 {t('chat.title')}</span>
          {unread > 0 && !expanded && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </div>
        {expanded ? <ChevronDown size={16} className="text-slate" /> : <ChevronUp size={16} className="text-slate" />}
      </button>

      {/* 채팅 영역 */}
      {expanded && (
        <div className="border-t border-mist">
          {/* 메시지 목록 */}
          <div className="h-60 overflow-y-auto px-4 py-3 space-y-2.5">
            {messages.length === 0 && (
              <p className="text-xs text-stone text-center py-8">{t('chat.placeholder')}</p>
            )}
            {messages.map((msg) => {
              if (msg.message_type === 'mission_complete') {
                return (
                  <div key={msg.id} className="bg-amber-50 rounded-xl px-3 py-2 text-center">
                    <p className="text-xs font-bold text-amber-700">🎉 {msg.message}</p>
                    <p className="text-[10px] text-amber-500">{formatTime(msg.created_at)}</p>
                  </div>
                )
              }
              if (msg.message_type === 'system') {
                return (
                  <div key={msg.id} className="text-center">
                    <p className="text-[10px] text-stone">{msg.message}</p>
                  </div>
                )
              }
              const isMe = msg.user_id === userId
              const flag = FLAG[msg.users?.language || ''] || '👤'
              return (
                <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                  {!isMe && <span className="text-sm shrink-0 mt-1">{flag}</span>}
                  <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                    {!isMe && (
                      <p className="text-[10px] font-bold text-slate mb-0.5">{msg.users?.nickname || '?'}</p>
                    )}
                    <div className={`inline-block rounded-2xl px-3 py-2 text-sm ${
                      isMe ? 'bg-mint-deep/10 text-ink' : 'bg-cloud text-ink'
                    }`}>
                      {msg.message}
                    </div>
                    <p className="text-[10px] text-stone mt-0.5">{formatTime(msg.created_at)}</p>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* 입력란 */}
          <div className="border-t border-mist px-3 py-2 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder')}
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-mist focus:outline-none focus:border-mint-deep"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="shrink-0 w-9 h-9 rounded-xl bg-mint-deep text-white flex items-center justify-center hover:bg-mint transition-colors disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
