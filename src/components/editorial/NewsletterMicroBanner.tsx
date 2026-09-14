'use client';

export function NewsletterMicroBanner() {
  const scrollToNewsletter = () => {
    const el = document.getElementById('inline-newsletter');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#EBE4D5] border-b border-ledger-border py-3 px-4 text-center">
      <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-3 text-xs md:text-sm font-mono text-ledger-ink">
        <span className="w-2 h-2 rounded-full bg-[var(--orange)] inline-block shrink-0 animate-pulse" />
        <span className="text-ledger-muted font-normal">
          সমকালীন বিজ্ঞান, প্রযুক্তি ও বৈশ্বিক চিন্তার নিরপেক্ষ বিশ্লেষণ।
        </span>
        <button
          onClick={scrollToNewsletter}
          className="font-bold text-[var(--orange)] hover:underline underline-offset-4 cursor-pointer inline-flex items-center gap-1 shrink-0"
        >
          সাপ্তাহিক ডিসপ্যাচে যুক্ত হন →
        </button>
      </div>
    </div>
  );
}
