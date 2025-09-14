import { OpenAI } from 'openai';
import {
  buildRecipeTextPrompt,
  RecipeCriteria,
  recipeSystemPromptHe,
} from './recipes-prompt';
import { extractFirstJsonObject } from './utils';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.FEATME_OPENROUTER_API_KEY,
});

export const generateRecipeWithOpenAI = async (
  criteria: RecipeCriteria,
  language: string,
) => {
  const response = await openai.chat.completions.create({
    model: 'google/gemini-2.5-flash-image-preview',
    response_format: { type: 'json_object' }, // <— forces pure JSON
    messages: buildRecipeTextPrompt(language, criteria),
  });

  console.log(response.choices[0].message.content!);
  const result = await extractFirstJsonObject(
    response.choices[0].message.content!,
  );

  console.log(result);
  return result;
};
