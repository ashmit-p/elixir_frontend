import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = supabaseServer();

  const url = new URL(request.url);
  const slug = url.pathname.split('/').pop(); 

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!blog) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  }

  let liked = false;
  if (user) {
    const { data: like } = await supabase
      .from('blog_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('blog_id', blog.id)
      .maybeSingle();

    liked = !!like;
  }

  return NextResponse.json({ blog, liked });
}
