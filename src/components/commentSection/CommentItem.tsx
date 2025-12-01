import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Comment } from '@/hooks/useComments';

type Props = {
  comment: Comment;
  onDelete: (comment: Comment) => void;
};

export function CommentItem({ comment, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.author}>{comment.author}</Text>
        <TouchableOpacity onPress={() => onDelete(comment)}>
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.body}>{comment.body}</Text>
      <Text style={styles.date}>
        {new Date(comment.created_at).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontWeight: '600',
    color: '#111827',
  },
  deleteText: {
    fontSize: 12,
    color: '#EF4444',
  },
  body: {
    marginTop: 4,
    fontSize: 14,
    color: '#374151',
  },
  date: {
    marginTop: 4,
    fontSize: 11,
    color: '#9CA3AF',
  },
});
