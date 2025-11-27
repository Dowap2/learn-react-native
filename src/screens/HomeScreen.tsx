import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation.types';
import * as Linking from 'expo-linking';

import HomeHeroCard from '@/components/home/HomeHeroCard';
import HomeBlogSection from '@/components/home/HomeBlogSection';
import HomeQuickActions from '@/components/home/HomeQuickActions';
import { useRecentPosts } from '@/hooks/useRecentPosts';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  const [blogSearch, setBlogSearch] = useState('');

  const { posts, loading, error } = useRecentPosts(3);

  return (
    <View style={styles.content}>
      <HomeHeroCard
        onPressBlog={() => navigation.navigate('BlogList')}
        onPressContact={() => navigation.navigate('Contact')}
        onPressGithub={() => Linking.openURL('https://github.com/Dowap2')}
        onPressEmail={() => Linking.openURL('mailto:dowapdowari@gmail.com')}
      />

      <HomeBlogSection
        search={blogSearch}
        onChangeSearch={setBlogSearch}
        onPressSeeAll={() => navigation.navigate('BlogList')}
        posts={posts}
        loading={loading}
        error={error}
        onPressPost={(postId) => navigation.navigate('BlogDetail', { postId })}
      />

      <HomeQuickActions
        onPressBlog={() => navigation.navigate('BlogList')}
        onPressFAQ={() => navigation.navigate('FAQ')}
        onPressCamera={() => navigation.navigate('Camera')}
        onPressContact={() => navigation.navigate('Contact')}
      />
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { flex: 1, padding: 16 },
});
