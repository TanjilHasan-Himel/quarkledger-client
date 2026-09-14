'use client';

import Link from 'next/link';
import Image from 'next/image';
import { StoryCard, StoryCardPost } from './StoryCard';

interface ThemedCollectionModuleProps {
  eyebrow?: string;
  title: string;
  description: string;
  featuredStory: StoryCardPost;
  companionStories: StoryCardPost[];
  collectionSlug?: string;
}

export function ThemedCollectionModule({
  eyebrow = '● বিশেষ সম্পাদকীয় সংকলন ২০২৬',
  title,
  description,
  featuredStory,
  companionStories,
  collectionSlug = 'quantum-and-frontier',
}: ThemedCollectionModuleProps) {
  return (
    <section className="w-full bg-[#181512] text-white border-y-4 border-[#C4430E] p-6 md:p-12 shadow-2xl relative overflow-hidden">
      {/* Subtle Background Halftone */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#C4430E 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Module Header */}
        <div className="mb-8 border-b border-white/20 pb-5">
          <span className="font-mono text-[11px] uppercase tracking-widest font-bold text-[var(--amber-warm)] block mb-2">
            {eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-white tracking-tight mb-2">
            {title}
          </h2>
          <p className="font-body text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* 2-Column Campaign Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Campaign Hero (7 cols) */}
          <div className="lg:col-span-7 flex flex-col group">
            {featuredStory.cover_image_url && (
              <div className="relative w-full aspect-[16/10] mb-5 overflow-hidden border border-white/20 group-hover:border-[var(--orange)] transition-colors shadow-xl bg-black">
                <Image
                  src={featuredStory.cover_image_url}
                  alt={featuredStory.title}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-2 font-mono text-[10px]">
              <span className="tag">
                {(featuredStory.categories as any)?.name || 'FEATURED'}
              </span>
              <span className="text-white/60">
                {featuredStory.read_time_minutes || 6} মিনিট পাঠ
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-headline font-bold text-white leading-snug mb-3 group-hover:text-[var(--amber-warm)] transition-colors">
              <Link href={`/record/${featuredStory.slug}`}>{featuredStory.title}</Link>
            </h3>

            {featuredStory.lead_paragraph && (
              <p className="font-body text-sm text-white/80 leading-relaxed line-clamp-3 mb-4">
                {featuredStory.lead_paragraph}
              </p>
            )}
          </div>

          {/* Featuring 3 Mini Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-widest font-bold text-white/70 border-b border-white/20 pb-2">
              সংকলনভুক্ত অন্যান্য প্রতিবেদনসমূহ ({companionStories.length})
            </h4>

            <div className="flex flex-col space-y-3">
              {companionStories.map((story) => (
                <StoryCard key={story.id || story.slug} post={story} variant="mini" />
              ))}
            </div>

            <div className="pt-2">
              <Link
                href={`/category/${collectionSlug}`}
                className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[var(--amber-warm)] hover:text-white uppercase tracking-wider transition-colors pt-2"
              >
                সম্পূর্ণ সংকলনের সব প্রতিবেদন পড়ুন →
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
