import { useState } from 'react';
import { Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Realm, useApp } from '@realm/react';

import * as Styles from './styles';

import BackgroundImg from '../../assets/background.png';
import { Button } from '../../components/Button';
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '../../configs';

GoogleSignin.configure({
  scopes: ['email', 'profile'],
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
});

export default function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const app = useApp();

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true);
      const { idToken } = await GoogleSignin.signIn();
      if (idToken) {
        const credentials = Realm.Credentials.jwt(idToken);
        await app.logIn(credentials);
      } else {
        Alert.alert(
          'Entrar',
          'Não foi possível conectar-se a sua conta google.'
        );
        setIsAuthenticating(false);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Entrar', 'Não foi possível conectar-se a sua conta google.');
      setIsAuthenticating(false);
    }
  }

  return (
    <Styles.Container source={BackgroundImg}>
      <Styles.Title>Ignite Fleet</Styles.Title>

      <Styles.Slogan>Gestão de uso de veículos</Styles.Slogan>

      <Button
        isLoading={isAuthenticating}
        onPress={handleGoogleSignIn}
        title="Entrar com o Google"
      />
    </Styles.Container>
  );
}
