'use client';

import Link from 'next/link';
import { StoryCardPost } from './StoryCard';

interface VerticalTickerProps {
  posts: StoryCardPost[];
}

export function VerticalTicker({ posts }: VerticalTickerProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col h-full bg-ledger-paper border border-ledger-border/50 rounded-sm overflow-hidden shadow-sm">
        <div className="p-4 border-b border-ledger-border/50 bg-ledger-dark text-white flex items-center justify-between z-10 relative">
          <h3 className="font-headline font-black uppercase tracking-widest text-lg">
            নির্বাচিত সারসংক্ষেপ
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center text-ledger-muted font-mono text-xs border-t border-ledger-border/50">
          সম্পাদকীয় বোর্ড থেকে এখনো কোনো প্রতিবেদন নির্বাচিত করা হয়নি।
        </div>
      </div>
    );
  }

  // Duplicate the array many times to ensure it overflows the container 
  // for a seamless infinite loop regardless of how few posts there are.
  const duplicatedPosts = Array(8).fill(posts).flat();

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
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-ledger-paper border border-ledger-border/50 rounded-sm overflow-hidden shadow-sm">
      <div className="p-4 border-b border-ledger-border/50 bg-ledger-dark text-white flex items-center justify-between z-10 relative">
        <h3 className="font-headline font-black uppercase tracking-widest text-lg">
          নির্বাচিত সারসংক্ষেপ
        </h3>
        <span className="w-2 h-2 bg-ledger-orange rounded-full inline-block animate-pulse shadow-[0_0_8px_rgba(255,87,34,0.8)]" />
      </div>

      <div className="relative flex-1 overflow-hidden group min-h-[300px]">
        <div className="absolute inset-0 z-10 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, var(--color-ledger-paper) 0%, transparent 10%, transparent 90%, var(--color-ledger-paper) 100%)'
        }} />
        
        {/* Absolute positioning prevents the scrolling content from stretching the grid height */}
        <div className="absolute top-0 left-0 right-0 flex flex-col animate-[marquee-vertical_60s_linear_infinite] group-hover:[animation-play-state:paused]">
          {duplicatedPosts.map((post, idx) => {
            const category = getPrimaryCategory(post);
            
            return (
              <Link 
                key={`${post.id}-${idx}`}
                href={`/record/${post.slug}`}
                className="block p-5 border-b border-ledger-border/40 hover:bg-ledger-control/30 transition-colors relative group/card"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    {category && (
                      <span className="font-mono text-[10px] text-ledger-orange uppercase tracking-wider font-bold">
                        {category.name}
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-ledger-muted">
                      {post.read_time_minutes ? `${post.read_time_minutes} MIN` : ''}
                    </span>
                  </div>
                  
                  <h4 className="font-headline font-bold text-ledger-ink text-sm md:text-base leading-snug line-clamp-3 group-hover/card:text-ledger-orange transition-colors">
                    {post.title}
                  </h4>
                  
                  <div className="mt-1 font-body text-xs text-ledger-muted line-clamp-2">
                    {post.lead_paragraph}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
