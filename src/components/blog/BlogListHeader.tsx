import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const ACCENT_COLOR = '#1E3A8A';

type Props = {
  allTags: string[];
  selectedTag: string | null;
  onChangeTag: (tag: string | null) => void;
  onPressWrite: () => void;
};

function BlogListHeader({
  allTags,
  selectedTag,
  onChangeTag,
  onPressWrite,
}: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerLabel}>MY BLOG</Text>
      <Text style={styles.headerTitle}>블로그 게시글</Text>
      <Text style={styles.headerSubtitle}>
        새로 작성한 글을 한 곳에서 확인해보세요.
      </Text>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.writeButton} onPress={onPressWrite}>
          <Text style={styles.writeButtonText}>글 작성</Text>
        </TouchableOpacity>
      </View>

      {allTags.length > 0 && (
        <View style={styles.tagFilterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagFilterScrollContent}
          >
            <TouchableOpacity
              style={[styles.tagChip, !selectedTag && styles.tagChipSelected]}
              onPress={() => onChangeTag(null)}
            >
              <Text
                style={[
                  styles.tagChipText,
                  !selectedTag && styles.tagChipTextSelected,
                ]}
              >
                전체
              </Text>
            </TouchableOpacity>

            {allTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                  onPress={() => onChangeTag(isSelected ? null : tag)}
                >
                  <Text
                    style={[
                      styles.tagChipText,
                      isSelected && styles.tagChipTextSelected,
                    ]}
                  >
                    #{tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export default BlogListHeader;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 6,
    color: '#6B7280',
  },
  headerActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  writeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: ACCENT_COLOR,
  },
  writeButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tagFilterContainer: {
    marginTop: 14,
  },
  tagFilterScrollContent: {
    paddingRight: 4,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  tagChipSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: ACCENT_COLOR,
  },
  tagChipText: {
    fontSize: 12,
    color: '#6B7280',
  },
  tagChipTextSelected: {
    color: ACCENT_COLOR,
    fontWeight: '600',
  },
});
