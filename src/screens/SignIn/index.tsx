import * as Styles from './styles';

import BackgroundImg from '../../assets/background.png';
import { Button } from '../../components/Button';

export default function SignIn() {
  return (
    <Styles.Container source={BackgroundImg}>
      <Styles.Title>Ignite Fleet</Styles.Title>

      <Styles.Slogan>Gestão de uso de veículos</Styles.Slogan>

      <Button title="Entrar com o Google" />
    </Styles.Container>
  );
}
