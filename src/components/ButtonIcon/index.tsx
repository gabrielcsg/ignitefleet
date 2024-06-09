import React from 'react';

import * as Styles from './styles';
import { IconProps } from 'phosphor-react-native';
import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components/native';

export type IconBoxProps = (props: IconProps) => JSX.Element;

type Props = TouchableOpacityProps & {
  icon: IconBoxProps;
};

export function ButtonIcon({ icon: Icon, ...rest }: Props) {
  const { COLORS } = useTheme();
  return (
    <Styles.Container activeOpacity={0.7} {...rest}>
      <Icon size={24} color={COLORS.BRAND_MID} />
    </Styles.Container>
  );
}
