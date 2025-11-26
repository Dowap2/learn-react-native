import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '@/libs/supabaseClient';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogList'>;

type Post = {
  id: number;
  title_ko: string;
  title_en: string;
  summary_ko: string | null;
  created_at: string;
  tags: string | null;
};

const ACCENT_COLOR = '#1E3A8A';

function BlogListScreen({ navigation }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('posts')
      .select('id, title_ko, summary_ko, created_at, tags')
      .order('created_at', { ascending: false });

    if (error) {
      console.log(error);
      setError('글 목록을 불러오는 중 오류가 발생했습니다.');
    } else {
      setPosts(data as Post[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const filteredPosts = useMemo(() => {
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

  const renderItem = ({ item }: { item: Post }) => {
    const dateStr = new Date(item.created_at).toLocaleDateString('ko-KR');
    const tags = item.tags
      ? item.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.itemContainer}
        onPress={() => navigation.navigate('BlogDetail', { postId: item.id })}
      >
        <View style={styles.itemHeaderRow}>
          <View style={styles.itemBadge} />
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title_ko || item.title_en}
          </Text>
        </View>

        {item.summary_ko && (
          <Text style={styles.itemSummary} numberOfLines={2}>
            {item.summary_ko}
          </Text>
        )}

        {tags.length > 0 && (
          <View style={styles.tagRow}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tagChipInCard}>
                <Text style={styles.tagChipInCardText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.itemFooter}>
          <View style={styles.dateChip}>
            <Text style={styles.dateChipText}>{dateStr}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ACCENT_COLOR} />
        <Text style={styles.loadingText}>불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
          <Text style={styles.retryText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>등록된 글이 아직 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerLabel}>MY BLOG</Text>
        <Text style={styles.headerTitle}>블로그 게시글</Text>
        <Text style={styles.headerSubtitle}>
          새로 작성한 글을 한 곳에서 확인해보세요.
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.writeButton}
            onPress={() => navigation.navigate('BlogCreate')}
          >
            <Text style={styles.writeButtonText}>글 작성</Text>
          </TouchableOpacity>
        </View>

        {allTags.length > 0 && (
          <View style={styles.tagFilterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagFilterScrollContent}
            >
              <TouchableOpacity
                style={[styles.tagChip, !selectedTag && styles.tagChipSelected]}
                onPress={() => setSelectedTag(null)}
              >
                <Text
                  style={[
                    styles.tagChipText,
                    !selectedTag && styles.tagChipTextSelected,
                  ]}
                >
                  전체
                </Text>
              </TouchableOpacity>

              {allTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagChip,
                      isSelected && styles.tagChipSelected,
                    ]}
                    onPress={() =>
                      setSelectedTag((prev) => (prev === tag ? null : tag))
                    }
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        isSelected && styles.tagChipTextSelected,
                      ]}
                    >
                      #{tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 6,
    color: '#6B7280',
  },

  headerActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  writeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: ACCENT_COLOR,
  },
  writeButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  tagFilterContainer: {
    marginTop: 14,
  },
  tagFilterScrollContent: {
    paddingRight: 4,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  tagChipSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: ACCENT_COLOR,
  },
  tagChipText: {
    fontSize: 12,
    color: '#6B7280',
  },
  tagChipTextSelected: {
    color: ACCENT_COLOR,
    fontWeight: '600',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },

  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: '#E5E7EB',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemBadge: {
    width: 8,
    height: 20,
    borderRadius: 999,
    backgroundColor: ACCENT_COLOR,
    marginRight: 10,
  },
  itemTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  itemSummary: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
    marginBottom: 8,
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  tagChipInCard: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6,
    marginBottom: 4,
  },
  tagChipInCardText: {
    fontSize: 11,
    color: '#6B7280',
  },

  itemFooter: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dateChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
  },
  dateChipText: {
    fontSize: 12,
    color: ACCENT_COLOR,
    fontWeight: '500',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: ACCENT_COLOR,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
