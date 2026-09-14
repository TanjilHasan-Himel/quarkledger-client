import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { ScrollProgress } from '@/components/reader/ScrollProgress';
import { RecordViewTracker } from './RecordViewTracker';
import DOMPurify from 'isomorphic-dompurify';
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

  const ogImage = record.cover_image_url || `/api/og?title=${encodeURIComponent(record.title)}`;

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
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const supabase = await createServerClient();

  // Fetch the main article
  const { data: record } = await supabase
    .from('posts')
    .select(`
      id, title, slug, lead_paragraph, content_html, read_time_minutes, 
      volume_no, issue_no, published_at, cover_image_url, views_count,
      category_id,
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

  const sanitizedHtml = DOMPurify.sanitize(record.content_html, {
    ADD_TAGS: ['span', 'pre', 'code', 'math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'msqrt', 'mroot', 'mtable', 'mtr', 'mtd', 'annotation'],
    ADD_ATTR: ['class', 'style', 'aria-hidden', 'xmlns', 'display']
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: record.title,
    image: [record.cover_image_url],
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

        {record.cover_image_url && (
          <figure className="mb-8 w-full border-2 border-ledger-ink">
            <Image 
              src={record.cover_image_url} 
              alt={record.title} 
              width={1200}
              height={675}
              priority={true}
              className="w-full aspect-[21/9] object-cover"
            />
          </figure>
        )}
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 font-mono text-xs text-ledger-muted border-y border-ledger-border py-3">
          <div>BY <Link href={`/author/${encodeURIComponent((record.users_extended as any)?.persons?.full_name || 'Quark Ledger')}`} className="hover:text-ledger-ink underline underline-offset-2">{(record.users_extended as any)?.persons?.full_name || 'Quark Ledger'}</Link></div>
          <div>VOL. {record.volume_no} NO. {record.issue_no}</div>
          <div>{new Date(record.published_at!).toLocaleDateString('en-US', { dateStyle: 'long' })}</div>
          <div className="md:ml-auto">READ: {record.read_time_minutes}M / VIEWS: {record.views_count}</div>
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
            className="prose prose-ledger lg:prose-lg font-body max-w-none
                       prose-p:leading-relaxed prose-headings:font-headline prose-headings:font-bold
                       prose-pre:bg-[#0d1117] prose-pre:text-[#c9d1d9] prose-pre:p-4 prose-pre:rounded-md prose-pre:font-mono prose-code:font-mono
                       first-letter:text-7xl first-letter:font-headline first-letter:font-bold first-letter:float-left first-letter:mr-4"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />

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
