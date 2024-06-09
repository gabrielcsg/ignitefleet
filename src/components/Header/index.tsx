import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import { ArrowLeft } from 'phosphor-react-native';

import { useNavigation } from '@react-navigation/native';

import * as Styles from './styles';

type Props = {
  title: string;
};

export function Header({ title }: Props) {
  const { COLORS } = useTheme();
  const { goBack } = useNavigation();

  const insets = useSafeAreaInsets();
  const paddingTop = insets.top + 42;

  function handleBack() {
    goBack();
  }

  return (
    <Styles.Container style={{ paddingTop }}>
      <TouchableOpacity activeOpacity={0.7} onPress={handleBack}>
        <ArrowLeft size={24} weight="bold" color={COLORS.BRAND_LIGHT} />
      </TouchableOpacity>

      <Styles.Title>{title}</Styles.Title>
    </Styles.Container>
  );
}
