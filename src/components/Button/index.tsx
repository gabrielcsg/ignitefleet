import { TouchableOpacityProps } from 'react-native';
import * as Styles from './styles';

type Props = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
};

export function Button({ title, isLoading = false, ...rest }: Props) {
  return (
    <Styles.Container activeOpacity={0.7} disabled={isLoading} {...rest}>
      {isLoading ? <Styles.Loading /> : <Styles.Title>{title}</Styles.Title>}
    </Styles.Container>
  );
}
