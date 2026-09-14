'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TickerItem {
  id: string;
  title: string;
  slug: string;
  source?: string;
  timeAgo: string;
}

export function BreakingTicker({ items = [] }: { items?: TickerItem[] }) {
  const [mounted, setMounted] = useState(false);
  const [timeStr, setTimeStr] = useState<string>('--:-- --');
  const [showColon, setShowColon] = useState(true);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    
    // Update time every second to track minute transitions accurately
    const timeInterval = setInterval(updateTime, 1000);
    
    // Blink colon every 500ms
    const blinkInterval = setInterval(() => {
      setShowColon(prev => !prev);
    }, 500);

    return () => {
      clearInterval(timeInterval);
      clearInterval(blinkInterval);
    };
  }, []);

  const [hours, rest] = mounted && timeStr.includes(':') 
    ? timeStr.split(':') 
    : ['--', '-- --'];

  const [minutes, ampm] = (rest || '').trim().split(' ');

  const sampleItems: TickerItem[] = items.length > 0 ? items : [
    { id: '1', title: 'কৃষ্ণগহ্বরের দিগন্তে কোয়ান্টাম এনট্যাঙ্গলমেন্টের নতুন প্রমাণ শনাক্ত', slug: 'quantum-blackhole', timeAgo: '১০ মিনিট আগে' },
    { id: '2', title: 'জেমস ওয়েব টেলিস্কোপে প্রাচীনতম গ্যালাক্সির রাসায়নিক বিশ্লেষণ সম্পন্ন', slug: 'jwst-ancient-galaxy', timeAgo: '২৫ মিনিট আগে' },
    { id: '3', title: 'স্বায়ত্তশাসিত নিউরাল এজেন্টদের নীতিমালায় আন্তর্জাতিক চুক্তি স্বাক্ষরিত', slug: 'autonomous-agents-ethics', timeAgo: '১ ঘণ্টা আগে' }
  ];

  return (
    <div className="w-full bg-[#FCF8F0] text-ledger-ink border-b-2 border-ledger-border flex flex-col md:flex-row items-stretch md:items-center overflow-hidden">
      
      {/* Compact 7-Segment Digital Clock (No orange block, no TIME text, no dot) */}
      <div 
        className="px-3.5 h-10 md:h-11 flex items-center justify-center shrink-0 border-b md:border-b-0 md:border-r border-ledger-border bg-[#F5EFE4] text-ledger-ink select-none"
        title="লাইভ ঘড়ি / Live Clock"
      >
        <div className="flex items-baseline gap-1">
          <span className="font-[family:var(--font-seven-segment)] text-xl md:text-2xl tracking-wider tabular-nums leading-none text-ledger-ink">
            <span>{hours}</span>
            <span className={`transition-opacity duration-150 ${showColon ? 'opacity-100' : 'opacity-20'} mx-[1px]`}>:</span>
            <span>{minutes || '--'}</span>
          </span>
          {ampm && (
            <span className="font-mono text-[9px] font-bold text-ledger-muted uppercase tracking-tight">
              {ampm}
            </span>
          )}
        </div>
      </div>

      {/* Marquee Ticker Track */}
      <div className="relative w-full overflow-hidden flex items-center font-headline font-bold text-sm md:text-base border-b md:border-b-0 md:border-r border-ledger-border h-10 md:h-11">
        {/* The single wrapper that animates, holding exactly two copies for a seamless 50% translation */}
        <div className="flex whitespace-nowrap animate-[marquee_60s_linear_infinite] hover:[animation-play-state:paused] w-max items-center h-full">
          {/* Copy 1 */}
          <div className="flex items-center">
            {sampleItems.map((item, idx) => (
              <Link 
                key={`a-${item.id}-${idx}`} 
                href={`/record/${item.slug}`} 
                className="inline-flex items-center gap-2 hover:text-[#FF5722] px-4 transition-colors"
              >
                <span>{item.title}</span>
                <span className="text-[#FF5722]/50 font-mono mx-2">+++</span>
              </Link>
            ))}
          </div>
          {/* Copy 2 */}
          <div className="flex items-center" aria-hidden="true">
            {sampleItems.map((item, idx) => (
              <Link 
                key={`b-${item.id}-${idx}`} 
                href={`/record/${item.slug}`} 
                className="inline-flex items-center gap-2 hover:text-[#FF5722] px-4 transition-colors"
              >
                <span>{item.title}</span>
                <span className="text-[#FF5722]/50 font-mono mx-2">+++</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Share / Email form */}
      <div className="flex items-center gap-2 shrink-0 px-4 py-2 md:w-[360px] bg-[#F5EFE4]">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-ledger-ink">নিউজলেটার:</span>
        <div className="flex w-full h-7 border border-ledger-border bg-white">
          <input 
            type="email" 
            placeholder="ইমেইল লিখুন" 
            className="w-full bg-transparent px-2 font-mono text-[10px] outline-none placeholder:text-ledger-muted/60 text-ledger-ink"
          />
          <button className="bg-[#FF5722] text-white px-3 font-mono text-[10px] font-bold uppercase hover:bg-[#FFAB91] hover:text-[#1C1917] transition-all active:scale-95 active:translate-y-[1px] cursor-pointer">
            যুক্ত হন
          </button>
        </div>
      </div>

    </div>
  );
}
