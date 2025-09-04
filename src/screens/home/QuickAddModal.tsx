// src/screens/home/QuickAddModal.tsx
import React, { useState } from 'react';
import Modal from '../../components/modal/Modal';
import { FoodItem } from '../../data/food/FoodItem';
import styled from '../../../styled-components';
import { HeadingM, TextM, TextMLight } from '../../theme/typography';
import { Dark, Gray4, Green } from '../../theme/colors';
import Spacer from '../../components/spacer/Spacer';
import { useTranslation } from 'react-i18next';
import CustomInput from '../../components/input/CustomInput';
import CustomTextArea from '../../components/input/CustomTextArea';
import FadeInView from '../../components/animations/FadeInView';
import i18n from '../../i18n';
import useDate from '../../lib/date/useDate';
import { format } from 'date-fns';
import CustomButton from '../../components/buttons/CustomButton';
import LinearGradient from 'react-native-linear-gradient';
import LightningIcon from '../../../assets/icons/lightning.svg';
import CloseIcon from '../../../assets/icons/close.svg';
import ImagePickerCard from '../../components/image-picker/ImagePickerCard ';
import { Pressable } from 'react-native';

interface QuickAddModalProps {
  visible: boolean;
  mealId: string;
  mealTitle: string;
  loading: boolean;
  onRequestClose: (foodItem?: FoodItem) => void;
}

const QuickAddModal = ({
  visible,
  mealId,
  mealTitle,
  loading,
  onRequestClose,
}: QuickAddModalProps) => {
  const { t } = useTranslation();
  const { selectedDate } = useDate();
  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  const isRtl = i18n.dir() === 'rtl';

  const handleQuickAdd = () => {
    if (foodName.trim() === '') {
      onRequestClose();
      return; // prevent adding empty item
    }

    const newFoodItem: FoodItem = {
      id: Math.random().toString(36).substring(7),
      name: foodName,
      mealId: mealId,
      description: foodDescription,
      calories: nutritionData.calories,
      protein: nutritionData.protein,
      fat: nutritionData.fat,
      carbs: nutritionData.carbs,
      servingSize: '',
      imageUri: imageUri || '', // use picked image
      aiGenerated: false,
    };

    onRequestClose(newFoodItem);

    // Reset form
    setFoodName('');
    setFoodDescription('');
    setNutritionData({ calories: 0, protein: 0, fat: 0, carbs: 0 });
    setImageUri(null);
  };

  return (
    <Modal isHidden visible={visible} onRequestClose={onRequestClose}>
      <Root>
        <FadeInView
          duration={300}
          delay={200}
          direction={isRtl ? 'right' : 'left'}
        >
          <TitleRow>
            <TitleSuffix>{mealTitle}</TitleSuffix>
            <Pressable onPress={() => onRequestClose()}>
              <CloseIcon width={24} height={24} fill={Dark} />
            </Pressable>
          </TitleRow>
        </FadeInView>

        <FadeInView
          duration={300}
          delay={350}
          direction={isRtl ? 'right' : 'left'}
        >
          <Subtitle>{t('quick_add.subtitle')}</Subtitle>
          <Spacer direction="vertical" size="m" />
        </FadeInView>

        <FadeInView duration={300} delay={500} direction="up">
          <Container>
            <CustomInput
              label={t('quick_add.food_name')}
              value={foodName}
              placeholder=""
              onChangeText={setFoodName}
            />
            <Spacer direction="vertical" size="m" />

            <CustomTextArea
              label={t('quick_add.description')}
              value={foodDescription}
              placeholder=""
              onChangeText={setFoodDescription}
            />

            <Spacer direction="vertical" size="m" />

            <CustomInput
              value={format(selectedDate, 'dd/MM/yyyy')}
              label={t('add_food_screen.date')}
              onChangeText={() => null}
            />

            <Spacer direction="vertical" size="m" />

            <Row>
              <CustomInput
                value={nutritionData.calories}
                label={t('add_food_screen.calories')}
                onChangeText={value =>
                  setNutritionData(p => ({ ...p, calories: Number(value) }))
                }
              />
              <Spacer direction="horizontal" size="m" />
              <CustomInput
                value={nutritionData.protein}
                label={t('add_food_screen.protein')}
                onChangeText={value =>
                  setNutritionData(p => ({ ...p, protein: Number(value) }))
                }
              />
            </Row>

            <Spacer direction="vertical" size="xl" />

            <Row>
              <CustomInput
                value={nutritionData.fat || 0}
                label={t('add_food_screen.fat')}
                onChangeText={(text: string) => {
                  // keep only digits, dot and comma; normalize comma -> dot
                  const cleaned = text
                    .replace(/[^\d.,-]/g, '')
                    .replace(',', '.');
                  const n = parseFloat(cleaned);

                  if (Number.isFinite(n)) {
                    setNutritionData(p => ({ ...p, fat: n }));
                  } else if (text === '') {
                    // empty -> treat as 0 (or skip if you prefer keeping last value)
                    setNutritionData(p => ({ ...p, fat: 0 }));
                  }
                  // if user types pure text => ignore update (prevents NaN)
                }}
              />
              <Spacer direction="horizontal" size="m" />
              <CustomInput
                value={nutritionData.carbs}
                label={t('add_food_screen.carbs')}
                onChangeText={value =>
                  setNutritionData(p => ({ ...p, carbs: Number(value) }))
                }
              />
            </Row>

            <Spacer direction="vertical" size="m" />

            {/* ----- Simple image picker (no AI) ----- */}
            <ImagePickerCard
              initialUri={imageUri ?? undefined}
              onPicked={uri => setImageUri(uri)}
              title={t('quick_add.add_image')}
              subtitle={t('add_food_screen.pick_from_gallery')}
              openCameraLabel={t('add_food_screen.open_camera')}
              openGalleryLabel={t('add_food_screen.pick_from_gallery')}
            />

            <Spacer direction="vertical" size="xl" />

            <CustomButton
              label={t('add_food_screen.quick_add')}
              backgroundColor={Green}
              startIcon={LightningIcon}
              loading={loading}
              onPress={handleQuickAdd}
            />
            <Spacer direction="vertical" size="xl" />
          </Container>
        </FadeInView>
      </Root>
    </Modal>
  );
};

const Root = styled.View`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
`;

const TitleSuffix = styled.Text`
  ${HeadingM};
  font-size: 24px;
  font-weight: bold;
  color: ${Green};
`;

const Subtitle = styled.Text`
  ${TextMLight};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;
const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export default QuickAddModal;
