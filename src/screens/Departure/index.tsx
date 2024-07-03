import React, { useEffect, useRef, useState } from 'react';
import { TextInput, ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useUser } from '@realm/react';
import { useNavigation } from '@react-navigation/native';
import {
  LocationAccuracy,
  LocationObjectCoords,
  LocationSubscription,
  requestBackgroundPermissionsAsync,
  useForegroundPermissions,
  watchPositionAsync,
} from 'expo-location';
import { Car } from 'phosphor-react-native';

import * as Styles from './styles';

import { Header } from '../../components/Header';
import { Map } from '../../components/Map';
import { Loading } from '../../components/Loading';
import { LocationInfo } from '../../components/LocationInfo';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Button } from '../../components/Button';
import { licensePlateValidate } from '../../utils/licensePlateValidate';
import { getAddressLocation } from '../../utils/getAddressLocation';
import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

export function Departure() {
  const realm = useRealm();
  const user = useUser();
  const { goBack } = useNavigation();

  const [description, setDescription] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [currentAddress, setCurrentAddress] = useState<string | null>();
  const [currentCoords, setCurrentCoords] =
    useState<LocationObjectCoords | null>(null);

  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions();

  async function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        return Alert.alert(
          'Placa inválida',
          'A placa é inválida. Por favor, informe a placa correta do veículo.',
          [{ text: 'OK', onPress: () => licensePlateRef.current?.focus() }]
        );
      }

      if (description.trim().length === 0) {
        return Alert.alert(
          'Finalidade',
          'Por favor, informe a finalidade da utilização do veículo.',
          [{ text: 'OK', onPress: () => descriptionRef.current?.focus() }]
        );
      }

      if (!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert(
          'Localização',
          'Não foi possível obter a localização atual. Tente novamente!'
        );
      }

      setIsRegistering(true);

      const backgroundPermissions = await requestBackgroundPermissionsAsync();

      if (!backgroundPermissions.granted) {
        setIsRegistering(false);
        return Alert.alert(
          'Localização',
          'É necessário que o App tenha acesso a localização em segundo plano. Acesse as configurações do dispositivo e habilite "Permitir o tempo todo".'
        );
      }

      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description: description,
          })
        );
      });

      Alert.alert('Saída', 'Saída do veículo registrada com sucesso!');
      goBack();
    } catch (error) {
      console.log(error);
      setIsRegistering(false);
      Alert.alert('Error', 'Não foi possível registrar a saída do veículo');
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission();
  }, []);

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return;
    }

    let subscription: LocationSubscription;

    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
      },
      (location) => {
        setCurrentCoords(location.coords);
        getAddressLocation(location.coords)
          .then((address) => {
            setCurrentAddress(address);
          })
          .finally(() => setIsLoadingLocation(false));
      }
    ).then((response) => (subscription = response));

    return () => subscription?.remove();
  }, [locationForegroundPermission]);

  if (!locationForegroundPermission?.granted) {
    return (
      <Styles.Container>
        <Header title="Saída" />
        <Styles.Message>
          Você precisa permitir que o aplicativo tenha acesso a localização para
          utilizar essa funcionalidade. Por favor, acesse as configurações do
          seu dispositivo para concender essa permissão ao aplicativo.
        </Styles.Message>
      </Styles.Container>
    );
  }

  if (isLoadingLocation) {
    return <Loading />;
  }

  return (
    <Styles.Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {currentCoords && <Map coordinates={[currentCoords]} />}
          <Styles.Content>
            {currentAddress && (
              <LocationInfo
                icon={Car}
                label="Localização atual"
                description={currentAddress}
              />
            )}

            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
              title="Registrar Saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Styles.Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Styles.Container>
  );
}
