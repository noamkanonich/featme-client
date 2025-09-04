// src/utils/groq.ts
import axios from 'axios';
import { buildNutritionImagePrompt, buildNutritionTextPrompt } from './prompts';

export type NutritionResult = {
  name: string;
  description: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  serving_size: string;
  language?: string;
};

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ---------- IMAGE ----------
export async function analyzeImageWithGroq(
  imageDataUrl: string, // data:image/jpeg;base64,....
  apiKey: string,
  language = 'en',
): Promise<NutritionResult> {
  try {
    const payload = {
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      response_format: { type: 'json_object' },
      temperature: 0.2,
      messages: buildNutritionImagePrompt(language, imageDataUrl),
    };

    const res = await axios.post(GROQ_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`, // 👈 עכשיו באמת נשלח
      },
    });

    // axios מחזיר את גוף התגובה ב־res.data
    const content = res.data?.choices?.[0]?.message?.content ?? '{}';
    return JSON.parse(content) as NutritionResult;
  } catch (err: any) {
    // ננסה להציג שגיאה נקייה עם גוף התגובה אם קיים
    const status = err?.response?.status;
    const data = err?.response?.data;
    throw new Error(
      `Groq vision error${status ? ' ' + status : ''}: ${
        typeof data === 'string' ? data : JSON.stringify(data)
      }`,
    );
  }
}

// ---------- TEXT ----------
export async function analyzeTextWithGroq(
  text: string,
  apiKey: string,
  language = 'en',
): Promise<NutritionResult> {
  try {
    console.log(buildNutritionTextPrompt(language, text));
    const payload = {
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
      temperature: 0.2,
      messages: [...buildNutritionTextPrompt(language, text)],
    };

    const res = await axios.post(GROQ_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const content = res.data?.choices?.[0]?.message?.content ?? '{}';
    return JSON.parse(content) as NutritionResult;
  } catch (err: any) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    throw new Error(
      `Groq text error${status ? ' ' + status : ''}: ${
        typeof data === 'string' ? data : JSON.stringify(data)
      }`,
    );
  }
}
