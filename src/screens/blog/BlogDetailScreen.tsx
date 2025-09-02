import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { supabase } from '@/libs/supabaseClient';
import { RootStackParamList } from 'App';
import Markdown from '@ronradtke/react-native-markdown-display';
import Constants from 'expo-constants';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogDetail'>;

type Post = {
  id: number;
  title_ko: string | null;
  content_ko: string | null;
  title_en: string | null;
  content_en: string | null;
  summary_ko: string | null;
  summary_en: string | null;
  created_at: string;
  tags: string | null;
};

const ACCENT_COLOR = '#1E3A8A';
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra;
const ADMIN_PASSWORD = extra.adminPassword;

function BlogDetailScreen({ route, navigation }: Props) {
  const { postId } = route.params;
  const isFocused = useIsFocused();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lang, setLang] = useState<'ko' | 'en'>('ko');

  const fetchPost = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('posts')
      .select(
        `
          id,
          title_ko,
          content_ko,
          title_en,
          content_en,
          summary_ko,
          summary_en,
          created_at,
          tags
        `,
      )
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
    if (!isFocused) return;
    fetchPost();
  }, [isFocused, postId]);

  const handleDeletePress = () => {
    setShowDeleteBox((prev) => !prev);
    setPassword('');
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    setDeleteError(null);

    if (password !== ADMIN_PASSWORD) {
      console.log(password, ADMIN_PASSWORD, Constants);
      setDeleteError('비밀번호가 올바르지 않습니다.');
      return;
    }

    if (!post) return;

    setIsDeleting(true);

    const { error } = await supabase.from('posts').delete().eq('id', post.id);

    setIsDeleting(false);

    if (error) {
      setDeleteError('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      return;
    }

    Alert.alert('삭제 완료', '게시글이 삭제되었습니다.', [
      {
        text: '확인',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  };

  const handleEditPress = () => {
    if (!post) return;

    // BlogCreate에서 route.params?.editingPostId로 받아서
    // 수정 모드로 동작하게 만들면 됨
    navigation.navigate('BlogCreate', { editingPostId: post.id });
  };

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

  const title = lang === 'ko' ? post.title_ko : post.title_en;
  const content = lang === 'ko' ? post.content_ko : post.content_en;

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
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.headerLabel}>POST DETAIL</Text>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}
            >
              <Text style={styles.editButtonText}>수정</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeletePress}
            >
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.dateRow}>
            <View style={styles.dateDot} />
            <Text style={styles.date}>{dateStr}</Text>
          </View>
        </View>

        {tags.length > 0 && (
          <View style={styles.tagRow}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagChipText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {showDeleteBox && (
          <View style={styles.deleteBox}>
            <Text style={styles.deleteBoxLabel}>관리자 비밀번호</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력하세요"
              secureTextEntry
              keyboardType="number-pad"
              style={styles.deleteInput}
            />
            {deleteError && (
              <Text style={styles.deleteErrorText}>{deleteError}</Text>
            )}

            <View style={styles.deleteButtonRow}>
              <TouchableOpacity
                style={[styles.deleteActionButton, styles.deleteCancel]}
                onPress={() => {
                  setShowDeleteBox(false);
                  setPassword('');
                  setDeleteError(null);
                }}
                disabled={isDeleting}
              >
                <Text style={styles.deleteCancelText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteActionButton, styles.deleteConfirm]}
                onPress={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.deleteConfirmText}>삭제 확인</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Markdown style={markdownStyles}>
          {content ?? '내용이 없습니다.'}
        </Markdown>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16 }}
      >
        <View style={styles.langToggleRow}>
          <TouchableOpacity
            style={[
              styles.langButton,
              lang === 'ko' && styles.langButtonActive,
            ]}
            onPress={() => setLang('ko')}
          >
            <Text
              style={[
                styles.langButtonText,
                lang === 'ko' && styles.langButtonTextActive,
              ]}
            >
              한국어
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.langButton,
              lang === 'en' && styles.langButtonActive,
            ]}
            onPress={() => setLang('en')}
          >
            <Text
              style={[
                styles.langButtonText,
                lang === 'en' && styles.langButtonTextActive,
              ]}
            >
              English
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    maxWidth: 240,
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

  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#F97373',
    backgroundColor: '#FEF2F2',
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },

  deleteBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteBoxLabel: {
    fontSize: 12,
    marginBottom: 6,
    color: '#991B1B',
    fontWeight: '600',
  },
  deleteInput: {
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  deleteErrorText: {
    marginTop: 6,
    fontSize: 12,
    color: '#DC2626',
  },
  deleteButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  deleteActionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginLeft: 8,
  },
  deleteCancel: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  deleteCancelText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  deleteConfirm: {
    backgroundColor: '#DC2626',
  },
  deleteConfirmText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  langToggleRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: 12,
    gap: 8 as any,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  langButtonActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  langButtonText: {
    fontSize: 12,
    color: '#555',
  },
  langButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    color: '#777',
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    backgroundColor: '#EFF6FF',
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 12,
    color: ACCENT_COLOR,
    fontWeight: '600',
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
