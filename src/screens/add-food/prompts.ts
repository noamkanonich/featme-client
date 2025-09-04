// src/utils/prompts.ts

export const nutritionSystemPromptEn = [
  'You are a nutrition analysis assistant.',
  'Return ONLY a valid JSON object with keys: id, name, description, calories, protein, fat, carbs, serving_size, language, image_url.',
  'No extra text, no markdown, no explanations.',
  'image_url based on the name and also description, find a suitable image on the internet.',
  'Create the id as a uuid and return it as a string.',
].join(' ');

export const nutritionSystemPromptHe = [
  'אתה מומחה לניתוח תזונתי.',
  'החזר אך ורק אובייקט JSON חוקי עם המפתחות: id, name, description, calories, protein, fat, carbs, serving_size, language, image_url.',
  'את ה- id תיצור כ- uuid ותחזיר אותו במחרוזת.',
  'image_url לפי שדה name וגם description תחפש תמונה מתאימה באינטרנט.',
  'ללא טקסט נוסף, ללא markdown, ללא הסברים.',
].join(' ');

// 🖼️ prompt לבקשה מבוססת תמונה
export const buildNutritionImagePrompt = (
  language: string,
  imageDataUrl: string,
) => {
  if (language === 'he') {
    return [
      {
        role: 'system',
        content: nutritionSystemPromptHe,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `נתח את התמונה הזו של הארוחה. החזר תשובה בעברית בלבד. רמז שפה: ${language}`,
          },
          { type: 'image_url', image_url: { url: imageDataUrl } },
        ],
      },
    ];
  }

  return [
    {
      role: 'system',
      content: nutritionSystemPromptEn,
    },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `Analyze this meal photo. Language hint: ${language}`,
        },
        { type: 'image_url', image_url: { url: imageDataUrl } },
      ],
    },
  ];
};

export const buildNutritionTextPrompt = (language: string, text: string) => {
  if (language === 'he') {
    return buildTextAnalysisMessagesHe(text);
  }

  return buildTextAnalysisMessagesEn(text);
};

export const buildTextAnalysisMessagesHe = (text: string) => [
  {
    role: 'system',
    content: [
      'אתה מומחה לניתוח תזונתי.',
      'החזר אך ורק אובייקט JSON חוקי עם המפתחות: id, name, description, calories, protein, fat, carbs, sugar_g, fiber_g, sodium_mg, saturated_fat_g, trans_fat_g, cholesterol_mg, serving_size, portion_g, language, image_url, image_query, ingredients, method, confidence, warnings.',
      'ללא טקסט נוסף, ללא markdown, ללא הסברים.',
      'כל הערכים התזונתיים הם עבור מזון מבושל/מוכן לאכילה (cooked/ready).',
      'עיגול: calories למספר שלם; יתר המקרו/מיקרו בספרה אחת אחרי הנקודה (או 0.0 אם לא ידוע).',
      'בדיקת עקביות: ודא calories ≈ 4*protein + 9*fat + 4*carbs. אם יש פער משמעותי (≥12%), תקן את calories לערך המחושב לפני ההחזרה.',
      'יחידות: protein/fat/carbs/sugar_g/fiber_g/saturated_fat_g/trans_fat_g בגרמים; sodium_mg/cholesterol_mg במ״ג.',
      'שדות טקסט: name קצר בעברית; description בעברית מפורטת; serving_size בעברית (לדוגמה: "מנה בינונית ~200 גר׳").',
      'portion_g הוא מספר (כמה גרמים מוערכים למנה). אם לא ידוע, ניתן להחזיר null.',
      'ingredients הוא מערך מחרוזות בעברית (אם לא בטוח, החזר מערך ריק).',
      'method אחת מהבאות: "baked","fried","grilled","boiled","raw","roasted","steamed","other".',
      'confidence בין 0 ל-1, ו-warnings מערך מחרוזות בעברית להסתייגויות/הבהרות (אפשר ריק).',
      'image_url חייב להיות קובץ תמונה ישיר (HTTPS) שמסתיים ב-.jpg|.jpeg|.png|.webp ומותר רק מדומיינים: images.pexels.com, cdn.pixabay.com.',
      'אל תחזיר קישורים מ-wikipedia/wikimedia/google/pinterest/instagram/tiktok וכדומה. אין להמציא קישורים.',
      'אם אין לך קישור ודאי — החזר image_url=null והחזר בשדה image_query שאילתת חיפוש מתאימה בעברית (למשל: "חביתת ירקות").',
      'language חייב להיות "he".',
      'id הוא UUID v4 כתוֹאֵם מחרוזת (למשל "3fa85f64-5717-4562-b3fc-2c963f66afa6") ושונה בכל קריאה.',
      'החזר מספרים כסוג מספרי (לא כמחרוזות), ללא ייצוג מדעי.',
      'תרחיב ככל הניתן ברמת התזונה והספורט על תיאור המנה בשדה ה- description',
      'הוסף הערות חשובות על אזהרות, אלרגיות, תוספים, סוכרים מוספים, שומן טראנס, רמות נתרן וכדומה בשדה ה- warnings',
      'תרחיב בשדה name ככל הניתן בהתאם לתיאור המנה',
    ].join(' '),
  },
  {
    role: 'user',
    content: `ניתח את תיאור המזון הבא והחזר JSON בלבד: "${text}". שפת יעד: he`,
  },
];

export const buildTextAnalysisMessagesEn = (text: string) => [
  {
    role: 'system',
    content: [
      'You are a nutrition analysis expert.',
      'Return ONLY a valid JSON object with keys: id, name, description, calories, protein, fat, carbs, sugar_g, fiber_g, sodium_mg, saturated_fat_g, trans_fat_g, cholesterol_mg, serving_size, portion_g, language, image_url, image_query, ingredients, method, confidence, warnings.',
      'No extra text, no markdown, no explanations.',
      'Assume cooked/ready-to-eat values.',
      'Rounding: calories = integer; macros/micros to 1 decimal place (or 0.0 if unknown).',
      'Self-consistency: ensure calories ≈ 4*protein + 9*fat + 4*carbs. If the gap is ≥12%, adjust calories to the macro-based value before returning.',
      'Units: protein/fat/carbs/sugar_g/fiber_g/saturated_fat_g/trans_fat_g in grams; sodium_mg/cholesterol_mg in milligrams.',
      'Text fields: concise English name; detailed English description; serving_size as a friendly English label (e.g., "1 medium serving (~200 g)").',
      'portion_g is a number (estimated grams per serving). Use null if unknown.',
      'ingredients is an array of strings in English (empty if uncertain).',
      'method is one of: "baked","fried","grilled","boiled","raw","roasted","steamed","other".',
      'confidence is 0..1; warnings is an array of English strings with caveats (may be empty).',
      'image_url must be a direct HTTPS image ending with .jpg|.jpeg|.png|.webp and ONLY from: images.pexels.com, cdn.pixabay.com.',
      'Do NOT return links from wikipedia/wikimedia/google/pinterest/instagram/tiktok, etc. Do not fabricate URLs.',
      'If no safe URL is available, return image_url=null and set image_query with relevant English search terms.',
      'language must be "en".',
      'id must be a UUID v4 string (e.g., "3fa85f64-5717-4562-b3fc-2c963f66afa6"), different each call.',
      'Numbers must be numeric (not strings), no scientific notation.',
    ].join(' '),
  },
  {
    role: 'user',
    content: `Analyze this food description and return JSON only: "${text}". Language: en`,
  },
];

//  TEXT - OLD PROMPT //----------
// messages: [
//     {
//       role: 'system',
//       content: [
//         'You are a nutrition analysis assistant.',
//         'Return ONLY a valid JSON object with keys: food_name, description, calories, protein, fat, carbs, serving_size, language.',
//         'No extra text, no markdown, no explanations.',
//         'Always calculate nutrition facts using standard USDA values for COOKED foods (not raw or averages).',
//         'Ensure scaling is exact: multiply the per-100g cooked values precisely by the specified grams.',
//         'Round calories to the nearest integer; round macros to 1 decimal; numeric fields must be numbers.',
//         "In the description: list the quantities, then add a qualitative statement about the macro profile and benefit, then note 'interpreted as cooked' if assumed.",
//       ].join(' '),
//     },
//     {
//       role: 'user',
//       content:
//         `Analyze this food description: "${textValue}". ` +
//         `Provide nutritional information for the specified amounts, or a reasonable default if not specified. ` +
//         `Aggregate totals into a single JSON output. ` +
//         `Language hint: ${i18n.language}`,
//     },
//   ],
