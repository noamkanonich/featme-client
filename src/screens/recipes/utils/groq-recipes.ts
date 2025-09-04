import axios from 'axios';
import { FEATME_GROQ_API_KEY } from '@env';
import { buildRecipeImagePrompt } from './image-generator';
import { buildRecipeTextPrompt, RecipeCriteria } from './recipes-prompt';

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

type ImageSelectorResult = {
  image_url: string | null;
  image_query: string | null;
};

function safeJsonParse(s: string): any {
  try {
    return JSON.parse(s);
  } catch {
    const m = s.match(/\{[\s\S]*\}$/); // try to grab the last JSON-looking block
    if (m) return JSON.parse(m[0]);
    throw new Error('Invalid JSON returned from model.');
  }
}

function sanitizeDomains(
  result: ImageSelectorResult,
  fallbackQuery: string,
): ImageSelectorResult {
  const allowed =
    /^(https:\/\/)(images\.pexels\.com|cdn\.pixabay\.com)\/.*\.(jpg|jpeg|png|webp)$/i;
  if (!result?.image_url || !allowed.test(result.image_url)) {
    return {
      image_url: null,
      image_query: result?.image_query || fallbackQuery || null,
    };
  }
  return {
    image_url: result.image_url,
    image_query: result.image_query ?? null,
  };
}

export const imageGenerator = async (
  text: string,
  language: string,
): Promise<ImageSelectorResult> => {
  try {
    const payload = {
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: buildRecipeImagePrompt(language, text), // text = recipe name or query
    };

    const res = await axios.post(GROQ_CHAT_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${FEATME_GROQ_API_KEY}`,
      },
      timeout: 30_000,
    });

    const content: string = res.data?.choices?.[0]?.message?.content ?? '{}';
    const parsed = safeJsonParse(content) as ImageSelectorResult;

    // Keep only safe-direct URLs; otherwise provide a fallback query
    return sanitizeDomains(parsed, text);
  } catch (err: any) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    throw new Error(
      `Groq image selector error${status ? ' ' + status : ''}: ${
        typeof data === 'string' ? data : JSON.stringify(data)
      }`,
    );
  }
};

export const generateRecipeWithGroq = async (
  text: RecipeCriteria,
  language = 'en',
): Promise<any> => {
  try {
    const payload = {
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
      temperature: 0.2,
      messages: [...buildRecipeTextPrompt(language, text)],
    };

    const res = await axios.post(GROQ_CHAT_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${FEATME_GROQ_API_KEY}`,
      },
    });

    const content = res.data?.choices?.[0]?.message?.content ?? '{}';
    return JSON.parse(content) as any;
  } catch (err: any) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    throw new Error(
      `Groq text error${status ? ' ' + status : ''}: ${
        typeof data === 'string' ? data : JSON.stringify(data)
      }`,
    );
  }
};
