import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const nickname = formData.get('nickname') as string | null;
  const avatarFile = formData.get('avatar') as File | null;

  if (!nickname || nickname.trim().length === 0) {
    return NextResponse.json({ error: '닉네임을 입력해주세요.' }, { status: 400 });
  }
  if (nickname.trim().length > 20) {
    return NextResponse.json({ error: '닉네임은 20자 이하여야 합니다.' }, { status: 400 });
  }

  let avatarUrl: string | undefined;

  // TODO: 'avatars' 버킷을 Supabase Storage에서 미리 생성해야 합니다.
  if (avatarFile && avatarFile.size > 0) {
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED.includes(avatarFile.type)) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다.' }, { status: 400 });
    }
    if (avatarFile.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 2MB 이하여야 합니다.' }, { status: 400 });
    }

    const ext = avatarFile.type === 'image/webp' ? 'webp'
      : avatarFile.type === 'image/png' ? 'png' : 'jpg';
    const path = `${user.id}.${ext}`;
    const arrayBuffer = await avatarFile.arrayBuffer();

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, new Uint8Array(arrayBuffer), {
          contentType: avatarFile.type,
          upsert: true,
        });

      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        // 버킷이 없어도 닉네임만 저장하고 계속 진행
      } else {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
        avatarUrl = publicUrl;
      }
    } catch (err) {
      console.error('Avatar upload failed (bucket may not exist):', err);
      // 아바타 업로드 실패해도 닉네임은 저장
    }
  }

  const updatePayload: Record<string, string> = {
    nickname: nickname.trim(),
    updated_at: new Date().toISOString(),
  };
  if (avatarUrl) updatePayload.avatar_url = avatarUrl;

  const { data: updated, error: dbError } = await supabase
    .from('users')
    .update(updatePayload)
    .eq('id', user.id)
    .select('nickname, avatar_url')
    .single();

  if (dbError) {
    console.error('Profile update DB error:', dbError);
    return NextResponse.json({ error: '프로필 저장에 실패했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: updated });
}
