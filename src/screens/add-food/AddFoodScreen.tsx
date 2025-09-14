// src/screens/add-food/AddFoodScreen.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import styled from '../../../styled-components';
import Spacer from '../../components/spacer/Spacer';
import ChevronLeftIcon from '../../../assets/icons/chevron-left.svg';
import ChevronRightIcon from '../../../assets/icons/chevron-right.svg';
import { useNavigation } from '@react-navigation/native';
import { HeadingM, TextM } from '../../theme/typography';
import { Gray1, Gray7, Green, White } from '../../theme/colors';
import { format } from 'date-fns';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';

import useAuth from '../../lib/auth/useAuth';
import CustomButton from '../../components/buttons/CustomButton';
import AnalyzeImageCard from './AnalyzeImageCard';
import AnalyzeTextCard from './AnalyzeTextCard';
import FoodDetailsForm from './FoodDetailsForm';
import { MealType } from '../../data/meals/MealType';
import { addFoodToMeal } from '../../utils/food/food-utils';
import { FEATME_GROQ_API_KEY } from '@env';
import useDate from '../../lib/date/useDate';
import uuid from 'react-native-uuid';
import {
  getMealByHour,
  getMealIdByTypeAndDate,
  getMeals,
} from '../../utils/meals/meals-utils';
import { addFoodItemToMeal } from '../../utils/food/food-utils-new';
import { useToast } from 'react-native-toast-notifications';
import { addFoodItemComponents } from '../../utils/meal-item-components/meal-item-components-utils';

const AddFoodScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigation = useNavigation();
  const toast = useToast();
  const isRtl = i18n.dir() === 'rtl';
  const ChevronIcon = isRtl ? ChevronRightIcon : ChevronLeftIcon;
  const { selectedDate } = useDate();
  const [isLoading, setIsLoading] = useState(false);

  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isQuickAdd, setIsQuickAdd] = useState(false);
  const [mealType, setMealType] = useState(getMealByHour());
  const [nutritionData, setNutritionData] = useState({
    id: uuid.v4() as string,
    mealId: '',
    userId: user?.id || '',
    name: '',
    description: '',
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    servingSize: '',
    meal_type: getMealByHour(),
    date: format(selectedDate, 'yyyy-MM-dd'),
    imageUri: '',
    aiGenerated: true,
    mealComponents: [],
  });

  const mealsData = useMemo(
    () => [
      { label: t('meals.breakfast'), value: MealType.Breakfast },
      { label: t('meals.lunch'), value: MealType.Lunch },
      { label: t('meals.dinner'), value: MealType.Dinner },
      { label: t('meals.snacks'), value: MealType.Snack },
    ],
    [t],
  );

  const getMealByType = useCallback(
    (type: MealType) => {
      const meals = getMeals();
      const label = meals.find(m => m.value === type)?.label;
      return t(`meals.${label}`);
    },
    [t],
  );

  const handleImageResult = useCallback(
    (result: any, imageUri: string) => {
      setAnalysisComplete(true);
      setNutritionData(prev => ({
        ...prev,
        id: uuid.v4() as string,
        name: result.name ?? '',
        description: result.description ?? '',
        calories: Number(result.calories ?? 0),
        protein: Number(result.protein ?? 0),
        fat: Number(result.fat ?? 0),
        carbs: Number(result.carbs ?? 0),
        servingSize: result.serving_size ?? '',
        mealType: mealType,
        date: format(selectedDate, 'yyyy-MM-dd'),
        imageUri: imageUri,
        aiGenerated: true,
        healthLevel: result.health_level,
        mealComponents: result.meal_components || [],
      }));
    },
    [mealType, selectedDate],
  );

  const handleTextResult = useCallback(
    (result: any) => {
      console.log('AI TEXT RESULTS: ', result);
      setAnalysisComplete(true);
      setNutritionData(prev => ({
        ...prev,
        id: uuid.v4() as string,
        name: result.name ?? '',
        description: result.description ?? '',
        calories: Number(result.calories ?? 0),
        protein: Number(result.protein ?? 0),
        fat: Number(result.fat ?? 0),
        carbs: Number(result.carbs ?? 0),
        servingSize: result.serving_size ?? '',
        mealType: mealType,
        date: format(selectedDate, 'yyyy-MM-dd'),
        imageUri: result.image_url,
        aiGenerated: true,
        healthLevel: result.health_level,
        mealComponents: result.meal_components || [],
      }));
    },
    [mealType, selectedDate],
  );

  const handleSaveFood = useCallback(async () => {
    try {
      setIsLoading(true);
      const mealId = await getMealIdByTypeAndDate(
        user!.id,
        mealType,
        selectedDate,
      );

      const mealItemComponents = nutritionData.mealComponents;

      // await addFoodToMeal(mealId!, nutritionData, selectedDate);
      await addFoodItemToMeal(mealId!, nutritionData, selectedDate);
      await addFoodItemComponents(mealItemComponents, nutritionData.id);
      console.log('Food saved to meal:', mealId, nutritionData);
      setIsQuickAdd(false);
      setAnalysisComplete(false);
      setIsLoading(false);
      toast.show(t('toast.food_added'), {
        type: 'success',
        textStyle: { color: Green },
        placement: 'bottom',
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving food to meal:', error);
      setIsLoading(false);
      toast.show(t('toast.add_food_error'), {
        type: 'danger',
        textStyle: { color: White },
        placement: 'bottom',
      });
    }
  }, [user, mealType, nutritionData, navigation, selectedDate, toast, t]);

  return (
    <Root>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
          <Spacer direction="vertical" size="xxs" />

          <TitleContainer>
            <Row>
              <Press onPress={() => navigation.goBack()}>
                <ChevronIcon width={24} height={24} fill={'#111'} />
              </Press>
              <Spacer direction="horizontal" size="xxl" />
              <View>
                <Title>{t('add_food_screen.title')}</Title>
                <Subtitle>{t('add_food_screen.subtitle')}</Subtitle>
              </View>
            </Row>
          </TitleContainer>

          <Spacer direction="vertical" size="xxl-2" />

          {!analysisComplete && !isQuickAdd && (
            <>
              <AnalyzeImageCard
                language={i18n.language}
                apiKey={FEATME_GROQ_API_KEY}
                onResult={handleImageResult}
              />
              <Spacer direction="vertical" size="xxl-2" />
              <AnalyzeTextCard
                language={i18n.language}
                apiKey={FEATME_GROQ_API_KEY}
                onResult={handleTextResult}
              />
            </>
          )}

          {(analysisComplete || isQuickAdd) && (
            <>
              <FoodDetailsForm
                mealsData={mealsData}
                mealType={mealType}
                setMealType={setMealType}
                nutritionData={nutritionData}
                setNutritionData={setNutritionData}
                getMealByType={getMealByType}
              />
              <Spacer direction="vertical" size="m" />
              <Row>
                <ButtonWrap>
                  <CustomButton
                    label={t('add_food_screen.save')}
                    loading={isLoading}
                    onPress={handleSaveFood}
                  />
                </ButtonWrap>
                <Spacer direction="horizontal" size="m" />
                <ButtonWrap>
                  <CustomButton
                    label={t('add_food_screen.back')}
                    type="secondary"
                    onPress={() => {
                      setAnalysisComplete(false);
                      setIsQuickAdd(false);
                    }}
                  />
                </ButtonWrap>
              </Row>
            </>
          )}
        </Container>
        <Spacer direction="vertical" size="xl" />
      </ScrollView>
    </Root>
  );
};

const Root = styled.View`
  flex: 1;
  background: ${Gray7};
`;
const Container = styled.View`
  padding: 20px;
`;
const TitleContainer = styled.View`
  width: 100%;
`;
const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Press = styled.Pressable``;
const Title = styled.Text`
  ${HeadingM};
  font-weight: bold;
  line-height: 24px;
`;
const Subtitle = styled.Text`
  ${TextM};
  font-size: 14px;
  color: ${Gray1};
`;
const ButtonWrap = styled.View`
  flex: 1;
`;

export default AddFoodScreen;
