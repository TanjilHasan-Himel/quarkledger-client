'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getCategoryColorVar } from '@/lib/categoryColor';

export interface StoryCardPost {
  id: string;
  title: string;
  slug: string;
  lead_paragraph?: string | null;
  cover_image_url?: string | null;
  read_time_minutes?: number | null;
  published_at: string;
  categories?: any;
  post_categories?: any;
  article_format?: string | null;
  location_country?: string | null;
}

function FormatBadge({ format }: { format?: string | null }) {
  if (!format || format.toLowerCase() === 'news') return null;
  return (
    <span className="font-mono text-[9px] uppercase tracking-widest text-[#FF5722] border border-[#FF5722]/30 px-1.5 py-0.5 rounded-sm bg-[#FF5722]/5">
      {format}
    </span>
  );
}

interface StoryCardProps {
  post: StoryCardPost;
  variant?: 'standard' | 'featured' | 'compact' | 'horizontal' | 'mini';
  priority?: boolean;
}

function getCategoryTopicClass(slugOrName?: string | null): string {
  if (!slugOrName) return 'card-ai';
  const normalized = slugOrName.toLowerCase();
  
  if (
    normalized.includes('space') ||
    normalized.includes('মহাকাশ') ||
    normalized.includes('astronomy') ||
    normalized.includes('কসমোলজি') ||
    normalized.includes('cosmology') ||
    normalized.includes('science') ||
    normalized.includes('বিজ্ঞান')
  ) {
    return 'card-space';
  }

  if (
    normalized.includes('bangladesh') ||
    normalized.includes('national') ||
    normalized.includes('politics') ||
    normalized.includes('বাংলাদেশ') ||
    normalized.includes('জাতীয়') ||
    normalized.includes('আইন') ||
    normalized.includes('law')
  ) {
    return 'card-bd';
  }

  if (
    normalized.includes('economy') ||
    normalized.includes('business') ||
    normalized.includes('finance') ||
    normalized.includes('বাণিজ্য') ||
    normalized.includes('অর্থনীতি') ||
    normalized.includes('market')
  ) {
    return 'card-business';
  }

  if (
    normalized.includes('sports') ||
    normalized.includes('খেলাধুলা') ||
    normalized.includes('athletic')
  ) {
    return 'card-sports';
  }

  return 'card-ai';
}

export function StoryCard({ post, variant = 'standard', priority = false }: StoryCardProps) {
  // Resolve primary category — no 'WIRE' ghost label
  const categoryName = Array.isArray(post.categories)
    ? post.categories[0]?.name || ''
    : (post.categories as any)?.name || '';
  const categorySlug = Array.isArray(post.categories)
    ? post.categories[0]?.slug || ''
    : (post.categories as any)?.slug || '';
  const dateFormatted = new Date(post.published_at).toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const catColorVar = getCategoryColorVar(categorySlug || categoryName);
  const topicClass = getCategoryTopicClass(categorySlug || categoryName);

  if (variant === 'horizontal') {
    return (
      <article 
        className={`card relative bg-white border border-ledger-border p-4 flex flex-col md:flex-row gap-5 group overflow-hidden ${topicClass}`}
        style={{ '--cat': catColorVar } as React.CSSProperties}
      >
        <div className="relative w-full md:w-48 aspect-[16/10] shrink-0 overflow-hidden border border-ledger-border bg-ledger-image">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-103 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1816] to-[#2A2320] flex items-center justify-center p-3 text-center">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#FF5722] font-bold">
                QUARK LEDGER
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1">
          {/* Tag row: category pill on left, read time on right — clean, no secondary clutter */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            {categoryName && (
              <div className="flex items-center gap-2">
                <Link
                  href={categorySlug ? `/category/${categorySlug}` : '#'}
                  className="tag"
                  style={{ '--cat': catColorVar } as React.CSSProperties}
                  onClick={(e) => e.stopPropagation()}
                >
                  {categoryName}
                </Link>
                <FormatBadge format={post.article_format} />
              </div>
            )}
            <span className="font-mono text-[10px] text-ledger-muted shrink-0 ml-auto">
              {post.read_time_minutes || 4} মিনিট
            </span>
          </div>

          <h3 className="font-headline font-bold text-lg md:text-xl leading-snug text-ledger-ink group-hover:text-[var(--orange)] transition-colors mb-2">
            <Link href={`/record/${post.slug}`}>{post.title}</Link>
          </h3>

          {post.lead_paragraph && (
            <p className="font-body text-xs md:text-sm text-ledger-muted line-clamp-2 mb-3">
              {post.lead_paragraph}
            </p>
          )}

          <div className="mt-auto font-mono text-[10px] text-ledger-muted/70">
            {dateFormatted}
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'mini') {
    return (
      <article 
        className={`card relative bg-white border border-ledger-border p-3.5 flex gap-3.5 group overflow-hidden ${topicClass}`}
        style={{ '--cat': catColorVar } as React.CSSProperties}
      >
        {post.cover_image_url && (
          <div className="relative w-20 h-20 shrink-0 overflow-hidden border border-ledger-border bg-ledger-image">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            {categoryName && (
              <div className="flex items-center gap-1.5">
                <Link
                  href={categorySlug ? `/category/${categorySlug}` : '#'}
                  className="tag text-[9px] py-0.5 px-1.5"
                  style={{ '--cat': catColorVar } as React.CSSProperties}
                  onClick={(e) => e.stopPropagation()}
                >
                  {categoryName}
                </Link>
                <FormatBadge format={post.article_format} />
              </div>
            )}
            <span className="font-mono text-[9px] text-ledger-muted ml-auto">
              {post.read_time_minutes || 4} মিনিট
            </span>
          </div>
          <h4 className="font-headline font-bold text-xs md:text-sm leading-snug text-ledger-ink line-clamp-2 mb-1 group-hover:text-ledger-accent transition-colors">
            <Link href={`/record/${post.slug}`}>{post.title}</Link>
          </h4>
          <span className="mt-auto font-mono text-[9px] text-ledger-muted/80">
            {dateFormatted}
          </span>
        </div>
      </article>
    );
  }

  // Standard vertical editorial card (Strictly uniform dimensions across carousel and grids)
  return (
    <article 
      className={`card relative bg-white border border-ledger-border p-5 flex flex-col justify-between group overflow-hidden h-full ${topicClass}`}
      style={{ '--cat': catColorVar } as React.CSSProperties}
    >
      <div>
        {/* Card Header: Category & Read Time (Fixed single line, no wrapping) */}
        <div className="flex items-center justify-between gap-2 mb-3 h-7 overflow-hidden">
          {categoryName && (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={categorySlug ? `/category/${categorySlug}` : '#'}
                className="tag"
                style={{ '--cat': catColorVar } as React.CSSProperties}
                onClick={(e) => e.stopPropagation()}
              >
                {categoryName}
              </Link>
              <FormatBadge format={post.article_format} />
            </div>
          )}
          <span className="font-mono text-[10px] font-bold text-ledger-ink bg-ledger-sand border border-ledger-border px-2 py-0.5 shrink-0">
            {post.read_time_minutes || 5} MIN
          </span>
        </div>

        {/* Image or Editorial Branded Placeholder (Locked 16:9 ratio) */}
        <div className="relative w-full aspect-video mb-3.5 overflow-hidden border border-ledger-border bg-ledger-image shrink-0">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-103 transition-transform duration-500"
              priority={priority}
              // Pollinations AI images must bypass next/image optimizer (it can't proxy external AI-generated image URLs)
              unoptimized={!!post.cover_image_url?.includes('pollinations.ai')}
            />
          ) : (
            <div className="absolute inset-0 bg-[#0F0D0B] flex flex-col items-center justify-center p-6 text-center select-none">
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#FF5722]/60 mb-3">Quark Ledger</span>
              <span className="font-headline font-bold text-sm text-white/80 line-clamp-3 leading-snug">{post.title}</span>
              <span className="absolute bottom-3 right-3 font-mono text-[8px] text-white/20 uppercase tracking-widest">{categoryName}</span>
            </div>
          )}
        </div>

        {/* Title: Clamped to 3 lines with fixed block height for perfect horizontal row alignment */}
        <h3 className="text-lg md:text-xl font-headline font-bold leading-snug mb-2 text-ledger-ink transition-colors line-clamp-3 h-[4.35rem]">
          <Link href={`/record/${post.slug}`} className="group-hover:text-ledger-orange transition-colors">
            {post.title}
          </Link>
        </h3>

        {/* Lead Paragraph: Clamped to 2 lines with fixed height */}
        <p className="font-body text-xs md:text-sm leading-relaxed text-ledger-muted mb-4 line-clamp-2 h-[2.5rem] overflow-hidden">
          {post.lead_paragraph || ''}
        </p>
      </div>

      {/* Footer Meta: Anchored to bottom */}
      <div className="mt-auto pt-3 border-t border-ledger-border/60 flex items-center justify-between font-mono text-[11px] text-ledger-muted/80 shrink-0">
        <span>{dateFormatted}</span>
        <span className="font-bold text-ledger-accent group-hover:translate-x-1 transition-transform">
          বিস্তারিত →
        </span>
      </div>
    </article>
  );

}
