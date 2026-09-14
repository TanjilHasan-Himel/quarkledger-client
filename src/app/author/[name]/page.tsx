import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { GrandMasthead } from '@/components/layout/GrandMasthead';
import { LoadMoreFeed } from '@/components/layout/LoadMoreFeed';
import { StoryCard } from '@/components/editorial/StoryCard';
import { SectionHeader } from '@/components/editorial/SectionHeader';

export const dynamic = 'force-dynamic';

export default async function AuthorProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const decodedName = decodeURIComponent(resolvedParams.name);
  const currentLimit = parseInt(resolvedSearchParams.limit as string) || 12;
  
  const supabase = await createServerClient();

  // Find the user by full_name in persons table
  let { data: person } = await supabase
    .from('persons')
    .select('user_id, full_name, bio')
    .eq('full_name', decodedName)
    .single();

  if (!person) {
    // Check if it's a hardcoded author name or pen name
    if (decodedName === 'Quark Ledger' || decodedName === 'System User') {
      person = { user_id: 'system', full_name: 'Quark Ledger', bio: 'A Journal of Fundamental Curiosities. The official editorial board of Quark Ledger.' } as any;
    } else {
      notFound();
    }
  }

  const validPerson = person!;

  let posts: any[] = [];
  let hasMore = false;

  if (validPerson.user_id === 'system') {
    // For Quark Ledger editorial pen name, fetch all articles
    const { data } = await supabase
      .from('posts')
      .select(`
        id, title, slug, lead_paragraph, read_time_minutes, 
        published_at, cover_image_url,
        categories:categories!posts_category_id_fkey (name, slug)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(currentLimit + 1);

      if (data) {
        hasMore = data.length > currentLimit;
        posts = data.slice(0, currentLimit);
      }
  } else {
    // Fetch posts for this author
    const { data } = await supabase
      .from('posts')
      .select(`
        id, title, slug, lead_paragraph, read_time_minutes, 
        published_at, cover_image_url,
        categories:categories!posts_category_id_fkey (name, slug)
      `)
      .eq('status', 'published')
      .eq('author_id', validPerson.user_id)
      .order('published_at', { ascending: false })
      .limit(currentLimit + 1);

    if (data) {
      hasMore = data.length > currentLimit;
      posts = data.slice(0, currentLimit);
    }
  }

  return (
    <div className="min-h-screen bg-ledger-paper text-ledger-ink flex flex-col">
      <GrandMasthead />
      
      <main className="flex-1 w-full flex flex-col gap-8 pb-16 pt-8">
        
        {/* Author Header Banner with Gradient Accent */}
        <section className="w-full text-ledger-ink pb-8 border-b-2 border-ledger-border">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <span className="tag mb-4">
                AUTHOR DOSSIER
              </span>
              <h1 className="text-4xl md:text-6xl font-headline font-bold uppercase tracking-tight text-ledger-ink mb-4">
                {validPerson.full_name}
              </h1>
              {validPerson.bio && (
                <p className="font-body text-base md:text-lg text-ledger-muted leading-relaxed">
                  {validPerson.bio}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Author Articles Grid */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 w-full mt-4">
          <SectionHeader
            title="প্রকাশিত অনুসন্ধান ও নিবন্ধ"
            subtitle={`${validPerson.full_name}-এর গবেষণা ও মাঠপর্যায়ের প্রতিবেদন`}
            badge="BYLINE"
          />

          {posts.length === 0 ? (
            <div className="text-center py-20 font-mono text-ledger-muted bg-white border border-ledger-border p-8">
              এই লেখকের কোনো প্রকাশিত প্রতিবেদন পাওয়া যায়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((record) => (
                <StoryCard key={record.id} post={record} />
              ))}
            </div>
          )}

          {/* Load More Pagination */}
          <LoadMoreFeed 
            initialOffset={12}
            initialHasMore={hasMore}
            authorId={validPerson.user_id}
          />
        </section>
      </main>
    </div>
  );
}
