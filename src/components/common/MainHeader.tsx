import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuthStore } from '../../store/auth.store';
import WaveHeader from './WaveHeader';

export default function MainHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language, setLanguage } = useTranslation();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/sign-in');
  };

  return (
    <View style={styles.wrapper}>
      <WaveHeader />
      <View style={[styles.overlay, { top: insets.top + 10 }]} pointerEvents="box-none">
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.actions}>
          <Pressable onPress={handleLogout} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="log-out-outline" size={22} color="#c9a25a" />
          </Pressable>
          <Pressable
            onPress={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Ionicons name="globe-outline" size={22} color="#c9a25a" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },
  logo: { width: 34, height: 34, zIndex: 11, elevation: 11 },
  actions: { flexDirection: 'row', gap: 14, zIndex: 11, elevation: 11 },
  iconBtn: { padding: 4 },
});