import { Colors, Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import MainHeader from '../../components/common/MainHeader';
import { useNfcScan } from '../../hooks/scan/useNfcScan';
import { useTranslation } from '../../i18n/LanguageContext';
import { checkAccess } from '../../service/scan.service';
import { useScanStore } from '../../store/scan.store';
import { getDeviceId } from '../../utils/device';
import { getRoomId } from '../../utils/roomConfig';

export default function ScanHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    scan,
    isScanning,
    error: nfcError,
  } = useNfcScan();

  const setResult = useScanStore((s) => s.setResult);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(async () => {
    setError(null);

    const cardSerial = await scan();

    if (!cardSerial) {
      setError(nfcError ? t(nfcError) : t('scan.failed'));
      return;
    }

    setProcessing(true);

    try {
      const [deviceId, roomId] = await Promise.all([
        getDeviceId(),
        getRoomId(),
      ]);

      const response = await checkAccess({
        cardSerial,
        deviceId,
        roomId,
      });

      setResult(response);

      router.push(
        response.allowed ? '/allowed' : '/not-allowed'
      );
    } catch {
      setError(t('scan.requestFailed'));
    } finally {
      setProcessing(false);
    }
  }, [scan, nfcError, setResult, router, t]);

  const busy = isScanning || processing;

  return (
    <View style={styles.container}>
      <MainHeader />

      <View style={styles.content}>
        <Text style={styles.title}>
          {t('scan.restaurantTitle')}
        </Text>

        <View style={styles.titleUnderline} />

        <Pressable
          style={styles.cardFrame}
          onPress={handleScan}
          disabled={busy}
        >
          <Image
            source={require('../../../assets/images/nfc-scan.png')}
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

        {!!error && (
          <Text style={styles.error}>
            {error}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  title: {
    fontFamily: Fonts.heading,
    fontSize: 45,
    color: Colors.gold,
    letterSpacing: 2,
  },

  titleUnderline: {
    width: 220,
    height: 1.2,
    backgroundColor: Colors.border,
    marginTop: 6,
    marginBottom: 38,
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

    // Shadow - iOS
    shadowColor: Colors.textSecondary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,

    // Shadow - Android
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

  error: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.error,
    marginTop: 16,
    textAlign: 'center',
  },
});

// import { useRouter } from 'expo-router';
// import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
// import MainHeader from '../../components/common/MainHeader';
// import { useTranslation } from '../../i18n/LanguageContext';
// import { useScanStore } from '../../store/scan.store';

// const MOCK_ALLOWED = {
//   allowed: true as const,
//   allowedAreas: [
//     { id: 1, name: 'Restaurant', type: 'RESTAURANT' },
//     { id: 2, name: 'Pool', type: 'POOL' },
//     { id: 3, name: 'Gym', type: 'GYM' },
//   ],
//   reservationDetails: {
//     guestName: 'Ahmed Mahmoud',
//     roomNumber: 1005,
//     allowedCompanions: 5,
//     reservationCategory: 'HB',
//     checkIn: '2026-05-10T00:00:00.000Z',
//     checkOut: '2026-05-15T00:00:00.000Z',
//   },
// };

// const MOCK_NOT_ALLOWED = {
//   allowed: false as const,
//   reason: 'No valid restaurant package found',
//   allowedAreas: [
//     { id: 1, name: 'Restaurant', type: 'RESTAURANT' },
//     { id: 2, name: 'Pool', type: 'POOL' },
//     { id: 3, name: 'Gym', type: 'GYM' },
//   ],
// };

// export default function ScanHomeScreen() {
//   const router = useRouter();
//   const { t } = useTranslation();
//   const setResult = useScanStore((s) => s.setResult);

//   const goAllowed = () => {
//     setResult(MOCK_ALLOWED);
//     router.push('/allowed');
//   };

//   const goNotAllowed = () => {
//     setResult(MOCK_NOT_ALLOWED);
//     router.push('/not-allowed');
//   };

//   return (
//     <View style={styles.container}>
//       <MainHeader />

//       <View style={styles.content}>
//         <Text style={styles.title}>{t('scan.restaurantTitle')}</Text>
//         <View style={styles.titleUnderline} />

//         <Pressable style={styles.cardFrame} onPress={goAllowed}>
//           <Image
//             source={require('../../../assets/images/nfc-scan.png')}
//             style={styles.cardImage}
//             resizeMode="cover"
//           />
//         </Pressable>

//         <Text style={styles.tapText}>{t('scan.tapToScan')}</Text>
//         <Text style={styles.hintText}>{t('scan.hint')}</Text>

//         <View style={styles.devRow}>
//           <Pressable style={[styles.devBtn, styles.devBtnGreen]} onPress={goAllowed}>
//             <Text style={styles.devBtnText}>Allowed Screen</Text>
//           </Pressable>
//           <Pressable style={[styles.devBtn, styles.devBtnRed]} onPress={goNotAllowed}>
//             <Text style={styles.devBtnText}>Not Allowed Screen</Text>
//           </Pressable>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#ffffff' },
//   content: { flex: 1, alignItems: 'center', paddingTop: 24, paddingHorizontal: 28 },
//   title: { fontSize: 26, fontWeight: '700', color: '#c9a25a' },
//   titleUnderline: { width: 60, height: 2, backgroundColor: '#c9a25a', marginTop: 6, marginBottom: 28 },
//   cardFrame: {
//     width: 230,
//     height: 230,
//     borderRadius: 16,
//     borderWidth: 2,
//     borderColor: '#2f8fe0',
//     overflow: 'hidden',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f4f4f4',
//   },
//   cardImage: { width: '100%', height: '100%' },
//   tapText: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginTop: 18 },
//   hintText: { fontSize: 12, color: '#9a9a9a', marginTop: 4 },
//   devRow: { flexDirection: 'row', gap: 10, marginTop: 30 },
//   devBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
//   devBtnGreen: { backgroundColor: '#e6f4ea' },
//   devBtnRed: { backgroundColor: '#fdecea' },
//   devBtnText: { fontSize: 12, fontWeight: '600', color: '#333' },
// });