'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export function InlineSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Close search when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={searchRef} className="relative flex items-center ml-4">
      {/* Expanding Search Container */}
      <div 
        className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64 md:w-80 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <input 
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the ledger..."
          className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-2 border-b-2 border-[#FF5722] font-mono text-sm focus:outline-none focus:bg-white/20 transition-colors rounded-none"
        />
      </div>

      {/* Toggle Icon with Tactile Click & Site Color */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/10 rounded-full transition-all group flex-shrink-0 active:scale-90 active:translate-y-[1px] cursor-pointer"
        title="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF5722] group-hover:scale-110 transition-transform">
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            <>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </>
          )}
        </svg>
      </button>

      {/* Results Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full right-0 mt-4 w-80 md:w-96 bg-ledger-paper border-[3px] border-ledger-ink shadow-[4px_4px_0_0_#1C1917] z-50 text-ledger-ink">
          {loading ? (
            <div className="p-4 font-mono text-xs text-ledger-muted text-center animate-pulse">
              Searching archives...
            </div>
          ) : results.length > 0 ? (
            <ul className="flex flex-col">
              {results.map((r, i) => (
                <li key={r.id} className={`border-ledger-border ${i !== results.length - 1 ? 'border-b' : ''}`}>
                  <Link href={`/record/${r.slug}`} className="block p-4 hover:bg-yellow-400/50 group transition-colors" onClick={() => setIsOpen(false)}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-ledger-accent border border-ledger-accent px-1">
                        {(r.categories as any)?.name || 'WIRE'}
                      </span>
                      <span className="font-mono text-[9px] text-ledger-muted">
                        {new Date(r.published_at).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                    <h4 className="font-headline font-bold text-lg leading-tight group-hover:underline underline-offset-2">
                      {r.title}
                    </h4>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 font-mono text-xs text-ledger-muted text-center">
              No field notes found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
