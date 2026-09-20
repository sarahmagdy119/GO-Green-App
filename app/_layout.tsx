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
import { Stack, usePathname, useRouter } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from '../src/components/common/SplashScreen';
import { LanguageProvider } from '../src/i18n/LanguageContext';
import { useAuthStore } from '../src/store/auth.store';
import { getDeviceId } from '../src/utils/device';

ExpoSplashScreen.preventAutoHideAsync();

// برا الـ component عشان يفضل ثابت طول عمر الـ app process
let hasShownAnimatedSplash = false;

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(!hasShownAnimatedSplash);

  const [deviceReady, setDeviceReady] = useState(false);
  const [hasDeviceId, setHasDeviceId] = useState(false);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_500Medium,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const accessToken = useAuthStore((s) => s.accessToken);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const initialize = useAuthStore((s) => s.initialize);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    getDeviceId().then((id) => {
      setHasDeviceId(!!id);
      setDeviceReady(true);
    });
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        if (!fontsLoaded || isInitializing || !deviceReady) {
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
  }, [fontsLoaded, isInitializing, deviceReady]);

  const isLoggedIn = !!accessToken;
  const onLoginRoute = pathname === '/sign-in';

  const shouldRedirectToSignIn = hasDeviceId && !isLoggedIn && !onLoginRoute;
  const shouldRedirectToHome = hasDeviceId && isLoggedIn && onLoginRoute;

  // هنا الفيكس: الـ redirect بيتعمل imperative بعد ما الـ Stack يكون mounted،
  // مش بنستبدل الـ Stack بـ <Redirect> ونهدّ الـ Navigator كل مرة
  useEffect(() => {
    if (!appReady) return;

    if (shouldRedirectToSignIn) {
      router.replace('/sign-in');
    } else if (shouldRedirectToHome) {
      router.replace('/');
    }
  }, [appReady, shouldRedirectToSignIn, shouldRedirectToHome, router]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Stack screenOptions={{ headerShown: false }} />

          {showAnimatedSplash && (
            <SplashScreen
              onFinish={() => {
                hasShownAnimatedSplash = true;
                setShowAnimatedSplash(false);
              }}
            />
          )}
        </View>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}