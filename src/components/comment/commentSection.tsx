import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '@/libs/supabaseClient';

type Comment = {
  id: number;
  post_id: number;
  author: string;
  body: string;
  pin: string;
  created_at: string;
};

type Props = {
  postId: number;
};

const ACCENT_COLOR = '#1E3A8A';

export function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [pin, setPin] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const loadComments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      Alert.alert('댓글을 불러오는 중 오류가 발생했습니다.');
    } else if (data) {
      setComments(data as Comment[]);
    }
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

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

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      author: author.trim(),
      body: body.trim(),
      pin,
    });

    if (error) {
      console.error(error);
      Alert.alert('댓글 작성 중 오류가 발생했습니다.');
    } else {
      setAuthor('');
      setBody('');
      setPin('');
      loadComments();
    }

    setSubmitting(false);
  };

  const handleDelete = (comment: Comment) => {
    let inputPin = '';
    Alert.prompt?.(
      '댓글 삭제',
      '이 댓글의 비밀번호 4자리를 입력해주세요.',
      async (text) => {
        inputPin = text ?? '';

        if (!/^\d{4}$/.test(inputPin)) {
          Alert.alert('비밀번호는 숫자 4자리입니다.');
          return;
        }

        if (inputPin !== comment.pin) {
          Alert.alert('비밀번호가 일치하지 않습니다.');
          return;
        }

        const { error } = await supabase
          .from('comments')
          .delete()
          .eq('id', comment.id);

        if (error) {
          console.error(error);
          Alert.alert('댓글 삭제 중 오류가 발생했습니다.');
        } else {
          loadComments();
        }
      },
      'secure-text',
    );
  };

  const renderItem = ({ item }: { item: Comment }) => {
    return (
      <View style={styles.commentItem}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{item.author}</Text>
          <TouchableOpacity onPress={() => handleDelete(item)}>
            <Text style={styles.deleteText}>삭제</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.commentBody}>{item.body}</Text>
        <Text style={styles.commentDate}>
          {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>댓글</Text>

      {/* 입력 영역 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="작성자"
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="댓글 내용을 입력해주세요."
          value={body}
          onChangeText={setBody}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호 (숫자 4자리)"
          value={pin}
          onChangeText={(text) => {
            // 숫자만 & 최대 4자리
            const onlyDigits = text.replace(/[^0-9]/g, '');
            if (onlyDigits.length <= 4) setPin(onlyDigits);
          }}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
        />

        <TouchableOpacity
          style={[styles.submitButton, submitting && { opacity: 0.7 }]}
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

      {/* 리스트 영역 */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : comments.length === 0 ? (
        <Text style={styles.emptyText}>첫 댓글을 남겨보세요!</Text>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          style={styles.list}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  inputContainer: {
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
  list: {
    marginTop: 8,
  },
  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentAuthor: {
    fontWeight: '600',
    color: '#111827',
  },
  deleteText: {
    fontSize: 12,
    color: '#EF4444',
  },
  commentBody: {
    marginTop: 4,
    fontSize: 14,
    color: '#374151',
  },
  commentDate: {
    marginTop: 4,
    fontSize: 11,
    color: '#9CA3AF',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#9CA3AF',
  },
});
