import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get('offset') || '0');
  const limit = parseInt(searchParams.get('limit') || '3');
  const categoryId = searchParams.get('categoryId');
  const authorId = searchParams.get('authorId');

  const supabase = await createServerClient();

  let query = supabase
    .from('posts')
    .select(`
      id, title, slug, lead_paragraph, read_time_minutes, 
      volume_no, issue_no, published_at, cover_image_url,
      users_extended ( persons ( full_name ) ),
      categories:categories!posts_category_id_fkey (name, slug),
      post_categories (
        is_primary,
        categories (id, name, slug)
      )
    `)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  if (authorId) {
    query = query.eq('author_id', authorId);
  }

  // Fetch limit + 1 to know if there's more
  query = query.range(offset, offset + limit);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const hasMore = data && data.length > limit;
  const posts = data ? data.slice(0, limit) : [];

  return NextResponse.json({ posts, hasMore });
}
