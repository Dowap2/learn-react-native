import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Markdown, {
  MarkdownIt,
  RenderRules,
} from '@ronradtke/react-native-markdown-display';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { github } from 'react-syntax-highlighter/styles/hljs';
import * as Clipboard from 'expo-clipboard';

import type { RootStackParamList } from '@/types/navigation.types';
import { useBlogPost } from '@/hooks/useBlogPost';
import { useBlogDelete } from '@/hooks/useBlogDelete';

import { LoadingView } from '@/components/common/LoadingView';
import { ErrorView } from '@/components/common/ErrorView';
import BlogPostHeader from '@/components/blog/BlogPostHeader';
import BlogDeleteBox from '@/components/blog/BlogDeleteBox';
import type { Language } from '@/types/blog.types';
import { CommentSection } from '@/components/comment/commentSection';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogDetail'>;

const ACCENT_COLOR = '#0969DA';

const markdownRules: RenderRules = {
  fence: (node, children, parent, styles) => {
    const language = (node.attributes?.info || '').split(' ')[0] || 'text';
    const code = node.content;

    return (
      <View key={node.key} style={styles.codeBlock}>
        <View style={styles.codeHeader}>
          <View style={styles.codeLanguageTag}>
            <Text style={styles.codeLanguageText}>{language}</Text>
          </View>
          <TouchableOpacity
            onPress={() => Clipboard.setStringAsync(code)}
            style={styles.copyButton}
          >
            <Text style={styles.copyButtonText}>Copy</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          style={styles.codeScrollView}
          contentContainerStyle={{ minWidth: '100%' }}
          showsHorizontalScrollIndicator={false}
        >
          <SyntaxHighlighter
            language={language}
            style={github as any}
            highlighter="hljs"
            customStyle={{
              width: '100%',
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: '#F6F8FA',
              margin: 0,
              fontSize: 13,
              overflow: 'hidden',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </ScrollView>
      </View>
    );
  },
};

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
        <Markdown style={markdownStyles} rules={markdownRules}>
          {content ?? '내용이 없습니다.'}
        </Markdown>
      </View>
      <CommentSection postId={postId} />
    </ScrollView>
  );
}

export default BlogDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: '#D0D7DE',
  },
  codeBlock: {
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#D0D7DE',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#F6F8FA',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F6F8FA',
    borderBottomWidth: 1,
    borderBottomColor: '#D0D7DE',
  },
  codeLanguageTag: {
    backgroundColor: '#DDF4FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#54AEFF',
  },
  codeLanguageText: {
    fontSize: 11,
    color: '#0969DA',
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copyButtonText: {
    fontSize: 12,
    color: '#57606A',
    fontWeight: '500',
  },
  codeScrollView: {
    borderRadius: 0,
  },
});

function createMarkdownStyles(accentColor: string) {
  return StyleSheet.create({
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: '#24292F',
      fontFamily: 'System',
    },
    heading1: {
      fontSize: 32,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 16,
      color: '#24292F',
      borderBottomWidth: 1,
      borderBottomColor: '#D0D7DE',
      paddingBottom: 8,
      lineHeight: 40,
    },
    heading2: {
      fontSize: 24,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 16,
      color: '#24292F',
      borderBottomWidth: 1,
      borderBottomColor: '#D0D7DE',
      paddingBottom: 8,
      lineHeight: 32,
    },
    heading3: {
      fontSize: 20,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 16,
      color: '#24292F',
      lineHeight: 28,
    },
    heading4: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 16,
      color: '#24292F',
      lineHeight: 24,
    },
    heading5: {
      fontSize: 14,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 16,
      color: '#24292F',
      lineHeight: 20,
    },
    heading6: {
      fontSize: 13,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 16,
      color: '#57606A',
      lineHeight: 20,
    },
    paragraph: {
      marginBottom: 16,
      lineHeight: 24,
    },
    bullet_list: {
      marginBottom: 16,
      paddingLeft: 0,
    },
    ordered_list: {
      marginBottom: 16,
      paddingLeft: 0,
    },
    list_item: {
      marginBottom: 4,
      paddingLeft: 28,
      lineHeight: 24,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: '#D0D7DE',
      paddingLeft: 16,
      marginVertical: 16,
      color: '#57606A',
      backgroundColor: '#F6F8FA',
      paddingVertical: 8,
      borderRadius: 0,
    },
    hr: {
      marginVertical: 24,
      height: 2,
      backgroundColor: '#D0D7DE',
      borderBottomWidth: 0,
    },
    code_inline: {
      backgroundColor: '#EFF1F3',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      fontFamily: 'Menlo, Monaco, Courier, monospace',
      fontSize: 13.6,
      color: '#24292F',
      borderWidth: 0,
    },
    code_block: {
      backgroundColor: '#F6F8FA',
      padding: 16,
      borderRadius: 6,
      fontFamily: 'Menlo, Monaco, Courier, monospace',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#D0D7DE',
      fontSize: 13,
      lineHeight: 20,
    },
    fence: {
      backgroundColor: '#F6F8FA',
      padding: 16,
      borderRadius: 6,
      fontFamily: 'Menlo, Monaco, Courier, monospace',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#D0D7DE',
    },
    table: {
      borderWidth: 1,
      borderColor: '#D0D7DE',
      borderRadius: 6,
      marginVertical: 16,
      overflow: 'hidden',
    },
    thead: {
      backgroundColor: '#F6F8FA',
    },
    th: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRightWidth: 1,
      borderRightColor: '#D0D7DE',
      fontWeight: '600',
      fontSize: 14,
      color: '#24292F',
    },
    tbody: {
      backgroundColor: '#FFFFFF',
    },
    tr: {
      borderTopWidth: 1,
      borderTopColor: '#D0D7DE',
    },
    td: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRightWidth: 1,
      borderRightColor: '#D0D7DE',
      fontSize: 14,
      color: '#24292F',
      lineHeight: 20,
    },
    image: {
      borderRadius: 6,
      marginVertical: 16,
      maxWidth: '100%',
    },
    strong: {
      fontWeight: '600',
      color: '#24292F',
    },
    em: {
      fontStyle: 'italic',
      color: '#24292F',
    },
    link: {
      color: accentColor,
      textDecorationLine: 'underline',
    },
    s: {
      textDecorationLine: 'line-through',
      color: '#57606A',
    },
  });
}
