import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

type Props = {
  visible: boolean;
  password: string;
  error: string | null;
  isDeleting: boolean;
  onChangePassword: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

function BlogDeleteBox({
  visible,
  password,
  error,
  isDeleting,
  onChangePassword,
  onCancel,
  onConfirm,
}: Props) {
  if (!visible) return null;

  return (
    <View style={styles.deleteBox}>
      <Text style={styles.deleteBoxLabel}>관리자 비밀번호</Text>
      <TextInput
        value={password}
        onChangeText={onChangePassword}
        placeholder="비밀번호를 입력하세요"
        secureTextEntry
        keyboardType="number-pad"
        style={styles.deleteInput}
      />
      {error && <Text style={styles.deleteErrorText}>{error}</Text>}

      <View style={styles.deleteButtonRow}>
        <TouchableOpacity
          style={[styles.deleteActionButton, styles.deleteCancel]}
          onPress={onCancel}
          disabled={isDeleting}
        >
          <Text style={styles.deleteCancelText}>취소</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteActionButton, styles.deleteConfirm]}
          onPress={onConfirm}
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
  );
}

export default BlogDeleteBox;

const styles = StyleSheet.create({
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
});
