import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Key, Car } from 'phosphor-react-native';

import * as Styles from './styles';

type Props = TouchableOpacityProps & {
  licensePlate?: string | null;
};

export function CarStatus({ licensePlate = null, ...rest }: Props) {
  const Icon = licensePlate ? Car : Key;
  const theme = useTheme();
  const message = licensePlate
    ? `Veículo ${licensePlate} em uso. `
    : `Nenhum veículo em uso. `;

  const status = licensePlate ? 'chegada.' : 'saída.';

  return (
    <Styles.Container {...rest}>
      <Styles.IconBox>
        <Icon size={32} color={theme.COLORS.BRAND_LIGHT} />
      </Styles.IconBox>

      <Styles.Message>
        {message}
        <Styles.TextHighlight>
          Clique aqui para registrar a {status}
        </Styles.TextHighlight>
      </Styles.Message>
    </Styles.Container>
  );
}
