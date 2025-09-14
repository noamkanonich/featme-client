// src/screens/recipes/utils/gemini-food.ts

import {
  // 👉 adjust names if your prompt file exports different identifiers
  foodSystemPromptEn,
  foodSystemPromptHe,
  buildFoodMessagesEn,
  buildFoodMessagesHe,
  buildFoodImageMessagesEn,
  buildFoodImageMessagesHe,
} from './prompts';

/** What the model should return (strict JSON) */
export type FoodItemAnalysis = {
  name: string;
  quantity: number;
  unit: string; // "g" | "ml" | "slice" | "piece" | ...
  calories?: number; // kcal
  protein?: number; // g
  fat?: number; // g
  carbs?: number; // g
  confidence?: number; // 0..1
  notes?: string;
};

export type FoodAnalysis = {
  items: FoodItemAnalysis[];
  totals: { calories?: number; protein?: number; fat?: number; carbs?: number };
  assumptions?: string[];
  warnings?: string[];
  locale?: string;
};

/** ---------- TEXT ANALYSIS ---------- */
export async function analyzeFoodTextWithGemini(
  text: string,
  language: string,
): Promise<FoodAnalysis> {
  // בוחרים פרומפט לפי שפה
  const systemPrompt =
    language === 'he' ? foodSystemPromptHe : foodSystemPromptEn;

  // בונים הודעות (בדומה למתכון) — מקבלים את טקסט המשתמש
  const messages =
    language === 'he'
      ? buildFoodMessagesHe({ text })
      : buildFoodMessagesEn({ text });

  const userText =
    (messages as any[]).find((m: any) => m?.role === 'user')?.content ?? text;

  // קריאה לג׳מיני שמחזירה JSON נקי לפי הסכימה בפרומפט
  const foodObj = await callGeminiJSON({
    apiKey: process.env.FEATME_GEMINI_API_KEY!,
    systemPrompt,
    userText: String(userText),
    temperature: 0.2, // יציב/דטרמיניסטי יחסית
    maxOutputTokens: 900,
  });

  return foodObj as FoodAnalysis;
}

/** ---------- IMAGE ANALYSIS ----------
 * תמונה יכולה להגיע כ-base64 (למשל מ-Expo FileSystem) או כ-URL (ציבורי/חתום)
 */
type AnalyzeImageParams =
  | {
      language: string;
      imageBase64: string;
      mimeType?: string;
      hintText?: string;
    }
  | { language: string; imageUrl: string; hintText?: string };

export async function analyzeFoodImageWithGemini(
  params: AnalyzeImageParams,
): Promise<FoodAnalysis> {
  const language = params.language ?? 'en';

  // פרומפט לפי שפה
  const systemPrompt =
    language === 'he' ? foodSystemPromptHe : foodSystemPromptEn;

  // הודעת משתמש (רצוי לתת hintText אם יש)
  const messages =
    language === 'he'
      ? buildFoodImageMessagesHe({ hintText: (params as any).hintText || '' })
      : buildFoodImageMessagesEn({ hintText: (params as any).hintText || '' });

  const userText =
    (messages as any[]).find((m: any) => m?.role === 'user')?.content ??
    (params as any).hintText ??
    'Analyze this food photo.';

  // קריאת חזון (Vision) בהתאם לסוג התמונה
  const foodObj = await callGeminiVisionJSON({
    apiKey: process.env.FEATME_GEMINI_API_KEY!,
    systemPrompt,
    userText: String(userText),
    image:
      'imageBase64' in params
        ? {
            kind: 'base64',
            data: params.imageBase64,
            mimeType: params.mimeType || 'image/jpeg',
          }
        : {
            kind: 'url',
            url: (params as any).imageUrl,
          },
    temperature: 0.25,
    maxOutputTokens: 900,
  });

  return foodObj as FoodAnalysis;
}
