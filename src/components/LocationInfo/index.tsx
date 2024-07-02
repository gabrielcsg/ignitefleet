import React from 'react';
import * as Styles from './styles';
import { IconBox, IconBoxProps } from '../IconBox';

export type LocationInfoProps = {
  description: string;
  label: string;
};

type Props = LocationInfoProps & {
  icon: IconBoxProps;
};

export function LocationInfo({ description, label, icon }: Props) {
  return (
    <Styles.Container>
      <IconBox icon={icon} />
      <Styles.Info>
        <Styles.Label numberOfLines={1}>{label}</Styles.Label>
        <Styles.Description numberOfLines={1}>{description}</Styles.Description>
      </Styles.Info>
    </Styles.Container>
  );
}
