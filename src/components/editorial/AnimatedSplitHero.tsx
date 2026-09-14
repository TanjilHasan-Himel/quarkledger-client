'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface HeroPost {
  id: string;
  title: string;
  slug: string;
  lead_paragraph: string;
  cover_image_url?: string;
  categories?: { name: string, slug: string };
}

interface AnimatedSplitHeroProps {
  leftPost: HeroPost;
  rightPost: HeroPost;
}

export function AnimatedSplitHero({ leftPost, rightPost }: AnimatedSplitHeroProps) {
  // We'll toggle between two states: 0 = left dominant, 1 = right dominant
  const [activeState, setActiveState] = useState<0 | 1>(0);

  useEffect(() => {
    // Loop the state every 6 seconds
    const interval = setInterval(() => {
      setActiveState((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Spring physics for the "tan" (elastic/stretch) feel
  const springConfig = {
    type: 'spring' as const,
    damping: 25,
    stiffness: 120,
    mass: 1.2
  };

  const CardContent = ({ post, isDominant }: { post: HeroPost, isDominant: boolean }) => (
    <div className="relative h-full w-full overflow-hidden bg-black flex flex-col justify-end p-8 md:p-12 border-2 border-ledger-ink group">
      {post.cover_image_url && (
        <motion.div 
          className="absolute inset-0 z-0"
          animate={{ scale: isDominant ? 1.05 : 1 }}
          transition={{ duration: 6, ease: "linear" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
          <Image 
            src={post.cover_image_url} 
            alt={post.title} 
            fill 
            className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-700" 
          />
        </motion.div>
      )}
      
      <div className="relative z-20 flex flex-col items-start max-w-2xl">
        {post.categories && (
          <span className="bg-ledger-orange text-white font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 shadow-sm">
            {post.categories.name}
          </span>
        )}
        <h2 className={`font-headline font-black text-white leading-tight drop-shadow-md mb-4 transition-all duration-700 ${isDominant ? 'text-3xl md:text-5xl' : 'text-2xl md:text-4xl'}`}>
          {post.title}
        </h2>
        
        {/* Use pure CSS max-height and opacity transition for buttery smooth accordion effect without reflow jitter */}
        <p 
          className={`font-body text-white/90 text-lg md:text-xl line-clamp-2 md:line-clamp-3 transition-all duration-700 ease-in-out overflow-hidden ${
            isDominant ? 'opacity-100 max-h-40 mt-4' : 'opacity-0 max-h-0 mt-0'
          }`}
        >
          {post.lead_paragraph}
        </p>
      </div>
    </div>
  );

  return (
    <section className="w-full bg-[#FF5722] py-8 px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1500px] mx-auto h-[600px] md:h-[700px] flex flex-col md:flex-row gap-6 relative">
        
        {/* LEFT CARD */}
        <motion.div
          className="h-1/2 md:h-full relative cursor-pointer"
          animate={{
            width: typeof window !== 'undefined' && window.innerWidth >= 768 
              ? (activeState === 0 ? '60%' : '40%')
              : '100%'
          }}
          transition={springConfig}
          onMouseEnter={() => setActiveState(0)}
        >
          <Link href={`/record/${leftPost.slug}`} className="block h-full w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300">
            <CardContent post={leftPost} isDominant={activeState === 0} />
          </Link>
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          className="h-1/2 md:h-full relative cursor-pointer"
          animate={{
            width: typeof window !== 'undefined' && window.innerWidth >= 768 
              ? (activeState === 1 ? '60%' : '40%')
              : '100%'
          }}
          transition={springConfig}
          onMouseEnter={() => setActiveState(1)}
        >
          <Link href={`/record/${rightPost.slug}`} className="block h-full w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300">
            <CardContent post={rightPost} isDominant={activeState === 1} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
