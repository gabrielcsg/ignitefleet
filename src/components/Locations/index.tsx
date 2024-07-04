import * as Styles from './styles';
import { Car, FlagCheckered } from 'phosphor-react-native';
import { LocationInfo, LocationInfoProps } from '../LocationInfo';

type Props = {
  arrival?: LocationInfoProps | null;
  departure: LocationInfoProps;
};

export function Locations({ arrival, departure }: Props) {
  return (
    <Styles.Container>
      <LocationInfo
        icon={Car}
        label={departure.label}
        description={departure.description}
      />

      {arrival && (
        <>
          <Styles.Line />

          <LocationInfo
            icon={FlagCheckered}
            label={arrival.label}
            description={arrival.description}
          />
        </>
      )}
    </Styles.Container>
  );
}
