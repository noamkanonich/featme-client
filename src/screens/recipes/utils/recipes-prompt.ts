// ==============================
// Recipe generation (text → recipe JSON)
// ==============================

export const recipeSystemPromptEn = [
  'You are a creative chef and nutrition-aware recipe generator.',
  'Return ONLY a valid JSON object with keys: recipe_name, description, prep_time_minutes, cook_time_minutes, servings, ingredients, instructions, estimated_nutrition.',
  'No extra text, no markdown, no explanations.',
  'ingredients is an array of strings with clear quantities (e.g., "200 g chicken breast", "1 tbsp olive oil").',
  'instructions is an array of concise but not too short, step-by-step strings.',
  'add description field with a flavorful summary of the recipe.',
  'estimated_nutrition is per serving and includes calories (int), protein (g), fat (g), carbs (g).',
  'Assume cooked/ready-to-eat values. Round calories to an integer; macros to 1 decimal.',
  'Self-consistency check: calories ≈ 4*protein + 9*fat + 4*carbs. If gap ≥12%, adjust calories to macro-based value before returning.',
].join(' ');

export const recipeSystemPromptHe = [
  'אתה שף יצירתי ומודע לתזונה, המייצר מתכונים.',
  'המתכונים שלך הם מעניינים וטעימים, תוך התחשבות במגבלות תזונתיות.',
  'אתה אוהב לתת מתכונים לא פשוטים אך בר־ביצוע עם מרכיבים נפוצים.',
  'החזר אך ורק אובייקט JSON חוקי עם המפתחות: recipe_name, description, prep_time_minutes, cook_time_minutes, servings, ingredients, instructions, estimated_nutrition.',
  'ללא טקסט נוסף, ללא markdown, ללא הסברים.',
  'תיאור המתכון באופן מפורט בשדה description.',
  'ingredients הוא מערך מחרוזות עם כמויות ברורות (למשל: "200 גר׳ חזה עוף", "1 כף שמן זית").',
  'instructions הוא מערך שלבים  ארוך ומפורט.',
  'estimated_nutrition הוא פר מנה וכולל calories (מספר שלם), protein/fat/carbs בגרמים.',
  'הנח ערכי מזון מבושלים/מוכנים לאכילה. קלוריות שלמות; מקרו עם ספרה אחת אחרי הנקודה.',
  'בדיקת עקביות: calories ≈ 4*protein + 9*fat + 4*carbs. אם הפער ≥12% תקן את calories לפי המקרו לפני ההחזרה.',
].join(' ');

// Input model for convenience
export type RecipeCriteria = {
  ingredients: string; // free text list the user typed
  diet?: string; // e.g. "vegan" | "vegetarian" | "gluten_free" | "keto" | "none" | string
  mealType?: string; // e.g. "breakfast" | "lunch" | "dinner" | "snack"
  servings?: number; // optional target servings
  cuisine_hint?: string; // optional (e.g. "Mediterranean", "Mexican")
};

export const buildRecipeMessagesEn = (criteria: RecipeCriteria) => [
  { role: 'system', content: recipeSystemPromptEn },
  {
    role: 'user',
    content: [
      'Generate one delicious recipe as JSON only with the exact keys specified.',
      `Ingredients available: ${criteria.ingredients || 'N/A'}.`,
      `Dietary requirements: ${
        criteria.diet && criteria.diet !== 'none'
          ? criteria.diet
          : 'No specific requirements'
      }.`,
      `Meal type: ${criteria.mealType || 'lunch'}.`,
      criteria.servings ? `Target servings: ${criteria.servings}.` : '',
      criteria.cuisine_hint ? `Cuisine hint: ${criteria.cuisine_hint}.` : '',
    ]
      .filter(Boolean)
      .join(' '),
  },
];

export const buildRecipeMessagesHe = (criteria: RecipeCriteria) => [
  { role: 'system', content: recipeSystemPromptHe },
  {
    role: 'user',
    content: [
      'צור מתכון אחד כ־JSON בלבד עם המפתחות המדויקים שנדרשו.',
      `מצרכים זמינים: ${criteria.ingredients || 'לא צוין'}.`,
      `הנחיות תזונתיות: ${
        criteria.diet && criteria.diet !== 'none'
          ? criteria.diet
          : 'ללא הגבלות מיוחדות'
      }.`,
      `סוג ארוחה: ${criteria.mealType || 'lunch'}.`,
      criteria.servings ? `מספר מנות: ${criteria.servings}.` : '',
      criteria.cuisine_hint ? `רמז מטבח: ${criteria.cuisine_hint}.` : '',
    ]
      .filter(Boolean)
      .join(' '),
  },
];

// Helper: choose EN/HE
export const buildRecipeTextPrompt = (
  language: string,
  criteria: RecipeCriteria,
) =>
  language === 'he'
    ? buildRecipeMessagesHe(criteria)
    : buildRecipeMessagesEn(criteria);

// Example JSON schema you can pass to InvokeLLM (matches your example)
export const recipeResponseJsonSchema = {
  type: 'object',
  properties: {
    recipe_name: { type: 'string' },
    description: { type: 'string' },
    prep_time_minutes: { type: 'number' },
    cook_time_minutes: { type: 'number' },
    servings: { type: 'number' },
    ingredients: { type: 'array', items: { type: 'string' } },
    instructions: { type: 'array', items: { type: 'string' } },
    estimated_nutrition: {
      type: 'object',
      properties: {
        calories: { type: 'number' },
        protein: { type: 'number' },
        fat: { type: 'number' },
        carbs: { type: 'number' },
      },
      required: ['calories', 'protein', 'fat', 'carbs'],
    },
  },
  required: [
    'recipe_name',
    'description',
    'prep_time_minutes',
    'cook_time_minutes',
    'servings',
    'ingredients',
    'instructions',
    'estimated_nutrition',
  ],
};
