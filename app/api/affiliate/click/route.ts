import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { link_id, user_id } = await req.json();

    if (!link_id) {
      return NextResponse.json({ error: 'Missing link_id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('affiliate_clicks')
      .insert({
        link_id,
        user_id: user_id || null,
        clicked_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Affiliate Click Insert Error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Affiliate Click API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
