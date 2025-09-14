// src/screens/add-food/FoodDetailsForm.tsx
import React from 'react';
import styled from '../../../styled-components';
import Spacer from '../../components/spacer/Spacer';
import CustomInput from '../../components/input/CustomInput';
import CustomTextArea from '../../components/input/CustomTextArea';
import { TextL, TextM } from '../../theme/typography';
import {
  Dark,
  DarkGreen,
  Gray4,
  Green,
  LightGreen,
  Red,
  White,
} from '../../theme/colors';
import { Dropdown } from 'react-native-element-dropdown';
import { MealType } from '../../data/meals/MealType';
import { useTranslation } from 'react-i18next';
import SparklesIcon from '../../../assets/icons/sparkles.svg';
import { Image } from 'react-native';
import CloseIcon from '../../../assets/icons/close.svg';
import { IMealItemComponent } from '../../data/meal-item-component/IMealItemComponent';

interface IFoodDetailsForm {
  mealsData: { label: string; value: MealType }[];
  mealType: MealType;
  setMealType: (m: MealType) => void;
  nutritionData: any;
  setNutritionData: React.Dispatch<React.SetStateAction<any>>;
  getMealByType: (m: MealType) => string;
}

const FoodDetailsForm = ({
  mealsData,
  mealType,
  setMealType,
  nutritionData,
  setNutritionData,
  getMealByType,
}: IFoodDetailsForm) => {
  const { t } = useTranslation();
  const { imageUri } = nutritionData.imageUri ? nutritionData : {};

  const handleDeleteMealItemComponent = (component: IMealItemComponent) => {
    const mealComponents = [...nutritionData.mealComponents];

    const updatedComponents = mealComponents.filter(
      comp => comp.name !== component.name,
    );
    setNutritionData((p: any) => ({
      ...p,
      calories:
        nutritionData.calories > 0
          ? nutritionData.calories - component.calories
          : 0,
      protein:
        nutritionData.protein > 0
          ? nutritionData.protein - component.protein
          : 0,
      fat: nutritionData.fat > 0 ? nutritionData.fat - component.fat : 0,
      carbs:
        nutritionData.carbs > 0 ? nutritionData.carbs - component.carbs : 0,
      mealComponents: updatedComponents,
    }));
  };

  return (
    <>
      <TopCard>
        <IconRow>
          <SparklesIcon width={24} height={24} fill={DarkGreen} />
          <Spacer direction="horizontal" size="xs" />
          <CustomTitle color={DarkGreen}>
            {t('add_food_screen.analyze_complete_title')}
          </CustomTitle>
        </IconRow>

        <Spacer direction="vertical" size="s" />
        <CustomText color={Green}>
          {t('add_food_screen.analyze_complete_subtitle')}
        </CustomText>
      </TopCard>
      <Spacer direction="vertical" size="s" />
      {imageUri && (
        <>
          <Spacer direction="vertical" size="m" />
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: 200, borderRadius: 16 }}
            resizeMode="cover"
          />
        </>
      )}
      <Spacer direction="vertical" size="xl" />

      <Card>
        <Title>{t('add_food_screen.food_details')}</Title>
        <Spacer direction="vertical" size="xl" />
        <CustomInput
          value={nutritionData.name || nutritionData.food_name}
          label={t('add_food_screen.food_name')}
          onChangeText={value =>
            setNutritionData((p: any) => ({ ...p, name: value }))
          }
        />
        <Spacer direction="vertical" size="xl" />
        <CustomTextArea
          label={t('add_food_screen.description')}
          value={nutritionData.description}
          onChangeText={value =>
            setNutritionData((p: any) => ({ ...p, description: value }))
          }
        />
        <Spacer direction="vertical" size="xl" />
        <Row>
          <DropdownContainer>
            <DropdownLabel>{t('add_food_screen.meal_type')}</DropdownLabel>
            <Spacer direction="vertical" size="xs" />
            <Dropdown
              data={mealsData}
              labelField="label"
              valueField="value"
              placeholder={getMealByType(mealType)}
              value={mealType}
              selectedTextStyle={{ fontSize: 14 }}
              containerStyle={{ borderRadius: 8, top: 10 }}
              placeholderStyle={{ fontSize: 14 }}
              itemTextStyle={{ fontSize: 14 }}
              onChange={item => setMealType(item.value)}
              style={{
                padding: 16,
                borderRadius: 8,
                borderColor: Gray4,
                borderWidth: 1,
              }}
            />
          </DropdownContainer>
          <Spacer direction="horizontal" size="m" />
          <InputContainer>
            <CustomInput
              value={nutritionData.date}
              label={t('add_food_screen.date')}
              onChangeText={() => null}
            />
          </InputContainer>
        </Row>
        <Spacer direction="vertical" size="xl" />
        <CustomInput
          value={nutritionData.servingSize}
          label={t('add_food_screen.serving_size')}
          onChangeText={value =>
            setNutritionData((p: any) => ({ ...p, serving_size: value }))
          }
        />
      </Card>

      <Spacer direction="vertical" size="xxl" />

      <Card>
        <Title>{t('add_food_screen.nutrition_facts')}</Title>
        <Spacer direction="vertical" size="xl" />
        <Row>
          <CustomInput
            value={nutritionData.calories}
            label={t('add_food_screen.calories')}
            onChangeText={value =>
              setNutritionData((p: any) => ({ ...p, calories: Number(value) }))
            }
          />
          <Spacer direction="horizontal" size="m" />
          <CustomInput
            value={nutritionData.protein}
            label={t('add_food_screen.protein')}
            onChangeText={value =>
              setNutritionData((p: any) => ({ ...p, protein: Number(value) }))
            }
          />
        </Row>
        <Spacer direction="vertical" size="xl" />
        <Row>
          <CustomInput
            value={nutritionData.fat}
            label={t('add_food_screen.fat')}
            onChangeText={value =>
              setNutritionData((p: any) => ({ ...p, fat: Number(value) }))
            }
          />
          <Spacer direction="horizontal" size="m" />
          <CustomInput
            value={nutritionData.carbs}
            label={t('add_food_screen.carbs')}
            onChangeText={value =>
              setNutritionData((p: any) => ({ ...p, carbs: Number(value) }))
            }
          />
        </Row>
        <Spacer direction="vertical" size="xl" />

        <MealComponentsContainer>
          <Row>
            {nutritionData.mealComponents.length > 0 &&
              nutritionData.mealComponents.map(
                (component: IMealItemComponent) => (
                  <>
                    <MealComponentCard>
                      <CustomText>{component.name}</CustomText>
                      <Spacer direction="vertical" size="xs" />

                      <CustomText>{component.calories} kcal</CustomText>
                      <DeleteButton
                        onPress={() => {
                          handleDeleteMealItemComponent(component);
                        }}
                      >
                        <CloseIcon width={15} height={15} fill={White} />
                      </DeleteButton>
                    </MealComponentCard>
                    <Spacer direction="horizontal" size="xs" />
                  </>
                ),
              )}
          </Row>
        </MealComponentsContainer>
      </Card>
    </>
  );
};

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const MealComponentsContainer = styled.View`
  flex: 1;
`;

const MealComponentCard = styled.View`
  padding: 8px 16px;
  border: 1px solid ${Gray4};
  border-radius: 16px;
  background-color: ${White};
`;

const TopCard = styled.View`
  width: 100%;
  padding: 20px;
  border: 1px solid ${Green};
  background-color: ${LightGreen};
  border-radius: 32px;
`;

const CustomTitle = styled.Text<{ color: string }>`
  ${TextL};
  color: ${({ color }: { color: string }) => color || Dark};
`;

const CustomText = styled.Text<{ color: string }>`
  ${TextM};
  color: ${({ color }: { color: string }) => color || Dark};
`;

const Card = styled.View`
  width: 100%;
  padding: 20px;
  background-color: ${White};
  border-radius: 32px;
`;

const Title = styled.Text`
  ${TextL};
  font-weight: bold;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DropdownContainer = styled.View`
  flex: 1;
`;

const DropdownLabel = styled.Text`
  ${TextM};
`;

const InputContainer = styled.View`
  flex: 1;
`;

const DeleteButton = styled.Pressable`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 16px;
  background-color: ${Red};
  align-items: center;
  justify-content: center;
  bottom: 55px;
  left: -8px;
`;

export default FoodDetailsForm;
