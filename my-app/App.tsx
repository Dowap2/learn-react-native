import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import CameraScreen from "./CameraScreen";
import ContactScreen from "./ContactScreen";

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Contact: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "홈" }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: "카메라" }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{ title: "문의하기" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
