// src/screens/recipes/utils/gemini.ts
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export type RecipeCriteria = {
  ingredients: string;
  diet?: string;
  mealType?: string;
  servings?: number;
  cuisine_hint?: string;
  creativity_hint?: string;
};

type GeminiPart = { text: string };
type GeminiContent = { role?: string; parts: GeminiPart[] };
type GeminiResponse = {
  candidates?: { content?: GeminiContent }[];
};

export async function callGeminiJSON({
  systemPrompt,
  userText,
  temperature = 0.55,
  maxOutputTokens = 1200,
}: {
  apiKey: string;
  systemPrompt: string;
  userText: string;
  temperature?: number;
  maxOutputTokens?: number;
}) {
  const res = await fetch(
    `${GEMINI_URL}?key=${process.env.FEATME_GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 💡 שים לב: response_mime_type=application/json גורם לג׳מיני להחזיר JSON נקי
      body: JSON.stringify({
        // system instruction
        systemInstruction: { parts: [{ text: systemPrompt }] },

        // השאילתה של המשתמש
        contents: [{ role: 'user', parts: [{ text: userText }] }],

        // הגדרות הפקה
        generationConfig: {
          temperature,
          maxOutputTokens,
          response_mime_type: 'application/json',
        },
      }),
    },
  );

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(
      `Gemini request failed: ${res.status} ${res.statusText}\n${msg}`,
    );
  }

  const data = (await res.json()) as GeminiResponse;

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    (() => {
      throw new Error('No content from Gemini');
    })();

  // כאן זה כבר JSON נקי – אין צורך לקלף ```json
  return JSON.parse(text);
}
