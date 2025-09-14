export const creativityOptions = [
  { label: 'Elevated but Simple', value: 'elevated_simple' },
  { label: 'Rustic One-Pan', value: 'rustic_one_pan' },
  { label: 'Street-Food Vibe', value: 'street_food' },
  { label: 'Light & Fresh', value: 'light_fresh' },
  { label: 'Comfort & Cozy', value: 'comfort_cozy' },
  { label: 'Bold & Spiced', value: 'bold_spiced' },
  { label: 'Herby & Zesty', value: 'herby_zesty' },
  { label: 'Low-Carb / Keto-leaning', value: 'low_carb' },
  { label: 'High-Protein Focus', value: 'high_protein' },
  { label: 'Family-Friendly', value: 'family_friendly' },
  { label: 'Meal-Prep Friendly', value: 'meal_prep' },
  { label: '15-Minute Quick', value: 'quick_15' },
  { label: 'Budget-Friendly', value: 'budget_friendly' },
  { label: 'Greens-Forward', value: 'greens_forward' },
  { label: 'Comfort Classic with Twist', value: 'classic_with_twist' },
];

export const cuisineOptions = [
  { label: 'Mediterranean', value: 'mediterranean' },
  { label: 'Middle Eastern', value: 'middle_eastern' },
  { label: 'Italian', value: 'italian' },
  { label: 'French', value: 'french' },
  { label: 'Spanish', value: 'spanish' },
  { label: 'Greek', value: 'greek' },
  { label: 'Levantine', value: 'levantine' },
  { label: 'Mexican', value: 'mexican' },
  { label: 'Peruvian', value: 'peruvian' },
  { label: 'American (Modern Bistro)', value: 'american_modern' },
  { label: 'Japanese', value: 'japanese' },
  { label: 'Korean', value: 'korean' },
  { label: 'Thai', value: 'thai' },
  { label: 'Vietnamese', value: 'vietnamese' },
  { label: 'Chinese', value: 'chinese' },
  { label: 'Indian', value: 'indian' },
  { label: 'North African (Maghrebi)', value: 'north_african' },
  { label: 'Turkish', value: 'turkish' },
  { label: 'Balkan', value: 'balkan' },
  { label: 'Fusion', value: 'fusion' },
];

export function extractFirstJsonObject(text: string) {
  if (!text) throw new Error('Empty response');

  // 1) strip code fences if present
  const stripped = text
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();

  // 2) find the first {...} block
  const match = stripped.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('No JSON object found in response:\n' + text.slice(0, 200));
  }

  // 3) parse safely (optionally fix trailing commas)
  const candidate = match[0].replace(/,\s*([}\]])/g, '$1'); // remove trailing commas

  return JSON.parse(candidate);
}
