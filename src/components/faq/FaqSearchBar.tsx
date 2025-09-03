import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  suggestions: string[];
  onPressSuggestion: (keyword: string) => void;
};

const FaqSearchBar = ({
  value,
  onChangeText,
  onClear,
  suggestions,
  onPressSuggestion,
}: Props) => {
  return (
    <View>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="궁금한 내용을 검색해보세요"
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#9CA3AF"
        />
        {value.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Text style={styles.clearButtonText}>초기화</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.suggestionContainer}>
        {suggestions.map((keyword) => (
          <TouchableOpacity
            key={keyword}
            style={styles.suggestionChip}
            onPress={() => onPressSuggestion(keyword)}
          >
            <Text style={styles.suggestionText}>{keyword}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FaqSearchBar;

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    fontSize: 13,
    color: '#111827',
  },
  clearButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#555',
  },
  suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8 as any,
    marginBottom: 16,
  },
  suggestionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4FF',
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: '#1E3A8A',
  },
});
