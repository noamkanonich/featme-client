import React, { useEffect, useRef, useState } from 'react';
import { Image, ViewStyle, Animated, Easing, View } from 'react-native';
import styled from 'styled-components/native';
import { TextL, TextM, TextS, TextSLight } from '../../theme/typography';
import { FoodItem } from '../../data/food/FoodItem';
import { MEAL_BADGE } from './utils';
import { MealType } from '../../data/meals/MealType';
import MainSliderCard from '../cards/slide-card/MainSliderCard';
import { useTranslation } from 'react-i18next';
import StarIcon from '../../../assets/icons/star.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import { Gray1, Green, White, Yellow } from '../../theme/colors';
import Spacer from '../spacer/Spacer';
import SparklesIcon from '../../../assets/icons/sparkles.svg';
import UpdateFoodModal from '../../screens/home/UpdateFoodModal';

interface IFoodCard {
  entry: FoodItem;
  mealType: MealType;
  style?: ViewStyle;
  onPress: (id: string) => void;
  onUpdate: (updatedFoodItem: Partial<FoodItem>, mealId: string) => void;
  onDelete: (id: string, mealId: string) => void;
  onToggleFavorite?: (foodItem: FoodItem) => void;
}

const formatTime = (t?: Date | string) => {
  if (!t) return '';
  const d = typeof t === 'string' ? new Date(t) : t;
  try {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const FoodCard = ({
  entry,
  mealType,
  onPress,
  onUpdate,
  onDelete,
  onToggleFavorite,
}: IFoodCard) => {
  const { t } = useTranslation();
  const meal = MEAL_BADGE[mealType];
  const time = formatTime(entry.createdAt);
  const [isFavorite, setIsFavorite] = useState(entry.isFavorite);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const spinV = useRef(new Animated.Value(0)).current;
  const spin = spinV.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '20deg'],
  });

  const pop = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 110,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(spinV, {
          toValue: 1,
          duration: 110,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(spinV, {
          toValue: 0,
          duration: 110,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  useEffect(() => {
    if (entry.isFavorite) pop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.isFavorite]);

  const handleUpdateItem = (updatedFoodItem: Partial<FoodItem>) => {
    onUpdate(updatedFoodItem, entry.mealId);
  };

  const handleDeleteItem = () => onDelete(entry.id, entry.mealId);

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite({ ...entry, isFavorite: !isFavorite });
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <MainSliderCard
      onUpdate={() => {
        setIsUpdateVisible(true);
      }}
      onDelete={handleDeleteItem}
      onPress={onPress}
    >
      <UpdateFoodModal
        visible={isUpdateVisible}
        onUpdate={handleUpdateItem}
        onRequestClose={() => {
          setIsUpdateVisible(false);
        }}
      />
      <Container>
        <Left>
          <Thumb>
            {entry.imageUri ? (
              <Image
                source={{ uri: entry.imageUri }}
                style={{ width: '100%', height: '100%', borderRadius: 16 }}
              />
            ) : (
              <ThumbEmoji>{meal.emoji}</ThumbEmoji>
            )}
          </Thumb>
        </Left>

        <Mid>
          <TitleRow>
            <TitleContainer>
              <IconRow>
                <Title numberOfLines={1}>{entry.name}</Title>
                {entry.aiGenerated && (
                  <>
                    <Spacer direction="horizontal" size="xs" />
                    <SparklesIcon width={18} height={18} fill={Green} />
                  </>
                )}
              </IconRow>
            </TitleContainer>
            {onToggleFavorite && (
              <Action
                onPress={() => {
                  pop();
                  handleToggleFavorite();
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Animated.View
                  style={{ transform: [{ scale }, { rotate: spin }] }}
                >
                  <StarIcon
                    width={20}
                    height={20}
                    fill={isFavorite ? Yellow : White}
                    stroke={Yellow}
                  />
                </Animated.View>
              </Action>
            )}
          </TitleRow>

          <MetaRow>
            <Badge style={{ backgroundColor: meal.bg }}>
              <BadgeText style={{ color: meal.fg }}>{meal.label}</BadgeText>
            </Badge>
            {!!time && (
              <Meta>
                <ClockIcon width={16} height={16} stroke={Gray1} />
                <MetaText>{time}</MetaText>
              </Meta>
            )}
          </MetaRow>

          <Spacer direction="vertical" size="xs" />

          <StatsRow>
            <Stat>
              <StatVal>{entry.calories}</StatVal>
              <StatLabel>{t('meal_item.calories')}</StatLabel>
            </Stat>
            <Stat>
              <StatVal style={{ color: '#16a34a' }}>{entry.protein}g</StatVal>
              <StatLabel>{t('meal_item.protein')}</StatLabel>
            </Stat>
            <Stat>
              <StatVal style={{ color: '#2563eb' }}>{entry.fat}g</StatVal>
              <StatLabel>{t('meal_item.fat')}</StatLabel>
            </Stat>
            <Stat>
              <StatVal style={{ color: '#7c3aed' }}>{entry.carbs}g</StatVal>
              <StatLabel>{t('meal_item.carbs')}</StatLabel>
            </Stat>
          </StatsRow>
        </Mid>
      </Container>
    </MainSliderCard>
  );
};

/* -------- styles -------- */
const Container = styled.View`
  flex-direction: row;
`;

const Left = styled.View`
  margin-right: 12px;
`;

const Thumb = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background-color: #f3f4f6;
  align-items: center;
  justify-content: center;
`;

const ThumbEmoji = styled.Text`
  font-size: 18px;
`;

const TitleContainer = styled.View`
  flex: 1;
`;

const Mid = styled.View`
  flex: 1;
`;

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  flex: 1;
  ${TextL};
  line-height: 26px;
  font-weight: bold;
`;

const Action = styled.Pressable`
  padding-left: 8px;
`;

const MetaRow = styled.View`
  margin-top: 4px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const Badge = styled.View`
  padding: 4px 8px;
  border-radius: 999px;
`;

const BadgeText = styled.Text`
  ${TextS}
  font-weight: 700;
`;

const Meta = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const MetaText = styled.Text`
  ${TextS}
  font-size: 12px;
  color: #475569;
`;

const StatsRow = styled.View`
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 260px;
`;

const Stat = styled.View`
  align-items: center;
`;

const StatVal = styled.Text`
  ${TextM};
  font-weight: bold;
`;

const StatLabel = styled.Text`
  ${TextSLight};
`;

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export default FoodCard;
