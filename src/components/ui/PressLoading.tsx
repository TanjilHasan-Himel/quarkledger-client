export function PressLoading() {
  return (
    <main className="min-h-screen bg-ledger-paper text-ledger-ink flex flex-col justify-center items-center px-4">
      <div className="border-4 border-double border-ledger-ink p-8 md:p-12 max-w-lg w-full text-center bg-ledger-paper relative">
        {/* Corner Registration Marks */}
        <span className="absolute -top-2 -left-2 font-mono text-xs text-ledger-muted">+</span>
        <span className="absolute -top-2 -right-2 font-mono text-xs text-ledger-muted">+</span>
        <span className="absolute -bottom-2 -left-2 font-mono text-xs text-ledger-muted">+</span>
        <span className="absolute -bottom-2 -right-2 font-mono text-xs text-ledger-muted">+</span>

        <span className="inline-block font-mono text-xs text-ledger-accent uppercase tracking-widest mb-3">
          ● ব্যুরো প্রেস চালু রয়েছে
        </span>

        <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight uppercase border-b-2 border-ledger-ink pb-3 mb-4">
          কোয়ার্ক লেজার প্রেসে ছাপা হচ্ছে...
        </h2>

        {/* Tactile Wireframe Skeleton */}
        <div className="space-y-2.5 my-6 text-left">
          <div className="h-3 bg-ledger-borderDark/20 w-full" />
          <div className="h-3 bg-ledger-borderDark/20 w-5/6" />
          <div className="h-3 bg-ledger-borderDark/20 w-4/6" />
        </div>

        <div className="font-mono text-[11px] text-ledger-muted uppercase tracking-wider">
          TYPESETTING BROADSHEET RECORD • PLEASE HOLD
        </div>
      </div>
    </main>
  );
}
