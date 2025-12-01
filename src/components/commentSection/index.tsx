import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useComments, Comment } from '@/hooks/useComments';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { DeleteConfirmModal } from './DeleteConfirmModal';

type Props = {
  postId: number;
};

export function CommentSection({ postId }: Props) {
  const { comments, loading, addComment, deleteComment } = useComments(postId);
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);

  const handleAddComment = async (data: {
    author: string;
    body: string;
    pin: string;
  }) => {
    return await addComment(data);
  };

  const handleDeleteClick = (comment: Comment) => {
    setDeleteTarget(comment);
  };

  const handleDeleteConfirm = async (pin: string) => {
    if (!deleteTarget) return { ok: false };
    return await deleteComment(deleteTarget.id);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>댓글</Text>

      <CommentForm onSubmit={handleAddComment} />

      {loading ? (
        <ActivityIndicator />
      ) : comments.length === 0 ? (
        <Text style={styles.emptyText}>첫 댓글을 남겨보세요!</Text>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CommentItem comment={item} onDelete={handleDeleteClick} />
          )}
          style={styles.list}
          scrollEnabled={false}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          comment={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  list: {
    marginTop: 8,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#9CA3AF',
  },
});
