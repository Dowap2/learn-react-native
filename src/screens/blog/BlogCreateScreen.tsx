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

function BlogCreateScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(''); // "회고, CSS" 이런 식으로 입력
  const [loading, setLoading] = useState(false);

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

      <Text style={styles.label}>제목</Text>
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

      <Text style={styles.label}>내용 (Markdown)</Text>
      <TextInput
        style={[styles.input, styles.multilineInput, styles.contentInput]}
        value={content}
        onChangeText={setContent}
        placeholder="마크다운으로 내용을 작성해보세요"
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
