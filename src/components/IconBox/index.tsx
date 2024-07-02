import React from 'react';
import * as Styles from './styles';
import { IconProps } from 'phosphor-react-native';
import { useTheme } from 'styled-components/native';

export type IconBoxProps = (props: IconProps) => JSX.Element;

type Props = {
  size?: Styles.SizeProps;
  icon: IconBoxProps;
};

export function IconBox({ size = 'NORMAL', icon: Icon }: Props) {
  const iconSize = size === 'NORMAL' ? 24 : 16;
  const { COLORS } = useTheme();

  return (
    <Styles.Container size={size}>
      <Icon color={COLORS.BRAND_LIGHT} size={iconSize} />
    </Styles.Container>
  );
}
