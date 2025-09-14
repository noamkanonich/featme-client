import React, { useMemo, useState } from 'react';
import styled from 'styled-components/native';
import MealCard from './MealCard';
import Spacer from '../spacer/Spacer';
import { TextM, TextS } from '../../theme/typography';
import { ActivityIndicator } from 'react-native';
import ChevronUpIcon from '../../../assets/icons/chevron-up.svg';
import ChevronDownIcon from '../../../assets/icons/chevron-down.svg';
import { Dark, Gray5, Green, White } from '../../theme/colors';
import FadeInView from '../animations/FadeInView';
import { useTranslation } from 'react-i18next';
import { IMeal } from '../../data/meals/IMeal';
import { FoodItem } from '../../data/food/FoodItem';
import PlusIcon from '../../../assets/icons/plus.svg';
import { MealType } from '../../data/meals/MealType';
import { mealTypeFromString } from './utils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList } from '../../lib/routes/tab-navigator/TabNavigator';
import QuickAddModal from '../../screens/home/QuickAddModal';
import { addFoodToMeal } from '../../utils/food/food-utils';
import useDate from '../../lib/date/useDate';
import useUserData from '../../lib/user-data/useUserData';
import { useToast } from 'react-native-toast-notifications';
import { addFoodItemToMeal } from '../../utils/food/food-utils-new';

interface IMealList {
  meals: IMeal[];
  loading?: boolean;
  onPressItem: (id: string) => void;
  onUpdateItem: (item: FoodItem, mealId: string) => void;
  onDeleteItem: (id: string, mealId: string) => void;
  onToggleFavorite?: (foodItem: FoodItem) => void;
  onQuickAddPress: () => void;
}

const ORDER: Array<{
  type: MealType;
  key: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  emoji: string;
}> = [
  { type: MealType.Breakfast, key: 'breakfast', emoji: '🌅' },
  { type: MealType.Lunch, key: 'lunch', emoji: '🌞' },
  { type: MealType.Dinner, key: 'dinner', emoji: '🌙' },
  { type: MealType.Snack, key: 'snack', emoji: '🍎' },
  { type: MealType.Other, key: 'other', emoji: '🍽️' },
];

const MealsList = ({
  meals,
  loading,
  onPressItem,
  onUpdateItem,
  onDeleteItem,
  onToggleFavorite,
  onQuickAddPress,
}: IMealList) => {
  const toast = useToast();
  const { t } = useTranslation();
  const { refreshData } = useUserData();
  const { selectedDate } = useDate();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootTabParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});
  const [activeModal, setActiveModal] = useState<{
    mealId: string;
    title: string;
  } | null>(null);

  const sections = useMemo(() => {
    return ORDER.map(({ type, key, emoji }) => {
      const meal = meals.find(
        m =>
          (mealTypeFromString(m.mealType as string) ?? MealType.Other) === type,
      );
      return {
        type,
        key,
        emoji,
        items: meal?.foodItems ?? [],
        mealId: meal?.id ?? '', // אם אין — ישאר ריק; עדיין נפתח מודל אם תרצה ליצור שם ארוחה
        title: t(`meals.${key}`, key),
      };
    });
  }, [meals, t]);

  const handlePressItem = (item: FoodItem, mealType: string) => {
    navigation.navigate('FoodDetails', {
      item,
      mealTypeName: mealType,
    });
  };

  const handleAddFoodToMeal = async (mealId: string, foodItem?: FoodItem) => {
    if (!foodItem) {
      setActiveModal(null);
      return;
    }
    try {
      setIsLoading(true);
      // await addFoodToMeal(mealId, foodItem, selectedDate);
      await addFoodItemToMeal(mealId, foodItem, selectedDate);
      await refreshData();
      onQuickAddPress();
      setIsLoading(false);
      toast.show(t('toast.food_added'), {
        type: 'success',
        placement: 'bottom',
        textStyle: { color: Dark },
      });

      setActiveModal(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Wrap>
      <QuickAddModal
        visible={!!activeModal}
        mealId={activeModal?.mealId ?? ''}
        mealTitle={activeModal?.title ?? ''}
        loading={isLoading}
        onRequestClose={(foodItem?: FoodItem) => {
          handleAddFoodToMeal(activeModal!.mealId, foodItem);
        }}
      />

      {loading ? (
        <ActivityIndicator size={24} color={Dark} />
      ) : (
        sections.map(({ type, key, emoji, items, mealId, title }) => {
          const isOpen = openMap[type] ?? true;
          const ChevronIcon = isOpen ? ChevronDownIcon : ChevronUpIcon;

          return (
            <Section key={String(type)}>
              <Header>
                <HeaderLeft
                  onPress={() =>
                    setOpenMap(prev => ({
                      ...prev,
                      [type]: !(prev[type] ?? true),
                    }))
                  }
                >
                  <ChevronIcon width={24} height={24} fill={Dark} />
                  {/* <Spacer direction="horizontal" size="xxs" />
                  <HeaderEmoji>{emoji}</HeaderEmoji> */}
                  <Spacer direction="horizontal" size="xxs" />
                  <HeaderTitle>{title}</HeaderTitle>
                  <Spacer direction="horizontal" size="xxs" />
                  <HeaderCount>({items.length})</HeaderCount>
                </HeaderLeft>

                {/* ⇩⇩⇩ כפתור Quick Add נפרד — פותח מודל עם ה-id של אותה ארוחה */}
                <QuickAddButton
                  onPress={() => {
                    setActiveModal({ mealId, title });
                  }}
                >
                  <QuickAddRow>
                    <QuickAddIconContainer>
                      <PlusIcon
                        width={16}
                        height={16}
                        fill={Green}
                        stroke={Green}
                      />
                    </QuickAddIconContainer>
                    <Spacer direction="horizontal" size="xs" />
                    <QuickAddText>
                      {t('button.quick_add', 'Quick Add')}
                    </QuickAddText>
                  </QuickAddRow>
                </QuickAddButton>
              </Header>

              <Spacer direction="vertical" size="s" />

              {items.length === 0 ? (
                <EmptyCard>
                  <EmptyTitle>
                    {t('meals.empty_title', { meal: title })}
                  </EmptyTitle>
                  <EmptySub>{t('meals.tap_plus')}</EmptySub>
                </EmptyCard>
              ) : (
                isOpen &&
                items.map((e, idx) => (
                  <FadeInView
                    direction="down"
                    distance={30}
                    key={e.id}
                    delay={(idx + 1) * 120}
                  >
                    <CardWrap>
                      <MealCard
                        key={idx}
                        entry={e as any}
                        mealType={type}
                        onPress={() => handlePressItem(e, String(type))}
                        onUpdate={onUpdateItem}
                        onDelete={onDeleteItem}
                        onToggleFavorite={onToggleFavorite}
                      />
                      <Spacer direction="vertical" size="s" />
                    </CardWrap>
                  </FadeInView>
                ))
              )}

              <Spacer direction="vertical" size="xxs" />
            </Section>
          );
        })
      )}
    </Wrap>
  );
};

/* -------- styles -------- */
const Wrap = styled.View`
  gap: 18px;
`;

const Section = styled.View``;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const HeaderLeft = styled.Pressable`
  flex-direction: row;
  align-items: center;
  flex-shrink: 1;
`;

const HeaderEmoji = styled.Text`
  font-size: 16px;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
`;

const HeaderCount = styled.Text`
  font-size: 16px;
  color: #6b7280;
`;

const CardWrap = styled.View``;

const EmptyCard = styled.View`
  margin-top: 8px;
  background-color: ${White};
  border-radius: 18px;
  padding: 20px;
  border-width: 1px;
  border-color: ${Gray5};
  align-items: center;
  justify-content: center;
`;

const EmptyTitle = styled.Text`
  ${TextM};
  font-size: 14px;
  font-weight: 700;
  color: #6b7280;
`;

const EmptySub = styled.Text`
  margin-top: 6px;
  font-size: 13px;
  color: #9ca3af;
`;

const QuickAddButton = styled.Pressable`
  padding: 6px 12px;
  border-radius: 12px;
`;

const QuickAddRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const QuickAddIconContainer = styled.View`
  width: 18px;
  height: 18px;
  border-radius: 16px;
  padding: 4px;
  border: 1.5px solid ${Green};
  align-items: center;
  justify-content: center;
`;

const QuickAddText = styled.Text`
  ${TextS};
  color: ${Green};
  font-weight: 800;
`;

export default MealsList;
