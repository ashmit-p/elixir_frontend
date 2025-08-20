import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function DELETE(req: NextRequest) {
  const supabase = supabaseServer();

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); 

  if (!id) {
    return NextResponse.json({ error: 'Missing blog ID' }, { status: 400 });
  }

  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
}
