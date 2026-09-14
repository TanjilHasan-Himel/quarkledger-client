'use client';

import { StoryCard, StoryCardPost } from './StoryCard';

interface StoryGridProps {
  posts: StoryCardPost[];
  columns?: 2 | 3 | 4;
  variant?: 'standard' | 'featured' | 'compact' | 'horizontal' | 'mini';
}

export function StoryGrid({ posts, columns = 3, variant = 'standard' }: StoryGridProps) {
  const colClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${colClass} gap-6 md:gap-8 w-full`}>
      {posts.map((post, idx) => (
        <StoryCard 
          key={post.id || post.slug} 
          post={post} 
          variant={variant}
          priority={idx < 3}
        />
      ))}
    </div>
  );
}
