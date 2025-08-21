// supabase/functions/translate-post/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('AI_API_KEY');
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

type TranslateRequestBody = {
  titleKo: string;
  contentKo: string;
};

type TranslateResponseBody = {
  titleEn: string;
  contentEn: string;
};

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

serve(async (req: Request): Promise<Response> => {
  // 1. 메서드 체크
  if (req.method !== 'POST') {
    return jsonResponse(
      { error: 'Only POST method is allowed' },
      405,
    );
  }

  // 2. API 키 체크
  if (!OPENAI_API_KEY) {
    console.error('AI_API_KEY is not set in environment variables');
    return jsonResponse(
      { error: 'AI_API_KEY is not configured on the server' },
      500,
    );
  }

  try {
    // 3. 요청 바디 파싱
    const body = (await req.json()) as Partial<TranslateRequestBody>;
    const { titleKo, contentKo } = body;

    if (!titleKo || !contentKo) {
      return jsonResponse(
        { error: 'titleKo and contentKo are required' },
        400,
      );
    }

    // 4. OpenAI로 번역 요청
    //   - gpt-4o-mini 사용
    //   - 응답은 JSON 문자열 형태로만 돌려주도록 강하게 요청
    const openaiRes = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: [
              'You are a translation assistant for a developer blog.',
              'Translate Korean technical blog posts into natural, clear English.',
              'Preserve Markdown structure, headings, and code blocks.',
              'Respond ONLY in valid JSON with this shape:',
              '{ "titleEn": "...", "contentEn": "..." }',
            ].join(' '),
          },
          {
            role: 'user',
            content: JSON.stringify({
              titleKo,
              contentKo,
            }),
          },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      console.error('OpenAI API error:', errorText);

      return jsonResponse(
        { error: 'AI translation failed', detail: errorText },
        500,
      );
    }

    const openaiJson = await openaiRes.json();
    const content: string =
      openaiJson.choices?.[0]?.message?.content ?? '';

    // 5. 모델 응답(JSON 문자열) 파싱
    let titleEn = '';
    let contentEn = '';

    try {
      const parsed = JSON.parse(content) as Partial<TranslateResponseBody>;
      titleEn = parsed.titleEn ?? '';
      contentEn = parsed.contentEn ?? '';
    } catch (e) {
      console.error('Failed to parse JSON from model:', e, content);
      // 혹시 JSON으로 안 주면, 통째로 contentEn으로라도 돌려주기
      titleEn = '';
      contentEn = content;
    }

    if (!contentEn) {
      return jsonResponse(
        { error: 'Empty translation from AI' },
        500,
      );
    }

    // 6. 최종 응답
    const responseBody: TranslateResponseBody = {
      titleEn,
      contentEn,
    };

    return jsonResponse(responseBody, 200);
  } catch (err) {
    console.error('Server error:', err);
    return jsonResponse(
      { error: 'Server error', detail: String(err) },
      500,
    );
  }
});
