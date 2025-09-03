import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';

import { useFaq } from '@/hooks/useFaq';
import FaqSearchBar from '@/components/faq/FaqSearchBar';
import FaqListSection from '@/components/faq/FaqListSection';

type Props = NativeStackScreenProps<RootStackParamList, 'FAQ'>;

const FaqScreen = ({ navigation }: Props) => {
  const { search, setSearch, suggestions, filteredFaq } = useFaq();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'FAQ',
    });
  }, [navigation]);

  const handlePressSuggestion = (keyword: string) => {
    setSearch(keyword);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <FaqSearchBar
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch('')}
          suggestions={suggestions}
          onPressSuggestion={handlePressSuggestion}
        />

        <FaqListSection faqs={filteredFaq} search={search} />
      </ScrollView>
    </View>
  );
};

export default FaqScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
  },
});
