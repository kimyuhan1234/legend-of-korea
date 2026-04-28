'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { HelpCircle, Lightbulb, Loader2, Sparkles, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import Link from 'next/link';
import { CourseCompletionModal } from './CourseCompletionModal';

interface QuizMissionProps {
  missionId: string;
  courseName: string;
  question: string;
  hints: string[];
  lpReward: number;
  initialStatus?: string;
  locale: string;
}

export function QuizMission({ 
  missionId, 
  courseName,
  question, 
  hints, 
  lpReward, 
  initialStatus = 'unlocked',
  locale
}: QuizMissionProps) {
  const t = useTranslations('mission');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [isVerifying, setIsVerifying] = useState(false);
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);

  const handleVerify = async () => {
    if (!answer.trim() || isVerifying) return;

    setIsVerifying(true);
    try {
      const response = await fetch('/api/missions/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, type: 'quiz', answer: answer.trim() }),
      });

      const data = await response.json();

      if (data.isCorrect) {
        setStatus('completed');
        setTotalEarned((data.lpEarned ?? lpReward) + (data.bonusLp ?? 0));
        if (data.courseCompleted) {
          setShowCompletion(true);
        } else {
          toast({
            title: t('missionComplete'),
            description: t('lpEarned', { lp: data.lpEarned ?? lpReward }),
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: t('tryAgain'),
          description: data.error || t('incorrectDesc'),
        });
      }
    } catch (err) {
      console.error('Quiz verify error:', err);
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('networkError'),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleHint = async (level: number) => {
    if (unlockedHints.includes(level)) return;

    // 1단계는 무료, 2단계 30, 3단계 50
    const costs = [0, 0, 30, 50];
    const cost = costs[level];

    try {
      setIsHintLoading(true);
      const response = await fetch('/api/missions/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, hintLevel: level }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setUnlockedHints([...unlockedHints, level]);
        toast({
          title: t('hintUnlockTitle'),
          description: level === 1 ? t('hintFreeDesc') : t('hintPaidDesc', { cost }),
        });
      } else {
        toast({
          variant: 'destructive',
          title: t('hintUseFailed'),
          description: data.error || t('hintUseFailedDesc'),
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('hintProcessingError'),
      });
    } finally {
      setIsHintLoading(false);
    }
  };

  return (
    <Card className="w-full border-primary/20 bg-white/40 backdrop-blur-md overflow-hidden border-2 rounded-[2.5rem] shadow-xl">
      <CardHeader className="bg-primary/5 pb-6 pt-8 px-8">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline" className="flex items-center gap-1.5 border-primary/30 text-primary py-1 px-3">
            <HelpCircle className="w-4 h-4" />
            {t('quiz')}
          </Badge>
          <div className="text-xl font-black text-primary">+{lpReward} 빗방울</div>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-black leading-tight text-slate-800">
          {question}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-8">
        {status === 'completed' ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-700 relative">
            {/* CSS Celebration Effect */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute w-2 h-2 rounded-full animate-ping opacity-0"
                        style={{ 
                            backgroundColor: ['#FBBF24', '#34D399', '#60A5FA', '#F471B5'][i % 4],
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${1 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
            
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-10 scale-110">
              <Sparkles className="w-12 h-12 text-green-600 animate-bounce" />
            </div>
            <h3 className="text-4xl font-black text-green-700 mb-2 relative z-10">{t('missionComplete')}</h3>
            <p className="text-muted-foreground font-bold text-xl mb-10 relative z-10">{t('lpEarned', { lp: lpReward })}</p>
            <Button size="lg" className="h-14 px-12 rounded-[2rem] shadow-xl hover:scale-105 transition-transform relative z-10" asChild>
              <Link href="./">{t('nextJourney')}</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Input & Action */}
            <div className="space-y-4">
                <div className="relative">
                    <Input
                        placeholder={t('enterAnswer')}
                        className="h-16 text-xl pl-6 pr-16 rounded-2xl border-2 focus-visible:ring-primary/40 focus-visible:border-primary bg-white/80"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    />
                    <Button 
                        size="icon" 
                        onClick={handleVerify}
                        disabled={!answer.trim() || isVerifying}
                        className="absolute right-1.5 top-1.5 w-13 h-13 rounded-xl shadow-md transition-transform active:scale-95"
                    >
                        {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    </Button>
                </div>
            </div>

            {/* Hint System */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-sm font-black text-slate-500 flex items-center gap-2">
                 <Lightbulb className="w-4 h-4" />
                 {t('helpNeeded')}
              </h4>
              
              <div className="grid grid-cols-1 gap-3">
                {hints.map((hint, idx) => {
                  const level = idx + 1;
                  const isUnlocked = unlockedHints.includes(level);
                  const costs = [0, 0, 30, 50];
                  const cost = costs[level];

                  if (isUnlocked) {
                    return (
                      <div key={idx} className="p-5 rounded-2xl bg-primary/5 border border-primary/10 animate-in slide-in-from-top-2">
                        <div className="text-xs font-bold text-primary mb-1">{t('hintLevelLabel', { level })}</div>
                        <p className="text-base font-medium text-slate-700">{hint}</p>
                      </div>
                    );
                  }

                  return (
                    <Dialog key={idx}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="h-12 justify-between rounded-xl border-dashed border-slate-300 text-slate-500 hover:text-primary hover:border-primary/50 group"
                          disabled={isHintLoading}
                        >
                          <span className="flex items-center gap-2">
                            <Lock className="w-4 h-4 group-hover:animate-bounce" />
                            {t('hintUnlockButton', { level })}
                          </span>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none">
                            {level === 1 ? t('free') : t('costLp', { cost })}
                          </Badge>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2rem] sm:max-w-md border-none shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">{t('hintConfirmTitle')}</DialogTitle>
                          <DialogDescription className="pt-2 text-base font-medium">
                            {level === 1 ? t('hintConfirmFree') : t('hintConfirmPaid', { level, cost })}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex gap-2 sm:gap-0 sm:justify-between pt-6">
                           <Button variant="ghost" className="rounded-xl px-6" onClick={() => {}}>{t('cancel')}</Button>
                           <Button
                             className="rounded-xl px-8"
                             onClick={() => handleHint(level)}
                             disabled={isHintLoading}
                           >
                              {t('confirm')}
                           </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CourseCompletionModal 
        isOpen={showCompletion} 
        onClose={() => setShowCompletion(false)} 
        courseName={courseName}
        totalLp={totalEarned} 
        locale={locale}
      />
    </Card>
  );
}

// Internal Lock Icon
function Lock({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
    )
}
