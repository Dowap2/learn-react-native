import { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/libs/supabaseClient';
import type { Post } from '@/types/blog.types';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('posts')
      .select('id, title_ko, title_en, summary_ko, created_at, tags')
      .order('created_at', { ascending: false });

    if (error) {
      setError('글 목록을 불러오는 중 오류가 발생했습니다.');
    } else {
      setPosts(data as Post[]);
    }

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  return { posts, loading, error, refetch: fetchPosts };
};