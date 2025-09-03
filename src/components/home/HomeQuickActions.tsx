import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const ACCENT_COLOR = '#1E3A8A';

type Props = {
  onPressBlog: () => void;
  onPressFAQ: () => void;
  onPressCamera: () => void;
  onPressContact: () => void;
};

function HomeQuickActions({
  onPressBlog,
  onPressFAQ,
  onPressCamera,
  onPressContact,
}: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>바로가기</Text>

      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickCard} onPress={onPressBlog}>
          <Ionicons name="book-outline" size={22} color={ACCENT_COLOR} />
          <Text style={styles.quickTitle}>블로그</Text>
          <Text style={styles.quickText}>기술 회고와 개발 기록</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard} onPress={onPressFAQ}>
          <Ionicons name="help-circle-outline" size={22} color={ACCENT_COLOR} />
          <Text style={styles.quickTitle}>FAQ</Text>
          <Text style={styles.quickText}>자주 묻는 질문 모음</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickCard} onPress={onPressCamera}>
          <Ionicons name="camera-outline" size={22} color={ACCENT_COLOR} />
          <Text style={styles.quickTitle}>카메라 데모</Text>
          <Text style={styles.quickText}>Expo 카메라 기능 테스트</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard} onPress={onPressContact}>
          <Ionicons name="chatbubbles-outline" size={22} color={ACCENT_COLOR} />
          <Text style={styles.quickTitle}>문의하기</Text>
          <Text style={styles.quickText}>간단한 연락/피드백 폼</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeQuickActions;

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  quickRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  quickText: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
  },
});
