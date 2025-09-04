import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable } from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Spacer from '../spacer/Spacer';
import CameraIcon from '../../../assets/icons/camera.svg';
import { TextM, TextS } from '../../theme/typography';
import { Dark, Gray1, Gray4, Green, White } from '../../theme/colors';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import PlusIcon from '../../../assets/icons/plus.svg';
import { useTranslation } from 'react-i18next';
import Modal from '../modal/Modal';
import CustomButton from '../buttons/CustomButton';

interface ImagePickerCard {
  onPicked: (uri: string, asset?: Asset) => void;
  initialUri?: string;
  title?: string;
  subtitle?: string;
  openCameraLabel?: string;
  openGalleryLabel?: string;
}

const ImagePickerCard = ({
  onPicked,
  initialUri,
  title = 'Add a photo',
  subtitle = 'Take a picture or choose from gallery',
  openCameraLabel = 'Open Camera',
  openGalleryLabel = 'Pick from Gallery',
}: ImagePickerCard) => {
  const [imageUri, setImageUri] = useState<string | undefined>(initialUri);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleOpenCamera = useCallback(async () => {
    setIsLoading(true);
    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: false, // no AI, keep it light
      quality: 0.85,
      cameraType: 'back',
    };
    const res = await launchCamera(options);
    const a = res.assets?.[0];
    setVisible(false);
    setIsLoading(false);

    if (!a?.uri) return;
    setImageUri(a.uri);
    onPicked(a.uri, a);
  }, [onPicked]);

  const handlePickFromGallery = useCallback(async () => {
    setIsLoading(true);

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      selectionLimit: 1,
      quality: 0.85,
    };
    const res = await launchImageLibrary(options);
    const a = res.assets?.[0];
    setVisible(false);

    if (!a?.uri) return;
    setImageUri(a.uri);
    onPicked(a.uri, a);
    setIsLoading(false);
  }, [onPicked]);

  return (
    <Card>
      <Modal visible={visible} onRequestClose={() => setVisible(false)}>
        <CustomButton
          label={openCameraLabel}
          onPress={() => {
            handleOpenCamera();
            setVisible(false);
          }}
        />

        <Spacer direction="vertical" size="s" />
        <CustomButton
          label={openGalleryLabel}
          onPress={() => {
            handlePickFromGallery();
            setVisible(false);
          }}
        />
      </Modal>

      <Row>
        <IconBox>
          <CameraIcon width={24} height={24} />
        </IconBox>
        <Spacer direction="horizontal" size="xs" />
        <AddImageLabel>{t('quick_add.add_image')}</AddImageLabel>
      </Row>
      <Spacer direction="vertical" size="s" />

      <Pressable
        onPress={() => {
          setVisible(true);
        }}
      >
        <PlusIconContainer>
          <PlusIcon width={24} height={24} fill={Green} />
        </PlusIconContainer>
      </Pressable>

      {imageUri && (
        <>
          <Spacer direction="vertical" size="m" />
          {isLoading ? (
            <ActivityIndicator size={24} color={Dark} />
          ) : (
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: 200, borderRadius: 16 }}
              resizeMode="cover"
            />
          )}
        </>
      )}
    </Card>
  );
};

const Card = styled.View`
  width: 100%;

  background-color: ${White};
  border-radius: 32px;
`;

const IconBox = styled(LinearGradient).attrs({
  colors: ['#34D399', '#8bcdb7'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  width: 32px;
  height: 32px;
  border-radius: 8px;
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

const AddImageLabel = styled.Text`
  ${TextM};
`;
const PlusIconContainer = styled.View`
  width: 100%;
  padding: 12px;
  border-radius: 16px;
  border-width: 2px;
  border-color: ${Gray4};
  align-items: center;
  justify-content: center;
`;
export default ImagePickerCard;
