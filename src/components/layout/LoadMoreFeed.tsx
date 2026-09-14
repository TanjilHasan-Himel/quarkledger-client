'use client';

import { useState } from 'react';
import { StoryCard } from '@/components/editorial/StoryCard';

interface LoadMoreFeedProps {
  initialOffset: number;
  initialHasMore: boolean;
  categoryId?: string;
  authorId?: string;
}

export function LoadMoreFeed({ initialOffset, initialHasMore, categoryId, authorId }: LoadMoreFeedProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: '6'
      });
      if (categoryId) params.append('categoryId', categoryId);
      if (authorId) params.append('authorId', authorId);

      const res = await fetch(`/api/posts/more?${params.toString()}`);
      const data = await res.json();

      if (data.posts) {
        setPosts((prev) => [...prev, ...data.posts]);
        setOffset((prev) => prev + data.posts.length);
        setHasMore(data.hasMore);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!hasMore && posts.length === 0) return null;

  return (
    <>
      {/* Appended Posts Grid */}
      {posts.length > 0 && (
        <div className="w-full mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((record) => (
              <StoryCard key={record.id} post={record} />
            ))}
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 flex justify-center w-full">
          <button 
            onClick={loadMore}
            disabled={loading}
            className="bg-ledger-orange hover:bg-ledger-orange-light hover:text-ledger-ink text-white px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-widest transition-colors shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'অনুসন্ধান চলছে...' : '+ আরও প্রতিবেদন লোড করুন'}
          </button>
        </div>
      )}
    </>
  );
}
