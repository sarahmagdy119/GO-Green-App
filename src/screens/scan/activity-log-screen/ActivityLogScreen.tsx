import { Colors, Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '../../../components/common/MainHeader';
import ActivityLogRow from '../../../components/scan/ActivityLogRow';
import LogHistoryModal from '../../../components/scan/LogHistoryModal';
import { useTranslation } from '../../../i18n/LanguageContext';
import {
  bulkReturnTowels,
  getTowelLogs,
  getTowelSummary,
} from '../../../service/scan.service';
import { TowelLogItem, TowelSummaryItem } from '../../../types/scan.types';

export default function ActivityLogScreen() {
  const router = useRouter();
  const { t, language } = useTranslation();

  const [items, setItems] = useState<TowelSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [returning, setReturning] = useState(false);

  const [modalRoom, setModalRoom] = useState<TowelSummaryItem | null>(null);
  const [modalLogs, setModalLogs] = useState<TowelLogItem[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);

  const activeRooms = items.length;
  const totalTowelsOut = items.reduce((sum, i) => sum + i.towelsOut, 0);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await getTowelSummary(language);
      setItems(summary.items);
    } catch {
      setError(t('scan.requestFailed'));
    } finally {
      setLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const toggleSelect = (roomId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) next.delete(roomId);
      else next.add(roomId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.roomId)));
    }
  };

  const handleView = async (item: TowelSummaryItem) => {
    setModalRoom(item);
    setModalLoading(true);
    try {
      const logs = await getTowelLogs({ roomId: item.roomId }, language);
      setModalLogs(logs.items);
    } catch {
      setModalLogs([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSingleDelete = async (roomId: string) => {
    try {
      await bulkReturnTowels([roomId], language);
      setItems((prev) => prev.filter((i) => i.roomId !== roomId));
    } catch {
      setError(t('scan.requestFailed'));
    }
  };

  const handleMarkAsReturned = () => {
    if (!selectionMode) {
      setSelectionMode(true);
      return;
    }
    if (selectedIds.size === 0) return;
    setConfirmVisible(true);
  };

  const handleConfirmReturn = async () => {
    setReturning(true);
    try {
      await bulkReturnTowels(Array.from(selectedIds), language);
      setItems((prev) => prev.filter((i) => !selectedIds.has(i.roomId)));
      setSelectedIds(new Set());
      setSelectionMode(false);
    } catch {
      setError(t('scan.requestFailed'));
    } finally {
      setReturning(false);
      setConfirmVisible(false);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmVisible(false);
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.roomId}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <View style={styles.headerWrapper}>
                <MainHeader />
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                  <Text style={styles.backButtonText}>{t('scan.back')}</Text>
                </Pressable>
              </View>

              <View style={styles.headerContent}>
                <View style={styles.banner}>
                  <Text style={styles.bannerTitle}>{t('scan.towelActivityLog')}</Text>
                  <View style={styles.bannerStatsRow}>
                    <View style={styles.bannerStat}>
                      <Text style={styles.bannerStatLabel}>{t('scan.activeRooms')}</Text>
                      <Text style={styles.bannerStatValue}>{activeRooms}</Text>
                    </View>
                    <View style={styles.bannerDivider} />
                    <View style={styles.bannerStat}>
                      <Text style={styles.bannerStatLabel}>{t('scan.towelsOutCount')}</Text>
                      <Text style={styles.bannerStatValue}>{totalTowelsOut}</Text>
                    </View>
                  </View>
                </View>

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.actionBar}>
                  {selectionMode ? (
                    <>
                      <Pressable onPress={toggleSelectAll} style={styles.actionBarSideButton}>
                        <Text style={styles.actionBarText}>
                          {selectedIds.size === items.length
                            ? t('scan.deselectAll')
                            : t('scan.selectAll')}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={handleMarkAsReturned}
                        disabled={selectedIds.size === 0 || returning}
                        style={styles.actionBarCenterButton}
                      >
                        <Ionicons name="checkbox-outline" size={16} color="#ffffff" />
                        <Text
                          style={[
                            styles.actionBarText,
                            styles.actionBarCenterText,
                            selectedIds.size === 0 && styles.actionBarTextDisabled,
                          ]}
                        >
                          {t('scan.markAsReturned')} ({selectedIds.size})
                        </Text>
                      </Pressable>
                      <Pressable onPress={handleCancelSelection} style={styles.actionBarSideButton}>
                        <Text style={styles.actionBarText}>{t('scan.cancel')}</Text>
                      </Pressable>
                    </>
                  ) : (
                    <Pressable onPress={handleMarkAsReturned} style={styles.actionBarFullButton}>
                      <Ionicons name="checkbox-outline" size={16} color="#ffffff" />
                      <Text style={[styles.actionBarText, styles.actionBarCenterText]}>
                        {t('scan.markAsReturned')}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <ActivityLogRow
                item={item}
                selectionMode={selectionMode}
                selected={selectedIds.has(item.roomId)}
                onToggleSelect={toggleSelect}
                onView={handleView}
                onDelete={handleSingleDelete}
              />
            </View>
          )}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator color={Colors.navy} style={styles.loadingIndicator} />
            ) : (
              <Text style={styles.emptyText}>{t('scan.noActiveTowels')}</Text>
            )
          }
        />

        <LogHistoryModal
          visible={!!modalRoom}
          room={modalRoom}
          logs={modalLogs}
          loading={modalLoading}
          onClose={() => setModalRoom(null)}
        />

        <Modal
          visible={confirmVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancelConfirm}
        >
          <View style={styles.confirmBackdrop}>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmTitle}>{t('scan.markAsReturned')}</Text>
              <Text style={styles.confirmMessage}>{t('scan.confirmationMessage')}</Text>
              <View style={styles.confirmButtonsRow}>
                <Pressable onPress={handleCancelConfirm} style={styles.confirmCancelButton}>
                  <Text style={styles.confirmCancelText}>{t('scan.cancel')}</Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirmReturn}
                  disabled={returning}
                  style={styles.confirmConfirmButton}
                >
                  <Text style={styles.confirmConfirmText}>
                    {returning ? t('scan.submitting') : t('scan.confirm')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, backgroundColor: '#ffffff' },

  headerWrapper: {
    position: 'relative',
  },

  headerContent: { paddingTop: 200 },

  backButton: {
    position: 'absolute',
    top: 170,
    left: 20,
    zIndex: 10,
    backgroundColor: Colors.navy,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  backButtonText: { fontFamily: Fonts.body, fontSize: 13, color: '#ffffff' },

  banner: {
    backgroundColor: Colors.gold,
    marginHorizontal: 20,
    marginTop: 29,
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  bannerTitle: {
    fontFamily: Fonts.heading,
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 14,
  },
  bannerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerStat: { alignItems: 'center', paddingHorizontal: 28 },
  bannerStatLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  bannerStatValue: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  bannerDivider: {
    width: 1,
    height: 34,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  errorText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: '#c0392b',
    textAlign: 'center',
    marginTop: 12,
    marginHorizontal: 20,
  },

  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.navy,
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  actionBarFullButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBarCenterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBarSideButton: { paddingHorizontal: 4 },
  actionBarText: { color: '#ffffff', fontFamily: Fonts.body, fontSize: 12 },
  actionBarCenterText: { fontWeight: '600' },
  actionBarTextDisabled: { opacity: 0.4 },

  listContent: { paddingBottom: 24 },
  row: { paddingHorizontal: 20, paddingTop: 12 },

  loadingIndicator: { marginTop: 40 },
  emptyText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: '#7a7a7a',
    textAlign: 'center',
    marginTop: 40,
  },

  confirmBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  confirmCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
  },
  confirmTitle: {
    fontFamily: Fonts.heading,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 8,
  },
  confirmMessage: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: '#7a7a7a',
    marginBottom: 20,
  },
  confirmButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 20,
  },
  confirmCancelButton: { paddingHorizontal: 8, paddingVertical: 8 },
  confirmCancelText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.navy },
  confirmConfirmButton: {
    backgroundColor: Colors.navy,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  confirmConfirmText: { fontFamily: Fonts.body, fontSize: 13, color: '#ffffff', fontWeight: '600' },
});