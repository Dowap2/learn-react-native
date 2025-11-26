import React, { useLayoutEffect, useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

import HomeHeroCard from '@/components/home/HomeHeroCard';
import HomeBlogSection from '@/components/home/HomeBlogSection';
import HomeQuickActions from '@/components/home/HomeQuickActions';
import SideMenu from '@/components/home/SideMenu';
import { useRecentPosts } from '@/hooks/useRecentPosts';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [blogSearch, setBlogSearch] = useState('');

  const { posts, loading, error } = useRecentPosts(3);

  const openMenu = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HomeHeroCard
          onPressBlog={() => navigation.navigate('BlogList')}
          onPressContact={() => navigation.navigate('Contact')}
        />

        <HomeBlogSection
          search={blogSearch}
          onChangeSearch={setBlogSearch}
          onPressSeeAll={() => navigation.navigate('BlogList')}
          posts={posts}
          loading={loading}
          error={error}
          onPressPost={(postId) =>
            navigation.navigate('BlogDetail', { postId })
          }
        />

        <HomeQuickActions
          onPressBlog={() => navigation.navigate('BlogList')}
          onPressFAQ={() => navigation.navigate('FAQ')}
          onPressCamera={() => navigation.navigate('Camera')}
          onPressContact={() => navigation.navigate('Contact')}
        />
      </View>

      <SideMenu
        visible={menuVisible}
        onClose={closeMenu}
        onNavigate={(screen) => {
          closeMenu();
          navigation.navigate(screen);
        }}
      />
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { flex: 1, padding: 16 },
});
