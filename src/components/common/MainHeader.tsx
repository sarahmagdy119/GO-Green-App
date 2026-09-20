import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FINAL_HEADER_HEIGHT,
  LAYERED_WAVE_IMAGE,
  LAYERED_WAVE_IMAGE_ASPECT_RATIO,
} from '../../constants/waveHeaderConfig';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuthStore } from '../../store/auth.store';

const { width } = Dimensions.get('window');

// نفس منطق الـ SplashScreen وWaveHeader عشان آخر فريم فيه يطابق الهيدر هنا
const OVERSCAN = 20;
const IMAGE_WIDTH = width + OVERSCAN * 2;
const IMAGE_HEIGHT = IMAGE_WIDTH * LAYERED_WAVE_IMAGE_ASPECT_RATIO;
const IMAGE_TRANSLATE_Y = FINAL_HEADER_HEIGHT - IMAGE_HEIGHT;

export default function MainHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language, setLanguage } = useTranslation();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.wrapper}>
      <View pointerEvents="none" style={styles.waveContainer}>
        <View
          style={[
            styles.waveImageWrapper,
            {
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
              transform: [{ translateY: IMAGE_TRANSLATE_Y }],
            },
          ]}
        >
          <Image source={LAYERED_WAVE_IMAGE} style={styles.waveImage} resizeMode="stretch" />
        </View>
      </View>

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
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: FINAL_HEADER_HEIGHT,
    overflow: 'hidden',
    zIndex: 1,
  },
  waveImageWrapper: {
    position: 'absolute',
    top: 0,
    left: -OVERSCAN,
  },
  waveImage: {
    width: '100%',
    height: '100%',
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