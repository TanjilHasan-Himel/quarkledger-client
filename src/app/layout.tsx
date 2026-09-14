import type { Metadata } from "next";
import { Anek_Bangla, Hind_Siliguri, JetBrains_Mono, Playfair_Display, Tiro_Bangla, Press_Start_2P, Share_Tech_Mono } from 'next/font/google';
import "./globals.css";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import { NewsletterSection } from '@/components/layout/NewsletterSection';
import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const pressStart = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-press-start',
  display: 'swap',
});

const tiroBangla = Tiro_Bangla({
  subsets: ['bengali'],
  weight: ['400'],
  variable: '--font-tiro-bangla',
  display: 'swap',
});

const anekBangla = Anek_Bangla({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-anek-bangla',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const shareTechMono = Share_Tech_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-digital',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://quarkledger.com'),
  title: "Quark Ledger — সমকালীন জিজ্ঞাসা ও বৈজ্ঞানিক অনুসন্ধান",
  description: "সমকালীন জিজ্ঞাসা, বৈজ্ঞানিক অনুসন্ধান ও বৈশ্বিক সংবাদ প্রবাহের ডিজিটাল মহাফেজখানা।",
  icons: {
    icon: '/tabQuark.jpg',
    shortcut: '/tabQuark.jpg',
    apple: '/tabQuark.jpg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch categories server-side for dynamic footer — replaces hardcoded slugs
  const supabase = await createServerClient();
  const { data: footerCategories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name')
    .limit(6);
  return (
    <html lang="bn" className={`${playfairDisplay.variable} ${tiroBangla.variable} ${pressStart.variable} ${anekBangla.variable} ${hindSiliguri.variable} ${jetbrainsMono.variable} ${shareTechMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body selection:bg-ledger-accent selection:text-white bg-ledger-paper">
        <div className="flex-1">
          {children}
        </div>

        {/* Global Newsletter Dispatch Section */}
        <NewsletterSection />

        {/* Tactile Broadsheet Footer */}
        <footer className="w-full bg-ledger-dark text-ledger-paper relative pt-12 pb-8 px-6 font-mono">
          {/* Top Tech Orange Hairline */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF5722]" />
          
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/20">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-[family:var(--font-english-display)] font-black tracking-tighter uppercase mb-3 text-white">
                QUARK LEDGER
              </h2>
              <p className="font-body text-sm text-white/70 max-w-md leading-relaxed mb-4">
                বিশ্বের নির্ভরযোগ্য বিজ্ঞান, প্রযুক্তি ও গবেষণার খবরগুলো আমরা বিভিন্ন মাধ্যম থেকে সংগ্রহ করে সহজ বাংলায় তুলে ধরার চেষ্টা করি। নতুন সব আবিষ্কার ও সমসাময়িক খবরের সাথে সবসময় আপডেটেড থাকুন।
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase font-bold tracking-widest text-ledger-amber-warm mb-4 border-b border-white/20 pb-1">
                বিভাগসমূহ
              </h3>
              <ul className="space-y-2 text-xs text-white/80">
                {(footerCategories || []).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="hover:text-ledger-amber-warm transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase font-bold tracking-widest text-ledger-amber-warm mb-4 border-b border-white/20 pb-1">
                লিখতে চান? যোগাযোগ করুন
              </h3>
              <p className="text-xs text-white/70 leading-relaxed mb-4">
                বিজ্ঞান বা প্রযুক্তি নিয়ে লিখতে ভালোবাসেন? আমাদের প্ল্যাটফর্মে যেকোনো আর্টিকেল বা নিজস্ব মতামত শেয়ার করার জন্য আপনাকে স্বাগতম!
              </p>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-white/50">ইমেইল: </span>
                  <a href="mailto:contact@quarkledger.com" className="text-ledger-amber-warm hover:underline">contact@quarkledger.com</a>
                </div>
                <div>
                  <span className="text-white/50">লেখা পাঠান: </span>
                  <a href="mailto:editor@quarkledger.com" className="text-ledger-amber-warm hover:underline">editor@quarkledger.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
            <div>
              © ২০২৬ কোয়ার্ক লেজার (Quark Ledger) · বিজ্ঞান ও সমসাময়িক তথ্যের উন্মুক্ত পোর্টাল।
            </div>
            <div className="flex items-center gap-4 text-xs text-white/70">
              <Link href="/category/science" className="hover:text-ledger-amber-warm">বিজ্ঞান</Link>
              <span>·</span>
              <Link href="/category/technology" className="hover:text-ledger-amber-warm">প্রযুক্তি</Link>
              <span>·</span>
              <Link href="/category/ai" className="hover:text-ledger-amber-warm">এআই</Link>
              <span>·</span>
              <a href="mailto:contact@quarkledger.com" className="hover:text-ledger-amber-warm">যোগাযোগ</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
