import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { RecentPost } from '@/hooks/useRecentPosts';
import { useSearchPosts } from '@/hooks/useSearchPosts';

const ACCENT_COLOR = '#1E3A8A';

type Props = {
  search: string;
  onChangeSearch: (value: string) => void;
  onPressSeeAll: () => void;
  posts: RecentPost[];
  loading: boolean;
  error: string | null;
  onPressPost: (postId: number) => void;
};

function HomeBlogSection({
  search,
  onChangeSearch,
  onPressSeeAll,
  posts: recentPosts,
  loading: recentLoading,
  error: recentError,
  onPressPost,
}: Props) {
  const shouldSearch = search.trim().length > 0;

  const {
    posts: searchedPosts,
    loading: searchLoading,
    error: searchError,
  } = useSearchPosts(search, { onlyTitle: true });

  const displayPosts = shouldSearch ? searchedPosts : recentPosts;
  const loading = shouldSearch ? searchLoading : recentLoading;
  const error = shouldSearch ? searchError : recentError;

  const noPosts =
    !loading && !error && displayPosts.length === 0 && !shouldSearch;

  const noSearchResult =
    !loading && !error && displayPosts.length === 0 && shouldSearch;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>블로그</Text>
        <TouchableOpacity onPress={onPressSeeAll}>
          <Text style={styles.sectionLink}>전체 보기</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionDescription}>
        공부한 내용을 정리한 기술 블로그 글을 모아둔 공간입니다.
      </Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="제목으로 검색 (전체 글 대상)"
          value={search}
          onChangeText={onChangeSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderTitle}>
          {shouldSearch ? '검색 결과' : '최근 글'}
        </Text>

        {loading && (
          <View style={styles.stateRow}>
            <ActivityIndicator size="small" color={ACCENT_COLOR} />
            <Text style={styles.stateText}>
              {shouldSearch ? '검색 중입니다...' : '최근 글을 불러오는 중...'}
            </Text>
          </View>
        )}

        {error && !loading && (
          <Text style={[styles.stateText, styles.errorText]}>{error}</Text>
        )}

        {noPosts && (
          <Text style={styles.stateText}>
            아직 등록된 글이 없습니다. 첫 글을 작성해보세요.
          </Text>
        )}

        {noSearchResult && (
          <Text style={styles.stateText}>
            "{search}"에 해당하는 글이 없습니다.
          </Text>
        )}

        {!loading &&
          !error &&
          displayPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.postRow}
              onPress={() => onPressPost(post.id)}
            >
              <View style={styles.postBullet} />
              <View style={styles.postTextWrapper}>
                <Text style={styles.postTitle} numberOfLines={1}>
                  {post.title_ko || '제목 없는 글'}
                </Text>
                {post.summary_ko ? (
                  <Text style={styles.postSummary} numberOfLines={1}>
                    {post.summary_ko}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

export default HomeBlogSection;

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionLink: {
    fontSize: 13,
    color: ACCENT_COLOR,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 13,
    color: '#111827',
  },
  placeholderCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 12,
  },
  placeholderTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  errorText: {
    color: '#DC2626',
  },
  postRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  postBullet: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: ACCENT_COLOR,
    marginRight: 8,
  },
  postTextWrapper: {
    flex: 1,
  },
  postTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  postSummary: {
    fontSize: 12,
    color: '#6B7280',
  },
});
