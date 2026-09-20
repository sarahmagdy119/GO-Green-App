import { Colors, Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import axios from 'axios';
import MainHeader from '../../../components/common/MainHeader';
import ScanButton from '../../../components/scan/ScanButton';
import ScanTextInput from '../../../components/scan/ScanTextInput';
import { useNfcScan } from '../../../hooks/nfc-scan/useNfcScan';
import { useTranslation } from '../../../i18n/LanguageContext';
import { checkAccess, checkTowelAccess } from '../../../service/scan.service';
import { useAuthStore } from '../../../store/auth.store';
import { useScanStore } from '../../../store/scan.store';
import { getDeviceId } from '../../../utils/device';
import { getRoomId } from '../../../utils/roomConfig';

export default function ScanHomeScreen() {
  const router = useRouter();
  const { t, language } = useTranslation();

  const area = useAuthStore((s) => s.area);
  const isTowelManagement = useAuthStore((s) => s.isTowelManagement);
  const accessToken = useAuthStore((s) => s.accessToken);
  const {
    scan,
    isScanning,
    error: nfcError,
  } = useNfcScan();

  const setResult = useScanStore((s) => s.setResult);
  const setTowelResult = useScanStore((s) => s.setTowelResult);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [roomNumber, setRoomNumber] = useState('');
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleScan = useCallback(async () => {
    console.log('[ScanHomeScreen] handleScan started, isTowelManagement:', isTowelManagement);
    setError(null);

    const cardSerial = await scan();
    console.log('[ScanHomeScreen] scan() returned cardSerial:', cardSerial);

    if (!cardSerial) {
      console.log('[ScanHomeScreen] no cardSerial, nfcError:', nfcError);
      setError(nfcError ? t(nfcError) : t('scan.failed'));
      return;
    }

    setProcessing(true);

    try {
      const [deviceId, roomId] = await Promise.all([
        getDeviceId(),
        getRoomId(),
      ]);
      console.log('[ScanHomeScreen] deviceId:', deviceId, 'roomId:', roomId);

      if (isTowelManagement) {
        console.log('[ScanHomeScreen] calling checkTowelAccess with:', { cardSerial, deviceId, roomId });
        const towelResponse = await checkTowelAccess({
          cardSerial,
          deviceId,
          roomId,
        });
        console.log('[ScanHomeScreen] checkTowelAccess response:', towelResponse);

        setTowelResult(towelResponse, {
          cardSerial,
          deviceId,
          roomId,
        });
        console.log('[ScanHomeScreen] setTowelResult called, navigating to /towel-details');
        router.push('/towel-details');
        return;
      }

      const response = await checkAccess({
        cardSerial,
        deviceId,
        roomId,
      });

      setResult(response);

      router.push('/(app)/scan-result');
    } catch (err) {
      console.log('[ScanHomeScreen] handleScan error:', err);
      if (axios.isAxiosError(err)) {
        console.log('[ScanHomeScreen] axios status:', err.response?.status, 'data:', err.response?.data);
      }
      setError(t('scan.requestFailed'));
    } finally {
      setProcessing(false);
    }
  }, [scan, nfcError, setResult, setTowelResult, isTowelManagement, router, t]);

  const handleManualSubmit = useCallback(async () => {
    if (!roomNumber.trim()) return;

    console.log('[ScanHomeScreen] handleManualSubmit started, roomNumber:', roomNumber);
    setError(null);
    setManualSubmitting(true);

    try {
      const deviceId = await getDeviceId();
      console.log('[ScanHomeScreen] deviceId:', deviceId);

      if (isTowelManagement) {
        const towelResponse = await checkTowelAccess({
          deviceId,
          roomId: roomNumber.trim(),
        });
        console.log('[ScanHomeScreen] checkTowelAccess (manual) response:', towelResponse);

        setTowelResult(towelResponse, {
          deviceId,
          roomId: roomNumber.trim(),
          // no cardSerial available here — manual entry has no card scan
        });
        console.log('[ScanHomeScreen] setTowelResult (manual) called, navigating to /towel-details');
        router.push('/towel-details');
        return;
      }

      const response = await checkAccess({
        deviceId,
        roomId: roomNumber.trim(),
      });

      setResult(response);

      router.push('/(app)/scan-result');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('Status:', err.response?.status);
        console.log('Data:', err.response?.data);
        console.log('Message:', err.message);
      } else {
        console.log('Unknown error:', err);
      }
      setError(t('scan.requestFailed'));
    } finally {
      setManualSubmitting(false);
    }
  }, [roomNumber, setResult, setTowelResult, isTowelManagement, router, t]);

  const busy = isScanning || processing;
  const showCard = !keyboardVisible;

  const title = area
    ? area
    : t('scan.restaurantTitle');

  if (!accessToken) {
    return null;
  }

  return (
    <View style={styles.root}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <MainHeader />

      {isTowelManagement && (
        <Pressable
          style={styles.activityLogButton}
          onPress={() => router.push('/activity-log')}
        >
          <Text style={styles.activityLogText}>{t('scan.activityLogs')}</Text>
        </Pressable>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.title,
            keyboardVisible && styles.titleKeyboardOpen,
          ]}
        >
          {title}
        </Text>

        <View style={[styles.titleUnderline, keyboardVisible && styles.titleUnderlineKeyboardOpen]} />

        {showCard && (
          <>
            <Pressable
              style={styles.cardFrame}
              onPress={handleScan}
              disabled={busy}
            >
              <Image
                source={require('../../../../assets/images/nfc-scan.png')}
                style={styles.cardImage}
                resizeMode="cover"
              />

              {busy && (
                <View style={styles.overlay}>
                  <ActivityIndicator
                    color={Colors.navy}
                    size="large"
                  />
                </View>
              )}
            </Pressable>

            <Text style={styles.tapText}>
              {t('scan.tapToScan')}
            </Text>

            <Text style={styles.hintText}>
              {t('scan.hint')}
            </Text>
          </>
        )}

        <View style={styles.errorSlot}>
          {!!error && (
            <Text style={styles.error}>
              {error}
            </Text>
          )}
        </View>

        <View style={styles.manualEntry}>
          <ScanTextInput
            value={roomNumber}
            onChangeText={setRoomNumber}
            placeholder={t('scan.enterRoomNumber')}
            returnKeyType="done"
            onSubmitEditing={handleManualSubmit}
          />

          <ScanButton
            label={t('scan.submit')}
            onPress={handleManualSubmit}
            loading={manualSubmitting}
            disabled={!roomNumber.trim()}
            style={styles.manualButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  root: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  activityLogButton: {
    position: 'absolute',
    top: 170,
    left: 20,
    zIndex: 10,
    backgroundColor: Colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  activityLogText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.white,
  },

  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 32,
    marginTop: 29,
  },

  title: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    color: Colors.gold,
    letterSpacing: 2,
    marginTop: 150,
    textAlign: 'center',
    width: '100%',
  },

  titleKeyboardOpen: {
    paddingTop: 30,
  },

  titleUnderline: {
    width: 220,
    height: 1.2,
    backgroundColor: Colors.border,
    marginTop: 12,
    marginBottom: 25,
  },

  titleUnderlineKeyboardOpen: {
    marginBottom: 0,
  },

  cardFrame: {
    width: 200,
    height: 200,
    borderRadius: 16,
    borderWidth: 3.5,
    borderColor: Colors.navy,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: Colors.textSecondary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,

    elevation: 17,
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tapText: {
    fontFamily: Fonts.headingMedium,
    fontSize: 20,
    letterSpacing: 1,
    color: '#131E30',
    marginTop: 18,
  },

  hintText: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  errorSlot: {
    minHeight: 36,
    justifyContent: 'center',
  },

  error: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.error,
    textAlign: 'center',
  },

  manualEntry: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },

  manualButton: {
    marginTop: 4,
    marginBottom: 30,
  },
});