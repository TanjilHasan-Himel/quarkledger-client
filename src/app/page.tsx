import { createServerClient } from '@/lib/supabase/server';
import { GrandMasthead } from '@/components/layout/GrandMasthead';
import { BreakingTicker } from '@/components/layout/BreakingTicker';
import { AnimatedSplitHero } from '@/components/editorial/AnimatedSplitHero';
import { NewsletterMicroBanner } from '@/components/editorial/NewsletterMicroBanner';
import { SectionHeader } from '@/components/editorial/SectionHeader';
import { StoryGrid } from '@/components/editorial/StoryGrid';
import { StoryCarousel } from '@/components/editorial/StoryCarousel';
import { ThemedCollectionModule } from '@/components/editorial/ThemedCollectionModule';
import { InlineNewsletterModule } from '@/components/editorial/InlineNewsletterModule';
import { TheArchiveFeed } from '@/components/editorial/TheArchiveFeed';
import { StoryCardPost } from '@/components/editorial/StoryCard';

export const dynamic = 'force-dynamic';

export default async function BroadsheetHomePage() {
  const supabase = await createServerClient();

  // 1. Fetch Ticker Items, Posts Catalog & Publication Settings in Parallel
  const [tickerRes, postsRes, pubRes] = await Promise.all([
    supabase
      .from('posts')
      .select('id, title, slug')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(10),
    supabase
      .from('posts')
      .select(`
        id, title, slug, lead_paragraph, read_time_minutes, 
        volume_no, issue_no, published_at, cover_image_url, views_count,
        users_extended ( persons ( full_name ) ),
        categories:categories!posts_category_id_fkey (name, slug),
        post_categories (
          is_primary,
          categories (id, name, slug)
        )
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(40),
    supabase
      .from('publications')
      .select('settings')
      .eq('id', 'a0000000-0000-0000-0000-000000000001')
      .single(),
  ]);

  const tickerPosts = tickerRes.data || [];
  const allPosts = (postsRes.data || []) as StoryCardPost[];
  const manualHighlightIds: string[] = Array.isArray(pubRes.data?.settings?.highlight_post_ids)
    ? pubRes.data.settings.highlight_post_ids
    : [];

  if (allPosts.length === 0) {
    return (
      <div className="min-h-screen bg-ledger-paper text-ledger-ink flex flex-col">
        <GrandMasthead />
        <main className="flex-1 flex items-center justify-center flex-col p-12 text-center">
          <h1 className="text-3xl font-headline font-bold mb-3 tracking-wide">QUARK LEDGER</h1>
          <p className="font-mono text-ledger-muted text-sm max-w-md">
            কোনো প্রতিবেদন লোড করা যায়নি বা সম্পাদকীয় প্রকাশনার অপেক্ষায় রয়েছে।
          </p>
        </main>
      </div>
    );
  }

  // 2. Helper to extract primary category name and slug
  const getPrimaryCategory = (post: StoryCardPost) => {
    if (Array.isArray(post.post_categories) && post.post_categories.length > 0) {
      const prim = post.post_categories.find((pc: any) => pc?.is_primary);
      const cat = prim ? (Array.isArray(prim.categories) ? prim.categories[0] : prim.categories) : null;
      if (cat?.name && cat?.slug) return { name: cat.name, slug: cat.slug };
    }
    if (Array.isArray(post.categories) && post.categories[0]) {
      return { name: post.categories[0].name, slug: post.categories[0].slug };
    }
    if ((post.categories as any)?.name) {
      return { name: (post.categories as any).name, slug: (post.categories as any).slug };
    }
    return { name: 'সাধারণ (General)', slug: 'general' };
  };

  // 3. Hero Two-Slot: Dominant #1, Companion from a DIFFERENT category to show broadsheet variety
  const dominantHero = allPosts[0];
  const dominantCat = getPrimaryCategory(dominantHero);

  const companionHero = allPosts.find(p => {
    const cat = getPrimaryCategory(p);
    return (cat.slug || cat.name) !== (dominantCat.slug || dominantCat.name);
  }) || allPosts[1] || null;

  // 4. Featured Content Grid (Next 3 stories excluding the hero stories)
  const heroIds = new Set([dominantHero.id, companionHero?.id].filter(Boolean));
  const featuredPosts = allPosts.filter(p => !heroIds.has(p.id)).slice(0, 3);

  // 5. "সর্বাধিক পঠিত" (Popular by read time)
  const popularPosts = [...allPosts].sort((a, b) => {
    return (b.read_time_minutes || 0) - (a.read_time_minutes || 0);
  });

  // 6. Dynamic Category Clustering: Group published posts by category
  const categoryGroups = new Map<string, { name: string; slug: string; posts: StoryCardPost[] }>();

  for (const post of allPosts) {
    const cat = getPrimaryCategory(post);
    const key = cat.slug || cat.name;
    if (!categoryGroups.has(key)) {
      categoryGroups.set(key, { name: cat.name, slug: cat.slug, posts: [] });
    }
    categoryGroups.get(key)!.posts.push(post);
  }

  // Only show category carousel sections with at least 2 posts — a single-card carousel looks broken
  const activeCategorySections = Array.from(categoryGroups.values())
    .filter(g => g.posts.length >= 2)
    .sort((a, b) => b.posts.length - a.posts.length);

  // 7. Themed Collection Package: STRICTLY filter for space/astronomy/cosmology stories
  const spacePosts = allPosts.filter(p => {
    const c = getPrimaryCategory(p);
    const text = `${c.name} ${c.slug}`.toLowerCase();
    return text.includes('space') || text.includes('মহাকাশ') || text.includes('astronomy') || text.includes('কসমোলজি') || text.includes('বিজ্ঞান');
  });

  const collectionLead = spacePosts.find(p => p.slug.includes('james-webb') || p.title.includes('জেমস ওয়েব')) 
    || spacePosts[0] 
    || allPosts[0];

  const collectionCompanions = spacePosts
    .filter(p => p.id !== collectionLead.id)
    .slice(0, 3);

  // 8. Highlights Grid: Prioritize manually pinned posts from Admin, auto-fill remaining
  const manualHighlights = manualHighlightIds
    .map(id => allPosts.find(p => p.id === id))
    .filter(Boolean) as StoryCardPost[];

  const remainingForHighlights = allPosts.filter(p => !manualHighlightIds.includes(p.id));
  const highlightPosts = [...manualHighlights, ...remainingForHighlights].slice(0, 3);

  return (
    <div className="min-h-screen bg-ledger-paper text-ledger-ink flex flex-col">
      
      {/* 1. Grand Masthead (Navigation Modal, Search, Saved Drawer, Multi-date) */}
      <GrandMasthead />

      {/* 2. Breaking News Ticker (Live 60s Marquee) */}
      <BreakingTicker
        items={(tickerPosts || []).map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          timeAgo: 'তাজা খবর',
        }))}
      />

      <main className="flex-1 w-full flex flex-col pb-20">
        
        {/* 3. New Animated Split Hero Section */}
        <AnimatedSplitHero leftPost={dominantHero as any} rightPost={companionHero as any} />

        {/* Centered Main Editorial Container */}
        <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8 pt-12 space-y-16">
          
          {/* 5. Featured Content Grid (3 Columns) */}
          {featuredPosts.length > 0 && (
            <section>
              <SectionHeader
                badge="FEATURED DISPATCHES"
                title="প্রধান অনুসন্ধান ও সমকালীন বিশ্লেষণ"
                subtitle="বিজ্ঞান, প্রযুক্তি ও সমকালীন বৈশ্বিক চিন্তার তথ্যনিষ্ঠ বয়ান"
                href="#the-feed"
                actionText="সম্পূর্ণ আর্কাইভ দেখুন →"
              />
              <StoryGrid posts={featuredPosts} columns={3} variant="standard" />
            </section>
          )}

          {/* 6. Horizontal Carousel: "সর্বাধিক পঠিত" (Most Popular) */}
          <section className="relative pt-4">
            <StoryCarousel 
              badge="MOST READ"
              title="সর্বাধিক পঠিত অনুসন্ধান"
              subtitle="গবেষক ও পাঠকদের মাঝে গত সপ্তাহে সবচেয়ে বেশি আলোচিত প্রতিবেদনসমূহ"
              posts={popularPosts} 
              variant="standard" 
            />
          </section>

          {/* 7. Themed Collection Module (Strictly Space & Frontier Science) */}
          <ThemedCollectionModule
            eyebrow="● বিশেষ সম্পাদকীয় সংকলন ২০২৬"
            title="মহাজাগতিক অনুসন্ধান ও ফ্রন্টিয়ার বিজ্ঞান"
            description="জেমস ওয়েব স্পেস টেলিস্কোপের পর্যবেক্ষণ থেকে শুরু করে আদিম মহাবিশ্বের গ্যালাক্সি সংকট এবং আধুনিক কসমোলজির নতুন সমীকরণ।"
            featuredStory={collectionLead}
            companionStories={collectionCompanions}
            collectionSlug="space-science"
          />

          {/* 8. Dynamic Category Sections: Automatically rendered for all active categories */}
          {activeCategorySections.map((group) => {
            const badge = (group.slug || group.name).replace(/-/g, ' ').toUpperCase();
            return (
              <section key={group.slug || group.name} className="relative pt-4">
                <StoryCarousel 
                  badge={badge}
                  title={group.name}
                  subtitle={`${group.name}-এর সাম্প্রতিক গবেষণা, গভীর বিশ্লেষণ ও আন্তর্জাতিক অনুসন্ধানী প্রতিবেদন`}
                  href={`/category/${group.slug}`}
                  actionText={`${group.name} বিভাগ দেখুন →`}
                  posts={group.posts} 
                  variant="standard" 
                />
              </section>
            );
          })}

          {/* 9. Inline Newsletter Content Module (Mid-Page Real Excerpt + Subscription) */}
          <InlineNewsletterModule />

          {/* 10. "নির্বাচিত সারসংক্ষেপ" (Highlights Grid with manual editor pin support) */}
          <section>
            <SectionHeader
              badge="HIGHLIGHTS"
              title="নির্বাচিত সারসংক্ষেপ"
              subtitle="আমাদের সম্পাদকীয় বোর্ডের নির্বাচিত সেরা সমকালীন অনুসন্ধান ও বিশেষ বিশ্লেষণ"
            />
            <StoryGrid posts={highlightPosts} columns={3} variant="standard" />
          </section>

          {/* 11. "The Feed" — Full Archive Catalog Browser with Dynamic Topics & Horizontal Next/Prev Controls */}
          <TheArchiveFeed
            initialPosts={allPosts}
            totalAvailableCount={allPosts.length}
          />

        </div>

      </main>

    </div>
  );
}
