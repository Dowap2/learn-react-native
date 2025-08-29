// supabase/functions/translate-post/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const GEMINI_API_KEY = Deno.env.get('AI_API_KEY');
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

console.log("Gemini API Key loaded?", !!GEMINI_API_KEY);
console.log("### USING GEMINI URL =", GEMINI_API_URL);

type TranslateRequestBody = {
  titleKo: string;
  contentKo: string;
};

type TranslateResponseBody = {
  titleEn: string;
  contentEn: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // 1. 메서드 체크
  if (req.method !== 'POST') {
    return jsonResponse(
      { error: 'Only POST method is allowed' },
      405,
    );
  }

  // 2. API 키 체크
  if (!GEMINI_API_KEY) {
    console.error('AI_API_KEY (Gemini) is not set in environment variables');
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

    // 4. Google Gemini로 번역 요청
    const prompt = [
      'You are a translation assistant for a developer blog.',
      'Translate the given Korean technical blog title and content into natural, clear English.',
      'Preserve Markdown structure, headings, and code blocks.',
      'Respond ONLY in valid JSON with this shape:',
      '{ "titleEn": "...", "contentEn": "..." }',
      'Do NOT wrap your response in markdown code blocks.',
    ].join(' ');

    const userPayload = JSON.stringify({
      titleKo,
      contentKo,
    });

    const geminiRes = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                { text: userPayload }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2
          }
        }),
      },
    );

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error('Gemini API error:', errorText);

      return jsonResponse(
        { error: 'AI translation failed', detail: errorText },
        500,
      );
    }

    const geminiJson = await geminiRes.json();

    // Gemini 응답 구조:
    // { candidates: [ { content: { parts: [ { text: '...JSON string...' } ] } } ] }
    const contentText: string =
      geminiJson.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    console.log('Raw response from Gemini:', contentText);

    // 5. 모델 응답(JSON 문자열) 파싱
    let titleEn = '';
    let contentEn = '';

    try {
      // ✅ 마크다운 코드 블록 제거
      let cleanText = contentText.trim();
      
      // ```json과 ``` 제거
      cleanText = cleanText.replace(/^```json\s*/i, '');
      cleanText = cleanText.replace(/^```\s*/, '');
      cleanText = cleanText.replace(/\s*```$/, '');
      cleanText = cleanText.trim();
      
      console.log('Cleaned text for parsing:', cleanText);
      
      const parsed = JSON.parse(cleanText) as Partial<TranslateResponseBody>;
      titleEn = parsed.titleEn ?? '';
      contentEn = parsed.contentEn ?? '';
    } catch (e) {
      console.error('Failed to parse JSON from Gemini:', e, contentText);
      // 혹시 JSON으로 안 주면, 통째로 contentEn으로라도 돌려주기
      titleEn = '';
      contentEn = contentText;
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