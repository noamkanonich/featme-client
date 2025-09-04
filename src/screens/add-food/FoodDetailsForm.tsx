// src/screens/add-food/FoodDetailsForm.tsx
import React from 'react';
import styled from '../../../styled-components';
import Spacer from '../../components/spacer/Spacer';
import CustomInput from '../../components/input/CustomInput';
import CustomTextArea from '../../components/input/CustomTextArea';
import { TextL, TextM } from '../../theme/typography';
import { Gray4, White } from '../../theme/colors';
import { Dropdown } from 'react-native-element-dropdown';
import { MealType } from '../../data/meals/MealType';
import { useTranslation } from 'react-i18next';

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
  return (
    <>
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
      </Card>
    </>
  );
};

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

export default FoodDetailsForm;
