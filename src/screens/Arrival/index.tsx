import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { LatLng } from 'react-native-maps';
import { X } from 'phosphor-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BSON } from 'realm';

import * as Styles from './styles';

import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { Locations } from '../../components/Locations';
import { Loading } from '../../components/Loading';
import { LocationInfoProps } from '../../components/LocationInfo';

import { useObject, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { getStorageLocations } from '../../libs/asyncStorage/locationStorage';
import { getLastSyncTimestamp } from '../../libs/asyncStorage/syncStorage';
import { stopLocationTask } from '../../tasks/backgroundLocationTask';
import { Map } from '../../components/Map';
import { getAddressLocation } from '../../utils/getAddressLocation';
import dayjs from 'dayjs';

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();
  const { goBack } = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>(
    {} as LocationInfoProps
  );
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null);

  const { id } = route.params as RouteParamsProps;

  const historic = useObject(Historic, new BSON.UUID(id));
  const realm = useRealm();

  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes';

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic);
    });

    await stopLocationTask();

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

      // background locations
      const locations = await getStorageLocations();

      realm.write(() => {
        historic.status = 'arrival';
        historic.updated_at = new Date();
        historic.coords.push(...locations);
      });
      await stopLocationTask();
      Alert.alert('Chegada', 'Chegada registrada com sucesso!');
      goBack();
    } catch (error) {
      Alert.alert('Error', 'Não foi possível registrar a chegada do veículo.');
    }
  }

  async function getLocationsInfo() {
    if (!historic) {
      return;
    }

    const lastSync = await getLastSyncTimestamp();
    const updatedAt = historic.updated_at.getTime();
    setDataNotSynced(updatedAt > lastSync);

    if (historic.status === 'departure') {
      const locationsStorage = await getStorageLocations();
      setCoordinates(locationsStorage);
    } else {
      setCoordinates(
        historic.coords.map(({ latitude, longitude }) => ({
          latitude,
          longitude,
        }))
      );
    }

    if (historic.coords[0]) {
      const departureStreetName = await getAddressLocation(historic.coords[0]);
      setDeparture({
        label: `Saindo em ${departureStreetName ?? ''}`,
        description: dayjs(historic.coords[0].timestamp).format(
          'DD/MM/YYYY [às] HH:mm'
        ),
      });
    }

    if (historic.status === 'arrival') {
      const lastLocation = historic.coords[historic.coords.length - 1];

      if (lastLocation) {
        const arrivalStreetName = await getAddressLocation(lastLocation);

        setArrival({
          label: `Chegando em ${arrivalStreetName ?? ''}`,
          description: dayjs(lastLocation.timestamp).format(
            'DD/MM/YYYY [às] HH:mm'
          ),
        });
      }
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getLocationsInfo();
  }, [historic]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Styles.Container>
      <Header title={title} />

      {coordinates.length > 0 && <Map coordinates={coordinates} />}

      <Styles.Content>
        {coordinates.length > 0 && (
          <Locations arrival={arrival} departure={departure} />
        )}

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
