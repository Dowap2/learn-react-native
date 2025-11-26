import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '@/libs/supabaseClient';
import type { RootStackParamList } from '@/navigation/types';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogCreate'>;

const ACCENT_COLOR = '#1E3A8A';
const TRANSLATE_ENDPOINT =
  'https://uernuwypmjghqmyhqhnq.functions.supabase.co/translate-post';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

function BlogCreateScreen({ route, navigation }: Props) {
  const editingPostId = route?.params?.editingPostId;
  const isEditMode = !!editingPostId;

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [contentEn, setContentEn] = useState('');

  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    if (!editingPostId) return;

    const loadPost = async () => {
      setInitialLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(
          `
          id,
          title_ko,
          content_ko,
          summary_ko,
          tags,
          title_en,
          content_en
        `,
        )
        .eq('id', editingPostId)
        .single();

      if (error || !data) {
        Alert.alert('오류', '글 정보를 불러오지 못했습니다.');
        setInitialLoading(false);
        return;
      }

      // ✅ 한국어 + 영어 모두 세팅
      setTitle(data.title_ko ?? '');
      setSummary(data.summary_ko ?? '');
      setContent(data.content_ko ?? '');
      setTags(data.tags ?? '');
      setTitleEn(data.title_en ?? '');
      setContentEn(data.content_en ?? '');

      setInitialLoading(false);
    };

    loadPost();
  }, [editingPostId]);

  const handleTranslate = async () => {
    if (!title.trim() || !content.trim()) {
      Toast.show({
        type: 'error',
        text1: '번역 불가',
        text2: '한국어 제목과 내용을 먼저 입력해주세요.',
      });
      return;
    }

    if (!SUPABASE_ANON_KEY) {
      Toast.show({
        type: 'error',
        text1: '환경 설정 오류',
        text2: 'EXPO_PUBLIC_SUPABASE_ANON_KEY가 설정되어 있지 않습니다.',
      });
      return;
    }

    try {
      setTranslating(true);
      const res = await fetch(TRANSLATE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          titleKo: title.trim(),
          contentKo: content,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.log('translate error:', text);
        Toast.show({
          type: 'error',
          text1: '오류',
          text2: '번역에 실패했습니다.',
        });
        return;
      }

      const data = await res.json();
      console.log('서버 응답:', data);

      if (data.error) {
        Toast.show({
          type: 'error',
          text1: '오류',
          text2: data.error,
        });
        return;
      }

      let finalTitleEn = data.titleEn || '';
      let finalContentEn = data.contentEn || '';

      if (!finalTitleEn && finalContentEn.includes('```json')) {
        try {
          let cleanText = finalContentEn.trim();
          cleanText = cleanText.replace(/^```json\s*/i, '');
          cleanText = cleanText.replace(/^```\s*/, '');
          cleanText = cleanText.replace(/\s*```$/, '');
          cleanText = cleanText.trim();

          const parsed = JSON.parse(cleanText);
          finalTitleEn = parsed.titleEn || '';
          finalContentEn = parsed.contentEn || '';
        } catch (e) {
          console.log('클라이언트 JSON 파싱 실패:', e);
        }
      }

      console.log('최종 titleEn:', finalTitleEn);
      console.log('최종 contentEn:', finalContentEn);

      setTitleEn(finalTitleEn);
      setContentEn(finalContentEn);

      Toast.show({
        type: 'success',
        text1: '번역 완료',
        text2: '영문 제목과 내용이 채워졌습니다.',
      });
    } catch (e) {
      console.error('번역 에러:', e);
      Alert.alert('오류', '번역 요청 중 문제가 발생했습니다.');
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Toast.show({
        type: 'error',
        text1: '제목을 입력해주세요.',
      });
      return;
    }

    if (!content.trim()) {
      Toast.show({
        type: 'error',
        text1: '내용을 입력해주세요.',
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ 저장할 데이터 (한국어 + 영어 모두 포함)
      const postData = {
        title_ko: title.trim(),
        summary_ko: summary.trim() || null,
        content_ko: content.trim(),
        tags: tags.trim() || null,
        title_en: titleEn.trim() || null,
        content_en: contentEn.trim() || null,
      };

      if (isEditMode && editingPostId) {
        // ✅ 수정 모드: UPDATE
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editingPostId);

        if (error) {
          console.error(error);
          Toast.show({
            type: 'error',
            text1: '글 수정 실패',
            text2: '잠시 후 다시 시도해주세요.',
          });
          return;
        }

        Toast.show({
          type: 'success',
          text1: '글이 수정되었습니다.',
          text2: '상세 페이지로 이동합니다.',
        });
        navigation.replace('BlogDetail', { postId: editingPostId });
      } else {
        // ✅ 작성 모드: INSERT
        const { error } = await supabase.from('posts').insert([postData]);

        if (error) {
          console.error(error);
          Toast.show({
            type: 'error',
            text1: '글 작성 실패',
            text2: '잠시 후 다시 시도해주세요.',
          });
          return;
        }

        Toast.show({
          type: 'success',
          text1: '새 글이 등록되었습니다.',
          text2: '목록 화면으로 돌아갑니다.',
        });
        navigation.goBack();
      }
    } catch (err) {
      console.error('🔥 handleSubmit exception:', err);
      Toast.show({
        type: 'error',
        text1: '알 수 없는 오류',
        text2: '요청 처리 중 문제가 발생했습니다.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ACCENT_COLOR} />
        <Text style={styles.loadingText}>
          {isEditMode ? '글 정보를 불러오는 중...' : '로딩 중...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>
          {isEditMode ? '글 수정' : '새 글 작성'}
        </Text>

        <Text style={styles.label}>제목 (한국어)</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="예: 내 첫 블로그 포스트"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>태그 (쉼표로 구분)</Text>
        <TextInput
          style={styles.input}
          value={tags}
          onChangeText={setTags}
          placeholder="예: React, TypeScript, Supabase"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>요약 (선택)</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={summary}
          onChangeText={setSummary}
          placeholder="간단한 요약을 입력하세요"
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <Text style={styles.label}>내용 (Markdown, 한국어)</Text>
        <TextInput
          style={[styles.input, styles.contentInput]}
          value={content}
          onChangeText={setContent}
          placeholder="본문 내용을 Markdown 형식으로 작성하세요"
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <View style={styles.translateRow}>
          <TouchableOpacity
            style={styles.translateButton}
            onPress={handleTranslate}
            disabled={translating}
          >
            {translating ? (
              <ActivityIndicator size="small" color={ACCENT_COLOR} />
            ) : (
              <Text style={styles.translateButtonText}>
                영어 번역 생성 (AI)
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Title (English)</Text>
        <TextInput
          style={styles.input}
          value={titleEn}
          onChangeText={setTitleEn}
          placeholder="English title (optional)"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Content (English, Markdown)</Text>
        <TextInput
          style={[styles.input, styles.contentInput]}
          value={contentEn}
          onChangeText={setContentEn}
          placeholder="English content (optional)"
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              취소
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isEditMode ? '수정 완료' : '작성 완료'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default BlogCreateScreen;

const styles = StyleSheet.create({
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 18,
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  multilineInput: {
    minHeight: 80,
  },
  contentInput: {
    minHeight: 200,
  },
  translateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  translateButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    backgroundColor: '#FFFFFF',
  },
  translateButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: ACCENT_COLOR,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#374151',
  },
});
