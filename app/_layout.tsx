import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import {
  PlayfairDisplay_500Medium,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import SplashScreen from '../src/components/common/SplashScreen';
import { LanguageProvider } from '../src/i18n/LanguageContext';

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_500Medium,

    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (!fontsLoaded) {
          return;
        }

        await new Promise<void>((resolve) => {
          setTimeout(resolve, 300);
        });

        setAppReady(true);
      } catch (error) {
        console.log('Error loading app:', error);
        setAppReady(true);
      }
    }

    prepare();
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <LanguageProvider>
      <View
        style={{ flex: 1 }}
        onLayout={onLayoutRootView}
      >
        <Stack screenOptions={{ headerShown: false }} />

        {showAnimatedSplash && (
          <SplashScreen
            onFinish={() => setShowAnimatedSplash(false)}
          />
        )}
      </View>
    </LanguageProvider>
  );
}
