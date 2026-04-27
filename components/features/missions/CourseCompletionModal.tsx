'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Trophy, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

type Lang = 'ko' | 'ja' | 'en' | 'zh-CN' | 'zh-TW'

const LANGS: readonly Lang[] = ['ko', 'ja', 'en', 'zh-CN', 'zh-TW']

const TEXT: Record<Lang, {
  congrats: string
  completed: string
  totalReward: string
  completionBonus: string
  raindrops: string
  shareCommunity: string
  browseCourses: string
}> = {
  ko:      { congrats: '축하합니다!',   completed: '{name} 코스를 완주하셨습니다!',   totalReward: '총 획득 보상',  completionBonus: '완주 보너스', raindrops: '빗방울',     shareCommunity: '커뮤니티에 완주 기록 남기기',      browseCourses: '다음 코스 둘러보기' },
  ja:      { congrats: 'おめでとうございます！', completed: '{name} コースを完走しました！',  totalReward: '獲得報酬合計', completionBonus: '完走ボーナス', raindrops: '雨滴',       shareCommunity: 'コミュニティに完走記録を残す',      browseCourses: '次のコースを見る' },
  en:      { congrats: 'Congratulations!', completed: "You've completed the {name} course!", totalReward: 'Total reward',  completionBonus: 'Completion bonus', raindrops: 'raindrops', shareCommunity: 'Share your completion in the community', browseCourses: 'Browse more courses' },
  'zh-CN': { congrats: '恭喜！',         completed: '您已完成 {name} 路线！',             totalReward: '总获得奖励',    completionBonus: '完成奖励',     raindrops: '雨滴',       shareCommunity: '在社区记录完赛心得',                 browseCourses: '浏览下一条路线' },
  'zh-TW': { congrats: '恭喜！',         completed: '您已完成 {name} 路線！',             totalReward: '總獲得獎勵',    completionBonus: '完成獎勵',     raindrops: '雨滴',       shareCommunity: '在社群記錄完賽心得',                 browseCourses: '瀏覽下一條路線' },
}

function toLang(raw: string): Lang {
  return (LANGS as readonly string[]).includes(raw) ? (raw as Lang) : 'ko'
}

interface CourseCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  totalLp: number;
  locale: string;
}

export function CourseCompletionModal({
  isOpen,
  onClose,
  courseName,
  totalLp,
  locale
}: CourseCompletionModalProps) {
  const t = TEXT[toLang(locale)];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-b from-primary to-primary-foreground p-10 text-center relative overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse delay-700" />
           </div>

           <div className="relative z-10 space-y-4">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/30 animate-bounce">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white">{t.congrats}</h2>
              <p className="text-white/80 font-bold text-lg">
                {t.completed.replace('{name}', courseName)}
              </p>
           </div>
        </div>

        <div className="p-8 space-y-8 bg-white">
           <div className="flex justify-around items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
              <div className="text-center">
                 <p className="text-xs font-black text-slate-500 mb-1">{t.totalReward}</p>
                 <p className="text-2xl font-black text-primary">+{totalLp} {t.raindrops}</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                 <p className="text-xs font-black text-slate-500 mb-1">{t.completionBonus}</p>
                 <p className="text-2xl font-black text-blossom-deep">+500 {t.raindrops}</p>
              </div>
           </div>

            <div className="space-y-3">
               <Button className="w-full h-14 rounded-2xl font-black text-lg gap-2" asChild>
                  <Link href={`/${locale}/community`}>
                     <MessageSquare className="w-5 h-5" />
                     {t.shareCommunity}
                  </Link>
               </Button>
               <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-lg gap-2 border-2" asChild>
                  <Link href={`/${locale}/courses`}>
                    {t.browseCourses}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
               </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
