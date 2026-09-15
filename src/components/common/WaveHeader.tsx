import { Dimensions, Image, StyleSheet, View } from 'react-native';

import {
  FINAL_HEADER_HEIGHT,
  WAVE_IMAGE,
  WAVE_IMAGE_ASPECT_RATIO,
} from '../../constants/waveHeaderConfig';

const { width } = Dimensions.get('window');

// نفس منطق الـ SplashScreen بالظبط عشان آخر فريم فيه يطابق الهيدر هنا
const OVERSCAN = 20;
const IMAGE_WIDTH = width + OVERSCAN * 2;
const IMAGE_HEIGHT = IMAGE_WIDTH * WAVE_IMAGE_ASPECT_RATIO;
const IMAGE_TRANSLATE_Y = FINAL_HEADER_HEIGHT - IMAGE_HEIGHT;

export default function WaveHeader() {
  return (
    <View pointerEvents="none" style={styles.container}>
      <View
        style={[
          styles.imageWrapper,
          {
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            transform: [{ translateY: IMAGE_TRANSLATE_Y }],
          },
        ]}
      >
        <Image source={WAVE_IMAGE} style={styles.image} resizeMode="stretch" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: FINAL_HEADER_HEIGHT,
    overflow: 'hidden',
    zIndex: 1,
  },
  imageWrapper: {
    position: 'absolute',
    top: 0,
    left: -OVERSCAN,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});