// src/screens/recipes/utils/generate-recipe.ts

import { callGeminiJSON, RecipeCriteria } from './gemini';
import {
  buildRecipeMessagesEn,
  buildRecipeMessagesHe,
  recipeSystemPromptEn,
  recipeSystemPromptHe,
} from './recipes-prompt';

export async function generateRecipeWithGemini(
  criteria: RecipeCriteria,
  language: string,
) {
  // בוחרים פרומפט ומסר משתמש לפי שפה
  const systemPrompt =
    language === 'he' ? recipeSystemPromptHe : recipeSystemPromptEn;

  // כאן הבילדרים שלך מחזירים מערך הודעות; אנחנו צריכים רק את תוכן המשתמש
  const messages =
    language === 'he'
      ? buildRecipeMessagesHe(criteria)
      : buildRecipeMessagesEn(criteria);

  // נחלץ את ה-user text (ההודעה האחרונה/היחידה עם role=user)
  const userText =
    messages.find(m => (m as any).role === 'user')?.content ??
    JSON.stringify(criteria);

  // קריאה לג׳מיני שתחזיר JSON נקי (object) לפי ההסכם בפרומפט
  const recipeObj = await callGeminiJSON({
    apiKey: process.env.FEATME_GEMINI_API_KEY!,
    systemPrompt,
    userText: String(userText),
    temperature: 0.55, // יצירתי אבל לא מופרע
    maxOutputTokens: 1400,
  });

  return recipeObj; // { recipe_name, description, ..., image_url, image_query }
}
