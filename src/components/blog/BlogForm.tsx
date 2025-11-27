import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import type { PostFormData } from '@/types/blog.types';

const ACCENT_COLOR = '#1E3A8A';

type Props = {
  form: PostFormData;
  isEditMode: boolean;
  submitting: boolean;
  translating: boolean;
  onChangeField: (field: keyof PostFormData, value: string) => void;
  onTranslate: () => void;
  onCancel: () => void;
  onSubmit: () => void;
};

function BlogForm({
  form,
  isEditMode,
  submitting,
  translating,
  onChangeField,
  onTranslate,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <View>
      <Text style={styles.screenTitle}>
        {isEditMode ? '글 수정' : '새 글 작성'}
      </Text>

      <Text style={styles.label}>제목 (한국어)</Text>
      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(v) => onChangeField('title', v)}
        placeholder="예: 내 첫 블로그 포스트"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>태그 (쉼표로 구분)</Text>
      <TextInput
        style={styles.input}
        value={form.tags}
        onChangeText={(v) => onChangeField('tags', v)}
        placeholder="예: React, TypeScript, Supabase"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>요약 (선택)</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={form.summary}
        onChangeText={(v) => onChangeField('summary', v)}
        placeholder="간단한 요약을 입력하세요"
        placeholderTextColor="#9CA3AF"
        multiline
      />

      <Text style={styles.label}>내용 (Markdown, 한국어)</Text>
      <TextInput
        style={[styles.input, styles.contentInput]}
        value={form.content}
        onChangeText={(v) => onChangeField('content', v)}
        placeholder="본문 내용을 Markdown 형식으로 작성하세요"
        placeholderTextColor="#9CA3AF"
        multiline
      />

      <View style={styles.translateRow}>
        <TouchableOpacity
          style={styles.translateButton}
          onPress={onTranslate}
          disabled={translating}
        >
          {translating ? (
            <ActivityIndicator size="small" color={ACCENT_COLOR} />
          ) : (
            <Text style={styles.translateButtonText}>영어 번역 생성 (AI)</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Title (English)</Text>
      <TextInput
        style={styles.input}
        value={form.titleEn}
        onChangeText={(v) => onChangeField('titleEn', v)}
        placeholder="English title (optional)"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Content (English, Markdown)</Text>
      <TextInput
        style={[styles.input, styles.contentInput]}
        value={form.contentEn}
        onChangeText={(v) => onChangeField('contentEn', v)}
        placeholder="English content (optional)"
        placeholderTextColor="#9CA3AF"
        multiline
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={submitting}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>취소</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={onSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>
              {isEditMode ? '수정 완료' : '작성 완료'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default BlogForm;

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 18,
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
