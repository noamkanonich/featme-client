// components/modals/LogoutModal.tsx
import React from 'react';

import { useTranslation } from 'react-i18next';
import Modal from '../modal/Modal';
import styled from '../../../styled-components';
import CustomButton from '../buttons/CustomButton';
import { Gray1, Gray4, LightRed, Red } from '../../theme/colors';
import Spacer from '../spacer/Spacer';
import { TextL, TextMLight } from '../../theme/typography';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal visible={isOpen} onRequestClose={onClose}>
      <Content>
        <Header>
          <Title>{t('logout_modal.title')}</Title>
          <Spacer direction="vertical" size="s" />
          <Subtitle>{t('logout_modal.subtitle')}</Subtitle>
        </Header>
        <Spacer direction="vertical" size="m" />

        <Footer>
          <ButtonContainer>
            <CustomButton
              label={t('logout_modal.cancel')}
              backgroundColor={Gray4}
              color={Gray1}
              onPress={onClose}
            />
          </ButtonContainer>
          <Spacer direction="horizontal" size="m" />
          <ButtonContainer>
            <CustomButton
              label={t('logout_modal.logout')}
              backgroundColor={LightRed}
              color={Red}
              onPress={onConfirm}
            />
          </ButtonContainer>
        </Footer>
      </Content>
    </Modal>
  );
};

const Content = styled.View`
  background-color: white;

  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const Header = styled.View`
  margin-bottom: 20px;
`;
const Title = styled.Text`
  ${TextL};
  font-weight: bold;
`;
const Subtitle = styled.Text`
  ${TextMLight};
`;

const Footer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ButtonContainer = styled.View`
  flex: 1;
`;

export default LogoutModal;
