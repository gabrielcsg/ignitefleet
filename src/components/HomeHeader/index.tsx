import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Power } from 'phosphor-react-native';
import { useApp, useUser } from '@realm/react';

import * as Styles from './styles';
import theme from '../../theme';

export function HomeHeader() {
  const user = useUser();
  const app = useApp();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 32;

  async function handleLogout() {
    await app.currentUser?.logOut();
  }

  return (
    <Styles.Container style={{ paddingTop }}>
      <Styles.Picture
        source={{ uri: user?.profile.pictureUrl }}
        placeholder="L184i9offQof00ayfQay~qj[fQj["
      />
      <Styles.Greeting>
        <Styles.Message>Olá</Styles.Message>
        <Styles.Name>{user?.profile.name}</Styles.Name>
      </Styles.Greeting>

      <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
        <Power size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Styles.Container>
  );
}
