'use client';

import { useState } from 'react';

export function InlineNewsletterModule() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatusMessage(null);
    setIsError(false);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setStatusMessage(data.error || 'সাবস্ক্রাইব করতে সমস্যা হয়েছে।');
      } else {
        setIsError(false);
        setStatusMessage(data.message || 'ধন্যবাদ! সাপ্তাহিক ডিসপ্যাচে আপনার নাম যুক্ত হয়েছে।');
        setEmail('');
      }
    } catch {
      setIsError(true);
      setStatusMessage('নেটওয়ার্ক সংযোগ ত্রুটি। পুনরায় চেষ্টা করুন।');
    }
    setLoading(false);
  };

  return (
    <section 
      id="inline-newsletter"
      className="w-full bg-[#EAE3D2] border-y-2 border-ledger-ink p-8 md:p-14 my-8"
    >
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left: Editorial Context / Preview */}
        <div className="md:col-span-7 flex flex-col">
          <div className="flex items-center gap-2 mb-2 font-mono text-[10px] uppercase tracking-widest text-ledger-accent font-bold">
            <span>● কোয়ার্ক লেজার সাপ্তাহিক ডিসপ্যাচ</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-headline font-bold text-ledger-ink tracking-tight mb-3">
            বিজ্ঞান ও সমকালীন অনুসন্ধানের গভীরতম পাঠ সরাসরি আপনার ইনবক্সে
          </h3>
          <p className="font-body text-sm text-ledger-muted leading-relaxed mb-2">
            প্রতি রবিবার সকালে আমাদের সম্পাদকীয় বোর্ড কৃত্রিম বুদ্ধিমত্তা, কসমোলজি, জিনোমিক্স ও জাতীয় গবেষণার নির্বাচিত সংকলন বিশ্লেষণসহ প্রেরণ করে। কোনো অ্যালগরিদম নয়, খাঁটি প্রমিত সাংবাদিকতা।
          </p>
          <div className="font-mono text-[10px] text-ledger-muted/70 italic">
            * কোনো স্প্যাম নয়। এক ক্লিকেই আনসাবস্ক্রাইব করা সম্ভব।
          </div>
        </div>

        {/* Right: Embedded Subscription Form */}
        <div className="md:col-span-5 bg-white border-2 border-ledger-ink p-6 shadow-md">
          <h4 className="font-headline font-bold text-base text-ledger-ink mb-1">
            বিনামূল্যে যুক্ত থাকুন
          </h4>
          <p className="font-body text-xs text-ledger-muted mb-4">
            আপনার পছন্দের ইমেইল এড্রেস দিয়ে সদস্যপদ নিশ্চিত করুন:
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.com"
              required
              className="w-full border-2 border-ledger-ink bg-transparent p-3 font-mono text-xs focus:outline-none focus:border-ledger-accent rounded-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ledger-ink text-white p-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#FF5722] hover:text-white transition-all active:scale-[0.99] active:translate-y-[1px] shadow-sm disabled:opacity-50 cursor-pointer rounded-none"
            >
              {loading ? 'প্রসেসিং হচ্ছে...' : 'সাবস্ক্রাইব করুন →'}
            </button>
          </form>

          {statusMessage && (
            <div className={`mt-3 p-2.5 font-mono text-xs border ${isError ? 'bg-red-50 text-red-700 border-red-300' : 'bg-green-50 text-green-700 border-green-300'}`}>
              {statusMessage}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
