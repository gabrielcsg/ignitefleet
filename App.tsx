import 'react-native-get-random-values';
import './src/libs/dayjs';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, UserProvider } from '@realm/react';

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

import SignIn from './src/screens/SignIn';

import { Loading } from './src/components/Loading';

import theme from './src/theme';
import { REALM_APP_ID } from './src/configs';
import { Routes } from './src/routes';
import { RealmProvider, syncConfig } from './src/libs/realm';
import { TopMessage } from './src/components/TopMessage';
import { WifiSlash } from 'phosphor-react-native';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider
          style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <TopMessage title="Você está offline" icon={WifiSlash} />
          <UserProvider fallback={SignIn}>
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
