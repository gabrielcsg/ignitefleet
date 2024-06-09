import { Alert } from 'react-native';
import { X } from 'phosphor-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BSON } from 'realm';

import * as Styles from './styles';

import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { useObject, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();
  const { goBack } = useNavigation();

  const { id } = route.params as RouteParamsProps;

  const historic = useObject(Historic, new BSON.UUID(id));
  const realm = useRealm();

  function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic);
    });

    goBack();
  }

  function handleRemoveVehicleUsage() {
    Alert.alert('Cancelar', 'Cancelar a utilização do veículo?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => removeVehicleUsage() },
    ]);
  }

  return (
    <Styles.Container>
      <Header title="Chegada" />
      <Styles.Content>
        <Styles.Label>Placa do veículo</Styles.Label>
        <Styles.LicensePlate>{historic?.license_plate}</Styles.LicensePlate>
        <Styles.Label>Finalidade</Styles.Label>
        <Styles.Description>{historic?.description}</Styles.Description>

        <Styles.Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />
          <Button title="Registrar Chegada" />
        </Styles.Footer>
      </Styles.Content>
    </Styles.Container>
  );
}
