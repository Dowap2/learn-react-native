import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Language } from '@/types/blog.types';

const ACCENT_COLOR = '#1E3A8A';

type Props = {
  title: string | null;
  dateStr: string;
  tags: string[];
  lang: Language;
  onChangeLang: (lang: Language) => void;
  onPressEdit: () => void;
  onPressDelete: () => void;
};

function BlogPostHeader({
  title,
  dateStr,
  tags,
  lang,
  onChangeLang,
  onPressEdit,
  onPressDelete,
}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerLabel}>POST DETAIL</Text>
          <Text style={styles.title}>{title ?? '제목 없음'}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editButton} onPress={onPressEdit}>
            <Text style={styles.editButtonText}>수정</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={onPressDelete}>
            <Text style={styles.deleteButtonText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.dateRow}>
          <View style={styles.dateDot} />
          <Text style={styles.date}>{dateStr}</Text>
        </View>
      </View>

      {tags.length > 0 && (
        <View style={styles.tagRow}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagChipText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.langToggleRow}>
        <TouchableOpacity
          style={[styles.langButton, lang === 'ko' && styles.langButtonActive]}
          onPress={() => onChangeLang('ko')}
        >
          <Text
            style={[
              styles.langButtonText,
              lang === 'ko' && styles.langButtonTextActive,
            ]}
          >
            한국어
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langButton, lang === 'en' && styles.langButtonActive]}
          onPress={() => onChangeLang('en')}
        >
          <Text
            style={[
              styles.langButtonText,
              lang === 'en' && styles.langButtonTextActive,
            ]}
          >
            English
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default BlogPostHeader;

const styles = StyleSheet.create({
  header: {
    marginBottom: 18,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 6,
    backgroundColor: ACCENT_COLOR,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6,
    marginBottom: 4,
  },
  tagChipText: {
    fontSize: 11,
    color: ACCENT_COLOR,
  },
  langToggleRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 4,
    gap: 8 as any,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  langButtonActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  langButtonText: {
    fontSize: 12,
    color: '#555',
  },
  langButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    backgroundColor: '#EFF6FF',
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 12,
    color: ACCENT_COLOR,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#F97373',
    backgroundColor: '#FEF2F2',
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
});
