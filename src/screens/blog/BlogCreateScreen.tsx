import React from 'react';
import { View, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation.types';
import { useBlogForm } from '@/hooks/useBlogForm';
import { useBlogTranslate } from '@/hooks/useBlogTranslate';
import { useBlogCreate } from '@/hooks/useBlogCreate';
import BlogForm from '@/components/blog/BlogForm';
import { LoadingView } from '@/components/common/LoadingView';
import type { PostFormData } from '@/types/blog.types';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogCreate'>;

const ACCENT_COLOR = '#1E3A8A';

function BlogCreateScreen({ route, navigation }: Props) {
  const editingPostId = route?.params?.editingPostId;

  const { formData, loading, initialLoading, updateField } =
    useBlogForm(editingPostId);

  const { translating, translate } = useBlogTranslate();
  const { submitting, submit } = useBlogCreate(editingPostId);

  const handleTranslate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    const res = await translate(formData.title, formData.content);
    if (res?.titleEn) updateField('titleEn', res.titleEn);
    if (res?.contentEn) updateField('contentEn', res.contentEn);
  };

  const handleSubmit = async () => {
    const result = await submit(formData as PostFormData);
    if (!result) return;

    if (result === 'updated' && editingPostId) {
      navigation.replace('BlogDetail', { postId: editingPostId });
    } else {
      navigation.goBack();
    }
  };

  if (initialLoading) {
    return (
      <LoadingView
        message={loading ? '글 정보를 불러오는 중...' : '로딩 중...'}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BlogForm
          form={formData}
          isEditMode={!!loading}
          submitting={submitting}
          translating={translating}
          onChangeField={updateField}
          onTranslate={handleTranslate}
          onCancel={() => navigation.goBack()}
          onSubmit={handleSubmit}
        />
      </ScrollView>
    </View>
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
});
