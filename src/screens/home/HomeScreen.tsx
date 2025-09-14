import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import styled from '../../../styled-components';
import DateSlider from '../../components/date-slider/DateSlider';
import Spacer from '../../components/spacer/Spacer';
import SkeletonScreen from '../skeleton-screen/SkeletonScreen';
import NutritionCard from '../../components/cards/NutritionCard';
import { TextL } from '../../theme/typography';
import { Gray7, Green, Red } from '../../theme/colors';
import CaloriesIcon from '../../../assets/icons/calories.svg';
import GrainIcon from '../../../assets/icons/grain.svg';
import DripIcon from '../../../assets/icons/drip.svg';
import MeatIcon from '../../../assets/icons/meat.svg';
import i18n from '../../i18n';
import MealsList from '../../components/meals/MealsList';
import { useTranslation } from 'react-i18next';
import useUserData from '../../lib/user-data/useUserData';
import { IMeal } from '../../data/meals/IMeal';
import {
  getMealsByDate,
  getMealsWithItemsByDate,
} from '../../utils/meals/meals-utils';
import useAuth from '../../lib/auth/useAuth';
import FadeInView from '../../components/animations/FadeInView';
import { useToast } from 'react-native-toast-notifications';
import useDate from '../../lib/date/useDate';
import { FoodItem } from '../../data/food/FoodItem';
import {
  addFoodToFavorites,
  checkIfFavoriteExists,
  removeFavorite,
} from '../../utils/favorites-utils';
import CustomTopBar from '../../components/custom-top-bar/CustomTopBar';
import { removeFoodItemFromMeal } from '../../utils/food/food-utils-new';

const HomeScreen = () => {
  const { user } = useAuth();
  const { selectedDate, setSelectedDate } = useDate();
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  const [mealsForDay, setMealsForDay] = useState<IMeal[]>([]);
  const [fetchingMeals, setFetchingMeals] = useState(false);

  const isRtl = i18n.dir() === 'rtl';

  const { meals, refreshData, userGoals } = useUserData();

  // simulate loading once
  useEffect(() => {
    const time = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(time);
  }, []);

  const loadMeals = useCallback(
    async (date: Date) => {
      if (!user) return;
      setFetchingMeals(true);
      try {
        // const todayMeals = await getMealsByDate(user.id, date);
        const foodItems = await getMealsWithItemsByDate(user.id, date);
        setMealsForDay(foodItems ?? []);
      } catch (e) {
        console.error('getMealsByDate failed:', e);
        setMealsForDay([]);
      } finally {
        setFetchingMeals(false);
      }
    },
    [user],
  );

  useEffect(() => {
    loadMeals(selectedDate);
  }, [selectedDate, isFocused, loadMeals, meals]);

  const totals = useMemo(() => {
    const sum = { calories: 0, protein: 0, fat: 0, carbs: 0 };
    for (const foodItem of mealsForDay) {
      sum.calories += Number(foodItem.totalCalories || 0);
      sum.protein += Number(foodItem.totalProtein || 0);
      sum.fat += Number(foodItem.totalFat || 0);
      sum.carbs += Number(foodItem.totalCarbs || 0);

      // for (const item of meal.foodItems ?? []) {
      //   sum.calories += Number(item.calories || 0);
      //   sum.protein += Number(item.protein || 0);
      //   sum.fat += Number(item.fat || 0);
      //   sum.carbs += Number(item.carbs || 0);
      // }
    }
    console.log('TOTALS', sum);
    return sum;
  }, [mealsForDay]);

  const goals = {
    calories: userGoals?.dailyCalories || 0,
    protein: userGoals?.dailyProtein || 0,
    fat: userGoals?.dailyFat || 0,
    carbs: userGoals?.dailyCarbs || 0,
  };

  const handleUpdateFoodItem = async (
    updatedFoodItem: FoodItem,
    mealId: string,
  ) => {
    try {
      setLoading(true);
      // await updateFoodItem(updatedFoodItem, mealId);
      await loadMeals(selectedDate);
      setLoading(false);
    } catch (err) {
      console.error('Error updating food item:', err);
    }
  };

  const handleDeleteFoodItem = async (foodItemId: string, mealId: string) => {
    try {
      setLoading(true);
      await removeFoodItemFromMeal(foodItemId, mealId);
      toast.show(t('toast.food_deleted'), {
        type: 'success',
        textStyle: { color: Green },
        placement: 'bottom',
      });
      await loadMeals(selectedDate);
      setLoading(false);
    } catch (err) {
      console.error('Error deleting food item:', err);
      toast.show(t('toast.food_deleted_failed'), {
        type: 'danger',
        textStyle: { color: Red },
        placement: 'bottom',
      });
    }
  };

  const handleToggleFavorite = async (foodItem: FoodItem) => {
    try {
      const checkIfFavorite = await checkIfFavoriteExists(
        user!.id,
        foodItem.id,
      );
      if (checkIfFavorite && foodItem.isFavorite) {
        console.log('REMOVE FROM FAVORITES');
        await removeFavorite(user!.id!, foodItem.id!);
      } else if (!checkIfFavorite && !foodItem.isFavorite) {
        console.log('ADD TO FAVORITES');
        await addFoodToFavorites(user!.id, foodItem);
      }
      toast.show(
        foodItem.isFavorite
          ? t('toast.added_to_favorite')
          : t('toast.remove_from_favorite'),
        {
          type: 'success',
          placement: 'bottom',
        },
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleQuickAddPress = async () => {
    try {
      await refreshData();
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Root>
        <CustomTopBar />

        {loading ? (
          <SkeletonScreen />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Spacer direction="vertical" size="xxl" />
            <FadeInView direction="down" delay={100}>
              <DateSliderContainer>
                <DateSlider
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </DateSliderContainer>
            </FadeInView>
            <Spacer direction="vertical" size="xl" />

            <FadeInView direction={isRtl ? 'right' : 'left'} delay={200}>
              <DailyProgressTitle>
                {t('dashboard_screen.daily_progress')}
              </DailyProgressTitle>
            </FadeInView>

            <DailyProgressCardsContainer>
              <Row>
                <NutritionCard
                  title={t('nutrition.calories')}
                  current={totals.calories}
                  goal={goals.calories}
                  color="emerald"
                  icon={CaloriesIcon}
                />

                <Spacer direction="horizontal" size="m" />
                <NutritionCard
                  title={t('nutrition.protein')}
                  current={totals.protein}
                  goal={goals.protein}
                  unit="g"
                  color="blue"
                  icon={MeatIcon}
                />
              </Row>

              <Spacer direction="vertical" size="m" />

              <Row>
                <NutritionCard
                  title={t('nutrition.fat')}
                  current={totals.fat}
                  goal={goals.fat}
                  unit="g"
                  color="purple"
                  icon={DripIcon}
                />
                <Spacer direction="horizontal" size="m" />
                <NutritionCard
                  title={t('nutrition.carbs')}
                  current={totals.carbs}
                  goal={goals.carbs}
                  unit="g"
                  color="orange"
                  icon={GrainIcon}
                />
              </Row>
            </DailyProgressCardsContainer>

            <MealsListContainer>
              <MealsList
                meals={mealsForDay}
                loading={fetchingMeals}
                onQuickAddPress={handleQuickAddPress}
                onPressItem={id => console.log('open', id)}
                onUpdateItem={(updatedFoodItem, mealId) =>
                  handleUpdateFoodItem(updatedFoodItem, mealId)
                }
                onDeleteItem={(id, mealId) => handleDeleteFoodItem(id, mealId)}
                onToggleFavorite={foodItem => handleToggleFavorite(foodItem)}
              />
            </MealsListContainer>
          </ScrollView>
        )}
      </Root>
    </SafeAreaView>
  );
};

/* ---- styles ---- */
const Root = styled.View`
  flex: 1;
  background-color: ${Gray7};
`;
const DateSliderContainer = styled.View`
  padding: 0px 20px;
`;
const DailyProgressTitle = styled.Text`
  ${TextL};
  padding: 0px 20px;
  font-weight: bold;
`;
const DailyProgressCardsContainer = styled.View`
  flex: 1;
  padding: 20px;
`;
const MealsListContainer = styled.View`
  flex: 1;
  padding: 20px;
`;
const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export default HomeScreen;
