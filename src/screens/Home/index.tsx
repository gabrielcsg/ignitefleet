import React, { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { ProgressDirection, ProgressMode } from 'realm';
import dayjs from 'dayjs';

import { useNavigation } from '@react-navigation/native';
import { useUser } from '@realm/react';

import * as Styles from './styles';

import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';

import { useQuery, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import {
  getLastSyncTimestamp,
  saveLastSyncTimestamp,
} from '../../libs/asyncStorage/syncStorage';
import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard';

export function Home() {
  const { navigate } = useNavigation();
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    []
  );

  const historic = useQuery(Historic);
  const realm = useRealm();
  const user = useUser();

  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      navigate('arrival', { id: vehicleInUse._id.toString() });
    } else {
      navigate('departure');
    }
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = historic.filtered("status = 'departure'")[0];
      setVehicleInUse(vehicle);
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Veículo em uso',
        'Não foi possível carregar o veículo em uso.'
      );
    }
  }

  async function fetchHistoric() {
    try {
      const response = historic.filtered(
        "status = 'arrival' SORT(created_at DESC)"
      );

      const lastSync = await getLastSyncTimestamp();

      const formattedHistoric = response.map((item) => {
        return {
          id: item._id!.toString(),
          licensePlate: item.license_plate,
          isSync: lastSync > item.updated_at!.getTime(),
          created: dayjs(item.created_at).format(
            '[Saída em] DD/MM/YYYY [às] HH:mm'
          ),
        };
      });

      setVehicleHistoric(formattedHistoric);
    } catch (error) {
      Alert.alert('Histórico', 'Não foi possível carregar o histórico.');
    }
  }

  function handleHistoricDetails(id: string) {
    navigate('arrival', { id });
  }

  async function progressNotification(
    transferred: number,
    transferable: number
  ) {
    const percentage = (transferred / transferable) * 100;

    if (percentage === 100) {
      await saveLastSyncTimestamp();
      fetchHistoric();
    }
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse());

    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener('change', fetchVehicleInUse);
      }
    };
  }, []);

  useEffect(() => {
    fetchHistoric();
  }, [historic]);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs, realm) => {
      const historicByUserQuery = realm
        .objects('Historic')
        .filtered(`user_id = '${user.id}'`);

      mutableSubs.add(historicByUserQuery, { name: 'historic_by_user' });
    });
  }, [realm]);

  useEffect(() => {
    const syncSession = realm.syncSession;

    if (!syncSession) {
      return;
    }

    syncSession.addProgressNotification(
      ProgressDirection.Upload,
      ProgressMode.ReportIndefinitely,
      progressNotification
    );

    return () => syncSession.removeProgressNotification(progressNotification);
  }, []);

  return (
    <Styles.Container>
      <HomeHeader />

      <Styles.Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />

        <Styles.Title>Histórico</Styles.Title>

        <FlatList
          data={vehicleHistoric}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Styles.Label>Nenhum registro de utilização.</Styles.Label>
          }
        />
      </Styles.Content>
    </Styles.Container>
  );
}
