import { useEffect, useState } from 'react';
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
import { getLastSyncTimestamp } from '../../libs/asyncStorage/syncStorage';
import { stopLocationTask } from '../../tasks/backgroundLocationTask';

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();
  const { goBack } = useNavigation();
  const [dataNotSynced, setDataNotSynced] = useState(false);

  const { id } = route.params as RouteParamsProps;

  const historic = useObject(Historic, new BSON.UUID(id));
  const realm = useRealm();

  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes';

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

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          'Error',
          'Não foi possível obter os dados para registrar a chegada do veículo.'
        );
      }

      await stopLocationTask();

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

  useEffect(() => {
    getLastSyncTimestamp().then((lastSync) =>
      setDataNotSynced(historic!.updated_at.getTime() > lastSync)
    );
  }, []);

  return (
    <Styles.Container>
      <Header title={title} />
      <Styles.Content>
        <Styles.Label>Placa do veículo</Styles.Label>
        <Styles.LicensePlate>{historic?.license_plate}</Styles.LicensePlate>
        <Styles.Label>Finalidade</Styles.Label>
        <Styles.Description>{historic?.description}</Styles.Description>
      </Styles.Content>

      {historic?.status === 'departure' && (
        <Styles.Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />
          <Button title="Registrar Chegada" onPress={handleArrivalRegister} />
        </Styles.Footer>
      )}

      {dataNotSynced && (
        <Styles.AsyncMessage>
          Sincronização da
          {historic?.status === 'departure' ? ' partida' : ' chegada'} pendende.
        </Styles.AsyncMessage>
      )}
    </Styles.Container>
  );
}
