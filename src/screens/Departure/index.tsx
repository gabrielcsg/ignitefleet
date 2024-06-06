import React, { useRef, useState } from 'react';
import {
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import * as Styles from './styles';

import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Button } from '../../components/Button';
import { licensePlateValidate } from '../../utils/licensePlateValidate';

const keyboardAvoidingViewBehavior =
  Platform.OS == 'android' ? 'height' : 'position';

export function Departure() {
  const [description, setDescription] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  function handleDepartureRegister() {
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
  }

  return (
    <Styles.Container>
      <Header title="Saída" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardAvoidingViewBehavior}
      >
        <ScrollView>
          <Styles.Content>
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

            <Button title="Registrar Saída" onPress={handleDepartureRegister} />
          </Styles.Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Styles.Container>
  );
}