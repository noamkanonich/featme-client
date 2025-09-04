import { ScrollView } from 'react-native';
import React, { useState } from 'react';
import styled from '../../../styled-components';
import { useTranslation } from 'react-i18next';
import { Gray7, Gray1, White, Green, Gray4 } from '../../theme/colors';
import { HeadingM, TextM, TextS } from '../../theme/typography';
import Spacer from '../../components/spacer/Spacer';
import CustomTopBar from '../../components/custom-top-bar/CustomTopBar';
import CustomInput from '../../components/input/CustomInput';
import CustomTextArea from '../../components/input/CustomTextArea';
import ChefIcon from '../../../assets/icons/nav-bar/navigation-chef.svg';
import { shadow } from '../../theme/utils';
import { Dropdown } from 'react-native-element-dropdown';
import CustomButton from '../../components/buttons/CustomButton';
import RecipeResultCard, { RecipeData } from './RecipeResultCard';
import RecipeGeneratingLoader from './RecipeGeneratingLoader';
import { generateRecipeWithGroq, imageGenerator } from './utils/groq-recipes';
import i18n from '../../i18n';

const RecipesScreen = () => {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState('');
  const [dietaryNeeds, setDietaryNeeds] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<RecipeData | undefined>();

  const handleGenereateRecipe = async () => {
    try {
      setIsLoading(true);
      const recipeCriteria = {
        ingredients: ingredients,
        diet: dietaryNeeds,
        mealType: 'dinner',
        servings: 2,
        //   cuisine_hint: 'Mediterranean',
      };

      //   const image = await fetchPixabayImage(ingredients, i18n.language);

      const recipeResult = await generateRecipeWithGroq(
        recipeCriteria,
        i18n.language,
      );
      console.log(recipeResult);

      const imagePromt = `A delicious, professional food photography shot of ${recipeResult.recipe_name}, ${recipeResult.description}`;
      const imageResult = await imageGenerator(
        imagePromt,
        i18n.language || 'en',
      );

      console.log(recipeResult, imageResult);
      const recipe = { ...recipeResult, imageUri: imageResult.image_url };

      setIsGenerating(true);
      setResult(undefined);
      // fake “AI” delay
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

  const dietaryNeedsData = [
    { label: 'No specific needs', value: 'no_needs' },
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Gluten-Free', value: 'gluten_free' },
    { label: 'Keto', value: 'keto' },
    { label: 'Paleo', value: 'paleo' },
    { label: 'Dairy-Free', value: 'dairy_free' },
    { label: 'Nut-Free', value: 'nut_free' },
  ];

  return (
    <Root>
      <CustomTopBar />
      <ScrollView showsVerticalScrollIndicator={false}>
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

              <DropdownContainer>
                <DropdownLabel>
                  {t('recipes_screen.dietary_needs')}
                </DropdownLabel>
                <Spacer direction="vertical" size="xs" />
                <Dropdown
                  data={dietaryNeedsData}
                  labelField="label"
                  valueField="value"
                  placeholder="Select an item"
                  value={dietaryNeeds} // 👈 ממפים enum→string
                  selectedTextStyle={{ fontSize: 14 }}
                  containerStyle={{ borderRadius: 8, top: 10 }}
                  placeholderStyle={{ fontSize: 14 }}
                  itemTextStyle={{ fontSize: 14 }}
                  onChange={item => {
                    setDietaryNeeds(item.value);
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    borderColor: Gray4,
                    borderWidth: 1,
                  }}
                />
              </DropdownContainer>
              {/* <CustomInput
              label={t('recipes_screen.dietary_needs')}
              placeholder={t('recipes_screen.dietary_needs_placeholder')}
              value={ingredients}
              onChangeText={setIngredients}
            /> */}
              <Spacer direction="vertical" size="xl" />
              <CustomInput
                label={t('recipes_screen.meal_type')}
                value={ingredients}
                onChangeText={setIngredients}
              />
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
