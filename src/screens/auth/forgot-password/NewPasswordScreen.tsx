import React from 'react';
import { useTranslation } from 'react-i18next';
import { Gray1, White } from '../../../theme/colors';
import { HeadingM, TextM } from '../../../theme/typography';
import Spacer from '../../../components/spacer/Spacer';
import NavHeader from '../../../components/header/NavHeader';
import styled from '../../../../styled-components';

const NewPasswordScreen = () => {
  const { t } = useTranslation();

  return (
    <Root>
      <NavHeader />
      <Container>
        <UpperContainer>
          <TextRow>
            <Title>{t('forgot_password.new_password_title')}</Title>
            <Spacer direction="horizontal" size="xxs" />
            {/* <LockIcon width={24} height={24} /> */}
          </TextRow>
          <Spacer direction="vertical" size="s" />
          <CustomText>{t('forgot_password.new_password_content')}</CustomText>
          <Spacer direction="vertical" size="xl" />
        </UpperContainer>
      </Container>
    </Root>
  );
};

const Root = styled.View`
  height: 100%;
  background: ${White};
`;

const Container = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const UpperContainer = styled.View`
  padding: 20px;
`;

const TextRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  ${HeadingM};
`;

const CustomText = styled.Text`
  ${TextM};
  color: ${Gray1};
`;

const Label = styled.Text`
  ${TextM};
`;

export default NewPasswordScreen;
