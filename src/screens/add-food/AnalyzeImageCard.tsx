// src/screens/add-food/AnalyzeImageCard.tsx
import React, { useCallback, useState } from 'react';
import { Pressable, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from '../../../styled-components';
import Spacer from '../../components/spacer/Spacer';
import CameraIcon from '../../../assets/icons/camera.svg';
import { TextM, TextS } from '../../theme/typography';
import { Gray1, White } from '../../theme/colors';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { requestCameraPermission } from './utils';
import { useTranslation } from 'react-i18next';
import { analyzeImageWithGroq } from './groq';
import i18n from '../../i18n';
import CustomButton from '../../components/buttons/CustomButton';

interface IAnalyzeImageCard {
  language: string;
  apiKey: string;
  onResult: (result: any, imageUri: string) => void;
}

const AnalyzeImageCard = ({ apiKey, onResult }: IAnalyzeImageCard) => {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyzeDataUrl = useCallback(
    async (dataUrl: string, uriForPreview: string) => {
      setBusy(true);
      try {
        setIsLoading(true);
        const result = await analyzeImageWithGroq(
          dataUrl,
          apiKey,
          i18n.language,
        );
        onResult(result, uriForPreview);
      } catch (e) {
        console.log('Groq vision failed', e);
      } finally {
        setIsLoading(false);
        setBusy(false);
      }
    },
    [apiKey, onResult],
  );

  const handleOpenCamera = useCallback(async () => {
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
        <ButtonContainer>
          <CustomButton
            label={t('add_food_screen.open_camera')}
            onPress={handleOpenCamera}
          />
        </ButtonContainer>
        <Spacer direction="horizontal" size="m" />
        <ButtonContainer>
          <CustomButton
            label={t('add_food_screen.pick_from_gallery')}
            onPress={handlePickFromGallery}
          />
        </ButtonContainer>
      </Row>

      {/* Preview with loading overlay */}
      {imageUri && (
        <>
          <Spacer direction="vertical" size="m" />
          <ImageContainer>
            <StyledImage source={{ uri: imageUri }} resizeMode="cover" />
            {isLoading && (
              <Overlay>
                <ActivityIndicator size="large" color={White} />
              </Overlay>
            )}
          </ImageContainer>
        </>
      )}

      {/* Optional small spinner for async state outside the image */}
      {!imageUri && isLoading && (
        <>
          <Spacer direction="vertical" size="m" />
          <ImagePlaceholder>
            <Overlay>
              <ActivityIndicator size="large" color={White} />
            </Overlay>
          </ImagePlaceholder>
        </>
      )}

      {/* <Spacer direction="vertical" size="m" /> */}
      {/* {busy && <ActivityIndicator size="small" color={Dark} />} */}
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
  ${TextM};
  color: ${White};
`;

/* ---- New styles for image + loading overlay ---- */
const ImageContainer = styled.View`
  width: 100%;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const Overlay = styled.View`
  position: absolute;
  inset: 0px;
  background-color: rgba(0, 0, 0, 0.45);
  align-items: center;
  justify-content: center;
`;

const ImagePlaceholder = styled(ImageContainer)`
  background-color: #000; /* dark backdrop while loading with no image yet */
`;

const ButtonContainer = styled.View`
  flex: 1;
`;

export default AnalyzeImageCard;
