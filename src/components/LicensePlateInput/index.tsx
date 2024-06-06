import React, { forwardRef } from 'react';
import { useTheme } from 'styled-components/native';

import * as Styles from './styles';
import { TextInput, TextInputProps } from 'react-native';

type Props = TextInputProps & {
  label: string;
};

const LicensePlateInput = forwardRef<TextInput, Props>(
  ({ label, ...rest }, ref) => {
    const { COLORS } = useTheme();

    return (
      <Styles.Container>
        <Styles.Label>{label}</Styles.Label>

        <Styles.Input
          ref={ref}
          maxLength={7}
          autoCapitalize="characters"
          placeholderTextColor={COLORS.GRAY_400}
          {...rest}
        />
      </Styles.Container>
    );
  }
);

export { LicensePlateInput };
