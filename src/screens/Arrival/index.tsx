import React from 'react';
import { useRoute } from '@react-navigation/native';

import * as Styles from './styles';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();

  const { id } = route.params as RouteParamsProps;

  return (
    <Styles.Container>
      <Header title="Chegada" />
      <Styles.Content>
        <Styles.Label>Placa do veículo</Styles.Label>
        <Styles.LicensePlate>XXX0000</Styles.LicensePlate>
        <Styles.Label>Finalidade</Styles.Label>
        <Styles.Description>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo dicta
          debitis quam consequuntur dolores amet reiciendis commodi dolor
          eveniet! Illum autem libero nesciunt repudiandae molestias placeat cum
          similique in blanditiis?
        </Styles.Description>

        <Styles.Footer>
          <Button title="Registrar Chegada" />
        </Styles.Footer>
      </Styles.Content>
    </Styles.Container>
  );
}
