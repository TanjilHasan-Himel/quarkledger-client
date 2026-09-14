'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

interface SubNavScrollProps {
  navCategories: { id: string; name: string; slug: string }[];
}

export function SubNavScroll({ navCategories }: SubNavScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [navCategories]);

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (!navCategories || navCategories.length === 0) return null;

  return (
    <nav aria-label="বিভাগ নেভিগেশন" className="relative border-t border-white/20 bg-black">
      {canScrollLeft && (
        <button 
          onClick={() => scrollByAmount(-250)}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-black to-transparent flex items-center justify-start pl-4 text-white/50 hover:text-white transition-colors"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}
      
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="max-w-[1400px] mx-auto px-6 flex items-center overflow-x-auto scrollbar-hide relative"
      >
        {navCategories.map((cat, idx) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={[
              'relative shrink-0 group',
              'font-mono text-[11px] font-semibold uppercase tracking-[0.12em]',
              'text-white/70 hover:text-white transition-colors duration-200',
              'py-3 px-5 whitespace-nowrap',
              idx > 0 ? 'border-l border-white/10' : '',
            ].join(' ')}
          >
            {cat.name}
            {/* Animated underline */}
            <span className="absolute bottom-0 left-5 right-5 h-[2px] bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200 block" />
          </Link>
        ))}
      </div>

      {canScrollRight && (
        <button 
          onClick={() => scrollByAmount(250)}
          className="absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-black via-black to-transparent flex items-center justify-end pr-4 text-white/50 hover:text-white transition-colors"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}
    </nav>
  );
}
