import React, { useCallback, useState } from 'react';
import { Image, Pressable } from 'react-native';
import styled, { css } from 'styled-components/native';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import Spacer from '../spacer/Spacer';
import Modal from '../modal/Modal';
import CustomButton from '../buttons/CustomButton';
import PlusIcon from '../../../assets/icons/plus.svg';
import { Gray4, Green } from '../../theme/colors';

type ButtonSize = 'large' | 'medium';

interface ImagePickerCardProps {
  onPicked: (uri: string, asset?: Asset) => void;
  initialUri?: string;
  openCameraLabel?: string;
  openGalleryLabel?: string;
  size?: ButtonSize;
  rounded?: boolean;
}

const ImagePickerCard = ({
  onPicked,
  initialUri,
  openCameraLabel = 'Open Camera',
  openGalleryLabel = 'Pick from Gallery',
  size = 'medium',
  rounded = true,
}: ImagePickerCardProps) => {
  const [imageUri, setImageUri] = useState<string | undefined>(initialUri);
  const [visible, setVisible] = useState(false);

  console.log(rounded);

  const handleOpenCamera = useCallback(async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.85,
      cameraType: 'back',
    };
    const res = await launchCamera(options);
    const a = res.assets?.[0];
    setVisible(false);
    if (!a?.uri) return;
    setImageUri(a.uri);
    onPicked(a.uri, a);
  }, [onPicked]);

  const handlePickFromGallery = useCallback(async () => {
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
  }, [onPicked]);

  return (
    <Root>
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

      <Pressable
        onPress={() => setVisible(true)}
        style={{ width: '100%', height: '100%' }}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <EmptyCenter>
            <PlusButton size={size} rounded={rounded}>
              <PlusIcon
                width={size === 'large' ? 36 : 28}
                height={size === 'large' ? 36 : 28}
                fill={Green}
              />
            </PlusButton>
          </EmptyCenter>
        )}
      </Pressable>
    </Root>
  );
};

export default ImagePickerCard;

/* ===== styles ===== */

const Root = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
`;

const EmptyCenter = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const PlusButton = styled.View<{ size: ButtonSize; rounded: boolean }>`
  border-width: 2px;
  border-color: ${Gray4};
  align-items: center;
  justify-content: center;

  ${({ size, rounded }) =>
    size === 'large'
      ? css`
          width: 120px;
          height: 120px;
          border-radius: ${rounded ? '24px' : '0px'};
        `
      : css`
          width: 100%;
          height: 100%;
          border-radius: ${rounded ? '16px' : '0px'};
        `}
`;
