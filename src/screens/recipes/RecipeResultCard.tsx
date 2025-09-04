// src/components/recipes/RecipeResultCard.tsx
import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import {
  HeadingXL,
  HeadingM,
  TextL,
  TextM,
  TextSLight,
  TextMLight,
} from '../../theme/typography';
import {
  Blue,
  Gray1,
  Green,
  LightGreen,
  Orange,
  White,
} from '../../theme/colors';
import Spacer from '../../components/spacer/Spacer';
import CheckIcon from '../../../assets/icons/check.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import FlameIcon from '../../../assets/icons/calories.svg';
import PeopleIcon from '../../../assets/icons/people.svg';
import { useTranslation } from 'react-i18next';

export type RecipeData = {
  recipe_name: string;
  description: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  estimated_nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  imageUri?: string | null;
};

interface IRecipeResultCard {
  recipe: RecipeData;
  onReset?: () => void;
}

const RecipeResultCard = ({ recipe, onReset }: IRecipeResultCard) => {
  const { t } = useTranslation();
  console.log(recipe);
  return (
    <Wrap>
      {!!recipe.imageUri && (
        <ImageBox>
          <Image
            source={{ uri: recipe.imageUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </ImageBox>
      )}
      <Spacer direction="vertical" size="xxl" />

      <Center>
        <Title>{recipe.recipe_name}</Title>
        <Spacer direction="vertical" size="xs" />
        <Subtitle>{recipe.description}</Subtitle>
      </Center>
      <Spacer direction="vertical" size="xl" />

      <StatsRow>
        <Stat>
          <ClockIcon width={28} height={28} stroke={Green} />
          <Spacer direction="vertical" size="xxs" />
          <StatValue>
            {recipe.prep_time_minutes} {t('recipe_result.min')}
          </StatValue>
          <Spacer direction="vertical" size="xxs" />
          <StatLabel>{t('recipe_result.prep')}</StatLabel>
        </Stat>
        <Stat>
          <FlameIcon width={28} height={28} fill={Orange} />
          <Spacer direction="vertical" size="xxs" />
          <StatValue>
            {recipe.cook_time_minutes} {t('recipe_result.min')}
          </StatValue>
          <Spacer direction="vertical" size="xxs" />
          <StatLabel>{t('recipe_result.cook')}</StatLabel>
        </Stat>
        <Stat>
          <PeopleIcon width={28} height={28} fill={Blue} />
          <Spacer direction="vertical" size="xxs" />
          <StatValue>{recipe.servings}</StatValue>
          <Spacer direction="vertical" size="xxs" />
          <StatLabel>{t('recipe_result.servings')}</StatLabel>
        </Stat>
      </StatsRow>
      <Spacer direction="vertical" size="xl" />

      <Card>
        <SectionTitle>{t('recipe_result.ingredients')}</SectionTitle>
        <Spacer direction="vertical" size="m" />

        {recipe.ingredients.map((line, i) => (
          <BulletRow key={`${line}-${i}`}>
            <CheckIcon width={24} height={24} fill={Green} />
            <Spacer direction="horizontal" size="s" />

            <BulletText>{line}</BulletText>
          </BulletRow>
        ))}
      </Card>
      <Spacer direction="vertical" size="xl" />

      <Card>
        <SectionTitle>{t('recipe_result.instructions')}</SectionTitle>
        <Spacer direction="vertical" size="m" />

        {recipe.instructions.map((step, i) => (
          <>
            <StepRow key={i}>
              <Circle>
                <StepNum>{i + 1}</StepNum>
              </Circle>
              <Spacer direction="horizontal" size="s" />

              <StepText>{step}</StepText>
            </StepRow>
            <Spacer direction="vertical" size="m" />
          </>
        ))}
      </Card>
      <Spacer direction="vertical" size="xl" />

      <Card>
        <SectionTitle>{t('recipe_result.estimetad_nutrition')}</SectionTitle>

        <Spacer direction="vertical" size="m" />

        <NutritionRow>
          <NutItem>
            <NutValue>{recipe.estimated_nutrition.calories}</NutValue>
            <NutLabel>{t('recipe_result.calories')}</NutLabel>
          </NutItem>
          <Spacer direction="horizontal" size="m" />

          <NutItem>
            <NutValue>{recipe.estimated_nutrition.protein}g</NutValue>
            <NutLabel>{t('recipe_result.protein')}</NutLabel>
          </NutItem>
        </NutritionRow>
        <Spacer direction="vertical" size="m" />

        <NutritionRow>
          <NutItem>
            <NutValue>{recipe.estimated_nutrition.fat}g</NutValue>
            <NutLabel>{t('recipe_result.fat')}</NutLabel>
          </NutItem>
          <Spacer direction="horizontal" size="m" />

          <NutItem>
            <NutValue>{recipe.estimated_nutrition.carbs}g</NutValue>
            <NutLabel>{t('recipe_result.carbs')}</NutLabel>
          </NutItem>
        </NutritionRow>
      </Card>
      <Spacer direction="vertical" size="xl" />

      {!!onReset && (
        <ResetBtn onPress={onReset}>
          <ResetText>{t('recipe_result.start_over')}</ResetText>
        </ResetBtn>
      )}
    </Wrap>
  );
};

const Wrap = styled.View`
  width: 100%;
`;

const ImageBox = styled.View`
  width: 100%;
  height: 240px;
  border-radius: 24px;
  overflow: hidden;
  background: #f2f2f2;
`;

const Center = styled.View`
  align-items: center;
  padding: 0 8px;
`;

const Title = styled.Text`
  ${HeadingXL};
  font-weight: bold;
`;

const Subtitle = styled.Text`
  ${TextL};
  color: ${Gray1};
  text-align: center;
`;

const StatsRow = styled.View`
  flex-direction: row;
  background: #ecfdf5;
  border-radius: 24px;
  padding: 12px;
  justify-content: space-between;
`;

const Stat = styled.View`
  flex: 1;
  align-items: center;
`;

const StatValue = styled.Text`
  ${TextL};
  font-weight: bold;
`;

const StatLabel = styled.Text`
  ${TextSLight};
`;

const Card = styled.View`
  background: ${White};
  border-radius: 24px;
  padding: 16px;
  border: 1px solid #eef2f7;
`;

const SectionTitle = styled.Text`
  ${HeadingM};
  font-weight: bold;
`;

const BulletRow = styled.View`
  flex-direction: row;
  align-items: flex-start;

  margin-bottom: 8px;
`;

const BulletText = styled.Text`
  ${TextM};
  flex: 1;
`;

const StepRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  align-items: center;
  justify-content: center;
`;

const Circle = styled.View`
  width: 36px;
  height: 36px;
  background: ${LightGreen};
  border-radius: 24px;
  align-items: center;
  justify-content: center;
`;

const StepNum = styled.Text`
  ${TextL};

  color: #065f46;
  text-align: center;
  font-weight: 800;
`;

const StepText = styled.Text`
  flex: 1;
  ${TextM};
`;

const NutritionRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const NutItem = styled.View`
  flex: 1;
  align-items: center;
  padding: 8px;
  background: #f8fafc;
  border-radius: 12px;
`;

const NutValue = styled.Text`
  ${TextL};
  font-weight: bold;
`;

const NutLabel = styled.Text`
  ${TextMLight};
`;

const ResetBtn = styled.Pressable`
  margin-top: 4px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  align-items: center;
  background-color: ${White};
`;

const ResetText = styled.Text`
  font-weight: 700;
  color: #0f172a;
`;

export default RecipeResultCard;
