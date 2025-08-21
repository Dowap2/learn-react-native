import React, { useState } from 'react';
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
import { RootStackParamList } from 'App';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogCreate'>;

const ACCENT_COLOR = '#1E3A8A';

// Supabase Edge Function 번역 엔드포인트
const TRANSLATE_ENDPOINT =
  'https://uernuwypmjghqmyhqhnq.functions.supabase.co/translate-post';

// Expo 환경변수에 이미 쓰고 있는 anon 키 사용
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

function BlogCreateScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(''); // "회고, CSS" 이런 식으로 입력

  // 🔹 영어 번역 결과 상태
  const [titleEn, setTitleEn] = useState('');
  const [contentEn, setContentEn] = useState('');

  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('알림', '한국어 제목과 내용을 먼저 입력해주세요.');
      return;
    }

    if (!SUPABASE_ANON_KEY) {
      Alert.alert(
        '환경 설정 오류',
        'EXPO_PUBLIC_SUPABASE_ANON_KEY가 설정되어 있지 않습니다.',
      );
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
        Alert.alert('오류', '번역에 실패했습니다.');
        return;
      }

      const data = (await res.json()) as {
        titleEn?: string;
        contentEn?: string;
        error?: string;
        detail?: string;
      };

      if (data.error) {
        console.log('translate error payload:', data);
        Alert.alert('오류', data.error);
        return;
      }

      setTitleEn(data.titleEn ?? '');
      setContentEn(data.contentEn ?? '');
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '번역 요청 중 문제가 발생했습니다.');
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('내용을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: title.trim(),
          summary: summary.trim() || null,
          content: content,
          tags: tags.trim() || null, // 그대로 콤마 문자열로 저장
          // TODO: 나중에 다국어 스키마 정리되면
          // title_ko, content_ko, title_en, content_en 도 같이 넣을 수 있음
        })
        .select('id')
        .single();

      if (error) {
        console.log(error);
        Alert.alert('오류', '글을 저장하는 중 오류가 발생했습니다.');
        return;
      }

      // 저장 성공 → 디테일 화면으로 이동
      if (data?.id) {
        navigation.replace('BlogDetail', { postId: data.id });
      } else {
        navigation.goBack();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="dark-content" />

      <Text style={styles.label}>제목 (한국어)</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="제목을 입력하세요"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>태그 (쉼표로 구분)</Text>
      <TextInput
        style={styles.input}
        value={tags}
        onChangeText={setTags}
        placeholder="예: 회고, CSS, React"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>요약 (선택)</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={summary}
        onChangeText={setSummary}
        placeholder="목록에 표시될 짧은 요약을 입력하세요"
        placeholderTextColor="#9CA3AF"
        multiline
      />

      <Text style={styles.label}>내용 (Markdown, 한국어)</Text>
      <TextInput
        style={[styles.input, styles.multilineInput, styles.contentInput]}
        value={content}
        onChangeText={setContent}
        placeholder="마크다운으로 내용을 작성해보세요"
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
      />

      {/* 🔹 번역 버튼 + 영어 필드 섹션 */}
      <View style={styles.translateRow}>
        <TouchableOpacity
          style={styles.translateButton}
          onPress={handleTranslate}
          disabled={translating}
        >
          {translating ? (
            <ActivityIndicator color={ACCENT_COLOR} />
          ) : (
            <Text style={styles.translateButtonText}>영어 번역 생성 (AI)</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Title (English)</Text>
      <TextInput
        style={styles.input}
        value={titleEn}
        onChangeText={setTitleEn}
        placeholder="English title (AI 번역 후 수정 가능)"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Content (English, Markdown)</Text>
      <TextInput
        style={[styles.input, styles.multilineInput, styles.contentInput]}
        value={contentEn}
        onChangeText={setContentEn}
        placeholder="English content (AI 번역 후 수정 가능)"
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>취소</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>작성 완료</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default BlogCreateScreen;

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
