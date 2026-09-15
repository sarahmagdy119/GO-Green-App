import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import SplashScreen from '../../src/components/common/SplashScreen';
import { LanguageProvider } from '../../src/i18n/LanguageContext';

export default function RootLayout() {
  const [showAnimatedSplash, setShowAnimatedSplash] = useState<boolean>(true);

  return (
    <LanguageProvider>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        {showAnimatedSplash && (
          <SplashScreen onFinish={() => setShowAnimatedSplash(false)} />
        )}
      </View>
    </LanguageProvider>
  );
}
