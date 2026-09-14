import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { GrandMasthead } from '@/components/layout/GrandMasthead';
import { BreakingTicker } from '@/components/layout/BreakingTicker';
import { LoadMoreFeed } from '@/components/layout/LoadMoreFeed';
import { StoryCard } from '@/components/editorial/StoryCard';
import { SectionHeader } from '@/components/editorial/SectionHeader';
import { getCategoryColorVar } from '@/lib/categoryColor';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { slug } = resolvedParams;
  const decodedSlug = decodeURIComponent(slug);
  const currentLimit = parseInt(resolvedSearchParams.limit as string) || 9; // 9 grid items for category page
  
  const supabase = await createServerClient();

  // Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .eq('slug', decodedSlug)
    .single();

  if (!category) {
    notFound();
  }

  // Fetch 10 latest posts for the ticker (Global)
  const { data: tickerPosts } = await supabase
    .from('posts')
    .select('id, title, slug')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(10);

  // Fetch posts for this category
  const { data: posts } = await supabase
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
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })
    .limit(currentLimit + 1);

  const hasMore = Boolean(posts && posts.length > currentLimit);
  const displayPosts = posts ? posts.slice(0, currentLimit) : [];
  const catColorVar = getCategoryColorVar(category.slug || category.name);

  return (
    <div className="min-h-screen bg-ledger-paper text-ledger-ink flex flex-col">
      <GrandMasthead />
      
      <BreakingTicker items={(tickerPosts || []).map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        timeAgo: 'তাজা খবর'
      }))} />

      <main className="flex-1 w-full flex flex-col pb-16">
        
        {/* Category Header Banner (Monochromatic Deep Dark + Grain + Tech Orange Accent) */}
        <section className="w-full band grain bg-[#12100E] text-white pt-12 pb-10 border-b-4 border-[#FF5722] shadow-lg">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="flex flex-col items-center justify-center text-center">
              <span 
                className="tag mb-3"
                style={{ '--cat': catColorVar } as React.CSSProperties}
              >
                FIELD INDEX ARCHIVE
              </span>
              <h1 className="text-4xl md:text-6xl font-headline font-bold uppercase tracking-tight text-white mb-2">
                {category.name}
              </h1>
              {category.description && (
                <p className="font-body text-base text-white/80 max-w-xl mt-2">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Category Records Grid */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 w-full mt-10">
          <SectionHeader
            title={`${category.name} — সকল রেকর্ড ও নিবন্ধ`}
            subtitle="নির্দিষ্ট বিভাগের সকল প্রকাশিত প্রতিবেদন ও বৈজ্ঞানিক অনুসন্ধান"
            badge="ARCHIVE"
          />

          {displayPosts.length === 0 ? (
            <div className="text-center py-20 font-mono text-ledger-muted bg-white border border-ledger-border p-8">
              এই বিভাগে এখনো কোনো নিবন্ধ প্রকাশিত হয়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPosts.map((record) => (
                <StoryCard key={record.id} post={record} />
              ))}
            </div>
          )}

          {/* Load More Pagination */}
          <LoadMoreFeed 
            initialOffset={9}
            initialHasMore={hasMore}
            categoryId={category.id}
          />
        </section>
      </main>
    </div>
  );
}
