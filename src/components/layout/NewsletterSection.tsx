'use client';

import { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'সাবস্ক্রিপশন সম্পন্ন হয়েছে!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'সমস্যা হয়েছে, পুনরায় চেষ্টা করুন।');
      }
    } catch {
      setStatus('error');
      setMessage('নেটওয়ার্ক ত্রুটি। ইন্টারনেট সংযোগ যাচাই করুন।');
    }
  };

  return (
    <section className="w-full bg-ledger-paper border-t-4 border-ledger-ink py-12 px-6 font-mono text-ledger-ink">
      <div className="max-w-[1400px] mx-auto border-2 border-ledger-ink p-8 md:p-12 relative bg-ledger-paper shadow-[8px_8px_0_0_#1C1917]">
        {/* Stamp Badge */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 border-2 border-ledger-accent text-ledger-accent px-3 py-1 text-[10px] uppercase font-bold tracking-widest rotate-2 select-none">
          WEEKLY DISPATCH
        </div>

        <div className="max-w-3xl">
          <div className="text-xs uppercase font-bold text-ledger-accent tracking-widest mb-2">
            ● সারসংক্ষেপ ডাকযোগ
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-black uppercase tracking-tight mb-4">
            কোয়ার্ক লেজার ডিসপ্যাচ
          </h2>
          <p className="font-body text-base md:text-lg text-ledger-muted leading-relaxed mb-8">
            সপ্তাহের সবচেয়ে প্রভাবশালী বৈজ্ঞানিক গবেষণা, ডিপ-টেক অগ্রগতি এবং আন্তর্জাতিক মহাকাশ অভিযানের নিরপেক্ষ বিশ্লেষণ প্রতি শুক্রবার সকালে সরাসরি আপনার ইনবক্সে। সম্পূর্ণ স্প্যাম-মুক্ত ও উন্মুক্ত বিজ্ঞান সাংবাদিকতা।
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="আপনার ইমেইল ঠিকানা লিখুন..."
              required
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 border-2 border-ledger-ink bg-white text-ledger-ink placeholder:text-ledger-muted/70 p-3.5 font-mono text-sm focus:outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] transition-all disabled:opacity-50 shadow-2xs"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="border-2 border-ledger-ink bg-ledger-ink text-ledger-paper px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider hover:bg-[#FF5722] hover:border-[#FF5722] transition-all active:scale-95 active:translate-y-[1px] disabled:opacity-50 cursor-pointer shrink-0 shadow-sm"
            >
              {status === 'loading' ? 'পাঠানো হচ্ছে...' : 'সাবস্ক্রাইব করুন ➔'}
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 p-3 border font-mono text-xs font-bold ${
                status === 'success'
                  ? 'border-green-700 bg-green-50 text-green-800'
                  : 'border-red-700 bg-red-50 text-red-800'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
