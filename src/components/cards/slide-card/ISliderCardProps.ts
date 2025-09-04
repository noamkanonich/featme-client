import { ElementType } from 'react';
import { SvgProps } from 'react-native-svg';

interface ISliderCardProps {
  item: any;
  color: string;
  background: string;
  icon: ElementType<SvgProps>;
  children: React.ReactNode;
  onPress: () => void;
  onDelete: () => void;
}

export default ISliderCardProps;
