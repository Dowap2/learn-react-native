import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

import HomeScreen from '@/screens/HomeScreen';
import CameraScreen from '@/screens/CameraScreen';
import ContactScreen from '@/screens/ContactScreen';
import BlogListScreen from '@/screens/blog/BlogListScreen';
import BlogDetailScreen from '@/screens/blog/BlogDetailScreen';
import BlogCreateScreen from '@/screens/blog/BlogCreateScreen';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Contact: undefined;
  BlogList: undefined;
  BlogDetail: {
    postId: number;
  };
  BlogCreate: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '홈' }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: '카메라' }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{ title: '문의하기' }}
        />
        <Stack.Screen
          name="BlogList"
          component={BlogListScreen}
          options={{ title: '블로그' }}
        />
        <Stack.Screen
          name="BlogDetail"
          component={BlogDetailScreen}
          options={{ title: '블로그 글' }}
        />
        <Stack.Screen
          name="BlogCreate"
          component={BlogCreateScreen}
          options={{ title: '새 글 작성' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
