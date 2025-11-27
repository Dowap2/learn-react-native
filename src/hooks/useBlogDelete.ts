import { useState } from 'react';
import { supabase } from '@/libs/supabaseClient';
import { CONFIG } from '@/constants/config';

export const useBlogDelete = () => {
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleDeleteBox = () => {
    setShowDeleteBox((prev) => !prev);
    setPassword('');
    setDeleteError(null);
  };

  const confirmDelete = async (postId: number): Promise<boolean> => {
    setDeleteError(null);

    if (password !== CONFIG.ADMIN_PASSWORD) {
      setDeleteError('비밀번호가 올바르지 않습니다.');
      return false;
    }

    setIsDeleting(true);

    const { error } = await supabase.from('posts').delete().eq('id', postId);

    setIsDeleting(false);

    if (error) {
      setDeleteError('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      return false;
    }

    return true;
  };

  return {
    showDeleteBox,
    password,
    deleteError,
    isDeleting,
    setPassword,
    toggleDeleteBox,
    confirmDelete,
  };
};