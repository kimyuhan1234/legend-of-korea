'use client';

import { Mission, MissionProgress } from '@/lib/supabase/types';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trophy, Clock, AlertCircle } from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  progress?: MissionProgress | null;
  locale: string;
}

export function MissionCard({ mission, progress, locale }: MissionCardProps) {
  const t = useTranslations('mission');
  const lang = locale as 'ko' | 'ja' | 'en';
  
  const status = progress?.status || 'locked';

  const statusColors = {
    locked: 'bg-muted text-muted-foreground',
    unlocked: 'bg-blue-100 text-blue-700 border-blue-200',
    in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${status === 'locked' ? 'opacity-70 contrast-75' : 'hover:shadow-xl hover:border-primary/30'}`}>
      <div className="h-2 bg-primary/10 w-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500" 
          style={{ width: status === 'completed' ? '100%' : status === 'in_progress' ? '50%' : '0%' }}
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[status]}`}>
            {t(status)}
          </Badge>
          <div className="flex items-center gap-1 text-primary font-bold">
            <Trophy className="w-4 h-4" />
            <span>{mission.lp_reward} LP</span>
          </div>
        </div>
        <CardTitle className="text-xl font-bold line-clamp-1">
          {mission.sequence}. {mission.title[lang] || mission.title.ko}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs">{mission.location_name?.[lang] || mission.location_name?.ko}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
          {mission.description[lang] || mission.description.ko}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          {status === 'locked' ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground italic">
              <AlertCircle className="w-3.5 h-3.5" />
              {t('qrRequired') || 'QR 스캔이 필요합니다'}
            </div>
          ) : (
            <div className="text-xs font-medium text-primary">
              {mission.type === 'quiz' && t('quiz')}
              {mission.type === 'photo' && t('photo')}
              {mission.type === 'boss' && t('boss')}
              {mission.type === 'hidden' && t('hidden')}
              {mission.type === 'open' && t('open')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
