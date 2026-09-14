'use client';

import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside 
      aria-label="Reading progress"
      className="fixed top-0 left-0 w-full h-[3px] z-50 bg-black/20"
    >
      <div 
        className="h-full bg-[var(--orange)] shadow-[0_0_10px_var(--orange)] transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </aside>
  );
}
