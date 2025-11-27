import { useState } from 'react';
import { CONFIG } from '@/constants/config';
import type { TranslateResponse } from '@/types/blog.types';

export const useBlogTranslate = () => {
  const [translating, setTranslating] = useState(false);

  const translate = async (
    title: string,
    content: string
  ): Promise<TranslateResponse> => {
    if (!CONFIG.SUPABASE_ANON_KEY) {
      return { error: 'EXPO_PUBLIC_SUPABASE_ANON_KEY가 설정되어 있지 않습니다.' };
    }

    try {
      setTranslating(true);
      const res = await fetch(CONFIG.TRANSLATE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          titleKo: title.trim(),
          contentKo: content,
        }),
      });

      if (!res.ok) {
        return { error: '번역에 실패했습니다.' };
      }

      const data = await res.json();

      if (data.error) {
        return { error: data.error };
      }

      let finalTitleEn = data.titleEn || '';
      let finalContentEn = data.contentEn || '';

      // JSON 파싱 시도
      if (!finalTitleEn && finalContentEn.includes('```json')) {
        try {
          let cleanText = finalContentEn.trim();
          cleanText = cleanText.replace(/^```json\s*/i, '');
          cleanText = cleanText.replace(/^```\s*/, '');
          cleanText = cleanText.replace(/\s*```$/, '');
          cleanText = cleanText.trim();

          const parsed = JSON.parse(cleanText);
          finalTitleEn = parsed.titleEn || '';
          finalContentEn = parsed.contentEn || '';
        } catch (e) {
          console.log('클라이언트 JSON 파싱 실패:', e);
        }
      }

      return { titleEn: finalTitleEn, contentEn: finalContentEn };
    } catch (e) {
      console.error('번역 에러:', e);
      return { error: '번역 요청 중 문제가 발생했습니다.' };
    } finally {
      setTranslating(false);
    }
  };

  return { translating, translate };
};
