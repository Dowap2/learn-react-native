import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import HomeScreen from '@/screens/HomeScreen';
import CameraScreen from '@/screens/CameraScreen';
import ContactScreen from '@/screens/ContactScreen';
import BlogListScreen from '@/screens/blog/BlogListScreen';
import BlogDetailScreen from '@/screens/blog/BlogDetailScreen';
import BlogCreateScreen from '@/screens/blog/BlogCreateScreen';
import FaqScreen from '@/screens/FaqScreen';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Contact: undefined;
  BlogList: undefined;
  BlogDetail: {
    postId: number;
  };
  BlogCreate: { editingPostId?: number } | undefined;
  FAQ: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ACCENT_COLOR = '#1E3A8A';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: ACCENT_COLOR,
        borderRadius: 16,
        backgroundColor: '#EFF6FF',
      }}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
      }}
      text2Style={{
        fontSize: 12,
        color: '#4B5563',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#DC2626',
        borderRadius: 16,
        backgroundColor: '#FEF2F2',
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '700',
        color: '#991B1B',
      }}
      text2Style={{
        fontSize: 12,
        color: '#B91C1C',
      }}
    />
  ),
};

export default function App() {
  return (
    <>
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
          <Stack.Screen name="FAQ" component={FaqScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}
