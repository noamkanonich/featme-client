import { Dark, Gray1, White } from './colors';
import styled, { css } from '../../styled-components';
import { Platform } from 'react-native';

export const HeadingL = css`
  font-family: 'Circular20-Medium';
  font-weight: 500;
  font-size: 26px;
  line-height: 40px;
  letter-spacing: 0;
  color: ${Dark};
  ${Platform.OS !== 'web' && 'text-align: left'};
`;

export const HeadingM = css`
  font-family: 'Circular20-Medium';
  font-weight: 500;
  font-size: 22px;
  line-height: 40px;
  letter-spacing: 0;
  color: ${Dark};
  ${Platform.OS !== 'web' && 'text-align: left'};
`;

export const HeadingXL = css`
  font-family: 'Circular20-Medium';
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: 0;
  color: ${Dark};
  ${Platform.OS !== 'web' && 'text-align: left'};
`;

export const HeadingXXL = css`
  font-family: 'Circular20-Medium';

  font-weight: 500;
  font-size: 60px;
  line-height: 60px;
  letter-spacing: 0;
  color: ${Dark};
  ${Platform.OS !== 'web' && 'text-align: left'};
`;

export const TextM = css`
  font-family: 'Circular20-Book';
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0;
  color: ${Dark};
  ${Platform.OS !== 'web' && 'text-align: left'};
`;

export const TextS = css`
  font-family: 'Circular20-Book';
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0;
  ${Platform.OS !== 'web' && 'text-align: left'};
`;

export const TextSLight = css`
  ${TextS};
  color: ${Gray1};
`;

export const TextMLight = css`
  ${TextM};
  color: ${Gray1};
`;

export const TextButton = css`
  font-family: 'Circular20-Book';
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0;
  color: ${White};
`;

export const TextL = css`
  font-family: 'Circular20-Book';
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0;
  color: ${Dark};
  ${Platform.OS !== 'web' && 'text-align: left'};
`;

export const TextXs = css`
  font-family: 'Circular20-Book';
  font-weight: 400;
  font-size: 10px;
  letter-spacing: 0;
  color: ${Gray1};
  ${Platform.OS !== 'web' && 'text-align: left'};
`;

export const Title = styled.Text.attrs({ dataSet: { nagish: 'title' } })`
  ${({ theme }) =>
    theme.media.isMobile &&
    css`
      ${HeadingL};
    `};
  ${({ theme }) =>
    theme.media.isTablet &&
    css`
      ${HeadingXL};
    `};
  ${({ theme }) =>
    theme.media.isDesktop &&
    css`
      ${HeadingXL};
    `};
`;

export const Subtitle = styled.Text.attrs({ dataSet: { nagish: 'subtitle' } })`
  ${({ theme }) =>
    theme.media.isMobile &&
    css`
      ${TextSLight};
    `};
  ${({ theme }) =>
    theme.media.isTablet &&
    css`
      ${TextMLight};
    `};
  ${({ theme }) =>
    theme.media.isDesktop &&
    css`
      ${TextMLight};
    `};
`;
