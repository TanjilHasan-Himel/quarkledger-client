import Link from 'next/link';
import { BanglaDateConverter } from 'bangla-date-converter';
import { createServerClient } from '@/lib/supabase/server';
import { NavigationOverlay } from './NavigationOverlay';
import { InlineSearch } from './InlineSearch';
import { SavedArticlesModal } from './SavedArticlesModal';
import { SubNavScroll } from './SubNavScroll';

// Curated editorial nav sections — main sections only, in display order
// These slugs must exist in the categories table
const NAV_SLUGS = [
  'bangladesh',
  'world',
  'politics',
  'economy',
  'science',
  'technology',
  'ai',
  'space',
  'environment',
  'health',
];

export async function GrandMasthead() {
  const supabase = await createServerClient();
  
  // Fetch ALL categories for NavigationOverlay (fullscreen menu needs them all)
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, name, slug, description, depth, parent_id')
    .order('name');

  // For the nav bar: match only the curated editorial slugs, preserve display order
  const navCategories = NAV_SLUGS
    .map(slug => (allCategories || []).find(cat => cat.slug === slug))
    .filter(Boolean) as { id: string; name: string; slug: string }[];

  const currentDateEn = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
  const currentDateBn = (new BanglaDateConverter(new Date()) as any).format('DD MMMM, YYYY');
  const currentDateAr = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <header className="w-full text-white bg-black border-b border-white/20 shadow-xl">
      <div className="max-w-[1400px] mx-auto px-6 py-7 flex flex-col md:flex-row justify-between items-start md:items-center relative">
        
        {/* Left Section: Logo & Menu */}
        <div className="flex items-center gap-4 z-10 mt-4 md:mt-0">
          <NavigationOverlay categories={(allCategories || []).filter(c => c.depth === 0)} />
          <Link href="/" className="inline-block group">
            <h1 className="text-4xl md:text-5xl font-[family:var(--font-english-display)] font-black tracking-tighter uppercase select-none text-white drop-shadow-md group-hover:text-ledger-amber-warm transition-colors">
              LEDGER
            </h1>
          </Link>
          <InlineSearch />
          <SavedArticlesModal />
        </div>

        {/* Right Section: Multi-lingual Dates */}
        <div className="mt-8 md:mt-0 flex flex-col items-start md:items-end text-sm md:text-base font-bold font-headline tracking-wide space-y-0.5">
          <div className="text-white/90">{currentDateEn}</div>
          <div className="text-white/90">{currentDateBn}</div>
          <div className="text-white/70 font-mono text-xs">{currentDateAr}</div>
          <div className="text-ledger-amber-warm mt-1 uppercase tracking-widest text-base font-mono font-bold">{currentDay}</div>
        </div>
      </div>

      {/* Editorial Category Nav — parent categories only, premium underline-hover design */}
      {navCategories.length > 0 && <SubNavScroll navCategories={navCategories} />}
    </header>
  );
}

