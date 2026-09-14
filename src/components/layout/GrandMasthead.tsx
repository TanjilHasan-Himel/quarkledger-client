import Link from 'next/link';
import { BanglaDateConverter } from 'bangla-date-converter';
import { createServerClient } from '@/lib/supabase/server';
import { NavigationOverlay } from './NavigationOverlay';
import { InlineSearch } from './InlineSearch';
import { SavedArticlesModal } from './SavedArticlesModal';

export async function GrandMasthead() {
  const supabase = await createServerClient();
  
  // Fetch active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .order('name');

  const currentDateEn = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
  const currentDateBn = (new BanglaDateConverter(new Date()) as any).format('DD MMMM, YYYY');
  // Using Intl.DateTimeFormat for Hijri (Arabic) date
  const currentDateAr = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <header className="w-full text-white bg-gradient-to-r from-[#140204] via-[#24060B] to-[#3D0A10] border-b-2 border-[#C4430E] shadow-xl">
      <div className="max-w-[1400px] mx-auto px-6 py-7 flex flex-col md:flex-row justify-between items-start md:items-center relative">
        
        {/* Left Section: Logo & Interactive Menu */}
        <div className="flex items-center gap-4 z-10 mt-4 md:mt-0">
          
          <NavigationOverlay categories={categories || []} />
          
          {/* LEDGER redirects to main page */}
          <Link href="/" className="inline-block group">
            <h1 className="text-4xl md:text-5xl font-[family:var(--font-english-display)] font-black tracking-tighter uppercase select-none text-white drop-shadow-md group-hover:text-[var(--amber-warm)] transition-colors">
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
          <div className="text-[var(--amber-warm)] mt-1 uppercase tracking-widest text-base font-mono font-bold">{currentDay}</div>
        </div>
      </div>
    </header>
  );
}
