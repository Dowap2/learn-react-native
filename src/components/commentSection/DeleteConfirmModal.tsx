// DeleteConfirmModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Comment } from '@/hooks/useComments';

type Props = {
  comment: Comment;
  onConfirm: (pin: string) => Promise<{ ok: boolean }>;
  onCancel: () => void;
};

export function DeleteConfirmModal({ comment, onConfirm, onCancel }: Props) {
  const [pin, setPin] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!/^\d{4}$/.test(pin)) {
      Alert.alert('비밀번호는 숫자 4자리로 입력해주세요.');
      return;
    }

    if (pin !== comment.pin) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setDeleting(true);
    const result = await onConfirm(pin);
    setDeleting(false);

    if (result.ok) {
      onCancel();
    }
  };

  const handlePinChange = (text: string) => {
    const onlyDigits = text.replace(/[^0-9]/g, '');
    if (onlyDigits.length <= 4) setPin(onlyDigits);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>댓글 삭제</Text>
      <Text style={styles.description}>
        작성자 <Text style={styles.authorHighlight}>{comment.author}</Text>의
        댓글을 삭제하려면 비밀번호를 입력해주세요.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호 (숫자 4자리)"
        value={pin}
        onChangeText={handlePinChange}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
      />
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={deleting}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirm}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.confirmButtonText}>삭제</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B91C1C',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#7F1D1D',
    marginBottom: 8,
  },
  authorHighlight: {
    fontWeight: '600',
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
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: '#DC2626',
  },
  cancelButtonText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
