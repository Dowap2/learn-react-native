// src/hooks/useComments.ts
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/libs/supabaseClient';

export type Comment = {
  id: number;
  post_id: number;
  author: string;
  body: string;
  pin: string;
  created_at: string;
};

export type NewCommentInput = {
  author: string;
  body: string;
  pin: string;
};

export function useComments(postId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const loadComments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      Alert.alert('댓글을 불러오는 중 오류가 발생했습니다.');
    } else if (data) {
      setComments(data as Comment[]);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const addComment = useCallback(
    async (input: NewCommentInput) => {
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        author: input.author.trim(),
        body: input.body.trim(),
        pin: input.pin,
      });

      if (error) {
        console.error(error);
        Alert.alert('댓글 작성 중 오류가 발생했습니다.');
        return { ok: false as const, error };
      }

      await loadComments();
      return { ok: true as const };
    },
    [postId, loadComments],
  );

  const deleteComment = useCallback(
    async (commentId: number) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error(error);
        Alert.alert('댓글 삭제 중 오류가 발생했습니다.');
        return { ok: false as const, error };
      }

      await loadComments();
      return { ok: true as const };
    },
    [loadComments],
  );

  return {
    comments,
    loading,
    addComment,
    deleteComment,
  };
}
