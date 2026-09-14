import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { ScrollProgress } from '@/components/reader/ScrollProgress';
import { RecordViewTracker } from './RecordViewTracker';
import sanitizeHtml from 'sanitize-html';
import { Metadata } from 'next';
import Image from 'next/image';
import { SocialShareAndBookmark } from '@/components/article/SocialShareAndBookmark';
import { getCategoryColorVar } from '@/lib/categoryColor';
import { GrandMasthead } from '@/components/layout/GrandMasthead';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerClient();
  const { data: record } = await supabase
    .from('posts')
    .select('title, lead_paragraph, cover_image_url, published_at')
    .eq('slug', slug)
    .single();

  if (!record) return {};

  let ogImage = record.cover_image_url || `/api/og?title=${encodeURIComponent(record.title)}`;
  if (ogImage && ogImage.startsWith('http://localhost:3000')) {
    ogImage = ogImage.replace('http://localhost:3000', '');
  }

  return {
    title: `${record.title} | Quark Ledger`,
    description: record.lead_paragraph,
    openGraph: {
      title: record.title,
      description: record.lead_paragraph,
      type: 'article',
      publishedTime: record.published_at,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: record.title,
      description: record.lead_paragraph,
      images: [ogImage],
    },
  };
}

export default async function RecordPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  // Next.js App Router already decodes the slug param. Using decodeURIComponent again
  // on a pre-decoded Bengali Unicode slug causes a double-decode crash on Vercel.
  // We try it safely and fall back to the raw value.
  const decodedSlug = (() => {
    try {
      // Only decode if it still looks percent-encoded
      const raw = resolvedParams.slug;
      return raw.includes('%') ? decodeURIComponent(raw) : raw;
    } catch {
      return resolvedParams.slug;
    }
  })();
  const supabase = await createServerClient();

  // Fetch the main article
  const { data: record } = await supabase
    .from('posts')
    .select(`
      id, title, slug, lead_paragraph, content_html, read_time_minutes, 
      volume_no, issue_no, published_at, cover_image_url, views_count,
      category_id, article_format, location_country, location_region, location_city,
      users_extended ( persons ( full_name ) ),
      categories:categories!posts_category_id_fkey (name, slug),
      post_categories (
        is_primary,
        categories (id, name, slug)
      )
    `)
    .eq('slug', decodedSlug)
    .eq('status', 'published')
    .single();

  if (!record) {
    notFound();
  }

  // Fetch related articles (same category, excluding current)
  const { data: relatedRecords } = await supabase
    .from('posts')
    .select(`
      id, title, slug, read_time_minutes, published_at
    `)
    .eq('status', 'published')
    .eq('category_id', record.category_id)
    .neq('id', record.id)
    .order('published_at', { ascending: false })
    .limit(4);

  const sanitizedHtml = sanitizeHtml(record.content_html || '', {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'span', 'pre', 'code', 'math', 'semantics', 'mrow', 'mi', 'mo', 'mn',
      'msup', 'msub', 'mfrac', 'msqrt', 'mroot', 'mtable', 'mtr', 'mtd', 'annotation',
      'img', 'figure', 'figcaption', 'details', 'summary', 'mark'
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'style', 'id', 'aria-hidden'],
      'math': ['xmlns', 'display'],
      'img': ['src', 'alt', 'width', 'height', 'loading'],
      'a': ['href', 'target', 'rel'],
    },
  });

  let resolvedImageUrl = record.cover_image_url;
  if (resolvedImageUrl && resolvedImageUrl.startsWith('http://localhost:3000')) {
    resolvedImageUrl = resolvedImageUrl.replace('http://localhost:3000', '');
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: record.title,
    image: [resolvedImageUrl],
    datePublished: record.published_at,
    author: [{
      '@type': 'Person',
      name: (record.users_extended as any)?.persons?.full_name || 'Quark Ledger'
    }]
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <main className="min-h-screen bg-ledger-paper text-ledger-ink pb-20">
      <ScrollProgress />
      <RecordViewTracker postId={record.id} />
      
      {/* Grand Masthead Header for Article Page */}
      <GrandMasthead />
      
      {/* Article Header */}
      <header className="max-w-[1400px] mx-auto px-4 md:px-8 pt-10 pb-8 border-b-2 border-ledger-ink mb-12">
        {/* Editorial Breadcrumb & Category Meta */}
        <div className="flex items-center flex-wrap gap-3 font-mono text-xs uppercase tracking-wider mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 font-bold text-ledger-ink hover:text-[#FF5722] hover:border-[#FF5722] transition-all py-1 px-2.5 bg-[#EDE7DA] border border-ledger-borderDark/40 shadow-2xs group active:scale-95 active:translate-y-[1px]"
            title="হোমপেজে ফিরে যান"
          >
            <span className="group-hover:-translate-x-1 transition-transform font-bold">←</span>
            <span>মূল পাতা</span>
          </Link>
          <span className="text-ledger-muted/50">/</span>
          <Link
            href={`/category/${(record.categories as any)?.slug || 'general'}`}
            className="tag hover:opacity-90 transition-opacity"
            style={{ '--cat': getCategoryColorVar((record.categories as any)?.slug || (record.categories as any)?.name) } as React.CSSProperties}
          >
            {(record.categories as any)?.name || 'FIELD REPORT'}
          </Link>
          <span className="text-ledger-muted">—</span>
          <span className="text-ledger-muted font-bold">FIELD OBSERVATION</span>
          <span className="text-ledger-muted/60 ml-auto hidden sm:inline font-mono text-[11px]">
            {record.read_time_minutes || 4} মিনিট পাঠ
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight mb-8 max-w-5xl">
          {record.title}
        </h1>

        {resolvedImageUrl && (
          <figure className="mb-8 w-full border-2 border-ledger-ink">
            <Image 
              src={resolvedImageUrl} 
              alt={record.title} 
              width={1200}
              height={675}
              priority={true}
              className="w-full aspect-[21/9] object-cover"
            />
          </figure>
        )}
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 font-mono text-[11px] uppercase tracking-widest text-ledger-muted border-y-2 border-ledger-border py-4">
          <div className="font-bold text-ledger-ink">
            BY <Link href={`/author/${encodeURIComponent((record.users_extended as any)?.persons?.full_name || 'Quark Ledger')}`} className="hover:text-ledger-accent underline underline-offset-4 decoration-2">{(record.users_extended as any)?.persons?.full_name || 'Quark Ledger'}</Link>
          </div>
          <div className="flex items-center gap-4">
            <span>VOL. {record.volume_no} NO. {record.issue_no}</span>
            <span className="hidden md:inline">•</span>
            <span>{new Date(record.published_at!).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
          </div>
          <div className="md:ml-auto flex items-center gap-4">
            <span>{record.read_time_minutes}M READ</span>
            <span>{record.views_count} VIEWS</span>
          </div>
        </div>

        <SocialShareAndBookmark
          title={record.title}
          slug={record.slug}
          postId={record.id}
          leadParagraph={record.lead_paragraph}
        />
      </header>

      {/* Article Body & Sidebar Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content */}
        <article className="lg:col-span-8">
          <p className="font-body text-xl md:text-2xl leading-relaxed text-ledger-ink mb-12 border-l-4 border-[#FF5722] pl-6 bg-[#FCFAF7] py-4 pr-4">
            {record.lead_paragraph}
          </p>

          <div 
            className="prose prose-ledger md:prose-lg max-w-prose mx-auto lg:mx-0
                       font-[family:var(--font-tiro-bangla)] leading-loose text-[18px] md:text-[20px] text-ledger-ink/90
                       prose-p:leading-loose prose-p:mb-8 prose-headings:font-headline prose-headings:font-bold prose-headings:font-[family:var(--font-anek-bangla)]
                       prose-pre:bg-[#111] prose-pre:text-[#eee] prose-pre:p-5 prose-pre:rounded-none prose-pre:font-mono prose-code:font-mono
                       prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:font-headline prose-blockquote:text-2xl prose-blockquote:text-black prose-blockquote:my-10
                       first-letter:text-8xl first-letter:font-headline first-letter:font-black first-letter:text-black first-letter:float-left first-letter:mr-6 first-letter:mt-2 first-letter:leading-none"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />

          {/* Metadata & Tags Section */}
          <div className="mt-16 pt-8 border-t-2 border-black max-w-prose mx-auto lg:mx-0">
            <h4 className="font-headline font-bold text-lg uppercase tracking-wider mb-4">Article Metadata</h4>
            <div className="flex flex-wrap gap-2 mb-8">
              {record.article_format && (
                <span className="px-3 py-1 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-widest">{record.article_format}</span>
              )}
              {record.location_country && (
                <span className="px-3 py-1 bg-gray-200 text-black font-mono text-[10px] font-bold uppercase tracking-widest border border-gray-300">📍 {record.location_country}</span>
              )}
              {record.location_city && (
                <span className="px-3 py-1 bg-gray-200 text-black font-mono text-[10px] font-bold uppercase tracking-widest border border-gray-300">{record.location_city}</span>
              )}
              {(record.post_categories || []).filter((pc: any) => !pc.is_primary).map((pc: any) => {
                const cat = Array.isArray(pc.categories) ? pc.categories[0] : pc.categories;
                if (!cat || !cat.id) return null;
                return (
                  <Link key={cat.id} href={`/category/${cat.slug || 'general'}`} className="px-3 py-1 bg-transparent text-black font-mono text-[10px] font-bold uppercase tracking-widest border border-black hover:bg-black hover:text-white transition-colors">
                    {cat.name || 'Category'}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="mt-12 pt-6 border-t-2 border-ledger-ink">
            <div className="font-mono text-xs text-ledger-muted uppercase tracking-wider mb-2 font-bold">
              পড়া শেষ? আপনার বন্ধুদের সাথে শেয়ার করুন:
            </div>
            <SocialShareAndBookmark
              title={record.title}
              slug={record.slug}
              postId={record.id}
              leadParagraph={record.lead_paragraph}
            />
          </div>
        </article>

        {/* Sidebar / Recommendations */}
        <aside className="lg:col-span-4 border-t-4 lg:border-t-0 lg:border-l-4 border-ledger-ink pt-8 lg:pt-0 lg:pl-8">
          <div className="sticky top-8">
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2.5 h-2.5 bg-[var(--orange)] rounded-xs"></span>
              <h2 className="font-headline font-bold text-2xl uppercase tracking-tighter">সংশ্লিষ্ট অনুসন্ধান</h2>
            </div>

            {relatedRecords && relatedRecords.length > 0 ? (
              <div className="flex flex-col gap-4">
                {relatedRecords.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/record/${item.slug}`}
                    className="card card-hover relative block bg-white border border-ledger-border p-5 overflow-hidden group"
                    style={{ '--cat': getCategoryColorVar((record.categories as any)?.slug || (record.categories as any)?.name) } as React.CSSProperties}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="tag">
                        {(record.categories as any)?.name}
                      </span>
                      <span className="font-mono text-[10px] text-ledger-muted font-bold">
                        {item.read_time_minutes || 4}M READ
                      </span>
                    </div>
                    <h3 className="font-headline font-bold text-lg text-ledger-ink leading-snug mb-3 group-hover:text-[var(--orange)] transition-colors">
                      {item.title}
                    </h3>
                    <div className="font-mono text-[10px] text-ledger-muted/70 text-right">
                      {new Date(item.published_at).toLocaleDateString('bn-BD')}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="font-mono text-sm text-ledger-muted">No related records found in this category.</p>
            )}
          </div>
        </aside>

      </div>
    </main>
    </>
  );
}
