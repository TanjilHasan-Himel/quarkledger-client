import Link from 'next/link';

interface RelatedRecord {
  id: string;
  title: string;
  slug: string;
  lead_paragraph: string;
  read_time_minutes: number;
}

interface Props {
  sourceAttribution?: string | null;
  confidenceScore?: number;
  relatedRecords?: RelatedRecord[];
}

export function RelatedDispatches({ 
  sourceAttribution = 'কোয়ার্ক লেজার স্বাধীন পর্যবেক্ষণ ডেস্ক',
  confidenceScore = 0.98,
  relatedRecords = [] 
}: Props) {
  return (
    <section className="mt-12 pt-8 border-t-4 border-double border-ledger-ink">
      {/* Archival Fact-Check Transparency Box */}
      <div className="border border-ledger-ink p-4 md:p-6 bg-white/40 mb-10">
        <div className="flex flex-wrap justify-between items-center border-b border-ledger-border pb-3 mb-3">
          <span className="font-mono text-xs uppercase font-bold text-ledger-accent tracking-wider">
            নথি যাচাইকরণ সূচক (TRANSPARENCY AUDIT)
          </span>
          <span className="font-mono text-xs text-ledger-muted">
            রেফারেন্স আইডি: AUD-{Math.random().toString(36).substring(2, 8).toUpperCase()}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-ledger-muted block">প্রাথমিক সূত্র:</span>
            <strong className="text-ledger-ink font-body text-sm">{sourceAttribution || 'মুক্ত তথ্যসূত্র'}</strong>
          </div>
          <div>
            <span className="text-ledger-muted block">সত্যতা যাচাই স্কোর:</span>
            <strong className="text-ledger-ink text-sm">{(confidenceScore * 100).toFixed(0)}% (উত্তীর্ণ)</strong>
          </div>
          <div>
            <span className="text-ledger-muted block">পর্যালোচনা বোর্ড:</span>
            <strong className="text-ledger-ink text-sm">সম্পাদকীয় পিয়ার কমিটি</strong>
          </div>
        </div>
      </div>

      {/* Historical Related Dispatches */}
      {relatedRecords.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-headline font-bold text-lg uppercase">এই বিষয়ের পূর্ববর্তী নথি ও সূত্র</span>
            <span className="flex-1 h-px bg-ledger-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedRecords.slice(0, 3).map((record) => (
              <article key={record.id} className="border-r border-ledger-border pr-4 last:border-r-0">
                <span className="font-mono text-[10px] text-ledger-muted block mb-1">
                  {record.read_time_minutes} মিনিট পাঠ
                </span>
                <h4 className="font-headline font-bold text-base hover:text-ledger-accent leading-snug">
                  <Link href={`/record/${record.slug}`}>{record.title}</Link>
                </h4>
                <p className="font-body text-xs text-ledger-muted mt-1.5 line-clamp-2 leading-relaxed">
                  {record.lead_paragraph}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
