import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import List from "./List";
import Camera from "./Camera";

type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
    {
      question: "다른 예시 질문?",
      answer: "다른 답변 예시입니다.",
    },
    {
      question: "다른 예시 질문?",
      answer: "다른 답변 예시입니다.",
    },
    {
      question: "다른 예시 질문?",
      answer: "다른 답변 예시입니다.",
    },
  ];

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
        {faqData.map((item, index) => (
          <List key={index} question={item.question} answer={item.answer} />
        ))}
        <Button title="카메라" onPress={() => navigation.navigate("Camera")} />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={Camera} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
  },
  logo: {
    height: 18,
    width: 88,
  },
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 56,
    marginBottom: 20,
  },
  icon: {
    width: 44,
    height: 44,
  },
});
