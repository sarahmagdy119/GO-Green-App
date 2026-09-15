import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  View,
} from 'react-native';

import {
  FINAL_HEADER_HEIGHT,
  FINAL_LOGO_MARGIN_TOP,
  FINAL_LOGO_SIZE,
  WAVE_IMAGE,
  WAVE_IMAGE_ASPECT_RATIO,
} from '../../constants/waveHeaderConfig';

const { width, height } = Dimensions.get('window');

const HOLD_DURATION = 700;
const TRANSITION_DURATION = 1500;
const END_HOLD = 250;

const INITIAL_LOGO_SIZE = width * 0.42;

const FINAL_LOGO_TOP = FINAL_HEADER_HEIGHT + FINAL_LOGO_MARGIN_TOP;
const FINAL_LOGO_CENTER_Y = FINAL_LOGO_TOP + FINAL_LOGO_SIZE / 2;
const START_LOGO_CENTER_Y = height / 2;

const LOGO_TRANSLATE_Y = FINAL_LOGO_CENTER_Y - START_LOGO_CENTER_Y;
const LOGO_SCALE = FINAL_LOGO_SIZE / INITIAL_LOGO_SIZE;

// أبعاد الصورة بنسبتها الطبيعية (بدون تشويه)، مع هامش بسيط يمين وشمال
const OVERSCAN = 20;
const IMAGE_WIDTH = width + OVERSCAN * 2;
const IMAGE_HEIGHT = IMAGE_WIDTH * WAVE_IMAGE_ASPECT_RATIO;

// القيمة النهائية اللي الصورة هتتحرك لها، بحيث آخرها (فيه الـ wave) يفضل ظاهر بالظبط بارتفاع FINAL_HEADER_HEIGHT
const IMAGE_TRANSLATE_Y_END = FINAL_HEADER_HEIGHT - IMAGE_HEIGHT;

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // progress: 0 = الصورة في وضعها الأصلي، 1 = الوضع النهائي (الهيدر فقط ظاهر)
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(progress, {
        toValue: 1,
        duration: TRANSITION_DURATION,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        const finishTimer = setTimeout(() => {
          onFinish?.();
        }, END_HOLD);

        return () => clearTimeout(finishTimer);
      });
    }, HOLD_DURATION);

    return () => {
      clearTimeout(timer);
      progress.stopAnimation();
    };
  }, [onFinish, progress]);

  const imageTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, IMAGE_TRANSLATE_Y_END],
  });

  const logoTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, LOGO_TRANSLATE_Y],
  });

  const logoScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, LOGO_SCALE],
  });

  // اللوجو بيظهر تدريجيًا بعد ما الصورة تبدأ تطلع
  const logoOpacity = progress.interpolate({
    inputRange: [0, 0.15, 0.35, 1],
    outputRange: [0, 0, 1, 1],
  });

  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={styles.logoLayer}>
        <Animated.Image
          source={require('../../../assets/images/logo.png')}
          resizeMode="contain"
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [
                { translateY: logoTranslateY },
                { scale: logoScale },
              ],
            },
          ]}
        />
      </View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.imageLayer,
          { transform: [{ translateY: imageTranslateY }] },
        ]}
      >
        <Image
          source={WAVE_IMAGE}
          style={styles.image}
          resizeMode="stretch"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  logoLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logo: {
    width: INITIAL_LOGO_SIZE,
    height: INITIAL_LOGO_SIZE,
  },
  // الصورة بأبعادها الطبيعية، وبتتحرك بالـ transform فقط (بدون تشويه في الأبعاد)
  imageLayer: {
    position: 'absolute',
    top: 0,
    left: -OVERSCAN,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    zIndex: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});