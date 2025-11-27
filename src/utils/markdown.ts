import { StyleSheet } from 'react-native';
import { theme } from '@/theme';

export const createMarkdownStyles = (accentColor: string) => {
  return StyleSheet.create({
    body: {
      fontSize: theme.fontSize.lg,
      lineHeight: 24,
      color: theme.colors.text.secondary,
    },
    heading1: {
      fontSize: theme.fontSize.huge,
      fontWeight: '700',
      marginTop: theme.spacing.massive,
      marginBottom: theme.spacing.lg,
      color: theme.colors.text.primary,
    },
    heading2: {
      fontSize: theme.fontSize.xxxl,
      fontWeight: '700',
      marginTop: theme.spacing.huge,
      marginBottom: theme.spacing.md,
      color: theme.colors.text.primary,
    },
    heading3: {
      fontSize: theme.fontSize.xl,
      fontWeight: '600',
      marginTop: theme.spacing.xxl,
      marginBottom: theme.spacing.sm,
      color: theme.colors.text.secondary,
    },
    paragraph: {
      marginBottom: theme.spacing.lg,
    },
    bullet_list: {
      marginBottom: theme.spacing.md,
      paddingLeft: theme.spacing.md,
    },
    ordered_list: {
      marginBottom: theme.spacing.md,
      paddingLeft: theme.spacing.md,
    },
    code_inline: {
      backgroundColor: theme.colors.code.background,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      fontFamily: 'monospace',
      borderWidth: 1,
      borderColor: theme.colors.code.border,
    },
    code_block: {
      backgroundColor: theme.colors.code.background,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      fontFamily: 'monospace',
      marginBottom: theme.spacing.xl,
      borderLeftWidth: 3,
      borderLeftColor: accentColor,
    },
    strong: {
      fontWeight: '700',
      color: theme.colors.text.secondary,
    },
    em: {
      fontStyle: 'italic',
    },
    link: {
      color: accentColor,
      textDecorationLine: 'underline',
    },
  });
};