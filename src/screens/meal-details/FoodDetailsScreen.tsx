import { View, Text, Image, ScrollView } from 'react-native';
import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootTabParamList } from '../../lib/routes/tab-navigator/TabNavigator';
import {
  Blue,
  Gray1,
  Gray5,
  Gray7,
  Green,
  Orange,
  Purple,
} from '../../theme/colors';
import styled from '../../../styled-components';
import Spacer from '../../components/spacer/Spacer';
import { HeadingL, HeadingM, TextMLight } from '../../theme/typography';
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

const FoodDetailsScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<RootTabParamList, 'FoodDetails'>>();

  const { item, mealTypeName } = route.params;
  console.log(item);
  return (
    <Root>
      <ScrollView showsVerticalScrollIndicator={false}>
        <NavHeader />
        <ImageContainer>
          {item.imageUri ? (
            <Image
              source={{ uri: item.imageUri }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
            />
          ) : (
            <NoImageContainer>
              <Text>No Image</Text>
            </NoImageContainer>
          )}
        </ImageContainer>
        <Container>
          <Title>{item.name}</Title>

          <CustomText>{item.description}</CustomText>

          <Spacer direction="vertical" size="s" />
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
              <CustomText>{format(item.createdAt!, 'HH:mm')}</CustomText>
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
                    <ValueText>{item.calories}</ValueText>
                    <CustomText>Calories</CustomText>
                  </View>
                </IconRow>
              </Card>
              <Spacer direction="horizontal" size="xl" />
              <Card>
                <IconRow>
                  <MeatIcon width={32} height={32} fill={Green} />
                  <Spacer direction="horizontal" size="m" />
                  <View>
                    <ValueText>{item.protein}</ValueText>
                    <CustomText>Protein</CustomText>
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
                    <ValueText>{item.fat}</ValueText>
                    <CustomText>Fat</CustomText>
                  </View>
                </IconRow>
              </Card>
              <Spacer direction="horizontal" size="xl" />
              <Card>
                <IconRow>
                  <GrainIcon width={32} height={32} fill={Orange} />
                  <Spacer direction="horizontal" size="m" />
                  <View>
                    <ValueText>{item.carbs}</ValueText>
                    <CustomText>Carbs</CustomText>
                  </View>
                </IconRow>
              </Card>
            </CardRow>
          </CardsContainer>
        </Container>
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
`;

const NoImageContainer = styled.View`
  width: 100%;
  height: 260px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Title = styled.Text`
  ${HeadingM};
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

export default FoodDetailsScreen;
