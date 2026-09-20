import { Colors, Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ClientDetailsCard from '../../../components/common/ClientDetails';
import MainHeader from '../../../components/common/MainHeader';
import { useTranslation } from '../../../i18n/LanguageContext';
import { submitTowelMovement } from '../../../service/scan.service';
import { useScanStore } from '../../../store/scan.store';
import { TowelStatus } from '../../../types/scan.types';

type ConfirmationKind = 'TAKEN' | 'RETURNED' | null;

export default function TowelDetailsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const towelResult = useScanStore((s) => s.towelResult);
  const towelContext = useScanStore((s) => s.towelContext);
  const setTowelResult = useScanStore((s) => s.setTowelResult);

  const [activeTab, setActiveTab] = useState<TowelStatus>('OUT');
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationKind>(null);
  const [error, setError] = useState<string | null>(null);

  const reservation = towelResult?.reservationDetails;
  const towel = towelResult?.towelDetails;

  const handleBackToScan = () => router.replace('/');

  const maxForTab = activeTab === 'OUT' ? (towel?.remaining ?? 0) : (towel?.taken ?? 0);

  const increment = () => {
    if (quantity < maxForTab) setQuantity((q) => q + 1);
  };

  const decrement = () => {
    if (quantity > 0) setQuantity((q) => q - 1);
  };

  const handleTabChange = (tab: TowelStatus) => {
    setActiveTab(tab);
    setQuantity(0);
  };

  const handleSubmit = async () => {
    console.log('towelContext:', towelContext, 'towelResult:', !!towelResult, 'quantity:', quantity);

    if (quantity <= 0 || !towelResult || !towelContext) return;

    setError(null);
    setSubmitting(true);

    try {
      const response = await submitTowelMovement({
        cardSerial: towelContext.cardSerial,
        deviceId: towelContext.deviceId,
        quantity,
        status: activeTab,
        roomId: towelContext.roomId,
      });

      setTowelResult({
        ...towelResult,
        towelDetails: response.towelDetails,
      });

      setConfirmation(activeTab === 'OUT' ? 'TAKEN' : 'RETURNED');
      setQuantity(0);
      setTimeout(() => setConfirmation(null), 3000);
    } catch (err) {
      console.log('submitTowelMovement error:', err);
      setError(t('scan.requestFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container}>
        <MainHeader />

        <View style={styles.content}>
          {reservation && (
            <ClientDetailsCard
              title={t('scan.clientDetails')}
              rows={[
                { label: t('scan.guestName'), value: reservation.guestName },
                {
                  label: t('scan.roomNumber'),
                  value: reservation.roomNumber,
                  highlight: true,
                },
                {
                  label: t('scan.numberOfGuests'),
                  value: String(reservation.allowedCompanions),
                },
                { label: t('scan.towelsTaken'), value: String(towel?.taken ?? 0) },
              ]}
            />
          )}

          {towel && (
            <View style={styles.trackingCard}>
              <Text style={styles.cardTitle}>{t('scan.towelTracking')}</Text>
              <Text style={styles.cardSubtitle}>{t('scan.trackGuestTowelUsage')}</Text>

              <View style={styles.tabRow}>
                <Pressable style={styles.tab} onPress={() => handleTabChange('IN')}>
                  <Ionicons
                    name="arrow-down-circle-outline"
                    size={16}
                    color={activeTab === 'IN' ? Colors.navy : '#9a9a9a'}
                    style={styles.tabIcon}
                  />
                  <Text style={[styles.tabText, activeTab === 'IN' && styles.tabTextActive]}>
                    {t('scan.towelsIn')}
                  </Text>
                  {activeTab === 'IN' && <View style={styles.tabUnderline} />}
                </Pressable>

                <Pressable style={styles.tab} onPress={() => handleTabChange('OUT')}>
                  <Ionicons
                    name="arrow-up-circle-outline"
                    size={16}
                    color={activeTab === 'OUT' ? Colors.navy : '#9a9a9a'}
                    style={styles.tabIcon}
                  />
                  <Text style={[styles.tabText, activeTab === 'OUT' && styles.tabTextActive]}>
                    {t('scan.towelsOut')}
                  </Text>
                  {activeTab === 'OUT' && <View style={styles.tabUnderline} />}
                </Pressable>
              </View>

              <LinearGradient
                colors={activeTab === 'OUT' ? ['#cba15c', '#8a6a2f'] : ['#1c2b4a', '#0f1930']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.counterBox}
              >
                <Text style={styles.counterBoxTitle}>
                  {activeTab === 'OUT' ? t('scan.towelsTaken') : t('scan.towelsReturned')}
                </Text>

                <View style={styles.counterRow}>
                  <Pressable style={styles.counterButton} onPress={decrement} disabled={quantity <= 0}>
                    <Ionicons name="remove" size={18} color={Colors.navy} />
                  </Pressable>

                  <Text style={styles.counterValue}>{quantity}</Text>

                  <Pressable
                    style={styles.counterButton}
                    onPress={increment}
                    disabled={quantity >= maxForTab}
                  >
                    <Ionicons name="add" size={18} color={Colors.navy} />
                  </Pressable>
                </View>

                <Text style={styles.outOfText}>
                  {maxForTab} {t('scan.outOfAllowed')}
                </Text>
              </LinearGradient>

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <Pressable
                style={[styles.submitButton, (quantity <= 0 || submitting) && styles.submitDisabled]}
                onPress={handleSubmit}
                disabled={quantity <= 0 || submitting}
              >
                <Text style={styles.submitText}>
                  {submitting ? t('scan.submitting') : t('scan.submit')}
                </Text>
              </Pressable>

              <View style={styles.remainingRow}>
                <Text style={styles.remainingLabel}>{t('scan.remainingAvailable')}</Text>
                <Text style={styles.remainingValue}>{towel.remaining}</Text>
              </View>
            </View>
          )}

          <Pressable style={styles.backButton} onPress={handleBackToScan}>
            <Text style={styles.backButtonText}>{t('scan.backToScan')}</Text>
          </Pressable>
        </View>
      </ScrollView>

      {confirmation && (
        <View style={styles.toast}>
          <Text style={styles.toastLabel}>{t('scan.confirm')}</Text>
          <Text
            style={[
              styles.toastTitle,
              confirmation === 'TAKEN' ? styles.toastTitleBlue : styles.toastTitleGreen,
            ]}
          >
            {confirmation === 'TAKEN' ? t('scan.towelsTakenTitle') : t('scan.towelsReturnedTitle')}
          </Text>
          <Text style={styles.toastSubtitle}>
            {confirmation === 'TAKEN'
              ? t('scan.towelsTakenSubtitle')
              : t('scan.towelsReturnedSubtitle')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 240, paddingBottom: 54 },
  trackingCard: {
    width: '90%',
    backgroundColor: 'rgba(233, 235, 239, 0.5)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 19,
    color: Colors.navy,
    textAlign: 'center',
    fontFamily: Fonts.heading,
    letterSpacing: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Fonts.body,
    letterSpacing: 1,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabIcon: { marginRight: 6 },
  tabText: { fontFamily: Fonts.body, fontSize: 14, color: '#9a9a9a' },
  tabTextActive: { color: Colors.navy, fontWeight: '600' },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#c9a25a',
  },
  counterBox: {
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  counterBoxTitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: '#ffffffcc',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    marginBottom: 10,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontFamily: Fonts.heading,
    fontSize: 40,
    color: '#ffffff',
    minWidth: 60,
    textAlign: 'center',
  },
  outOfText: {
    textAlign: 'center',
    fontFamily: Fonts.body,
    fontSize: 13,
    color: '#ffffffcc',
  },
  errorText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    width: '45%',
    alignSelf: 'center',
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: '#c9a25a', fontSize: 14, fontWeight: '700', fontFamily: Fonts.body },
  remainingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#0000001A',
  },
  remainingLabel: { fontFamily: Fonts.body, fontSize: 14, color: Colors.navy },
  remainingValue: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: '#c9a25a',
    fontWeight: '700',
  },
  backButton: {
    backgroundColor: '#16233f',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginBottom: 8,
  },
  backButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '600', fontFamily: Fonts.body },
  toast: {
    position: 'absolute',
    top: 44,
    left: 54,
    right: 54,
    zIndex: 100,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 12,
  },
  toastLabel: { fontFamily: Fonts.body, fontSize: 12, color: '#b0b0b0', marginBottom: 6 },
  toastTitle: { fontFamily: Fonts.heading, fontSize: 16, marginBottom: 4 },
  toastTitleBlue: { color: '#3478f6' },
  toastTitleGreen: { color: '#34c759' },
  toastSubtitle: { fontFamily: Fonts.body, fontSize: 12, color: '#7a7a7a' },
});