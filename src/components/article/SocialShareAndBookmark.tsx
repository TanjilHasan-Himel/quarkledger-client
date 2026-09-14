'use client';

import { useState, useEffect } from 'react';

interface Props {
  title: string;
  slug: string;
  postId: string;
  leadParagraph?: string;
}

export function SocialShareAndBookmark({ title, slug, postId, leadParagraph }: Props) {
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = JSON.parse(localStorage.getItem('quark_saved_records') || '[]');
      setIsBookmarked(saved.some((item: any) => item.slug === slug || item.id === postId));
    } catch {
      // ignore
    }
  }, [slug, postId]);

  const getFullUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/record/${encodeURIComponent(slug)}`;
    }
    return `https://quarkledger.com/record/${encodeURIComponent(slug)}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFullUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const toggleBookmark = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('quark_saved_records') || '[]');
      let updated;
      if (isBookmarked) {
        updated = saved.filter((item: any) => item.slug !== slug && item.id !== postId);
        setIsBookmarked(false);
      } else {
        updated = [{
          id: postId,
          title,
          slug,
          lead: leadParagraph || '',
          savedAt: new Date().toISOString()
        }, ...saved];
        setIsBookmarked(true);
      }
      localStorage.setItem('quark_saved_records', JSON.stringify(updated));
      window.dispatchEvent(new Event('quark-bookmark-updated'));
    } catch {
      // ignore
    }
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(getFullUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const shareTwitter = () => {
    const url = encodeURIComponent(getFullUrl());
    const text = encodeURIComponent(`${title} — Quark Ledger`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
  };

  const shareWhatsApp = () => {
    const url = encodeURIComponent(getFullUrl());
    const text = encodeURIComponent(`*${title}*\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 my-6 border-y-2 border-ledger-ink font-mono text-xs">
      {/* Share Section */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold uppercase tracking-wider text-ledger-muted mr-1">শেয়ার করুন:</span>
        
        <button
          onClick={shareFacebook}
          className="border border-ledger-ink px-3 py-1.5 hover:border-[#FF5722] hover:text-[#FF5722] transition-all font-bold uppercase cursor-pointer active:scale-95 active:translate-y-[1px] bg-ledger-paper shadow-2xs"
          title="Share on Facebook"
        >
          Facebook
        </button>

        <button
          onClick={shareTwitter}
          className="border border-ledger-ink px-3 py-1.5 hover:border-[#FF5722] hover:text-[#FF5722] transition-all font-bold uppercase cursor-pointer active:scale-95 active:translate-y-[1px] bg-ledger-paper shadow-2xs"
          title="Share on X / Twitter"
        >
          X (Twitter)
        </button>

        <button
          onClick={shareWhatsApp}
          className="border border-ledger-ink px-3 py-1.5 hover:border-[#FF5722] hover:text-[#FF5722] transition-all font-bold uppercase cursor-pointer active:scale-95 active:translate-y-[1px] bg-ledger-paper shadow-2xs"
          title="Share on WhatsApp"
        >
          WhatsApp
        </button>

        {/* Copy Link Button with Floating Toast Tooltip */}
        <div className="relative inline-block">
          <button
            onClick={handleCopy}
            className={`border px-3 py-1.5 font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 active:translate-y-[1px] shadow-2xs ${
              copied 
                ? 'border-[#FF5722] bg-[#FF5722] text-white shadow-sm' 
                : 'border-ledger-ink bg-ledger-paper text-ledger-ink hover:border-[#FF5722] hover:text-[#FF5722]'
            }`}
            title="Copy Link"
          >
            <span className={copied ? 'text-white' : 'text-[#FF5722]'}>{copied ? '✓' : '📋'}</span>
            <span>{copied ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
          </button>
          {copied && (
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1C1917] text-white text-[11px] font-mono font-bold px-2.5 py-1 whitespace-nowrap shadow-lg border border-[#FF5722] flex items-center gap-1 z-30 animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[#FF5722]">✓</span>
              <span>ক্লিপবোর্ডে কপি হয়েছে!</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1C1917] border-r border-b border-[#FF5722] rotate-45" />
            </div>
          )}
        </div>
      </div>

      {/* Bookmark Section with Site-Color Star (#FF5722) */}
      <div>
        <button
          onClick={toggleBookmark}
          className={`border-2 px-3.5 py-1.5 font-bold uppercase transition-all flex items-center gap-2 cursor-pointer active:scale-95 active:translate-y-[1px] shadow-2xs ${
            isBookmarked 
              ? 'border-[#FF5722] bg-[#FF5722]/10 text-ledger-ink shadow-sm' 
              : 'border-ledger-ink bg-ledger-paper text-ledger-ink hover:border-[#FF5722] hover:text-[#FF5722]'
          }`}
          title={isBookmarked ? 'সংরক্ষিত তালিকা থেকে মুছুন' : 'পরবর্তীতে পড়ার জন্য সংরক্ষণ করুন'}
        >
          <span className={`text-base leading-none transition-transform duration-200 ${isBookmarked ? 'text-[#FF5722] scale-125' : 'text-ledger-muted'}`}>
            ★
          </span>
          <span className={isBookmarked ? 'text-[#FF5722] font-black' : ''}>
            {isBookmarked ? 'সংরক্ষিত (Saved)' : 'পড়ে রাখুন (Save)'}
          </span>
        </button>
      </div>
    </div>
  );
}
