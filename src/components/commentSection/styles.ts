import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#1E3A8A',
  danger: '#EF4444',
  dangerDark: '#DC2626',
  dangerLight: '#FCA5A5',
  dangerBg: '#FEF2F2',
  dangerText: '#B91C1C',
  dangerTextDark: '#7F1D1D',
  
  gray50: '#F9FAFB',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray700: '#374151',
  gray900: '#111827',
  
  white: '#FFFFFF',
};

export const commonStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: COLORS.gray50,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
  
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  bodyText: {
    fontSize: 14,
    color: COLORS.gray700,
  },
  smallText: {
    fontSize: 12,
    color: COLORS.gray400,
  },
  
  container: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});