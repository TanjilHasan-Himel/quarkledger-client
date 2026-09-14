'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroPost {
  id: string;
  title: string;
  slug: string;
  lead_paragraph: string;
  cover_image_url?: string;
  categories?: { name: string; slug: string };
}

interface AnimatedSplitHeroProps {
  leftPost: HeroPost;
  rightPost: HeroPost;
}

function CardContent({ post, isDominant }: { post: HeroPost; isDominant: boolean }) {
  const isAiImage = post.cover_image_url?.includes('pollinations.ai');

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0F0D0B] flex flex-col justify-end p-8 md:p-10 group">
      
      {/* Background Image with CSS Ken Burns - no JS animation */}
      {post.cover_image_url && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 z-10" />
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            quality={90}
            sizes="(max-width: 768px) 100vw, 60vw"
            className={`object-cover transition-all duration-[8000ms] ease-linear ${isDominant ? 'scale-110' : 'scale-100'}`}
            style={{ opacity: isDominant ? 0.85 : 0.55 }}
            priority
            unoptimized={isAiImage}
          />
        </div>
      )}

      {/* AI Credit */}
      {isAiImage && (
        <div className="absolute top-3 right-3 z-30 bg-black/50 text-white/40 font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 border border-white/10">
          AI · Generated
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 flex flex-col items-start">
        
        {/* Category badge */}
        {post.categories && (
          <span className={`bg-ledger-orange text-white font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 shadow transition-opacity duration-700 ${isDominant ? 'opacity-100' : 'opacity-70'}`}>
            {post.categories.name}
          </span>
        )}

        {/* Title — always visible, font size transitions via CSS */}
        <h2 className={`font-headline font-black text-white leading-tight drop-shadow-lg transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDominant ? 'text-3xl md:text-[2.6rem]' : 'text-xl md:text-2xl'
        }`}>
          {post.title}
        </h2>

        {/* Lead — Apple DUO Gaussian flip: each line rotates in from below on X-axis + blur */}
        <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDominant ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
        }`} style={{ perspective: '800px' }}>
          {isDominant && (() => {
            const words = (post.lead_paragraph || '').split(' ');
            const lines: string[] = [];
            for (let i = 0; i < words.length; i += 8) {
              lines.push(words.slice(i, i + 8).join(' '));
            }
            return lines.slice(0, 3).map((line, i) => (
              <div key={i} className="pt-1 pb-1">
                <span
                  className="block font-body text-white/85 text-base md:text-lg leading-relaxed opacity-0 animate-apple-flip"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards', backfaceVisibility: 'hidden' }}
                >
                  {line}
                </span>
              </div>
            ));
          })()}
        </div>

        {/* Read CTA */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isDominant ? 'max-h-12 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
          <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-ledger-orange border border-ledger-orange px-4 py-1.5 group-hover:bg-ledger-orange group-hover:text-white transition-colors">
            পড়ুন →
          </span>
        </div>
      </div>
    </div>
  );
}

export function AnimatedSplitHero({ leftPost, rightPost }: AnimatedSplitHeroProps) {
  const [activeState, setActiveState] = useState<0 | 1>(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveState((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="w-full bg-[#FF5722] py-6 px-4 md:px-8 overflow-hidden">
      <div
        className="max-w-[1500px] mx-auto flex flex-col md:flex-row gap-4"
        style={{ height: 'clamp(480px, 65vh, 700px)' }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* LEFT CARD — Pure CSS flex-grow transition (no JS layout thrashing) */}
        <div
          className="relative cursor-pointer h-1/2 md:h-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-2xl hover:shadow-3xl"
          style={{
            flexGrow: activeState === 0 ? 3 : 1,
            flexShrink: 1,
            flexBasis: 0,
          }}
          onMouseEnter={() => { setIsHovered(true); setActiveState(0); }}
        >
          <Link
            href={`/record/${leftPost.slug}`}
            className="block h-full w-full"
          >
            <CardContent post={leftPost} isDominant={activeState === 0} />
          </Link>
        </div>

        {/* RIGHT CARD */}
        <div
          className="relative cursor-pointer h-1/2 md:h-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-2xl hover:shadow-3xl"
          style={{
            flexGrow: activeState === 1 ? 3 : 1,
            flexShrink: 1,
            flexBasis: 0,
          }}
          onMouseEnter={() => { setIsHovered(true); setActiveState(1); }}
        >
          <Link
            href={`/record/${rightPost.slug}`}
            className="block h-full w-full"
          >
            <CardContent post={rightPost} isDominant={activeState === 1} />
          </Link>
        </div>
      </div>
    </section>
  );
}
