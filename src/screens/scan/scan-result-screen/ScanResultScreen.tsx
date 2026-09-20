import MainHeader from '@/components/common/MainHeader';
import { Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClientDetailsCard from '../../../components/common/ClientDetails';
import AreaListItem from '../../../components/scan/AreaListItem';
import { useTranslation } from '../../../i18n/LanguageContext';
import { useScanStore } from '../../../store/scan.store';
import { formatDate } from '../../../utils/date';
import { getReservationCategoryLabel } from '../../../utils/reservationCategory';

const BADGE_SIZE = 48;

export default function ScanRsesultScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const result = useScanStore((s) => s.result);
  const [expanded, setExpanded] = useState(false);

  const isAllowed = !!result?.allowed;
  const reservation = result?.reservationDetails;
  const areas = result?.allowedAreas ?? [];
  const visibleAreas = expanded ? areas : areas.slice(0, 3);
  const hasMore = !expanded && areas.length > 3;

  const handleBackToScan = () => router.replace('/');

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        <MainHeader />

        {isAllowed && (
          <View style={styles.badgeGroup}>
            <View style={styles.badge}>
              <Ionicons name="checkmark" size={28} color="#ffffff" />
            </View>
            <Text style={styles.allowedText}>{t('scan.allowed')}</Text>
            <View style={styles.allowedUnderline} />
          </View>
        )}

        <View style={[styles.content, isAllowed ? styles.contentAllowed : styles.contentNotAllowed]}>
          {isAllowed ? (
            reservation && (
              <ClientDetailsCard
                title={t('scan.clientDetails')}
                rows={[
                  { label: t('scan.guestName'), value: reservation.guestName },
                  {
                    label: t('scan.roomNumber'),
                    value: String(reservation.roomNumber),
                    highlight: true,
                  },
                  {
                    label: t('scan.allowedCompanions'),
                    value: `${reservation.allowedCompanions} ${t('scan.guests')}`,
                  },
                  {
                    label: t('scan.reservationCategory'),
                    value: getReservationCategoryLabel(reservation.reservationCategory),
                  },
                  { label: t('scan.checkIn'), value: formatDate(reservation.checkIn) },
                  { label: t('scan.checkOut'), value: formatDate(reservation.checkOut) },
                ]}
              />
            )
          ) : (
            <View style={styles.notAllowedBox}>
              <View style={styles.iconWrap}>
                <Ionicons name="ban-outline" size={40} color="#B23A3A" />
              </View>
              <Text style={styles.notAllowedText}>{t('scan.notAllowed')}</Text>
              <View style={styles.notAllowedUnderline} />
            </View>
          )}

          <Pressable style={styles.backButton} onPress={handleBackToScan}>
            <Text style={styles.backButtonText}>{t('scan.backToScan')}</Text>
          </Pressable>

          <Text style={styles.sectionTitle}>{t('scan.accessibleAreas')}</Text>

          {visibleAreas.map((area) => (
            <AreaListItem key={area.id} area={area} />
          ))}

          {hasMore && (
            <Pressable style={styles.viewMore} onPress={() => setExpanded(true)}>
              <Text style={styles.viewMoreText}>{t('scan.viewMore')}</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, backgroundColor: '#ffffff' },

  content: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24 },
  contentAllowed: { paddingTop: 270 },
  contentNotAllowed: { marginTop: '55%' },

  badgeGroup: {
    position: 'absolute',
    top: 140,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 20,
    elevation: 20,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: '#c9a25a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  allowedText: { fontSize: 36, color: '#c9a25a', marginTop: 10, fontFamily: Fonts.heading },
  allowedUnderline: { width: 90, height: 1.2, backgroundColor: '#c9a25a', marginTop: 4 },

  notAllowedBox: {
    width: 290,
    height: 190,
    borderWidth: 3.5,
    borderColor: '#B23A3A',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    marginBottom: 20,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3.5,
    borderColor: '#B23A3A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0px 0px 8px 2px rgba(178, 58, 58, 0.45)',
  },
  notAllowedText: { fontSize: 36, color: '#B23A3A', fontFamily: Fonts.heading },
  notAllowedUnderline: { width: 150, height: 1.2, backgroundColor: '#B23A3A', marginTop: 4 },

  backButton: {
    backgroundColor: '#16233f',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  backButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '600', fontFamily: Fonts.body },
  sectionTitle: {
    fontSize: 19,
    color: '#16233f',
    alignSelf: 'center',
    marginBottom: 19,
    fontFamily: Fonts.heading,
  },
  viewMore: {
    borderWidth: 1,
    borderColor: '#c9a25a',
    borderRadius: 10,
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  viewMoreText: { color: '#c9a25a', fontSize: 13, fontWeight: '600', fontFamily: Fonts.body },
});