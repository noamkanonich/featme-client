import { IMealItemComponent } from '../../data/meal-item-component/IMealItemComponent';
import { IMealItemComponentRaw } from '../../data/meal-item-component/IMealItemComponentRaw';

export const toMealItemComponents = (data: IMealItemComponentRaw) => {
  return {
    id: data.id,
    mealItemId: data.meal_item_id,
    name: data.name,
    calories: data.calories,
    protein: data.protein,
    carbs: data.carbs,
    fat: data.fat,
    quantity: data.quantity,
  };
};

export const toMealItemComponentsRaw = (item: IMealItemComponent) => {
  return {
    id: item.id,
    meal_item_id: item.mealItemId,
    name: item.name,
    calories: item.calories,
    protein: item.protein,
    carbs: item.carbs,
    fat: item.fat,
    quantity: item.quantity,
  };
};
