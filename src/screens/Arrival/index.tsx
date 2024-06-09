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

  function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          'Error',
          'Não foi possível obter os dados para registrar a chegada do veículo.'
        );
      }

      realm.write(() => {
        historic.status = 'arrival';
        historic.updated_at = new Date();
      });

      Alert.alert('Chegada', 'Chegada registrada com sucesso!');
      goBack();
    } catch (error) {
      Alert.alert('Error', 'Não foi possível registrar a chegada do veículo.');
    }
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
          <Button title="Registrar Chegada" onPress={handleArrivalRegister} />
        </Styles.Footer>
      </Styles.Content>
    </Styles.Container>
  );
}
