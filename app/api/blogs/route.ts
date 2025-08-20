import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

function calculateReadTime(content: string): number {
  if (!content || typeof content !== 'string') {
    return 1;
  }
  
  const plainText = content
    .replace(/<[^>]*>/g, '') 
    .replace(/\s+/g, ' ') 
    .trim();
  
  const words = plainText.split(' ').filter(word => word.length > 0).length;
  
  return Math.max(1, Math.ceil(words / 200));
}

export async function GET(req: NextRequest) {
  const supabase = supabaseServer();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.trim() || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6'); 
  
  const offset = (page - 1) * limit;

  let query = supabase
    .from('blogs')
    .select('id, slug, title, description, content, created_at, likes', { count: 'exact' })
    .order('likes', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data: blogs, error: blogError, count } = await query;

  if (blogError) {
    return NextResponse.json({ 
      blogs: [], 
      pagination: { page: 1, limit, total: 0, totalPages: 0 },
      error: blogError.message 
    }, { status: 500 });
  }

  // Calculate read time for each blog
  const blogsWithReadTime = blogs?.map(blog => ({
    ...blog,
    readTime: calculateReadTime(blog.content || blog.description || '')
  })) || [];

  // Calculate pagination metadata
  const totalPages = Math.ceil((count || 0) / limit);
  const pagination = {
    page,
    limit,
    total: count || 0,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };

  return NextResponse.json({ 
    blogs: blogsWithReadTime,
    pagination 
  });
}
