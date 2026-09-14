'use client';

import { useState, useRef, MouseEvent, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface NavigationOverlayProps {
  categories: Category[];
}

export function NavigationOverlay({ categories }: NavigationOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Native wheel event for horizontal scrolling
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // If there is significant vertical scrolling from the mouse wheel
      if (Math.abs(e.deltaY) > 0) {
        // Prevent default only if we are actually converting vertical to horizontal
        // But since we are full screen and overflow is hidden on body, preventDefault isn't strictly necessary for body, 
        // but it stops bouncy effects in Safari/Edge.
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    // Needs passive: false to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleScroll = () => {
      const container = scrollRef.current;
      if (!container) return;
      const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
      
      Array.from(container.children).forEach((child: Element) => {
        const rect = child.getBoundingClientRect();
        const childCenter = rect.left + rect.width / 2;
        const dist = Math.abs(containerCenter - childCenter);
        
        const maxDist = container.clientWidth / 2;
        const scale = Math.max(0.4, 1 - (dist / maxDist) * 0.6);
        const opacity = Math.max(0.2, 1 - (dist / maxDist) * 0.8);
        
        const el = child as HTMLElement;
        el.style.transform = `scale(${scale})`;
        el.style.opacity = opacity.toString();
      });
    };
    
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      // Short delay to allow layout to settle before calculating centers
      setTimeout(handleScroll, 50);
    }
    
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  return (
    <>
      {/* QUARK acts as the hamburger menu with horizontal cut effect */}
      <div 
        className="relative group cursor-pointer flex items-center justify-center w-auto h-12 pr-4 md:pr-6 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Base Text (Invisible, takes up layout space) */}
        <span className="font-[family:var(--font-english-display)] text-4xl md:text-5xl font-black tracking-tighter uppercase select-none text-transparent">
          QUARK
        </span>
        
        {/* Top Slice */}
        <span 
          className={`absolute left-0 top-1/2 -translate-y-1/2 font-[family:var(--font-english-display)] text-4xl md:text-5xl font-black tracking-tighter uppercase select-none transition-all duration-300 ${isOpen ? 'text-[#FF5722] -translate-y-[calc(50%+6px)]' : 'text-white group-hover:-translate-y-[calc(50%+4px)] group-hover:-translate-x-[2px]'}`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 38%, 0 38%)' }}
        >
          QUARK
        </span>
        
        {/* Middle Slice */}
        <span 
          className={`absolute left-0 top-1/2 -translate-y-1/2 font-[family:var(--font-english-display)] text-4xl md:text-5xl font-black tracking-tighter uppercase select-none transition-all duration-300 ${isOpen ? 'text-[#FF5722] translate-x-[4px]' : 'text-white group-hover:translate-x-[3px]'}`}
          style={{ clipPath: 'polygon(0 38%, 100% 38%, 100% 62%, 0 62%)' }}
        >
          QUARK
        </span>

        {/* Bottom Slice */}
        <span 
          className={`absolute left-0 top-1/2 -translate-y-1/2 font-[family:var(--font-english-display)] text-4xl md:text-5xl font-black tracking-tighter uppercase select-none transition-all duration-300 ${isOpen ? 'text-[#FF5722] -translate-y-[calc(50%-6px)]' : 'text-white group-hover:-translate-y-[calc(50%-4px)] group-hover:-translate-x-[1px]'}`}
          style={{ clipPath: 'polygon(0 62%, 100% 62%, 100% 100%, 0 100%)' }}
        >
          QUARK
        </span>
      </div>

      {/* Fullscreen Overlay Menu */}
      <div 
        className={`fixed inset-0 bg-[#12100E] z-40 flex flex-col items-center justify-center transition-all duration-500 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
      >
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-8" style={{ backgroundImage: 'linear-gradient(#FF5722 1px, transparent 1px), linear-gradient(90deg, #FF5722 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        
        {/* Edge Blur Mask */}
        <div 
          className="absolute inset-0 z-10 flex items-center"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
        >
          <nav 
            ref={scrollRef}
            className="flex flex-row items-center gap-12 md:gap-24 text-center w-full h-full px-[40vw] overflow-x-auto whitespace-nowrap scrollbar-hide snap-x snap-mandatory"
          >
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="snap-center origin-center transition-transform duration-75 ease-out font-[family:var(--font-english-display)] text-6xl md:text-8xl lg:text-[9rem] font-black text-white hover:text-[var(--orange)] uppercase tracking-tighter shrink-0 flex flex-col items-center justify-center"
            >
              HOME
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/category/${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className="snap-center origin-center transition-transform duration-75 ease-out font-[family:var(--font-english-display)] text-6xl md:text-8xl lg:text-[9rem] font-black text-white hover:text-[var(--orange)] uppercase tracking-tighter shrink-0 relative flex flex-col items-center justify-center"
              >
                {cat.name}
                <span className="block absolute -bottom-8 font-mono text-sm tracking-widest text-white/50 uppercase">
                  {cat.description || `Explore ${cat.name}`}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
