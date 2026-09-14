'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { StoryCard, StoryCardPost } from './StoryCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryCarouselProps {
  posts: StoryCardPost[];
  variant?: 'standard' | 'horizontal' | 'compact';
  title?: string;
  subtitle?: string;
  badge?: string;
  href?: string;
  actionText?: string;
}

export function StoryCarousel({
  posts,
  variant = 'standard',
  title,
  subtitle,
  badge,
  href,
  actionText = 'সব দেখুন →',
}: StoryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [posts]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const cardWidth = 340; // Approx single card width + gap
    const delta = direction === 'left' ? -cardWidth : cardWidth;
    containerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  if (!posts || posts.length === 0) return null;

  return (
    <div className="relative w-full group/carousel">
      {/* Integrated Section Header with Side-by-Side Controls */}
      {title && (
        <div className="w-full mb-6 pb-3 border-b-2 border-ledger-border flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 bg-ledger-orange rounded-xs inline-block" />
              {badge && (
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-ledger-orange">
                  {badge}
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-ledger-ink tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="font-body text-xs md:text-sm text-ledger-muted mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Section: Action Link AND Navigation Controls side-by-side */}
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            {href && (
              <Link
                href={href}
                className="font-mono text-xs font-bold text-ledger-orange hover:underline underline-offset-4 tracking-wider uppercase transition-colors mr-1"
              >
                {actionText}
              </Link>
            )}
            
            {/* Arrow Controls placed neatly side-by-side */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="পূর্ববর্তী স্লাইড"
                className="w-8 h-8 border border-ledger-borderDark bg-ledger-control hover:bg-ledger-orange hover:border-ledger-orange hover:text-white text-ledger-ink transition-all active:scale-90 active:translate-y-[1px] disabled:opacity-25 disabled:hover:bg-ledger-control disabled:hover:border-ledger-borderDark disabled:hover:text-ledger-ink cursor-pointer flex items-center justify-center shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="পরবর্তী স্লাইড"
                className="w-8 h-8 border border-ledger-borderDark bg-ledger-control hover:bg-ledger-orange hover:border-ledger-orange hover:text-white text-ledger-ink transition-all active:scale-90 active:translate-y-[1px] disabled:opacity-25 disabled:hover:bg-ledger-control disabled:hover:border-ledger-borderDark disabled:hover:text-ledger-ink cursor-pointer flex items-center justify-center shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Arrow Controls if no title is provided */}
      {!title && (
        <div className="flex items-center justify-end gap-1.5 mb-4">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="পূর্ববর্তী স্লাইড"
            className="w-8 h-8 border border-ledger-borderDark bg-[#EDE6D8] hover:bg-[#FF5722] hover:border-[#FF5722] hover:text-white text-ledger-ink transition-all active:scale-90 active:translate-y-[1px] disabled:opacity-25 disabled:hover:bg-[#EDE6D8] disabled:hover:border-ledger-borderDark disabled:hover:text-ledger-ink cursor-pointer flex items-center justify-center shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="পরবর্তী স্লাইড"
            className="w-8 h-8 border border-ledger-borderDark bg-[#EDE6D8] hover:bg-[#FF5722] hover:border-[#FF5722] hover:text-white text-ledger-ink transition-all active:scale-90 active:translate-y-[1px] disabled:opacity-25 disabled:hover:bg-[#EDE6D8] disabled:hover:border-ledger-borderDark disabled:hover:text-ledger-ink cursor-pointer flex items-center justify-center shadow-2xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Horizontal Carousel Track with Peeking Edge Card */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="flex items-stretch gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 -mx-4 px-4 md:-mx-8 md:px-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {posts.map((post) => (
          <div
            key={post.id || post.slug}
            className="w-[290px] sm:w-[320px] md:w-[360px] shrink-0 snap-start flex flex-col h-full"
          >
            <StoryCard post={post} variant={variant} />
          </div>
        ))}

        {/* Padding spacer to allow the last card to scroll fully into view */}
        <div className="w-4 shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
}
