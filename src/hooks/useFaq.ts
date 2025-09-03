import { useMemo, useState } from 'react';

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  category?: string;
};

const FAQ_DATA: FaqItem[] = [
  {
    id: 1,
    question:
      '피그마에서 여러 컴포넌트의 색상을 한 번에 바꿀 수 있는 플러그인은 뭐가 있나요?',
    answer:
      'Batch Styler를 추천합니다. 여러 색상 스타일을 한 번에 수정할 수 있어서 정말 편해요.',
    category: 'Figma',
  },
  {
    id: 2,
    question: '다른 예시 질문?',
    answer: '다른 답변 예시입니다.',
    category: '기타',
  },
  {
    id: 3,
    question: 'React Native란?',
    answer: '크로스 플랫폼 앱 개발 프레임워크입니다.',
    category: 'React Native',
  },
  {
    id: 4,
    question: 'Expo는 뭐예요?',
    answer: 'React Native 개발을 더 쉽게 해주는 툴체인입니다.',
    category: 'Expo',
  },
];

const KEYWORD_SUGGESTIONS = ['피그마', 'React Native', 'Expo', '플러그인'];

export function useFaq() {
  const [search, setSearch] = useState('');

  const filteredFaq = useMemo(() => {
    if (!search.trim()) return FAQ_DATA;
    const lower = search.toLowerCase();
    return FAQ_DATA.filter((item) =>
      item.question.toLowerCase().includes(lower),
    );
  }, [search]);

  return {
    search,
    setSearch,
    suggestions: KEYWORD_SUGGESTIONS,
    filteredFaq,
    totalCount: FAQ_DATA.length,
  };
}
