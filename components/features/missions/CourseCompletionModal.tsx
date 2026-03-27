'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Trophy, Sparkles, Share2, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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
              <h2 className="text-3xl font-black text-white">축하합니다!</h2>
              <p className="text-white/80 font-bold text-lg">
                {courseName} 코스를 완주하셨습니다!
              </p>
           </div>
        </div>

        <div className="p-8 space-y-8 bg-white">
           <div className="flex justify-around items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
              <div className="text-center">
                 <p className="text-xs font-black text-slate-400 mb-1">총 획득 보상</p>
                 <p className="text-2xl font-black text-primary">+{totalLp} LP</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                 <p className="text-xs font-black text-slate-400 mb-1">완주 보너스</p>
                 <p className="text-2xl font-black text-amber-500">+500 LP</p>
              </div>
           </div>

            <div className="space-y-3">
               <Button className="w-full h-14 rounded-2xl font-black text-lg gap-2" asChild>
                  <Link href={`/${locale}/community`}>
                     <MessageSquare className="w-5 h-5" />
                     커뮤니티에 완주 기록 남기기
                  </Link>
               </Button>
               <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-lg gap-2 border-2" asChild>
                  <Link href={`/${locale}/courses`}>
                    다음 코스 둘러보기
                    <ArrowRight className="w-5 h-5" />
                  </Link>
               </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
