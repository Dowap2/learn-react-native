import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra;

export const CONFIG = {
  TRANSLATE_ENDPOINT: 'https://uernuwypmjghqmyhqhnq.functions.supabase.co/translate-post',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  ADMIN_PASSWORD: extra?.adminPassword,
};