import { useState, useEffect } from 'react';
import { supabase } from '@/libs/supabaseClient';
import type { PostFormData } from '@/types/blog.types';

export const useBlogForm = (editingPostId?: number) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    summary: '',
    content: '',
    tags: '',
    titleEn: '',
    contentEn: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    if (!editingPostId) return;

    const loadPost = async () => {
      setInitialLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(
          `
          id,
          title_ko,
          content_ko,
          summary_ko,
          tags,
          title_en,
          content_en
        `,
        )
        .eq('id', editingPostId)
        .single();

      if (!error && data) {
        setFormData({
          title: data.title_ko ?? '',
          summary: data.summary_ko ?? '',
          content: data.content_ko ?? '',
          tags: data.tags ?? '',
          titleEn: data.title_en ?? '',
          contentEn: data.content_en ?? '',
        });
      }

      setInitialLoading(false);
    };

    loadPost();
  }, [editingPostId]);

  const updateField = <K extends keyof PostFormData>(
    field: K,
    value: PostFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const submitPost = async (editingPostId?: number): Promise<boolean> => {
    setLoading(true);

    const postData = {
      title_ko: formData.title.trim(),
      summary_ko: formData.summary.trim() || null,
      content_ko: formData.content.trim(),
      tags: formData.tags.trim() || null,
      title_en: formData.titleEn.trim() || null,
      content_en: formData.contentEn.trim() || null,
    };

    try {
      if (editingPostId) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editingPostId);

        if (error) {
          console.error(error);
          return false;
        }
      } else {
        const { error } = await supabase.from('posts').insert([postData]);

        if (error) {
          console.error(error);
          return false;
        }
      }

      return true;
    } catch (err) {
      console.error('submitPost exception:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    initialLoading,
    updateField,
    submitPost,
    setFormData,
  };
};
