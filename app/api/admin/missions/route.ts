import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    // 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    let query = supabase
      .from('missions')
      // 관리자 전용 — 모든 컬럼 명시 (correct_answer 포함, 운영 화면용)
      .select('id, course_id, sequence, type, title, description, hint_1, hint_2, hint_3, correct_answer, lp_reward, is_hidden, location_name, location_description, latitude, longitude, qr_code, created_at')
      .order('sequence', { ascending: true });

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data: missions, error } = await query;
    if (error) throw error;

    return NextResponse.json(missions);
  } catch (error) {
    console.error('Admin Missions GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { mission_id, title, description, hint_1, hint_2, hint_3 } = await req.json();

    // 권한 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const updates: any = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (hint_1) updates.hint_1 = hint_1;
    if (hint_2) updates.hint_2 = hint_2;
    if (hint_3) updates.hint_3 = hint_3;

    const { data: updatedMission, error } = await supabase
      .from('missions')
      .update(updates)
      .eq('id', mission_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedMission);
  } catch (error) {
    console.error('Admin Missions PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
