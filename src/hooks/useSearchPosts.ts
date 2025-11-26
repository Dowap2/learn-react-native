import { useEffect, useState } from 'react';
import { supabase } from '@/libs/supabaseClient';
import type { RecentPost } from '@/hooks/useRecentPosts';

type Options = {
  onlyTitle?: boolean;
};

type UseSearchPostsResult = {
  posts: RecentPost[];
  loading: boolean;
  error: string | null;
};

export function useSearchPosts(
  keyword: string,
  options?: Options
): UseSearchPostsResult {
  const [posts, setPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { onlyTitle = false } = options ?? {};

  useEffect(() => {
    const q = keyword.trim();

    if (!q) {
      setPosts([]);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      const orCondition = onlyTitle
        ? `title_ko.ilike.%${q}%`
        : `title_ko.ilike.%${q}%,summary_ko.ilike.%${q}%`;

      const { data, error } = await supabase
        .from('posts')
        .select('id, title_ko, summary_ko, created_at')
        .or(orCondition)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        setPosts([]);
      } else {
        setPosts((data || []) as RecentPost[]);
      }

      setLoading(false);
    };

    fetchPosts();
  }, [keyword, onlyTitle]);

  return { posts, loading, error };
}
