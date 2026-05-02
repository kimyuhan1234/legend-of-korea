import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { hasActivePass } from '@/lib/auth/pass'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const filename = req.nextUrl.searchParams.get('file')
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return NextResponse.json({ error: 'invalid filename' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'login required' }, { status: 401 })
  }

  const allowed = await hasActivePass(user.id)
  if (!allowed) {
    return NextResponse.json({ error: 'pass required' }, { status: 403 })
  }

  const admin = await createServiceClient()
  const { data, error } = await admin.storage
    .from('gallery')
    .createSignedUrl(filename, 300, { download: true })

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'file not found' }, { status: 404 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
