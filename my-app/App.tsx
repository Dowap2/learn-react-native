import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const onPressMenu = () => {
    console.log("햄버거 버튼 클릭!");
    // 여기서 Drawer 열기 또는 메뉴 화면 이동 가능
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("./assets/logo.png")} style={styles.logo} />
        <TouchableOpacity onPress={onPressMenu}>
          <Ionicons name="menu" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>자주 묻는 질문</Text>
        <Image source={require("./assets/character.png")} style={styles.icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    height: 18,
    width: 88,
  },
  header: {
    height: 80,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  headerTitle: {},
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    width: 44,
    height: 44,
    resizeMode: "contain",
  },
});
