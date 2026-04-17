/**
 * Supabase Storage public URL helper
 */
export function getVideoUrl(filename: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return `/videos/${filename}`
  return `${base}/storage/v1/object/public/videos/${filename}`
}
