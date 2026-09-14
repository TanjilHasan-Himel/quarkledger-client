'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function RecordViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const supabase = createClient();
    supabase.rpc('increment_post_views', { target_post_id: postId })
      .then(({ error }) => {
        if (error) console.error("View increment failed:", error);
      });
  }, [postId]);

  return null;
}
