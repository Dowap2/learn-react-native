import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/theme';

type Props = {
  error: string;
  onRetry?: () => void;
};

export const ErrorView: React.FC<Props> = ({ error, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{error}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>다시 시도</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.massive,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.error.primary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: theme.spacing.huge,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.accent,
  },
  retryText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.base,
    fontWeight: '600',
  },
});
