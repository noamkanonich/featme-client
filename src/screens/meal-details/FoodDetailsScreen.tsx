import { View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootTabParamList } from '../../lib/routes/tab-navigator/TabNavigator';
import {
  Blue,
  DarkGreen,
  Gray1,
  Gray4,
  Gray5,
  Gray7,
  Green,
  LightGreen,
  LightRed,
  Orange,
  Purple,
  Red,
  White,
} from '../../theme/colors';
import styled from '../../../styled-components';
import Spacer from '../../components/spacer/Spacer';
import { HeadingL, TextM, TextMLight, TextS } from '../../theme/typography';
import CutleryIcon from '../../../assets/icons/cutlery.svg';
import { format } from 'date-fns';
import FireIcon from '../../../assets/icons/calories.svg';
import GrainIcon from '../../../assets/icons/grain.svg';
import DripIcon from '../../../assets/icons/drip.svg';
import MeatIcon from '../../../assets/icons/meat.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import NavHeader from '../../components/header/NavHeader';
import { mealTypeToString } from '../../utils/mappers/mealMapper';
import { useTranslation } from 'react-i18next';
import ImagePickerCard from '../../components/image-picker/ImagePickerCard ';
import { updateFoodInMeal } from '../../utils/food/food-utils';
import SparklesIcon from '../../../assets/icons/sparkles.svg';
import ProgressBar from '../../components/progress-bar/ProgressBar';
import HearthIcon from '../../../assets/icons/hearth.svg';
import {
  getMealItemComponents,
  removeMealItemComponent,
} from '../../utils/meal-item-components/meal-item-components-utils';
import { useToast } from 'react-native-toast-notifications';
import CloseIcon from '../../../assets/icons/close.svg';
import { IMealItemComponent } from '../../data/meal-item-component/IMealItemComponent';
import { FoodItem } from '../../data/food/FoodItem';

const FoodDetailsScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const route = useRoute<RouteProp<RootTabParamList, 'FoodDetails'>>();
  const { item, mealTypeName } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [mealItem, setMealItem] = useState<FoodItem>(item);

  const [imageUri, setImageUri] = useState<string | undefined>(
    item.imageUri || undefined,
  );

  const [mealComponents, setMealComponents] = useState<IMealItemComponent[]>(
    [],
  );

  useEffect(() => {
    const fetchMealItemComponents = async () => {
      try {
        // Fetch updated item details here if needed
        const mealComponentsData = await getMealItemComponents(mealItem.id);
        setMealComponents(mealComponentsData || []);
      } catch (error) {
        console.error('Error fetching meal item components:', error);
      }
    };

    if (mealItem) {
      fetchMealItemComponents();
    }
  }, [mealItem]);

  const handleAddFoodImage = async (uri: string) => {
    try {
      setIsLoading(true);
      setImageUri(uri);
      await updateFoodInMeal(mealItem.mealId, {
        ...mealItem,
        imageUri: uri,
        updatedAt: new Date(),
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      setImageUri(undefined);
    }
  };

  const handleDeleteMealItemComponent = async (
    component: IMealItemComponent,
  ) => {
    try {
      setIsLoading(true);

      await removeMealItemComponent(component.id, mealItem.id);
      const updatedComponents = mealComponents.filter(
        comp => comp.id !== component.id,
      );
      setMealComponents(updatedComponents);
      setMealItem(prev => ({
        ...prev,
        calories: prev.calories - component.calories,
        protein: prev.protein - component.protein,
        fat: prev.fat - component.fat,
        carbs: prev.carbs - component.carbs,
      }));
      setIsLoading(false);
      toast.show(t('toast.meal_component_deleted_success'), {
        type: 'success',
        textStyle: { color: Green },
        placement: 'bottom',
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.show(t('toast.meal_component_delete_failed'), {
        type: 'danger',
        textStyle: { color: Red },
        placement: 'bottom',
      });
    }
  };

  return (
    <Root>
      <ScrollView showsVerticalScrollIndicator={false}>
        <NavHeader />
        <ImageContainer>
          <ImagePickerCard
            initialUri={imageUri ?? undefined}
            onPicked={handleAddFoodImage}
            openCameraLabel={t('add_food_screen.open_camera')}
            openGalleryLabel={t('add_food_screen.pick_from_gallery')}
            size="large"
            rounded={false}
          />
          {isLoading && (
            <Overlay>
              <ActivityIndicator size={24} color={White} />
            </Overlay>
          )}
        </ImageContainer>

        <Container>
          <IconRow>
            <Title>{mealItem.name}</Title>
            <Spacer direction="horizontal" size="s" />

            {mealItem.aiGenerated && (
              <SparklesIconRow>
                <SparklesIcon width={18} height={18} fill={Green} />
                <Spacer direction="horizontal" size="xxs" />
                <SparklesIconText>AI</SparklesIconText>
              </SparklesIconRow>
            )}
          </IconRow>
          <Spacer direction="vertical" size="xs" />

          <CustomText>{mealItem.description}</CustomText>
          <Spacer direction="vertical" size="xs" />

          <IconRow>
            <IconRow>
              <CutleryIcon width={28} height={28} fill={Gray1} stroke={Gray1} />
              <Spacer direction="horizontal" size="xxs" />
              <CustomText>
                {t(`meals.${mealTypeToString(mealTypeName)}`)}
              </CustomText>
            </IconRow>
            <Spacer direction="horizontal" size="xxl" />
            <IconRow>
              <ClockIcon width={28} height={28} stroke={Gray1} />
              <Spacer direction="horizontal" size="xxs" />
              <CustomText>{format(mealItem.createdAt!, 'HH:mm')}</CustomText>
            </IconRow>
          </IconRow>
          <Spacer direction="vertical" size="xl" />

          <CardsContainer>
            <CardRow>
              <Card>
                <IconRow>
                  <FireIcon width={32} height={32} fill={Blue} />
                  <Spacer direction="horizontal" size="m" />
                  <View>
                    <ValueText>{mealItem.calories}</ValueText>
                    <CustomText>{t('nutrition.calories')}</CustomText>
                  </View>
                </IconRow>
              </Card>
              <Spacer direction="horizontal" size="xl" />
              <Card>
                <IconRow>
                  <MeatIcon width={32} height={32} fill={Green} />
                  <Spacer direction="horizontal" size="m" />
                  <View>
                    <ValueText>{mealItem.protein}</ValueText>
                    <CustomText>{t('nutrition.protein')}</CustomText>
                  </View>
                </IconRow>
              </Card>
            </CardRow>
            <Spacer direction="vertical" size="xl" />
            <CardRow>
              <Card>
                <IconRow>
                  <DripIcon width={32} height={32} fill={Purple} />
                  <Spacer direction="horizontal" size="m" />
                  <View>
                    <ValueText>{mealItem.fat}</ValueText>
                    <CustomText>{t('nutrition.fat')}</CustomText>
                  </View>
                </IconRow>
              </Card>
              <Spacer direction="horizontal" size="xl" />
              <Card>
                <IconRow>
                  <GrainIcon width={32} height={32} fill={Orange} />
                  <Spacer direction="horizontal" size="m" />
                  <View>
                    <ValueText>{mealItem.carbs}</ValueText>
                    <CustomText>{t('nutrition.carbs')}</CustomText>
                  </View>
                </IconRow>
              </Card>
            </CardRow>
          </CardsContainer>
          <Spacer direction="vertical" size="xl" />

          {mealItem.healthLevel && (
            <HealthBarContainer>
              <Row>
                <IconRow>
                  <HealthIconContainer>
                    <HearthIcon width={24} height={24} fill={Red} />
                  </HealthIconContainer>
                  <Spacer direction="horizontal" size="s" />
                  <HealthText>{t('meal_details.health_score')}</HealthText>
                </IconRow>
                <HealthValueText>{mealItem.healthLevel!}/10</HealthValueText>
              </Row>
              <Spacer direction="vertical" size="s" />

              <ProgressBar
                value={mealItem.healthLevel!}
                maxValue={10}
                fillColor={Red}
              />
            </HealthBarContainer>
          )}

          <Spacer direction="vertical" size="xl" />

          <MealComponentsContainer>
            {mealComponents.length > 0 &&
              mealComponents.map(component => (
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
              ))}
          </MealComponentsContainer>
        </Container>
        <Spacer direction="vertical" size="xl" />
      </ScrollView>
    </Root>
  );
};

const Root = styled.View`
  flex: 1;

  background-color: ${Gray7};
`;

const ImageContainer = styled.View`
  width: 100%;
  height: 260px;
  overflow: hidden;
  position: relative;
`;
const Overlay = styled.View`
  position: absolute;
  inset: 0px;
  background-color: rgba(0, 0, 0, 0.45);
  align-items: center;
  justify-content: center;
`;

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const MealComponentsContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  ${HeadingL};
  line-height: 32px;
  font-weight: bold;
`;

const CustomText = styled.Text`
  ${TextMLight};
`;

const ValueText = styled.Text`
  ${HeadingL};
  line-height: 32px;
`;

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CardsContainer = styled.View`
  flex: 1;
`;

const HealthBarContainer = styled.View`
  flex: 1;
  background: ${White};
  padding: 20px;
  border-radius: 16px;
  border: 1px solid ${Gray4};
`;

const HealthIconContainer = styled.View`
  background: ${LightRed};
  border-radius: 8px;
  padding: 8px;
`;

const CardRow = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Card = styled.View`
  flex: 1;
  background-color: ${Gray5};
  border-radius: 16px;
  padding: 20px;
`;

const MealComponentCard = styled.View`
  padding: 8px 16px;
  background-color: ${White};
  border-radius: 16px;
  border: 1px solid ${Gray1};
`;

const SparklesIconRow = styled.View`
  background-color: ${LightGreen};
  padding: 2px 8px;
  border-radius: 16px;
  border: 1px solid ${Green};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const SparklesIconText = styled.Text`
  ${TextS};
  color: ${DarkGreen};
  font-weight: bold;
`;

const HealthText = styled.Text`
  ${TextM};
  font-weight: bold;
`;

const HealthValueText = styled.Text`
  ${TextM};
  font-weight: bold;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

export default FoodDetailsScreen;
