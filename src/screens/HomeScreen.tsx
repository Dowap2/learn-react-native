import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import List from '@/components/List';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(300)).current;

  const openMenu = useCallback(() => {
    setMenuVisible(true);

    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  // 🔹 여기서 네이티브 헤더에 햄버거 버튼 세팅
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '홈',
      headerLeft: () => (
        <TouchableOpacity onPress={openMenu} style={{ paddingHorizontal: 12 }}>
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, openMenu]);

  const faqData = [
    {
      question:
        '피그마에서 여러 컴포넌트의 색상을 한 번에 바꿀 수 있는 플러그인은 뭐가 있나요?',
      answer:
        'Batch Styler를 추천합니다. 여러 색상 스타일을 한 번에 수정할 수 있어서 정말 편해요.',
    },
    { question: '다른 예시 질문?', answer: '다른 답변 예시입니다.' },
    {
      question: 'React Native란?',
      answer: '크로스 플랫폼 앱 개발 프레임워크입니다.',
    },
    { question: 'Expo는 뭐예요?', answer: 'RN 개발을 쉽게 해주는 도구입니다.' },
  ];

  const keywordSuggestions = ['피그마', 'React Native', 'Expo', '플러그인'];

  const filteredFAQ = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      {/* 🔹 이제 커스텀 header 뷰는 필요 없으니 제거 */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={openMenu}>
          <Ionicons name="menu" size={32} color="#000" />
        </TouchableOpacity>
      </View> */}

      <View style={styles.content}>
        <View style={styles.contentTitle}>
          <Text style={styles.title}>자주 묻는 질문</Text>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="질문 검색..."
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearch('')}
            >
              <Text style={styles.clearButtonText}>초기화</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.suggestionContainer}>
          {keywordSuggestions.map((keyword) => (
            <TouchableOpacity
              key={keyword}
              style={styles.suggestionChip}
              onPress={() => setSearch(keyword)}
            >
              <Text style={styles.suggestionText}>{keyword}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredFAQ.map((item, index) => (
          <List key={index} question={item.question} answer={item.answer} />
        ))}
      </View>

      {/* 사이드 메뉴 모달은 그대로 사용 */}
      <Modal visible={menuVisible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={closeMenu}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              styles.sideMenu,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <Text style={styles.menuTitle}>메뉴</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                navigation.navigate('Camera');
              }}
            >
              <Text style={styles.menuText}>카메라</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>설정</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                navigation.navigate('BlogList');
              }}
            >
              <Text style={styles.menuText}>블로그</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                navigation.navigate('Contact');
              }}
            >
              <Text style={styles.menuText}>문의하기</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000' },
  content: { flex: 1, padding: 16 },
  contentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
  },
  clearButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#555',
  },
  suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8 as any,
    marginBottom: 16,
  },
  suggestionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: '#555',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  sideMenu: {
    width: 250,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 80,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: -4, height: 0 },
    elevation: 5,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  menuItem: {
    paddingVertical: 14,
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
});
