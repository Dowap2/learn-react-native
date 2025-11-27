import { useState } from 'react';
import { supabase } from '@/libs/supabaseClient';
import Toast from 'react-native-toast-message';
import type { PostFormData } from '@/types/blog.types';

export const useBlogCreate = (editingPostId?: number) => {
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = !!editingPostId;

  const submit = async (
    form: PostFormData,
  ): Promise<'created' | 'updated' | null> => {
    const title = form.title.trim();
    const content = form.content.trim();
    const summary = form.summary.trim();
    const tags = form.tags.trim();
    const titleEn = form.titleEn.trim();
    const contentEn = form.contentEn.trim();

    if (!title) {
      Toast.show({
        type: 'error',
        text1: '제목을 입력해주세요.',
      });
      return null;
    }

    if (!content) {
      Toast.show({
        type: 'error',
        text1: '내용을 입력해주세요.',
      });
      return null;
    }

    const postData = {
      title_ko: title,
      summary_ko: summary || null,
      content_ko: content,
      tags: tags || null,
      title_en: titleEn || null,
      content_en: contentEn || null,
    };

    setSubmitting(true);

    try {
      if (isEditMode && editingPostId) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editingPostId);

        if (error) {
          console.error(error);
          Toast.show({
            type: 'error',
            text1: '글 수정 실패',
            text2: '잠시 후 다시 시도해주세요.',
          });
          return null;
        }

        Toast.show({
          type: 'success',
          text1: '글이 수정되었습니다.',
          text2: '상세 페이지로 이동합니다.',
        });

        return 'updated';
      } else {
        const { error } = await supabase.from('posts').insert([postData]);

        if (error) {
          console.error(error);
          Toast.show({
            type: 'error',
            text1: '글 작성 실패',
            text2: '잠시 후 다시 시도해주세요.',
          });
          return null;
        }

        Toast.show({
          type: 'success',
          text1: '새 글이 등록되었습니다.',
          text2: '목록 화면으로 돌아갑니다.',
        });

        return 'created';
      }
    } catch (err) {
      console.error('🔥 useBlogCreate.submit exception:', err);
      Toast.show({
        type: 'error',
        text1: '알 수 없는 오류',
        text2: '요청 처리 중 문제가 발생했습니다.',
      });
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    isEditMode,
    submit,
  };
};
