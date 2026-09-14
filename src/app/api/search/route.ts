import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIp, sanitizeSearchQuery } from '@/lib/rateLimit';

export async function GET(request: Request) {
  // 1. Rate Limiting: Max 40 search queries per minute per IP
  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit(`search:${clientIp}`, { intervalMs: 60_000, maxRequests: 40 });

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'অতিরিক্ত অনুরোধের সীমা অতিক্রম করেছে। কিছুক্ষণ পর আবার চেষ্টা করুন।' },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil(rateCheck.resetTimeMs / 1000).toString(),
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get('q');

  if (!rawQuery || rawQuery.trim() === '') {
    return NextResponse.json({ results: [] });
  }

  // 2. Injection Defense: Sanitize search query to prevent PostgREST syntax injection
  const q = sanitizeSearchQuery(rawQuery);
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, read_time_minutes, published_at, categories:categories!posts_category_id_fkey (name)')
    .eq('status', 'published')
    .or(`title.ilike.%${q}%,lead_paragraph.ilike.%${q}%`)
    .order('published_at', { ascending: false })
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ results: data });
}
