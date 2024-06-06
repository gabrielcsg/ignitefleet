import React, { forwardRef } from 'react';
import * as Styles from './styles';
import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from 'styled-components/native';

type Props = TextInputProps & {
  label: string;
};

const TextAreaInput = forwardRef<TextInput, Props>(
  ({ label, ...rest }, ref) => {
    const { COLORS } = useTheme();

    return (
      <Styles.Container>
        <Styles.Label>{label}</Styles.Label>

        <Styles.Input
          ref={ref}
          autoCapitalize="sentences"
          multiline
          placeholderTextColor={COLORS.GRAY_400}
          {...rest}
        />
      </Styles.Container>
    );
  }
);

export { TextAreaInput };
