import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import List from '@/components/List';
import type { FaqItem } from '@/hooks/useFaq';

type Props = {
  faqs: FaqItem[];
  search: string;
};

const FaqListSection = ({ faqs, search }: Props) => {
  const hasSearch = search.trim().length > 0;

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>자주 묻는 질문</Text>
        {hasSearch && (
          <Text style={styles.resultText}>
            검색어 "<Text style={styles.highlight}>{search}</Text>"에 대한 결과
            {faqs.length}건
          </Text>
        )}
      </View>

      {faqs.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>검색 결과가 없습니다.</Text>
          <Text style={styles.emptyDesc}>
            다른 키워드로 검색해보거나, 문의하기 페이지를 통해 질문을
            남겨주세요.
          </Text>
        </View>
      ) : (
        faqs.map((item) => (
          <List
            key={item.id}
            question={item.question}
            answer={item.answer}
            // 기존 List 컴포넌트 props만 맞추면 됨
          />
        ))
      )}
    </View>
  );
};

export default FaqListSection;

const styles = StyleSheet.create({
  section: {
    flex: 1,
  },
  headerRow: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 12,
    color: '#6B7280',
  },
  highlight: {
    fontWeight: '600',
    color: '#111827',
  },
  emptyBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
});
