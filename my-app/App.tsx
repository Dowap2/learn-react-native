import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import List from "./List";

function HomeScreen({ navigation }: any) {
  const onPressMenu = () => {
    console.log("햄버거 버튼 클릭!");
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

  const [search, setSearch] = useState("");

  const filteredFAQ = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("./assets/logo.png")} style={styles.logo} />
        <TouchableOpacity onPress={onPressMenu}>
          <Ionicons name="menu" size={32} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.contentTitle}>
          <Text style={styles.title}>자주 묻는 질문</Text>
          <Image
            source={require("./assets/character.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        {/* 🔍 검색창 추가 */}
        <TextInput
          style={styles.searchInput}
          placeholder="질문 검색..."
          value={search}
          onChangeText={setSearch}
        />

        {/* 필터링된 FAQ 출력 */}
        {filteredFAQ.map((item, index) => (
          <List key={index} question={item.question} answer={item.answer} />
        ))}

        <Button title="카메라" onPress={() => navigation.navigate("Camera")} />
      </View>
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

  // 🔍 검색창 스타일
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#F9F9F9",
  },
});
