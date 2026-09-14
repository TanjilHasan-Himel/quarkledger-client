'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getCategoryColorVar } from '@/lib/categoryColor';
import { StoryCardPost } from './StoryCard';

interface HeroTwoSlotProps {
  dominant: StoryCardPost;
  companion?: StoryCardPost | null;
}

export function HeroTwoSlot({ dominant, companion }: HeroTwoSlotProps) {
  const domCategory = Array.isArray(dominant.categories)
    ? dominant.categories[0]?.name || 'WIRE'
    : (dominant.categories as any)?.name || 'WIRE';
  const domCategorySlug = Array.isArray(dominant.categories)
    ? dominant.categories[0]?.slug || ''
    : (dominant.categories as any)?.slug || '';
  const domCatColor = getCategoryColorVar(domCategorySlug || domCategory);

  const compCategory = companion
    ? Array.isArray(companion.categories)
      ? companion.categories[0]?.name || 'WIRE'
      : (companion.categories as any)?.name || 'WIRE'
    : null;
  const compCategorySlug = companion
    ? Array.isArray(companion.categories)
      ? companion.categories[0]?.slug || ''
      : (companion.categories as any)?.slug || ''
    : '';
  const compCatColor = compCategory ? getCategoryColorVar(compCategorySlug || compCategory) : '';

  return (
    <section className="w-full band grain bg-gradient-to-r from-[#140204] via-[#24060B] to-[#38090E] text-white border-b-4 border-[#C4430E] shadow-2xl relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Dominant Story (Slot 1 - 7 cols on desktop) */}
          <article className="lg:col-span-7 hero-shine flex flex-col group p-4 md:p-6 bg-[#1C0407]/60 border border-white/10 rounded-sm">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-3">
              <span 
                className="tag"
                style={{ '--cat': domCatColor } as React.CSSProperties}
              >
                {domCategory}
              </span>
              <span className="text-[var(--amber-warm)] font-bold tracking-wider">
                ● প্রধান অনুসন্ধান
              </span>
              <span className="text-white/50 ml-auto font-mono text-[10px]">
                {dominant.read_time_minutes || 5} মিনিট পাঠ
              </span>
            </div>

            {dominant.cover_image_url && (
              <div className="relative w-full aspect-video mb-6 border border-white/20 group-hover:border-[var(--orange)] transition-colors shadow-xl overflow-hidden bg-black/50">
                <Image 
                  src={dominant.cover_image_url} 
                  alt={dominant.title} 
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                  priority
                />
              </div>
            )}

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-headline font-bold leading-snug mb-4 group-hover:text-[var(--amber-warm)] transition-colors">
              <Link href={`/record/${dominant.slug}`}>{dominant.title}</Link>
            </h2>

            {dominant.lead_paragraph && (
              <p className="font-body text-sm md:text-base leading-relaxed text-white/85 mb-6 line-clamp-3">
                {dominant.lead_paragraph}
              </p>
            )}

            <div className="mt-auto flex items-center justify-between font-mono text-xs text-white/60 border-t border-white/15 pt-4">
              <span>{new Date(dominant.published_at).toLocaleDateString('bn-BD')}</span>
              <span className="text-[var(--amber-warm)] font-bold group-hover:translate-x-1 transition-transform">
                সম্পূর্ণ প্রতিবেদন পড়ুন →
              </span>
            </div>
          </article>

          {/* Companion Story (Slot 2 - 5 cols on desktop) */}
          {companion && (
            <article className="lg:col-span-5 hero-shine flex flex-col group p-4 md:p-6 bg-[#1C0407]/60 border border-white/10 rounded-sm h-full">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-3">
                <span 
                  className="tag"
                  style={{ '--cat': compCatColor } as React.CSSProperties}
                >
                  {compCategory}
                </span>
                <span className="text-[var(--amber-warm)] font-bold tracking-wider">
                  ● সর্বশেষ সংযোজন
                </span>
                <span className="text-white/50 ml-auto font-mono text-[10px]">
                  {companion.read_time_minutes || 4} মিনিট পাঠ
                </span>
              </div>

              {companion.cover_image_url && (
                <div className="relative w-full aspect-video mb-5 border border-white/20 group-hover:border-[var(--orange)] transition-colors shadow-lg overflow-hidden bg-black/50">
                  <Image 
                    src={companion.cover_image_url} 
                    alt={companion.title} 
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
              )}

              <h3 className="text-xl md:text-2xl lg:text-3xl font-headline font-bold leading-snug mb-3 group-hover:text-[var(--amber-warm)] transition-colors">
                <Link href={`/record/${companion.slug}`}>{companion.title}</Link>
              </h3>

              {companion.lead_paragraph && (
                <p className="font-body text-xs md:text-sm leading-relaxed text-white/80 mb-5 line-clamp-3">
                  {companion.lead_paragraph}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between font-mono text-xs text-white/60 border-t border-white/15 pt-4">
                <span>{new Date(companion.published_at).toLocaleDateString('bn-BD')}</span>
                <span className="text-[var(--amber-warm)] font-bold group-hover:translate-x-1 transition-transform">
                  বিস্তারিত পড়ুন →
                </span>
              </div>
            </article>
          )}

        </div>
      </div>
    </section>
  );
}
