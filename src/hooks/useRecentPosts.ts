import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/libs/supabaseClient';

export type RecentPost = {
  id: number;
  title_ko: string | null;
  summary_ko: string | null;
  created_at: string;
};

export function useRecentPosts(limit: number = 3) {
  const [posts, setPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        id,
        title_ko,
        summary_ko,
        created_at
      `,
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(error);
      setError('최근 글을 불러오는 중 오류가 발생했습니다.');
      setPosts([]);
    } else {
      setPosts((data ?? []) as RecentPost[]);
    }

    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchRecentPosts();
  }, [fetchRecentPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchRecentPosts,
  };
}
