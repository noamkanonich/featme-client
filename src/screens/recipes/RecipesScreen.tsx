import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import styled from '../../../styled-components';
import { useTranslation } from 'react-i18next';
import { Gray7, Gray1, White, Green, Gray4 } from '../../theme/colors';
import { HeadingM, TextM, TextS } from '../../theme/typography';
import Spacer from '../../components/spacer/Spacer';
import CustomTopBar from '../../components/custom-top-bar/CustomTopBar';
import CustomTextArea from '../../components/input/CustomTextArea';
import ChefIcon from '../../../assets/icons/nav-bar/navigation-chef.svg';
import { shadow } from '../../theme/utils';
import { Dropdown } from 'react-native-element-dropdown';
import CustomButton from '../../components/buttons/CustomButton';
import RecipeResultCard, { RecipeData } from './RecipeResultCard';
import RecipeGeneratingLoader from './RecipeGeneratingLoader';
import { generateRecipeWithGroq, imageGenerator } from './utils/groq-recipes';
import i18n from '../../i18n';
import { creativityOptions, cuisineOptions } from './utils/utils';
import { generateRecipeWithOpenAI } from './utils/openai-recipes';
import { generateRecipeWithGemini } from './utils/generate-recipe';

const RecipesScreen = () => {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState('');
  const [dietaryNeeds, setDietaryNeeds] = useState<string | undefined>();
  const [mealType, setMealType] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'snack' | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cuisineHint, setCuisineHint] = useState<string | undefined>();
  const [creativityHint, setCreativityHint] = useState<string | undefined>();
  const [result, setResult] = useState<RecipeData | undefined>();

  const dietaryNeedsData = [
    {
      label: t('recipes_screen.no_specific_needs', 'No specific needs'),
      value: 'no_needs',
    },
    {
      label: t('recipes_screen.vegetarian', 'Vegetarian'),
      value: 'vegetarian',
    },
    { label: t('recipes_screen.vegan', 'Vegan'), value: 'vegan' },
    {
      label: t('recipes_screen.gluten_free', 'Gluten-Free'),
      value: 'gluten_free',
    },
    { label: t('recipes_screen.keto', 'Keto'), value: 'keto' },
    { label: t('recipes_screen.paleo', 'Paleo'), value: 'paleo' },
    {
      label: t('recipes_screen.dairy_free', 'Dairy-Free'),
      value: 'dairy_free',
    },
    { label: t('recipes_screen.nut_free', 'Nut-Free'), value: 'nut_free' },
  ];

  const mealTypeData = [
    { label: t('meals.breakfast', 'Breakfast'), value: 'breakfast' },
    { label: t('meals.lunch', 'Lunch'), value: 'lunch' },
    { label: t('meals.dinner', 'Dinner'), value: 'dinner' },
    { label: t('meals.snack', 'Snack'), value: 'snack' },
  ];

  const handleGenereateRecipe = async () => {
    try {
      setIsLoading(true);
      setIsGenerating(true);
      const recipeCriteria = {
        ingredients,
        diet: dietaryNeeds,
        mealType: mealType ?? 'dinner',
        servings: 2,
        cuisine_hint: cuisineHint,
        creativity_hint: creativityHint,
      };

      // const recipeResult = await generateRecipeWithOpenAI(
      //   recipeCriteria,
      //   i18n.language,
      // );

      const recipeData = await generateRecipeWithGemini(
        recipeCriteria,
        i18n.language,
      );

      console.log(recipeData);

      // const imagePrompt = `A delicious, professional food photography shot of ${recipeResult.recipe_name}, ${recipeResult.description}`;
      // const imageResult = await imageGenerator(
      //   imagePrompt,
      //   i18n.language || 'en',
      // );

      const recipe = {
        ...recipeData[0],
        imageUri: recipeData[0].image_url,
      };

      // setIsGenerating(true);
      setResult(undefined);

      setTimeout(() => {
        setResult(recipe);
        setIsLoading(false);
        setIsGenerating(false);
      }, 1400);
    } catch (err) {
      console.log('Error generating recipe:', err);
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  const dropdownCommonStyle = {
    padding: 12,
    borderRadius: 8,
    borderColor: Gray4,
    borderWidth: 1,
  } as const;

  return (
    <Root>
      <CustomTopBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Container>
          <ChefIcon width={42} height={42} fill={Green} />
          <Spacer direction="vertical" size="xs" />
          <Title>{t('recipes_screen.title')}</Title>
          <Subtitle>{t('recipes_screen.subtitle')}</Subtitle>

          <Spacer
            direction="vertical"
            size={!isGenerating && !result ? 'xl' : 'xs'}
          />

          {!isGenerating && !result && (
            <MainCard>
              <CustomTextArea
                label={t('recipes_screen.ingredients')}
                placeholder={t('recipes_screen.ingredients_placeholder')}
                value={ingredients}
                onChangeText={setIngredients}
              />

              <Spacer direction="vertical" size="xl" />

              {/* Dietary needs dropdown */}
              <DropdownContainer>
                <DropdownLabel>
                  {t('recipes_screen.dietary_needs')}
                </DropdownLabel>
                <Spacer direction="vertical" size="xs" />
                <Dropdown
                  data={dietaryNeedsData}
                  labelField="label"
                  valueField="value"
                  placeholder={t(
                    'recipes_screen.select_item',
                    'Select an item',
                  )}
                  value={dietaryNeeds}
                  selectedTextStyle={{ fontSize: 14 }}
                  containerStyle={{ borderRadius: 8, top: 10 }}
                  placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                  itemTextStyle={{ fontSize: 14 }}
                  onChange={item => setDietaryNeeds(item.value)}
                  style={dropdownCommonStyle}
                />
              </DropdownContainer>

              <Spacer direction="vertical" size="xl" />

              {/* Meal type dropdown */}
              <DropdownContainer>
                <DropdownLabel>{t('recipes_screen.meal_type')}</DropdownLabel>
                <Spacer direction="vertical" size="xs" />
                <Dropdown
                  data={mealTypeData}
                  labelField="label"
                  valueField="value"
                  placeholder={t(
                    'recipes_screen.select_item',
                    'Select an item',
                  )}
                  value={mealType}
                  selectedTextStyle={{ fontSize: 14 }}
                  containerStyle={{ borderRadius: 8, top: 10 }}
                  placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                  itemTextStyle={{ fontSize: 14 }}
                  onChange={item => setMealType(item.value)}
                  style={dropdownCommonStyle}
                />
              </DropdownContainer>

              <Spacer direction="vertical" size="xl" />

              <DropdownContainer>
                <DropdownLabel>{t('recipes_screen.cuisine')}</DropdownLabel>
                <Spacer direction="vertical" size="xs" />
                <Dropdown
                  data={cuisineOptions}
                  labelField="label"
                  valueField="value"
                  placeholder={t(
                    'recipes_screen.select_item',
                    'Select an item',
                  )}
                  value={cuisineHint}
                  selectedTextStyle={{ fontSize: 14 }}
                  containerStyle={{ borderRadius: 8, top: 10 }}
                  placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                  itemTextStyle={{ fontSize: 14 }}
                  onChange={item => setCuisineHint(item.value)}
                  style={dropdownCommonStyle}
                />
              </DropdownContainer>

              <Spacer direction="vertical" size="xl" />

              <DropdownContainer>
                <DropdownLabel>{t('recipes_screen.creativity')}</DropdownLabel>
                <Spacer direction="vertical" size="xs" />
                <Dropdown
                  data={creativityOptions}
                  labelField="label"
                  valueField="value"
                  placeholder={t(
                    'recipes_screen.select_item',
                    'Select an item',
                  )}
                  value={creativityHint}
                  selectedTextStyle={{ fontSize: 14 }}
                  containerStyle={{ borderRadius: 8, top: 10 }}
                  placeholderStyle={{ fontSize: 14, color: '#9CA3AF' }}
                  itemTextStyle={{ fontSize: 14 }}
                  onChange={item => setCreativityHint(item.value)}
                  style={dropdownCommonStyle}
                />
              </DropdownContainer>

              <Spacer direction="vertical" size="xl" />

              <CustomButton
                label={t('recipes_screen.generate_recipe')}
                loading={isLoading}
                disabled={!ingredients || isLoading}
                onPress={handleGenereateRecipe}
              />
            </MainCard>
          )}

          <Spacer direction="vertical" size="xl" />

          {isGenerating && <RecipeGeneratingLoader />}

          {!!result && (
            <RecipeResultCard
              recipe={result}
              onReset={() => {
                setResult(undefined);
                setIngredients('');
                setDietaryNeeds(undefined);
                setMealType(undefined);
              }}
            />
          )}
        </Container>
      </ScrollView>
    </Root>
  );
};

const Root = styled.View`
  flex: 1;
  background-color: ${Gray7};
`;

const Container = styled.View`
  align-items: center;
  padding: 20px;
  justify-content: center;
`;

const Title = styled.Text`
  ${HeadingM};
  font-weight: bold;
`;

const Subtitle = styled.Text`
  ${TextS};
  color: ${Gray1};
`;

const MainCard = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${White};
  border-radius: 16px;
  padding: 20px;
  ${shadow({
    opacity: 0.15,
    offsetWidth: -3,
    offsetHeight: 0,
    radius: 16,
    elevation: '4',
  }) as {}};
`;

const DropdownContainer = styled.View`
  width: 100%;
`;

const DropdownLabel = styled.Text`
  ${TextM};
`;

export default RecipesScreen;
