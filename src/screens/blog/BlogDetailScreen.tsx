import React, { useState } from 'react';
import { View, ScrollView, StatusBar, StyleSheet } from 'react-native';
import Markdown from '@ronradtke/react-native-markdown-display';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import type { RootStackParamList } from '@/types/navigation.types';
import { useBlogPost } from '@/hooks/useBlogPost';
import { useBlogDelete } from '@/hooks/useBlogDelete';

import { LoadingView } from '@/components/common/LoadingView';
import { ErrorView } from '@/components/common/ErrorView';
import BlogPostHeader from '@/components/blog/BlogPostHeader';
import BlogDeleteBox from '@/components/blog/BlogDeleteBox';
import type { Language } from '@/types/blog.types';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogDetail'>;

const ACCENT_COLOR = '#1E3A8A';

function BlogDetailScreen({ route, navigation }: Props) {
  const { postId } = route.params;
  const isFocused = useIsFocused();

  const { post, loading, error, refetch } = useBlogPost(postId, isFocused);

  const {
    showDeleteBox,
    password,
    deleteError,
    isDeleting,
    setPassword,
    toggleDeleteBox,
    confirmDelete,
  } = useBlogDelete(postId);

  const [lang, setLang] = useState<Language>('ko');

  if (loading) {
    return <LoadingView message="불러오는 중..." />;
  }

  if (error || !post) {
    return (
      <ErrorView error={error ?? '글을 찾을 수 없습니다.'} onRetry={refetch} />
    );
  }

  const dateStr = new Date(post.created_at).toLocaleDateString('ko-KR');
  const tags = post.tags
    ? post.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const title = lang === 'ko' ? post.title_ko : post.title_en;
  const content = lang === 'ko' ? post.content_ko : post.content_en;

  const markdownStyles = createMarkdownStyles(ACCENT_COLOR);

  const handleConfirmDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    Toast.show({
      type: 'success',
      text1: '삭제 완료',
      text2: '게시글이 삭제되었습니다.',
    });

    navigation.reset({
      index: 0,
      routes: [{ name: 'BlogList' }],
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" />

      <BlogPostHeader
        title={title}
        dateStr={dateStr}
        tags={tags}
        lang={lang}
        onChangeLang={setLang}
        onPressEdit={() =>
          navigation.navigate('BlogCreate', { editingPostId: post.id })
        }
        onPressDelete={toggleDeleteBox}
      />

      <BlogDeleteBox
        visible={showDeleteBox}
        password={password}
        error={deleteError}
        isDeleting={isDeleting}
        onChangePassword={setPassword}
        onCancel={toggleDeleteBox}
        onConfirm={handleConfirmDelete}
      />

      <View style={styles.card}>
        <Markdown style={markdownStyles}>
          {content ?? '내용이 없습니다.'}
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
