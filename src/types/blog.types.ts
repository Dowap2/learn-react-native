export type Post = {
  id: number;
  title_ko: string | null;
  content_ko: string | null;
  title_en: string | null;
  content_en: string | null;
  summary_ko: string | null;
  summary_en: string | null;
  created_at: string;
  tags: string | null;
};

export type PostFormData = {
  title: string;
  summary: string;
  content: string;
  tags: string;
  titleEn: string;
  contentEn: string;
};

export type Language = 'ko' | 'en';

export type TranslateResponse = {
  titleEn?: string;
  contentEn?: string;
  error?: string;
};