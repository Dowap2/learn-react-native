import React, { useMemo, useState } from 'react';
import { View, FlatList, StatusBar, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/types/navigation.types';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import BlogListHeader from '@/components/blog/BlogListHeader';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { LoadingView } from '@/components/common/LoadingView';
import { ErrorView } from '@/components/common/ErrorView';
import type { Post } from '@/types/blog.types';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogList'>;

function BlogListScreen({ navigation }: Props) {
  const { posts, loading, error, refetch } = useBlogPosts();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      if (!post.tags) return;
      post.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [posts]);

  const filteredPosts = useMemo<Post[]>(() => {
    if (!selectedTag) return posts;

    return posts.filter((post) => {
      if (!post.tags) return false;
      const tags = post.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      return tags.includes(selectedTag);
    });
  }, [posts, selectedTag]);

  if (loading) {
    return <LoadingView message="불러오는 중..." />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={refetch} />;
  }

  if (posts.length === 0) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.emptyText}>등록된 글이 아직 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <BlogListHeader
        allTags={allTags}
        selectedTag={selectedTag}
        onChangeTag={setSelectedTag}
        onPressWrite={() => navigation.navigate('BlogCreate')}
      />

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <BlogPostCard
            post={item}
            onPress={() =>
              navigation.navigate('BlogDetail', { postId: item.id })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centerList}>
            <Text style={styles.emptyText}>해당 태그의 글이 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

export default BlogListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
  },
  centerList: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
