import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { supabase } from '@/libs/supabaseClient';
import { RootStackParamList } from 'App';
import Markdown from '@ronradtke/react-native-markdown-display';

type BlogDetailRouteProp = RouteProp<RootStackParamList, 'BlogDetail'>;
type BlogDetailNavigationProp = NavigationProp<
  RootStackParamList,
  'BlogDetail'
>;

type Props = {
  route: BlogDetailRouteProp;
  navigation: BlogDetailNavigationProp;
};

type Post = {
  id: number;
  title: string;
  content: string;
  summary: string | null;
  created_at: string;
  tags: string | null; // ⬅ 태그 컬럼 추가
};

const ACCENT_COLOR = '#1E3A8A';

function BlogDetailScreen({ route }: Props) {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('posts')
      .select('id, title, summary, content, created_at, tags') // ⬅ tags까지 조회
      .eq('id', postId)
      .single();

    if (error) {
      setError('글을 불러오는 중 오류가 발생했습니다.');
      setPost(null);
    } else {
      setPost(data as Post);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ACCENT_COLOR} />
        <Text style={styles.loadingText}>불러오는 중...</Text>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error ?? '글을 찾을 수 없습니다.'}
        </Text>
      </View>
    );
  }

  const dateStr = new Date(post.created_at).toLocaleDateString('ko-KR');
  const markdownStyles = createMarkdownStyles(ACCENT_COLOR);

  // "회고, CSS" → ['회고', 'CSS']
  const tags = post.tags
    ? post.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerLabel}>POST DETAIL</Text>
        <Text style={styles.title}>{post.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.dateRow}>
            <View style={styles.dateDot} />
            <Text style={styles.date}>{dateStr}</Text>
          </View>
        </View>

        {/* ⬇ 프리뷰(summary) 대신 태그만 표시 */}
        {tags.length > 0 && (
          <View style={styles.tagRow}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagChipText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Markdown style={markdownStyles}>
          {post.content ?? '내용이 없습니다.'}
        </Markdown>
      </View>
    </ScrollView>
  );
}

export default BlogDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
  },
  header: {
    marginBottom: 18,
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 6,
    backgroundColor: ACCENT_COLOR,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },

  // ⬇ 태그 스타일
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6,
    marginBottom: 4,
  },
  tagChipText: {
    fontSize: 11,
    color: ACCENT_COLOR,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,

    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderTopWidth: 3,
    borderTopColor: ACCENT_COLOR,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2,
  },
});

function createMarkdownStyles(accentColor: string) {
  return StyleSheet.create({
    body: {
      fontSize: 15,
      lineHeight: 24,
      color: '#111827',
    },
    heading1: {
      fontSize: 22,
      fontWeight: '700',
      marginTop: 20,
      marginBottom: 10,
      color: '#0F172A',
    },
    heading2: {
      fontSize: 18,
      fontWeight: '700',
      marginTop: 18,
      marginBottom: 8,
      color: '#0F172A',
    },
    heading3: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 14,
      marginBottom: 6,
      color: '#111827',
    },
    paragraph: {
      marginBottom: 10,
    },
    bullet_list: {
      marginBottom: 8,
      paddingLeft: 8,
    },
    ordered_list: {
      marginBottom: 8,
      paddingLeft: 8,
    },
    code_inline: {
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: 'monospace',
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    code_block: {
      backgroundColor: '#F3F4F6',
      padding: 10,
      borderRadius: 8,
      fontFamily: 'monospace',
      marginBottom: 12,
      borderLeftWidth: 3,
      borderLeftColor: accentColor,
    },
    strong: {
      fontWeight: '700',
      color: '#111827',
    },
    em: {
      fontStyle: 'italic',
    },
    link: {
      color: accentColor,
      textDecorationLine: 'underline',
    },
  });
}
