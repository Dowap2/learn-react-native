import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import { Comment } from '@/hooks/useComments';
import { CommentItem } from './CommentItem';

type Props = {
  comments: Comment[];
  onDelete: (comment: Comment) => void;
};

export function CommentList({ comments, onDelete }: Props) {
  if (comments.length === 0) {
    return <Text style={styles.emptyText}>첫 댓글을 남겨보세요!</Text>;
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <CommentItem comment={item} onDelete={onDelete} />
      )}
      style={styles.list}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 8,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#9CA3AF',
  },
});
