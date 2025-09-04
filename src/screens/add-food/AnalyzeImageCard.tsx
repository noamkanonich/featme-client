// src/screens/add-food/AnalyzeImageCard.tsx
import React, { useCallback, useState } from 'react';
import {
  View,
  Pressable,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from '../../../styled-components';
import Spacer from '../../components/spacer/Spacer';
import CameraIcon from '../../../assets/icons/camera.svg';
import AnalyzeIcon from '../../../assets/icons/analyze.svg';
import { TextM, TextS } from '../../theme/typography';
import { Gray1, Gray4, White } from '../../theme/colors';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';

import { requestCameraPermission } from './utils';
import { useTranslation } from 'react-i18next';
import { analyzeImageWithGroq } from './groq';

interface IAnalyzeImageCard {
  language: string;
  apiKey: string;
  onResult: (result: any, imageUri: string) => void;
}

const AnalyzeImageCard = ({
  language,
  apiKey,
  onResult,
}: IAnalyzeImageCard) => {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleAnalyzeDataUrl = useCallback(
    async (dataUrl: string, uriForPreview: string) => {
      setBusy(true);
      try {
        const lang = language === 'he' ? 'Hebrew' : 'English';
        const result = await analyzeImageWithGroq(dataUrl, apiKey, lang);
        onResult(result, uriForPreview);
      } catch (e) {
        console.log('Groq vision failed', e);
      } finally {
        setBusy(false);
      }
    },
    [apiKey, language, onResult],
  );

  const handleOpenCamera = useCallback(async () => {
    console.log('Opening camera');
    const granted = await requestCameraPermission();
    if (!granted) return;

    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.85,
      cameraType: 'back',
    };
    const res = await launchCamera(options);
    const a = res.assets?.[0];
    if (!a?.uri || !a.base64) return;

    const ext = a.type?.split('/')[1] ?? 'jpeg';
    const dataUrl = `data:image/${ext};base64,${a.base64}`;
    setImageUri(a.uri);
    await handleAnalyzeDataUrl(dataUrl, a.uri);
  }, [handleAnalyzeDataUrl]);

  const handlePickFromGallery = useCallback(async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      selectionLimit: 1,
      quality: 0.85,
    };
    const res = await launchImageLibrary(options);
    const a = res.assets?.[0];
    if (!a?.uri || !a.base64) return;

    const ext = a.type?.split('/')[1] ?? 'jpeg';
    const dataUrl = `data:image/${ext};base64,${a.base64}`;
    setImageUri(a.uri);
    await handleAnalyzeDataUrl(dataUrl, a.uri);
  }, [handleAnalyzeDataUrl]);

  return (
    <Card>
      <IconBox>
        <CameraIcon width={38} height={38} />
      </IconBox>

      <Spacer direction="vertical" size="xl" />
      <CardTitle>{t('add_food_screen.scan_with_camera_title')}</CardTitle>
      <CardSubtitle>
        {t('add_food_screen.scan_with_camera_subtitle')}
      </CardSubtitle>
      <Spacer direction="vertical" size="s" />

      <Row>
        <Pressable onPress={handleOpenCamera}>
          <Pill>
            <PillLabel>{t('add_food_screen.open_camera')}</PillLabel>
          </Pill>
        </Pressable>
        <Spacer direction="horizontal" size="m" />
        <Pressable onPress={handlePickFromGallery}>
          <Pill>
            <PillLabel>{t('add_food_screen.pick_from_gallery')}</PillLabel>
          </Pill>
        </Pressable>
      </Row>

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

      <Spacer direction="vertical" size="m" />
      {busy && <ActivityIndicator size="small" color={White} />}
    </Card>
  );
};

const Card = styled.View`
  width: 100%;
  padding: 20px;
  background-color: ${White};
  border-radius: 32px;
  align-items: center;
  shadow-color: ${Gray1};
  shadow-radius: 2px;
  shadow-offset: 0px 8px;
`;

const IconBox = styled(LinearGradient).attrs({
  colors: ['#34D399', '#8bcdb7'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  width: 75px;
  height: 75px;
  border-radius: 16px;
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

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Pill = styled(LinearGradient).attrs({
  colors: ['#34D399', '#8bcdb7'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  padding: 12px 24px;
  border-radius: 9999px;
  align-items: center;
  justify-content: center;
`;

const PillLabel = styled.Text`
  ${TextS};
  color: ${White};
`;

export default AnalyzeImageCard;
