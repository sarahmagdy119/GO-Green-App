import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useEffect, useRef } from 'react';

import AuthButton from '../../components/auth/AuthButton';
import AuthInput from '../../components/auth/AuthInput';
import WaveHeader from '../../components/common/WaveHeader';

import {
  FINAL_HEADER_HEIGHT,
  FINAL_LOGO_MARGIN_TOP,
  FINAL_LOGO_SIZE,
} from '../../constants/waveHeaderConfig';

import { useSignIn } from '../../hooks/auth/useSignIn';
import { useKeyboardVisible } from '../../hooks/common/useKeyboardVisible';
import { useTranslation } from '../../i18n/LanguageContext';

const STAGGER_DELAY = 90;

export default function SignInScreen() {
  const router = useRouter();

  const { t, isRTL, language, setLanguage } = useTranslation();

  const {
    username,
    setUsername,
    password,
    setPassword,
    fieldErrors,
    isLoading,
    apiError,
    submit,
  } = useSignIn();

  const isKeyboardVisible = useKeyboardVisible();

  // انيميشن دخول لكل عنصر لوحده: لوجو - يوزرنيم - باسورد - زرار
  const logoAnim = useRef(new Animated.Value(0)).current;
  const usernameAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeEntrance = (val: Animated.Value, delay: number) =>
      Animated.spring(val, {
        toValue: 1,
        delay,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      });

    Animated.stagger(STAGGER_DELAY, [
      makeEntrance(logoAnim, 0),
      makeEntrance(usernameAnim, 0),
      makeEntrance(passwordAnim, 0),
      makeEntrance(buttonAnim, 0),
    ]).start();
  }, [logoAnim, usernameAnim, passwordAnim, buttonAnim]);

  const logoKeyboardOpacity = isKeyboardVisible ? 0 : 1;

  const entranceStyle = (val: Animated.Value) => ({
    opacity: val,
    transform: [
      {
        translateY: val.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  });

  const handleLogin = async () => {
    const success = await submit();
    if (success) {
      router.replace('/');
    }
  };

  const logoTop = FINAL_HEADER_HEIGHT + FINAL_LOGO_MARGIN_TOP;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <WaveHeader />

      <Animated.View
        pointerEvents="none"
        style={[styles.logoContainer, { top: logoTop }, entranceStyle(logoAnim)]}
      >
        <View style={{ opacity: logoKeyboardOpacity }}>
          <Animated.Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <Pressable
        style={styles.langToggle}
        onPress={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
      >
        <Ionicons name="globe-outline" size={24} color="#c9a25a" />
      </Pressable>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[
          styles.keyboardAvoidingView,
          { marginTop: FINAL_HEADER_HEIGHT + FINAL_LOGO_SIZE - 90 },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <View style={styles.form}>
              <Animated.View style={entranceStyle(usernameAnim)}>
                <AuthInput
                  label={t('login.username')}
                  value={username}
                  onChangeText={setUsername}
                  icon="person-outline"
                  error={fieldErrors.username ? t(fieldErrors.username) : undefined}
                  isRTL={isRTL}
                />
              </Animated.View>

              <Animated.View style={entranceStyle(passwordAnim)}>
                <AuthInput
                  label={t('login.password')}
                  value={password}
                  onChangeText={setPassword}
                  icon="lock-closed-outline"
                  secureTextEntry
                  error={fieldErrors.password ? t(fieldErrors.password) : undefined}
                  isRTL={isRTL}
                />
              </Animated.View>

              {!!apiError && <Text style={styles.apiError}>{t(apiError)}</Text>}

              <Animated.View style={entranceStyle(buttonAnim)}>
                <AuthButton
                  title={t('login.submit')}
                  onPress={handleLogin}
                  loading={isLoading}
                />
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  logo: {
    width: FINAL_LOGO_SIZE,
    height: FINAL_LOGO_SIZE,
  },
  langToggle: {
    position: 'absolute',
    top: 48,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  formContainer: {
    width: '100%',
  },
  form: {
    paddingHorizontal: 28,
  },
  apiError: {
    color: '#c0392b',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
});