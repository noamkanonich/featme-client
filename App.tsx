/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import Router from './src/lib/routes/Router';
import useTheme from './src/theme/useTheme';
import styled, { ThemeProvider } from './styled-components';
import { useEffect, useRef, useState } from 'react';
import i18n, { initI18n } from './src/i18n';
import { Dark, White } from './src/theme/colors';
import { AuthProvider } from './src/lib/auth/AuthProvider';
import { UserDataProvider } from './src/lib/user-data/UserDataProvider';
import { DateProvider } from './src/lib/date/DateProvider';
import { init as initAxios } from './src/lib/axios';
import SplashScreen from './src/screens/splash/SplashScreen';

initAxios();

const App = () => {
  const { theme, setDir } = useTheme();
  const initialLanguage = useRef<string | undefined>();
  const [i18nReady, setI18nReady] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const init = async () => {
      await initI18n({
        language: initialLanguage.current || 'he',
      });
      // setTimeout(() => {
      //   setI18nReady(true);
      // }, 3000);
    };
    // if (authReady) {
    init();
    // }
  }, [setDir]);

  useEffect(() => {
    const onLanguageChanged = () => {
      setDir(i18n.dir());
    };

    i18n.on('languageChanged', onLanguageChanged);
    onLanguageChanged();

    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? Dark : White}
      />

      <ThemeProvider theme={theme}>
        <AuthProvider onReady={() => true}>
          <DateProvider>
            <UserDataProvider>
              {!i18nReady ? (
                // <LoadingContainer>
                //   <ActivityIndicator size={64} color={Dark} />
                // </LoadingContainer>
                <SplashScreen
                  stayMs={3000}
                  onComplete={() => {
                    setI18nReady(true);
                  }}
                />
              ) : (
                <>
                  {/* <CustomTopBar /> */}
                  <Router />
                </>
              )}
            </UserDataProvider>
          </DateProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${White};
`;

export default App;
