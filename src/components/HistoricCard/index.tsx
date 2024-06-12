import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Check, Clock } from 'phosphor-react-native';

import * as Styles from './styles';

export type HistoricCardProps = {
  id: string;
  licensePlate: string;
  created: string;
  isSync: boolean;
};

type Props = TouchableOpacityProps & {
  data: HistoricCardProps;
};

export function HistoricCard({ data, ...rest }: Props) {
  const { COLORS } = useTheme();

  return (
    <Styles.Container activeOpacity={0.7} {...rest}>
      <Styles.Info>
        <Styles.LicensePlate>{data.licensePlate}</Styles.LicensePlate>

        <Styles.Departure>{data.created}</Styles.Departure>
      </Styles.Info>
      {data.isSync ? (
        <Check size={24} color={COLORS.BRAND_LIGHT} />
      ) : (
        <Clock size={24} color={COLORS.GRAY_400} />
      )}
    </Styles.Container>
  );
}
