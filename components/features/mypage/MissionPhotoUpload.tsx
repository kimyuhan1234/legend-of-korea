'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Camera, ImageIcon, FolderOpen, X, Upload, Loader2 } from 'lucide-react';
import { RetroFilterCanvas } from '@/components/features/camera/RetroFilterCanvas';
import { RETRO_FILTERS, applyFilterToFile } from '@/lib/camera/filters';

interface MissionPhotoUploadProps {
  missionId: string;
  courseId: string;
  onSuccess: (missionId: string) => void;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function MissionPhotoUpload({ missionId, courseId, onSuccess }: MissionPhotoUploadProps) {
  const t = useTranslations('mypage');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'ko';
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Filter step
  const [filterStep, setFilterStep] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  function handleFile(f: File) {
    setError(null);
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError(t('photoGuide3'));
      return;
    }
    if (f.size > MAX_SIZE_BYTES) {
      setError(t('photoGuide3'));
      return;
    }
    // Enter filter step
    setPendingFile(f);
    setFilterStep(true);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = '';
  }

  // Filter callbacks
  const handleFilterApply = async (filterId: string) => {
    if (!pendingFile) return;
    const filter = RETRO_FILTERS.find((f) => f.id === filterId) ?? RETRO_FILTERS[0];
    const processed = await applyFilterToFile(pendingFile, filter);
    setFile(processed);
    setPreview(URL.createObjectURL(processed));
    setPendingFile(null);
    setFilterStep(false);
  };

  const handleFilterSkip = () => {
    if (!pendingFile) return;
    setFile(pendingFile);
    setPreview(URL.createObjectURL(pendingFile));
    setPendingFile(null);
    setFilterStep(false);
  };

  const handleFilterCancel = () => {
    setPendingFile(null);
    setFilterStep(false);
  };

  function removePhoto() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setError(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  async function submitUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('missionId', missionId);
    formData.append('courseId', courseId);

    try {
      const res = await fetch('/api/mission-register', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'upload failed');
      removePhoto();
      onSuccess(missionId);
    } catch {
      setError(t('uploadFail'));
    } finally {
      setUploading(false);
    }
  }

  // ---- Filter step UI ----
  if (filterStep && pendingFile) {
    return (
      <div className="mt-4">
        <RetroFilterCanvas
          imageFile={pendingFile}
          onApply={handleFilterApply}
          onSkip={handleFilterSkip}
          onCancel={handleFilterCancel}
          locale={locale}
        />
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* hidden file inputs */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onInputChange}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />
      <input
        ref={fileRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={onInputChange}
      />

      {!preview ? (
        <>
          {/* main drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`
              cursor-pointer rounded-2xl border-2 border-dashed p-8
              flex flex-col items-center gap-3 transition-all duration-300
              ${dragOver
                ? 'border-mint-deep bg-mint-light scale-[1.02]'
                : 'border-mist bg-snow hover:border-ink hover:bg-lavender'
              }
            `}
          >
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Camera size={28} className="text-[#111]" />
            </div>
            <p className="text-sm text-stone font-medium text-center">
              {t('tapToUpload')}
            </p>
            <p className="text-xs text-stone">
              {t('photoGuide3')}
            </p>
          </div>

          {/* source buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => cameraRef.current?.click()}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 border-dashed
                         border-mist hover:border-ink hover:bg-lavender transition-all
                         active:scale-95"
            >
              <Camera size={18} className="text-[#111]" />
              <span className="text-xs text-slate font-medium">{t('camera')}</span>
            </button>
            <button
              onClick={() => galleryRef.current?.click()}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 border-dashed
                         border-mist hover:border-ink hover:bg-lavender transition-all
                         active:scale-95"
            >
              <ImageIcon size={18} className="text-[#111]" />
              <span className="text-xs text-slate font-medium">{t('gallery')}</span>
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 border-dashed
                         border-mist hover:border-ink hover:bg-lavender transition-all
                         active:scale-95"
            >
              <FolderOpen size={18} className="text-[#111]" />
              <span className="text-xs text-slate font-medium">{t('fileSelect')}</span>
            </button>
          </div>

          {/* guide toggle */}
          <button
            onClick={() => setShowGuide((v) => !v)}
            className="text-xs text-stone underline underline-offset-2 hover:text-[#111] transition-colors"
          >
            📸 {t('photoGuide')}
          </button>
          {showGuide && (
            <ul className="text-xs text-stone space-y-1.5 pl-5 list-disc bg-peach p-3 rounded-xl border border-peach">
              <li>{t('photoGuide1')}</li>
              <li>{t('photoGuide2')}</li>
              <li>{t('photoGuide3')}</li>
            </ul>
          )}
        </>
      ) : (
        <>
          {/* preview with remove button */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-mist bg-snow shadow-sm group">
            <img
              src={preview}
              alt="preview"
              className="w-full object-cover max-h-64"
            />
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />
            <button
              onClick={removePhoto}
              className="absolute top-3 right-3 p-1.5 bg-black/50 rounded-full text-white
                         hover:bg-red-500 transition-all active:scale-90 group-hover:scale-110"
              aria-label={t('removePhoto')}
            >
              <X size={16} />
            </button>
          </div>

          {/* submit button */}
          <button
            onClick={submitUpload}
            disabled={uploading}
            className="w-full py-3.5 bg-gradient-to-br from-mint to-blossom text-ink rounded-xl font-bold text-sm
                       hover:bg-[#7BC8BC] disabled:opacity-60 disabled:cursor-not-allowed
                       transition-all active:scale-[0.98] flex items-center justify-center gap-2
                       shadow-lg shadow-mint-light"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t('uploading')}
              </>
            ) : (
              <>
                <Upload size={16} />
                {t('registerWithPhoto')}
              </>
            )}
          </button>
        </>
      )}

      {/* error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-sm">⚠️</span>
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
