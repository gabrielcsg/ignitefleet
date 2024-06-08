import React from 'react';
import { useRoute } from '@react-navigation/native';

import * as Styles from './styles';

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();

  const { id } = route.params as RouteParamsProps;

  console.log('id >', id);

  return <Styles.Container></Styles.Container>;
}
