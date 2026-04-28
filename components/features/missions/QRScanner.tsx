'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Camera, Keyboard, QrCode, ArrowRight } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export function QRScanner({ onScanSuccess }: QRScannerProps) {
  const t = useTranslations('mission');
  const [manualCode, setManualCode] = useState('');
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (scanMode === 'camera') {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
        },
        false
      );

      scanner.render(
        (decodedText) => {
          scanner.clear();
          onScanSuccess(decodedText);
        },
        () => {
          // Silent errors during scanning
        }
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error("Scanner clear fail:", e));
      }
    };
  }, [scanMode, onScanSuccess]);

  const handleManualSubmit = async () => {
    if (manualCode.length < 6) {
        toast({ variant: 'destructive', title: t('qrCodeFormatError'), description: t('qrCodeFormatDesc') });
        return;
    }
    onScanSuccess(manualCode);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Mode Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto shadow-inner">
          <Button 
            variant={scanMode === 'camera' ? 'default' : 'ghost'} 
            className="rounded-xl px-6"
            onClick={() => setScanMode('camera')}
          >
            <Camera className="w-4 h-4 mr-2" />
            {t('cameraScan')}
          </Button>
          <Button
            variant={scanMode === 'manual' ? 'default' : 'ghost'}
            className="rounded-xl px-6"
            onClick={() => setScanMode('manual')}
          >
            <Keyboard className="w-4 h-4 mr-2" />
            {t('manualInput')}
          </Button>
      </div>

      <div className="relative max-w-sm mx-auto">
        {scanMode === 'camera' ? (
          <div className="overflow-hidden rounded-[2.5rem] border-4 border-primary/20 bg-black shadow-2xl aspect-square relative">
            <div id="qr-reader" className="w-full h-full" />
            {/* Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary/50 rounded-3xl border-dashed animate-pulse" />
            </div>
          </div>
        ) : (
          <Card className="rounded-[2.5rem] border-2 border-primary/20 shadow-xl overflow-hidden pt-10 pb-12 px-8 text-center bg-white/80 backdrop-blur-md">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-6">{t('enter6DigitCode')}</h3>
            <div className="flex gap-2 justify-center mb-8">
                <Input 
                    maxLength={6}
                    placeholder="DOK001"
                    className="h-16 text-2xl font-black text-center tracking-[0.5em] rounded-2xl border-2 uppercase focus-visible:ring-primary/40 focus-visible:border-primary"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                />
            </div>
            <Button 
                onClick={handleManualSubmit}
                disabled={manualCode.length < 6}
                className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg"
            >
                {t('confirmCode')}
                <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        )}
      </div>

      <div className="text-center px-6">
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
             {scanMode === 'camera' ? t('qrScanHint') : t('qrManualHint')}
          </p>
      </div>
    </div>
  );
}
