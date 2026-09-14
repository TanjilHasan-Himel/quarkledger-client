'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { StoryCard, StoryCardPost } from './StoryCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TheArchiveFeedProps {
  initialPosts: StoryCardPost[];
  totalAvailableCount?: number;
}

interface CategoryTopic {
  id: string; // category slug or 'all'
  label: string; // Bengali label
  count: number;
}

export function TheArchiveFeed({ initialPosts, totalAvailableCount = 7 }: TheArchiveFeedProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'read_time'>('newest');
  const [visibleLimit, setVisibleLimit] = useState<number>(6);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const pillsTrackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Dynamically extract all categories from available posts with accurate live counts
  const topics = useMemo<CategoryTopic[]>(() => {
    const catMap = new Map<string, { label: string; count: number }>();

    initialPosts.forEach((post) => {
      // 1. Primary category from post.categories
      const catName = Array.isArray(post.categories)
        ? post.categories[0]?.name
        : (post.categories as any)?.name;
      const catSlug = Array.isArray(post.categories)
        ? post.categories[0]?.slug
        : (post.categories as any)?.slug;

      if (catName && catSlug) {
        if (!catMap.has(catSlug)) {
          catMap.set(catSlug, { label: catName, count: 0 });
        }
        catMap.get(catSlug)!.count += 1;
      }

      // 2. Secondary categories from post.post_categories
      if (Array.isArray(post.post_categories)) {
        post.post_categories.forEach((pc: any) => {
          const c = Array.isArray(pc?.categories) ? pc.categories[0] : pc?.categories;
          if (c?.name && c?.slug && c.slug !== catSlug) {
            if (!catMap.has(c.slug)) {
              catMap.set(c.slug, { label: c.name, count: 0 });
            }
            catMap.get(c.slug)!.count += 1;
          }
        });
      }
    });

    const sortedCats = Array.from(catMap.entries())
      .map(([id, data]) => ({ id, label: data.label, count: data.count }))
      .sort((a, b) => b.count - a.count);

    return [
      { id: 'all', label: 'সব বিষয়', count: initialPosts.length },
      ...sortedCats,
    ];
  }, [initialPosts]);

  // Check scroll state of category pills
  const checkPillsScroll = () => {
    if (!pillsTrackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = pillsTrackRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkPillsScroll();
    window.addEventListener('resize', checkPillsScroll);
    return () => window.removeEventListener('resize', checkPillsScroll);
  }, [topics]);

  const scrollPills = (direction: 'left' | 'right') => {
    if (!pillsTrackRef.current) return;
    const delta = direction === 'left' ? -220 : 220;
    pillsTrackRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(checkPillsScroll, 250);
  };

  // Filtered and sorted stories
  const filteredPosts = useMemo(() => {
    let list = [...initialPosts];

    if (selectedTopic !== 'all') {
      list = list.filter((p) => {
        const catSlug = Array.isArray(p.categories) ? p.categories[0]?.slug : (p.categories as any)?.slug;
        if (catSlug === selectedTopic) return true;

        if (Array.isArray(p.post_categories)) {
          return p.post_categories.some((pc: any) => {
            const c = Array.isArray(pc?.categories) ? pc.categories[0] : pc?.categories;
            return c?.slug === selectedTopic;
          });
        }
        return false;
      });
    }

    if (sortOrder === 'read_time') {
      list.sort((a, b) => (b.read_time_minutes || 0) - (a.read_time_minutes || 0));
    } else {
      list.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }

    return list;
  }, [initialPosts, selectedTopic, sortOrder]);

  const displayedPosts = filteredPosts.slice(0, visibleLimit);
  const hasMore = displayedPosts.length < filteredPosts.length;

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleLimit((prev) => prev + 3);
      setLoadingMore(false);
    }, 300);
  };

  const percentageSeen = Math.min(100, Math.round((displayedPosts.length / Math.max(1, filteredPosts.length)) * 100));

  return (
    <section id="the-feed" className="w-full mt-12 mb-16 scroll-mt-20">
      {/* Feed Controls Header */}
      <div className="bg-ledger-control border border-ledger-border p-5 md:p-6 mb-8">
        {/* Brand Trust Meta Line */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ledger-border/80 pb-4 mb-5">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-orange font-bold block mb-1">
              ● সম্পূর্ণ আর্কাইভ ব্রাউজার (The Feed)
            </span>
            <h3 className="text-2xl md:text-3xl font-headline font-bold text-ledger-ink">
              কোয়ার্ক মহাফেজখানার সম্পূর্ণ তালিকা
            </h3>
          </div>
          <div className="font-mono text-xs text-ledger-muted text-left md:text-right">
            <div>মোট সংরক্ষিত: <span className="font-bold text-ledger-ink">{initialPosts.length}টি প্রতিবেদন</span></div>
            <div className="text-[10px] text-ledger-muted/70">প্রমিত বাংলা সাংবাদিকতা ও বৈজ্ঞানিক তথ্যসূত্র</div>
          </div>
        </div>

        {/* Filters and Sorters Bar with Next/Prev Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Scrollable Category Pill Bar */}
          <div className="flex items-center gap-2 max-w-full overflow-hidden">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => scrollPills('left')}
              disabled={!canScrollLeft}
              aria-label="পূর্ববর্তী বিষয়সমূহ"
              title="পূর্ববর্তী বিষয়সমূহ"
              className="w-7 h-7 border border-ledger-borderDark bg-white hover:bg-ledger-orange hover:border-ledger-orange hover:text-white text-ledger-ink transition-all active:scale-90 disabled:opacity-25 disabled:hover:bg-white disabled:hover:border-ledger-borderDark disabled:hover:text-ledger-ink cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scroll Track */}
            <div
              ref={pillsTrackRef}
              onScroll={checkPillsScroll}
              className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {topics.map((t) => {
                const isActive = selectedTopic === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTopic(t.id);
                      setVisibleLimit(6);
                    }}
                    className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all cursor-pointer border whitespace-nowrap active:scale-95 active:translate-y-[1px] shadow-2xs flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-ledger-ink text-white border-ledger-ink ring-1 ring-ledger-orange'
                        : 'bg-white text-ledger-ink border-ledger-border hover:border-ledger-orange hover:text-ledger-orange'
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className={`text-[10px] px-1 py-0.2 rounded-xs font-mono font-bold ${
                      isActive ? 'bg-ledger-orange text-white' : 'bg-ledger-control text-ledger-muted'
                    }`}>
                      {t.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => scrollPills('right')}
              disabled={!canScrollRight}
              aria-label="পরবর্তী বিষয়সমূহ"
              title="পরবর্তী বিষয়সমূহ"
              className="w-7 h-7 border border-ledger-borderDark bg-white hover:bg-ledger-orange hover:border-ledger-orange hover:text-white text-ledger-ink transition-all active:scale-90 disabled:opacity-25 disabled:hover:bg-white disabled:hover:border-ledger-borderDark disabled:hover:text-ledger-ink cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 font-mono text-xs shrink-0 self-end lg:self-auto">
            <span className="text-ledger-muted uppercase">সর্টিং:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="border border-ledger-ink bg-white p-1.5 font-mono text-xs focus:outline-none focus:border-ledger-orange cursor-pointer shadow-2xs"
            >
              <option value="newest">সর্বশেষ প্রকাশিত</option>
              <option value="read_time">দীর্ঘতম পাঠ (গবেষণা)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      {displayedPosts.length === 0 ? (
        <div className="border-2 border-dashed border-ledger-border p-12 text-center font-mono text-sm text-ledger-muted">
          এই বিষয়ে কোনো প্রতিবেদন পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedPosts.map((post) => (
            <StoryCard key={post.id || post.slug} post={post} variant="standard" />
          ))}
        </div>
      )}

      {/* Progress Counter & User-Initiated Load More */}
      <div className="mt-10 flex flex-col items-center justify-center text-center space-y-3">
        <p className="font-mono text-xs text-ledger-muted">
          আপনি <span className="font-bold text-ledger-ink">{displayedPosts.length}</span>টি প্রতিবেদন দেখেছেন ({percentageSeen}% প্রদর্শিত)
        </p>

        {hasMore && (
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 bg-ledger-paper border-2 border-ledger-ink text-ledger-ink font-mono text-xs font-bold uppercase tracking-wider hover:border-ledger-orange hover:bg-ledger-orange hover:text-white transition-all cursor-pointer disabled:opacity-50 active:scale-95 active:translate-y-[1px] shadow-sm flex items-center gap-2"
          >
            <span>{loadingMore ? 'লোড করা হচ্ছে...' : 'আরও প্রতিবেদন লোড করুন'}</span>
            <span>{loadingMore ? '⏳' : '↓'}</span>
          </button>
        )}
      </div>
    </section>
  );
}
