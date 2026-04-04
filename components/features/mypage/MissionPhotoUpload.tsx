'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Camera, ImageIcon, FolderOpen, X, Upload, Loader2 } from 'lucide-react';

interface MissionPhotoUploadProps {
  missionId: string;
  courseId: string;
  onSuccess: (missionId: string) => void;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function MissionPhotoUpload({ missionId, courseId, onSuccess }: MissionPhotoUploadProps) {
  const t = useTranslations('mypage');
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = '';
  }

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
                ? 'border-[#FF6B35] bg-orange-50 scale-[1.02]'
                : 'border-gray-300 bg-gray-50 hover:border-[#2D1B69] hover:bg-purple-50'
              }
            `}
          >
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Camera size={28} className="text-[#2D1B69]" />
            </div>
            <p className="text-sm text-gray-500 font-medium text-center">
              {t('tapToUpload')}
            </p>
            <p className="text-xs text-gray-400">
              {t('photoGuide3')}
            </p>
          </div>

          {/* source buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => cameraRef.current?.click()}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 border-dashed
                         border-gray-200 hover:border-[#2D1B69] hover:bg-purple-50 transition-all
                         active:scale-95"
            >
              <Camera size={18} className="text-[#2D1B69]" />
              <span className="text-xs text-gray-600 font-medium">{t('camera')}</span>
            </button>
            <button
              onClick={() => galleryRef.current?.click()}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 border-dashed
                         border-gray-200 hover:border-[#2D1B69] hover:bg-purple-50 transition-all
                         active:scale-95"
            >
              <ImageIcon size={18} className="text-[#2D1B69]" />
              <span className="text-xs text-gray-600 font-medium">{t('gallery')}</span>
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 border-dashed
                         border-gray-200 hover:border-[#2D1B69] hover:bg-purple-50 transition-all
                         active:scale-95"
            >
              <FolderOpen size={18} className="text-[#2D1B69]" />
              <span className="text-xs text-gray-600 font-medium">{t('fileSelect')}</span>
            </button>
          </div>

          {/* guide toggle */}
          <button
            onClick={() => setShowGuide((v) => !v)}
            className="text-xs text-gray-400 underline underline-offset-2 hover:text-[#2D1B69] transition-colors"
          >
            📸 {t('photoGuide')}
          </button>
          {showGuide && (
            <ul className="text-xs text-gray-500 space-y-1.5 pl-5 list-disc bg-amber-50 p-3 rounded-xl border border-amber-100">
              <li>{t('photoGuide1')}</li>
              <li>{t('photoGuide2')}</li>
              <li>{t('photoGuide3')}</li>
            </ul>
          )}
        </>
      ) : (
        <>
          {/* preview with remove button */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50 shadow-sm group">
            <Image
              src={preview}
              alt="preview"
              width={600}
              height={360}
              className="w-full object-cover max-h-64"
              unoptimized
            />
            {/* gradient overlay at top */}
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
            className="w-full py-3.5 bg-[#FF6B35] text-white rounded-xl font-bold text-sm
                       hover:bg-[#e55a2a] disabled:opacity-60 disabled:cursor-not-allowed
                       transition-all active:scale-[0.98] flex items-center justify-center gap-2
                       shadow-lg shadow-orange-200"
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
