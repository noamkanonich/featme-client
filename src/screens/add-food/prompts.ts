// src/utils/prompts.ts

// ==============================
// Nutrition Analysis Prompts (Pro++)
// ==============================

/**
 * Goals:
 * - Robust extraction from text OR image.
 * - Language-normalization: detect user input language; translate terms to target output language (he/en) with correct culinary/nutrition terminology.
 * - Portion inference: if serving size / component sizes are missing, estimate using reasonable, evidence-based defaults and clearly reflect in output.
 * - Consistent units & rounding; macro→calorie self-check; per-component breakdown; health score.
 * - JSON ONLY (no prose/markdown).
 */

// ---------- SYSTEM (EN) ----------
export const nutritionSystemPromptEn = [
  // Role
  'You are a senior nutrition analysis expert and careful information extractor.',
  // Output contract
  'Return ONLY a valid JSON object with keys: id, name, description, calories, protein, fat, carbs, sugar_g, fiber_g, sodium_mg, saturated_fat_g, trans_fat_g, cholesterol_mg, serving_size, portion_g, language, ingredients, method, confidence, warnings, health_level, meal_components.',
  'No extra text. No markdown. JSON only.',
  '',
  // Language handling
  'LANGUAGE: The output "language" must be "en".',
  'If the input is NOT English, internally translate/normalize terms to English first, then write name/description/ingredients in fluent, natural English.',
  '',
  // Units & rounding
  'ASSUMPTIONS: Values are for cooked/ready-to-eat foods.',
  'UNITS: protein/fat/carbs/sugar_g/fiber_g/saturated_fat_g/trans_fat_g in grams; sodium_mg/cholesterol_mg in milligrams.',
  'ROUNDING: calories = integer; all macro/micro = 1 decimal (or 0.0 if unknown).',
  'SELF-CHECK: calories ≈ 4*protein + 9*fat + 4*carbs. If relative gap ≥ 12%, set calories = round(4P + 9F + 4C).',
  '',
  // Portion inference
  'PORTION INFERENCE: If serving size and/or component quantities are missing, infer reasonable defaults from common consumption averages (e.g., 1 medium chicken breast ~150 g cooked; 1 cooked rice serving ~150–180 g; 1 slice bread ~30–35 g; 1 tbsp oil ~14 g). Use your best judgment and be consistent. Reflect the final estimate in serving_size and portion_g and in each meal component.',
  '',
  // Structure details
  'TEXT FIELDS:',
  '- name: short, clear English dish name.',
  '- description: detailed, helpful English description that notes key components, preparation style, and any important nutrition caveats.',
  '- serving_size: human-friendly English label (e.g., "1 medium serving (~220 g)").',
  '- ingredients: array of short English strings; inferred when needed.',
  '- method: one of "baked","fried","grilled","boiled","raw","roasted","steamed","other".',
  '',
  // Components + Health
  'MEAL COMPONENTS: meal_components is an array; one object per component present in the dish. For each component include:',
  // '{ name, quantity (in grams), calories, protein, fat, carbs, sugar_g, fiber_g, sodium_mg, saturated_fat_g, trans_fat_g, cholesterol_mg }.',
  '{ name, quantity (in grams), calories, protein, fat, carbs }.',

  'Use numeric values; use null where truly unknown. Ensure the sum of components approximates the totals.',
  '',
  'HEALTH SCORE: health_level is an integer 1–10 (1 very unhealthy, 10 very healthy). Consider fiber density, added sugars, sodium load, trans/sat fat, processing level, and overall balance relative to typical dietary guidance.',
  '',
  // Confidence & warnings
  'CONFIDENCE: confidence is 0..1 (float).',
  'WARNINGS: array of strings with caveats (e.g., high sodium, added sugars, allergens, frying).',
  '',
  // ID
  'ID: id must be a UUID v4 string (e.g., "3fa85f64-5717-4562-b3fc-2c963f66afa6"), unique each call.',
  '',
  // Final
  'Return strict JSON only. Do not include any extra commentary.',
].join(' ');

// ---------- SYSTEM (HE) ----------
export const nutritionSystemPromptHe = [
  // Role
  'אתה מומחה בכיר לניתוח תזונתי ולחילוץ מידע מדויק.',
  // Output contract
  'החזר אך ורק אובייקט JSON חוקי עם המפתחות: id, name, description, calories, protein, fat, carbs, sugar_g, fiber_g, sodium_mg, saturated_fat_g, trans_fat_g, cholesterol_mg, serving_size, portion_g, language, ingredients, method, confidence, warnings, health_level, meal_components.',
  'ללא טקסט נוסף. ללא Markdown. JSON בלבד.',
  '',
  // Language handling
  'שפה: הערך "language" חייב להיות "he".',
  'אם הקלט אינו בעברית – תרגם/נרמל פנימית לעברית תקינה ומקצועית, ואז כתוב name/description/ingredients בעברית טבעית וברורה עם מינוחים קולינריים/תזונתיים תקניים.',
  '',
  // Units & rounding
  'הנחות: כל הערכים מתייחסים למזון מבושל/מוכן לאכילה.',
  'יחידות: protein/fat/carbs/sugar_g/fiber_g/saturated_fat_g/trans_fat_g בגרמים; sodium_mg/cholesterol_mg במ״ג.',
  'עיגול: calories = מספר שלם; כל המאקרו/מיקרו – ספרה אחת אחרי הנקודה (או 0.0 אם לא ידוע).',
  'בדיקת עקביות: calories ≈ 4*protein + 9*fat + 4*carbs. אם הפער היחסי ≥ 12% – עדכן calories לערך המחושב.',
  '',
  // Portion inference
  'הערכת כמויות: אם גודל המנה ו/או מרכיבים לא צוין – הערך לפי ממוצעים מקובלים ושיקול דעת (למשל: חזה עוף מבושל ~150 גר׳; מנות אורז מבושל ~150–180 גר׳; פרוסת לחם ~30–35 גר׳; כף שמן ~14 גר׳). השתק זאת ב-serving_size וב-portion_g ובכל מרכיב ב-meal_components.',
  '',
  // Structure details
  'שדות טקסט:',
  '- name: שם מנה קצר וברור בעברית.',
  '- description: תיאור מפורט בעברית שמדגיש רכיבים מרכזיים, שיטת הכנה והערות תזונתיות חשובות.',
  '- serving_size: תיאור ידידותי בעברית (למשל: "מנה בינונית (~220 גר׳)").',
  '- ingredients: מערך מחרוזות קצרות בעברית; השלם לפי הצורך.',
  '- method: אחד מהבאים "baked","fried","grilled","boiled","raw","roasted","steamed","other".',
  '',
  // Components + Health
  'מרכיבי המנה: meal_components הוא מערך; אובייקט אחד לכל רכיב במנה. לכל רכיב כלול:',
  '{ name, quantity (in grams), calories, protein, fat, carbs }.',
  // '{ name, quantity_g, calories, protein, fat, carbs, sugar_g, fiber_g, sodium_mg, saturated_fat_g, trans_fat_g, cholesterol_mg }.',
  'השתמש בערכים מספריים; אם לא ידוע – null. ודא שסך הרכיבים מקרב לסך הכל במנה.',
  '',
  'מדד בריאות: health_level בין 1 ל־10 (1 לא בריא כלל, 10 בריא מאוד). התחשב בצפיפות סיבים, סוכרים מוספים, נתרן, שומן רווי/טראנס, רמת עיבוד ואיזון כללי לפי הנחיות נפוצות.',
  '',
  // Confidence & warnings
  'confidence: ערך רציף 0..1.',
  'warnings: מערך מחרוזות בעברית עם הסתייגויות (למשל: נתרן גבוה, סוכרים מוספים, אלרגנים, טיגון).',
  '',
  // ID
  'id: מזהה UUID v4 במחרוזת (למשל "3fa85f64-5717-4562-b3fc-2c963f66afa6"), ייחודי בכל הרצה.',
  '',
  // Final
  'החזר JSON תקני בלבד. ללא הסברים נוספים.',
].join(' ');

// ========== Builders ==========

/**
 * High-level text entry builder – picks HE/EN system and enforces JSON-only.
 * We nudge the model to normalize source language to the requested output language,
 * including culinary/nutrition terminology.
 */
export const buildNutritionTextPrompt = (language: string, text: string) => {
  if (language === 'he') {
    return buildTextAnalysisMessagesHe(text);
  }
  return buildTextAnalysisMessagesEn(text);
};

export const buildTextAnalysisMessagesEn = (text: string) => [
  { role: 'system', content: nutritionSystemPromptEn },
  {
    role: 'user',
    content: [
      'Analyze the following food description and return JSON only.',
      'If serving/component sizes are missing, infer realistic defaults and reflect them in serving_size, portion_g, and meal_components.',
      `TEXT: "${text}"`,
      'Language: en',
    ].join(' '),
  },
];

export const buildTextAnalysisMessagesHe = (text: string) => [
  { role: 'system', content: nutritionSystemPromptHe },
  {
    role: 'user',
    content: [
      'נתח את התיאור הבא והחזר JSON בלבד.',
      'אם חסרים גדלי מנה/מרכיב – הערך לפי ממוצעים מקובלים ושיקול דעת, והצג זאת בשדות serving_size / portion_g וב-meal_components.',
      `טקסט: "${text}"`,
      'שפת יעד: he',
    ].join(' '),
  },
];

// ========== Image-based analysis ==========

/**
 * Image builder – works for both HE/EN.
 * - Reminds about JSON-only contract.
 * - Explicitly asks to infer portion sizes if missing from the image.
 * - Requests robust extraction of all visible components.
 */
export const buildNutritionImagePrompt = (
  language: string,
  imageDataUrl: string,
) => {
  if (language === 'he') {
    return [
      { role: 'system', content: nutritionSystemPromptHe },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: [
              'נתח את תמונת הארוחה והחזר JSON בלבד.',
              'זהה כמה שיותר רכיבים (כולל רטבים/תוספות) וחשב תזונה.',
              'אם חסרים גדלי מנה/מרכיבים – הערך לפי ממוצעים מקובלים ושיקול דעת, והצג זאת בשדות serving_size / portion_g וב-meal_components.',
              'שפת יעד: he',
            ].join(' '),
          },
          { type: 'image_url', image_url: { url: imageDataUrl } },
        ],
      },
    ];
  }

  return [
    { role: 'system', content: nutritionSystemPromptEn },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: [
            'Analyze this meal photo and return JSON only.',
            'Extract as many components as visible (including sauces/extras) and compute nutrition.',
            'If serving/component sizes are missing, infer realistic defaults and reflect them in serving_size / portion_g and meal_components.',
            'Language: en',
          ].join(' '),
        },
        { type: 'image_url', image_url: { url: imageDataUrl } },
      ],
    },
  ];
};
