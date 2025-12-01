// CommentForm.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

type Props = {
  onSubmit: (data: {
    author: string;
    body: string;
    pin: string;
  }) => Promise<{ ok: boolean }>;
};

const ACCENT_COLOR = '#1E3A8A';

export function CommentForm({ onSubmit }: Props) {
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!author.trim()) {
      Alert.alert('작성자 이름을 입력해주세요.');
      return;
    }
    if (!body.trim()) {
      Alert.alert('댓글 내용을 입력해주세요.');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      Alert.alert('비밀번호는 숫자 4자리로 입력해주세요.');
      return;
    }

    setSubmitting(true);
    const result = await onSubmit({ author, body, pin });
    setSubmitting(false);

    if (result.ok) {
      setAuthor('');
      setBody('');
      setPin('');
    }
  };

  const handlePinChange = (text: string) => {
    const onlyDigits = text.replace(/[^0-9]/g, '');
    if (onlyDigits.length <= 4) setPin(onlyDigits);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="작성자"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="댓글 내용"
        value={body}
        onChangeText={setBody}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 (숫자 4자리)"
        value={pin}
        onChangeText={handlePinChange}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>댓글 작성</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 4,
    backgroundColor: ACCENT_COLOR,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
