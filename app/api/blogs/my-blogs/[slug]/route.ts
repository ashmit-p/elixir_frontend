import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = supabaseServer();

  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const slug = segments.pop(); 

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('written_by', slug)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ blogs }, { status: 200 });
}
