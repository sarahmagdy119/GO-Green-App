  import { Colors, Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MainHeader from '../../components/common/MainHeader';
import AreaListItem from '../../components/scan/AreaListItem';
import { useTranslation } from '../../i18n/LanguageContext';
import { useScanStore } from '../../store/scan.store';
import { formatDate } from '../../utils/date';
import { getHeaderContentHeight } from '../../utils/headerMetrics';
import { getReservationCategoryLabel } from '../../utils/reservationCategory';

  const BADGE_SIZE = 48;
  const GROUP_BOTTOM_SPACING = 34;

  export default function AllowedScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const result = useScanStore((s) => s.result);
    const [groupHeight, setGroupHeight] = useState(0);

    const headerHeight = getHeaderContentHeight() + insets.top;
    const badgeTop = headerHeight - BADGE_SIZE;

    const reservation = result?.reservationDetails;
    const areas = result?.allowedAreas ?? [];
    const [expanded, setExpanded] = useState(false);
    const visibleAreas = expanded ? areas : areas.slice(0, 3);
    const hasMore = !expanded && areas.length > 3;

    const handleBackToScan = () => router.replace('/');

    const onGroupLayout = (e: LayoutChangeEvent) => {
      setGroupHeight(e.nativeEvent.layout.height);
    };

    const contentPaddingTop =
      groupHeight > 0 ? badgeTop + groupHeight + GROUP_BOTTOM_SPACING : headerHeight + 80;

    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView style={styles.container}>
          <MainHeader />

          <View
            onLayout={onGroupLayout}
            style={[styles.badgeGroup, { top: 140, alignSelf: 'center' }]}
          >
            <View style={styles.badge}>
              <Ionicons name="checkmark" size={28} color="#ffffff" />
            </View>
            <Text style={styles.allowedText}>{t('scan.allowed')}</Text>
            <View style={styles.allowedUnderline} />
          </View>

          <View
            style={[styles.content, { paddingTop: 270 }]}
          >
            {reservation && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{t('scan.clientDetails')}</Text>

                <DetailRow label={t('scan.guestName')} value={reservation.guestName} />
                <DetailRow
                  label={t('scan.roomNumber')}
                  value={String(reservation.roomNumber)}
                  highlight
                />
                <DetailRow
                  label={t('scan.allowedCompanions')}
                  value={`${reservation.allowedCompanions} ${t('scan.guests')}`}
                />
                <DetailRow
                  label={t('scan.reservationCategory')}
                  value={getReservationCategoryLabel(reservation.reservationCategory)}
                />
                <DetailRow label={t('scan.checkIn')} value={formatDate(reservation.checkIn)} />
                <DetailRow
                  label={t('scan.checkOut')}
                  value={formatDate(reservation.checkOut)}
                  last
                />
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

  function DetailRow({
    label,
    value,
    highlight,
    last,
  }: {
    label: string;
    value: string;
    highlight?: boolean;
    last?: boolean;
  }) {
    return (
      <View style={[styles.row, !last && styles.rowBorder]}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>{value}</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    container: { flex: 1, backgroundColor: '#ffffff' },
    badgeGroup: {
      position: 'absolute',
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
    content: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24 },
    card: {
      width: '100%',
      backgroundColor: 'rgba(233, 235, 239, 0.5)',
      borderRadius: 12,
      padding: 16,
      marginBottom: 18,
    },
    cardTitle: { fontSize: 19, color: Colors.navy, textAlign: 'center', marginBottom: 12 , fontFamily: Fonts.heading , letterSpacing: 1},
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
    rowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#0000001A' },
    rowLabel: { fontSize: 13, color: '#7a7a7a', fontFamily: Fonts.body },
    rowValue: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', fontFamily: Fonts.body },
    rowValueHighlight: { color: '#c9a25a', fontFamily: Fonts.heading , fontSize: 16 },
    backButton: {
      backgroundColor: '#16233f',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 32,
      marginBottom: 24,
    },
    backButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '600', fontFamily: Fonts.body },
    sectionTitle: { fontSize: 19, color: '#16233f', alignSelf: 'center', marginBottom: 19, fontFamily: Fonts.heading },
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