'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SavedItem {
  id: string;
  title: string;
  slug: string;
  lead: string;
  savedAt: string;
}

export function SavedArticlesModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadSaved = () => {
    try {
      const items = JSON.parse(localStorage.getItem('quark_saved_records') || '[]');
      setSavedItems(items);
    } catch {
      setSavedItems([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadSaved();

    const handleUpdate = () => loadSaved();
    window.addEventListener('quark-bookmark-updated', handleUpdate);
    return () => window.removeEventListener('quark-bookmark-updated', handleUpdate);
  }, []);

  const removeItem = (id: string, slug: string) => {
    const updated = savedItems.filter(item => item.id !== id && item.slug !== slug);
    setSavedItems(updated);
    localStorage.setItem('quark_saved_records', JSON.stringify(updated));
    window.dispatchEvent(new Event('quark-bookmark-updated'));
  };

  const clearAll = () => {
    if (!confirm('সব সংরক্ষিত আর্টিকেল মুছে ফেলতে চান?')) return;
    setSavedItems([]);
    localStorage.removeItem('quark_saved_records');
    window.dispatchEvent(new Event('quark-bookmark-updated'));
  };

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 border border-white/40 hover:border-[#FF5722] px-2.5 py-1.5 text-xs font-mono font-bold uppercase transition-all tracking-wider text-white active:scale-95 active:translate-y-[1px] cursor-pointer"
        title="Saved Articles"
      >
        <span className={savedItems.length > 0 ? "text-[#FF5722]" : "text-white/60"}>★</span>
        <span className="hidden sm:inline">সংরক্ষিত</span>
        <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-xs transition-colors ${
          savedItems.length > 0 ? 'bg-[#FF5722] text-white' : 'bg-white/20 text-white/80'
        }`}>
          {savedItems.length}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs font-mono animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-ledger-paper text-ledger-ink border-l-4 border-ledger-ink flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b-2 border-ledger-ink flex items-center justify-between">
              <div>
                <h2 className="text-xl font-headline font-black uppercase tracking-tight">সংরক্ষিত সংগ্রহশালা</h2>
                <div className="text-[10px] text-ledger-muted uppercase mt-0.5">
                  SAVED ARTICLES · {savedItems.length} ITEMS
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="border-2 border-ledger-ink w-8 h-8 flex items-center justify-center font-bold hover:bg-ledger-ink hover:text-ledger-paper transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {savedItems.map(item => (
                <div key={item.id || item.slug} className="border border-ledger-border p-4 bg-ledger-paper hover:border-ledger-ink transition-colors">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <Link
                      href={`/record/${encodeURIComponent(item.slug)}`}
                      onClick={() => setIsOpen(false)}
                      className="font-bold text-sm leading-snug hover:underline text-ledger-ink"
                    >
                      {item.title}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id, item.slug)}
                      className="text-ledger-muted hover:text-red-700 text-xs px-1 cursor-pointer"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                  {item.lead && (
                    <p className="text-[11px] text-ledger-muted line-clamp-2 mb-2">
                      {item.lead}
                    </p>
                  )}
                  <div className="text-[9px] text-ledger-muted uppercase">
                    সংরক্ষিত: {new Date(item.savedAt).toLocaleDateString('en-GB')}
                  </div>
                </div>
              ))}

              {savedItems.length === 0 && (
                <div className="p-12 text-center text-ledger-muted text-xs border border-dashed border-ledger-border">
                  কোনো সংরক্ষিত আর্টিকেল নেই। যেকোনো প্রতিবেদনের নিচে &quot;পড়ে রাখুন&quot; বাটনে ক্লিক করে সংগ্রহ করুন।
                </div>
              )}
            </div>

            {/* Footer */}
            {savedItems.length > 0 && (
              <div className="p-4 border-t-2 border-ledger-ink bg-ledger-paper flex justify-between items-center text-xs">
                <button
                  onClick={clearAll}
                  className="text-red-700 hover:underline font-bold uppercase text-[10px] cursor-pointer"
                >
                  সব মুছুন (Clear All)
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="border border-ledger-ink bg-ledger-ink text-ledger-paper px-4 py-1.5 font-bold uppercase text-[10px] hover:bg-ledger-accent transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
