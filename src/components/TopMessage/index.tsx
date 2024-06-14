import { useTheme } from 'styled-components/native';
import { IconBoxProps } from '../ButtonIcon';
import * as Styles from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  icon?: IconBoxProps;
  title: string;
};

export function TopMessage({ title, icon: Icon }: Props) {
  const { COLORS } = useTheme();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 5;

  return (
    <Styles.Container style={{ paddingTop }}>
      {Icon && <Icon size={18} color={COLORS.GRAY_100} />}
      <Styles.Title>{title}</Styles.Title>
    </Styles.Container>
  );
}
