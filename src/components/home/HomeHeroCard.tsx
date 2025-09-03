import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ACCENT_COLOR = '#1E3A8A';

type Props = {
  onPressBlog: () => void;
  onPressContact: () => void;
};

function HomeHeroCard({ onPressBlog, onPressContact }: Props) {
  return (
    <View style={styles.heroCard}>
      <Text style={styles.heroLabel}>ABOUT</Text>
      <Text style={styles.heroTitle}>프론트엔드 개발자 오경태</Text>
      <Text style={styles.heroSubtitle}>
        React Native로 블로그, FAQ, 카메라 등 다양한 기능을 하나의 앱으로 구현한
        개인 프로젝트입니다.
      </Text>

      <View style={styles.heroButtonRow}>
        <TouchableOpacity
          style={styles.heroPrimaryButton}
          onPress={onPressBlog}
        >
          <Text style={styles.heroPrimaryText}>블로그 보러가기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.heroSecondaryButton}
          onPress={onPressContact}
        >
          <Text style={styles.heroSecondaryText}>문의하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeHeroCard;

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  heroLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 14,
  },
  heroButtonRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  heroPrimaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: ACCENT_COLOR,
    marginRight: 8,
  },
  heroPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroSecondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  heroSecondaryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
});
