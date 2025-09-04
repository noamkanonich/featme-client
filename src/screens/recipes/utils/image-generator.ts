// ==============================
// Recipe image helper (name/desc → image_url or image_query)
// ==============================

export const recipeImageSystemPromptEn = [
  'You select a suitable stock food image URL for a given recipe.',
  'Return ONLY a valid JSON object with keys: image_url, image_query.',
  'image_url must be a direct HTTPS image ending with .jpg|.jpeg|.png|.webp.',
  'Allowed domains ONLY: images.pexels.com, pixabay.com/api',
  'If you are not 100% sure or no direct file is available, return image_url=null and provide a concise search phrase in image_query.',
  'Do NOT return google/wikipedia/wikimedia/pinterest/instagram/tiktok or pages, only direct image files. Do NOT fabricate URLs.',
  'use this pixabay url with my api key:  https://pixabay.com/api/?key=52101842-0834da23056c4ca4f628eb513, and fetch the image from there',
].join(' ');

export const recipeImageSystemPromptHe = [
  'אתה בוחר קישור תמונת סטוק מתאים למתכון.',
  'החזר אך ורק JSON חוקי עם המפתחות: image_url, image_query.',
  'image_url חייב להיות קובץ תמונה ישיר (HTTPS) שמסתיים ב-.jpg|.jpeg|.png|.webp.',
  'דומיינים מותרים בלבד: images.pexels.com, pixabay.com/api.',
  'אם אין קישור ודאי — החזר image_url=null וספק שאילתת חיפוש קצרה ב-image_query.',
  'אל תחזיר google/wikipedia/wikimedia/pinterest/instagram/tiktok או דפי תוכן; רק קבצי תמונה ישירים. אל תמציא קישורים.',
  'תשתמש ב- pixabay יחד עם ה- api key שלי:  https://pixabay.com/api/?key=52101842-0834da23056c4ca4f628eb513, ותביא משם את התמונות הרלוונטיות',
].join(' ');

export const buildRecipeImageMessagesEn = (
  recipeName: string,
  description?: string,
) => [
  { role: 'system', content: recipeImageSystemPromptEn },
  {
    role: 'user',
    content: `Pick a direct image URL for: "${recipeName}". ${
      description ? `Description: ${description}.` : ''
    } Return JSON only.`,
  },
];

export const buildRecipeImageMessagesHe = (
  recipeName: string,
  description?: string,
) => [
  { role: 'system', content: recipeImageSystemPromptHe },
  {
    role: 'user',
    content: `בחר קישור תמונה ישיר עבור: "${recipeName}". ${
      description ? `תיאור: ${description}.` : ''
    } החזר JSON בלבד.`,
  },
];

export const buildRecipeImagePrompt = (
  language: string,
  recipeName: string,
  description?: string,
) =>
  language === 'he'
    ? buildRecipeImageMessagesHe(recipeName, description)
    : buildRecipeImageMessagesEn(recipeName, description);

// Optional JSON schema for the image selector
export const recipeImageResponseSchema = {
  type: 'object',
  properties: {
    image_url: { type: ['string', 'null'] },
    image_query: { type: ['string', 'null'] },
  },
  required: ['image_url', 'image_query'],
};

// this is the code example to generate image from text in OpenAI
// OpenAI Integration Example
// const fetch = require('node-fetch');

// async function callOpenAIAPI(prompt) {
//     const url = 'https://api.openai.com/v1/images/generations';
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${OPENAI_API_KEY}`,
//         },
//         body: JSON.stringify({
//             prompt
//         })
//     };

//     try {
//         const response = await fetch(url, options);
//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         console.log('Success:', data);
//         return data;
//     } catch (error) {
//         console.error('Error:', error);
//         throw error;
//     }
// }

// Usage
// callOpenAIAPI()
//   .then(result => {
//     // Handle successful response
//     console.log(result);
//   })
//   .catch(error => {
//     // Handle errors
//     console.error('API call failed:', error);
//   });
