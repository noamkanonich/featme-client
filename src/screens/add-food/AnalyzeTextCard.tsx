// src/screens/add-food/AnalyzeTextCard.tsx
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import styled from '../../../styled-components';
import Spacer from '../../components/spacer/Spacer';
import TextIcon from '../../../assets/icons/text.svg';
import AnalyzeIcon from '../../../assets/icons/analyze.svg';
import CustomTextArea from '../../components/input/CustomTextArea';

import { TextM, TextS } from '../../theme/typography';
import { Blue, Gray1, White } from '../../theme/colors';
import { useTranslation } from 'react-i18next';
import { analyzeTextWithGroq } from './groq';

interface IAnalyzeTextCard {
  language: string;
  apiKey: string;
  onResult: (result: any) => void;
}

const AnalyzeTextCard = ({ language, apiKey, onResult }: IAnalyzeTextCard) => {
  const { t } = useTranslation();
  const [textValue, setTextValue] = useState('');
  const [busy, setBusy] = useState(false);

  const handleAnalyze = async () => {
    if (!textValue.trim()) return;
    setBusy(true);
    try {
      const result = await analyzeTextWithGroq(textValue, apiKey, language);
      console.log(result);
      onResult(result);
      setTextValue('');
    } catch (e) {
      console.log('Groq text failed', e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <Row>
        <TitleIconBox>
          <TextIcon width={28} height={28} />
        </TitleIconBox>
        <Spacer direction="horizontal" size="s" />
        <View>
          <CardTitle>{t('add_food_screen.describe_food_title')}</CardTitle>
          <CardSubtitle>
            {t('add_food_screen.describe_food_subtitle')}
          </CardSubtitle>
        </View>
      </Row>

      <Spacer direction="vertical" size="xl" />
      <CustomTextArea
        value={textValue}
        onChangeText={setTextValue}
        placeholder={t('add_food_screen.text_input_placeholder')}
      />
      <Spacer direction="vertical" size="xl" />

      <AnalyzeButton disabled={!textValue.trim()}>
        {busy ? (
          <ActivityIndicator size={24} color={White} />
        ) : (
          <Pressable onPress={handleAnalyze} disabled={!textValue.trim()}>
            <Row>
              <AnalyzeIcon width={32} height={32} stroke={White} />
              <Spacer direction="horizontal" size="s" />
              <AnalyzeLabel>{t('add_food_screen.analyze_food')}</AnalyzeLabel>
            </Row>
          </Pressable>
        )}
      </AnalyzeButton>
    </Card>
  );
};

const Card = styled.View`
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 32px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TitleIconBox = styled.View`
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background-color: #dbeafe;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.Text`
  ${TextM};
`;

const CardSubtitle = styled.Text`
  ${TextS};
  color: ${Gray1};
`;

const AnalyzeButton = styled.View<{ disabled?: boolean }>`
  width: 100%;
  opacity: ${({ disabled }: { disabled?: boolean }) => (disabled ? 0.5 : 1)};
  background-color: ${Blue};
  padding: 12px 24px;
  border-radius: 32px;
  align-items: center;
  justify-content: center;
`;

const AnalyzeLabel = styled.Text`
  ${TextM};
  color: ${White};
`;

export default AnalyzeTextCard;
