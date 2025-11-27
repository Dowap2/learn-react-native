import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { parseTags } from '@/utils/tags';
import type { Post } from '@/types/blog.types';

type Props = {
  post: Post;
  onPress: () => void;
};

export const BlogPostCard: React.FC<Props> = ({ post, onPress }) => {
  const dateStr = new Date(post.created_at).toLocaleDateString('ko-KR');
  const tags = parseTags(post.tags);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        <View style={styles.badge} />
        <Text style={styles.title} numberOfLines={1}>
          {post.title_ko || post.title_en}
        </Text>
      </View>

      {post.summary_ko && (
        <Text style={styles.summary} numberOfLines={2}>
          {post.summary_ko}
        </Text>
      )}

      {tags.length > 0 && (
        <View style={styles.tagRow}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagChipText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.dateChip}>
          <Text style={styles.dateChipText}>{dateStr}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xxxl,
    marginBottom: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadow.small,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  badge: {
    width: 8,
    height: 20,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.accent,
    marginRight: theme.spacing.lg,
  },
  title: {
    flex: 1,
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  summary: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.tertiary,
    marginTop: 2,
    marginBottom: theme.spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.sm,
  },
  tagChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  tagChipText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  footer: {
    marginTop: theme.spacing.xs,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dateChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.tag.background,
  },
  dateChipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.accent,
    fontWeight: '500',
  },
});
