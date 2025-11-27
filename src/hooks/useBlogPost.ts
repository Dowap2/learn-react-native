import { useState, useEffect } from 'react';
import { supabase } from '@/libs/supabaseClient';
import type { Post } from '@/types/blog.types';

export const useBlogPost = (postId: number, isFocused: boolean) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title_ko,
        content_ko,
        title_en,
        content_en,
        summary_ko,
        summary_en,
        created_at,
        tags
      `)
      .eq('id', postId)
      .single();

    if (error) {
      setError('글을 불러오는 중 오류가 발생했습니다.');
      setPost(null);
    } else {
      setPost(data as Post);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!isFocused) return;
    fetchPost();
  }, [isFocused, postId]);

  return { post, loading, error, refetch: fetchPost };
};