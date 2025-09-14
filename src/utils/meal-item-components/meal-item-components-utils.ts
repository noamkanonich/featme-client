// src/utils/meal-item-components.ts
import { IMealItemComponent } from '../../data/meal-item-component/IMealItemComponent';
import { supabase } from '../../lib/supabase/supabase';
import {
  toMealItemComponents,
  toMealItemComponentsRaw,
} from './meal-item-components-mapper';
import uuid from 'react-native-uuid';

/** --- small aggregator for numbers --- */
const sum = (arr: any[], key: string) =>
  arr.reduce((acc, x) => acc + Number(x?.[key] ?? 0), 0);

/**
 * Recalculate totals on the parent meal item from all its components
 * and persist to `meal_items`.
 */
const recalcMealItemTotals = async (foodItemId: string) => {
  // 1) fetch components with all nutrition columns you store
  const { data: comps, error } = await supabase
    .from('meal_item_components')
    .select(
      // keep only the columns you actually have in the table
      'quantity, calories, protein, fat, carbs',
    )
    .eq('meal_item_id', foodItemId);

  if (error) throw error;

  const total = {
    calories: Math.round(sum(comps || [], 'calories')),
    protein: +sum(comps || [], 'protein').toFixed(1),
    fat: +sum(comps || [], 'fat').toFixed(1),
    carbs: +sum(comps || [], 'carbs').toFixed(1),
    // sugar_g: +sum(comps || [], 'sugar_g').toFixed(1),
    // fiber_g: +sum(comps || [], 'fiber_g').toFixed(1),
    // sodium_mg: Math.round(sum(comps || [], 'sodium_mg')),
    // saturated_fat_g: +sum(comps || [], 'saturated_fat_g').toFixed(1),
    // trans_fat_g: +sum(comps || [], 'trans_fat_g').toFixed(1),
    // cholesterol_mg: Math.round(sum(comps || [], 'cholesterol_mg')),
  };

  // 2) update the parent meal item
  const { error: upErr } = await supabase
    .from('meal_items')
    .update({
      calories: total.calories,
      protein: total.protein,
      fat: total.fat,
      carbs: total.carbs,
      //   sugar_g: total.sugar_g,
      //   fiber_g: total.fiber_g,
      //   sodium_mg: total.sodium_mg,
      //   saturated_fat_g: total.saturated_fat_g,
      //   trans_fat_g: total.trans_fat_g,
      //   cholesterol_mg: total.cholesterol_mg,
      updated_at: new Date().toISOString(),
    })
    .eq('id', foodItemId);

  if (upErr) throw upErr;

  return total;
};

export const getMealItemComponents = async (foodItemId: string) => {
  try {
    const { data, error } = await supabase
      .from('meal_item_components')
      .select('*')
      .eq('meal_item_id', foodItemId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toMealItemComponents);
  } catch (err) {
    console.error('Error fetching meal item components:', err);
    throw err;
  }
};

export const updateFoodItem = async (
  foodItemId: string,
  patch: Record<string, any>,
) => {
  try {
    const { data, error } = await supabase
      .from('meal_items')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', foodItemId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating food item:', err);
    throw err;
  }
};

/**
 * Add one or many components; each saved as its own row.
 * Returns inserted rows and triggers parent totals recalculation.
 */
export const addFoodItemComponents = async (
  itemComponents: IMealItemComponent | IMealItemComponent[],
  foodItemId: string,
) => {
  try {
    const list = Array.isArray(itemComponents)
      ? itemComponents
      : [itemComponents];

    const rows = list.map(c => ({
      ...toMealItemComponentsRaw(c),
      id: uuid.v4() as string,
      meal_item_id: foodItemId,
      quantity: c.quantity ?? c.quantity ?? 0,
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('meal_item_components')
      .insert(rows)
      .select('*');

    if (error) throw error;

    // ✅ update parent meal_item totals
    await recalcMealItemTotals(foodItemId);

    return data ?? [];
  } catch (err) {
    console.error('Error adding meal item components:', err);
    throw err;
  }
};

/**
 * Remove a single component and recalc parent totals.
 */
export const removeMealItemComponent = async (
  itemComponentId: string,
  foodItemId: string,
) => {
  try {
    const { error, count } = await supabase
      .from('meal_item_components')
      .delete({ count: 'exact' })
      .eq('id', itemComponentId)
      .eq('meal_item_id', foodItemId);

    if (error) throw error;

    // ✅ update parent meal_item totals
    await recalcMealItemTotals(foodItemId);

    return (count ?? 0) > 0;
  } catch (err) {
    console.error('Error removing meal item component:', err);
    throw err;
  }
};

/**
 * Bulk remove all components of a meal item and recalc parent totals.
 */
export const removeAllMealItemComponents = async (foodItemId: string) => {
  try {
    console.log('Removing all components for meal item:', foodItemId);
    const { error, count } = await supabase
      .from('meal_item_components')
      .delete({ count: 'exact' })
      .eq('meal_item_id', foodItemId);

    if (error) throw error;

    await recalcMealItemTotals(foodItemId);

    return count ?? 0;
  } catch (err) {
    console.error('Error removing all meal item components:', err);
    throw err;
  }
};
