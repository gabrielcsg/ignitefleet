import React from 'react';
import { useNavigation } from '@react-navigation/native';

import * as Styles from './styles';

import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';

export function Home() {
  const { navigate } = useNavigation();

  function handleRegisterMovement() {
    navigate('departure');
  }

  return (
    <Styles.Container>
      <HomeHeader />

      <Styles.Content>
        <CarStatus licensePlate={''} onPress={handleRegisterMovement} />
      </Styles.Content>
    </Styles.Container>
  );
}
