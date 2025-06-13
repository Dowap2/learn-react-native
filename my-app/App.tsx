import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
} from "react-native";
import { useState, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import List from "./List";

function HomeScreen({ navigation }: any) {
  const [search, setSearch] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  // 오른쪽에서 슬라이드 인/아웃
  const slideAnim = useRef(new Animated.Value(300)).current; // 시작: 오른쪽 바깥

  const openMenu = () => {
    setMenuVisible(true);

    Animated.spring(slideAnim, {
      toValue: 0, // 화면 안으로
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 300, // 다시 오른쪽 바깥으로
      duration: 200,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const faqData = [
    {
      question:
        "피그마에서 여러 컴포넌트의 색상을 한 번에 바꿀 수 있는 플러그인은 뭐가 있나요?",
      answer:
        "Batch Styler를 추천합니다. 여러 색상 스타일을 한 번에 수정할 수 있어서 정말 편해요.",
    },
    { question: "다른 예시 질문?", answer: "다른 답변 예시입니다." },
    {
      question: "React Native란?",
      answer: "크로스 플랫폼 앱 개발 프레임워크입니다.",
    },
    { question: "Expo는 뭐예요?", answer: "RN 개발을 쉽게 해주는 도구입니다." },
  ];

  const filteredFAQ = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Image source={require("./assets/logo.png")} style={styles.logo} />
        <TouchableOpacity onPress={openMenu}>
          <Ionicons name="menu" size={32} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 내용 */}
      <View style={styles.content}>
        <View style={styles.contentTitle}>
          <Text style={styles.title}>자주 묻는 질문</Text>
          <Image
            source={require("./assets/character.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="질문 검색..."
          value={search}
          onChangeText={setSearch}
        />

        {filteredFAQ.map((item, index) => (
          <List key={index} question={item.question} answer={item.answer} />
        ))}
      </View>

      {/* 오른쪽 사이드 메뉴 모달 */}
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
                navigation.navigate("Camera");
              }}
            >
              <Text style={styles.menuText}>카메라</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>설정</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>고객센터</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", marginTop: 20 },
  logo: { height: 18, width: 88 },
  header: {
    height: 80,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#F7F7F7",
    padding: 16,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#000" },
  content: { flex: 1, padding: 16 },
  contentTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 56,
    marginBottom: 20,
  },
  icon: { width: 44, height: 44 },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#F9F9F9",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end", // 오른쪽 정렬
  },

  sideMenu: {
    width: 250,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: -4, height: 0 }, // 오른쪽에서 튀어나오는 느낌
    elevation: 5,
  },

  menuTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 32,
  },

  menuItem: {
    paddingVertical: 14,
  },

  menuText: {
    fontSize: 18,
    color: "#333",
  },
});
