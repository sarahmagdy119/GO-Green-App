// components/scan/LogHistoryModal.tsx
import { Colors, Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../i18n/LanguageContext';
import { TowelLogItem, TowelSummaryItem } from '../../types/scan.types';
import { formatDate } from '../../utils/date';

interface Props {
  visible: boolean;
  room: TowelSummaryItem | null;
  logs: TowelLogItem[];
  loading?: boolean;
  onClose: () => void;
}

export default function LogHistoryModal({ visible, room, logs, loading, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={18} color="#7a7a7a" />
          </Pressable>

          {room && (
            <>
              <Text style={styles.roomId}>{room.roomId}</Text>
              <Text style={styles.guestName}>{room.guestName}</Text>
            </>
          )}

          {loading ? (
            <ActivityIndicator color={Colors.navy} style={styles.loadingIndicator} />
          ) : logs.length === 0 ? (
            <Text style={styles.emptyText}>{t('scan.noHistoryFound')}</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {logs.map((log) => (
                <View key={log.id} style={styles.entry}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>
                      {log.status === 'OUT' ? t('scan.towelsTakenTitle') : t('scan.towelsReturnedTitle')}
                    </Text>
                    <Text style={styles.entryDate}>{formatDate(log.createdAt)}</Text>
                  </View>
                  <Text style={styles.entryDetail}>
                    {t('scan.numberOfTowels')}: {log.quantity}
                  </Text>
                  {!!log.location && (
                    <Text style={styles.entryDetail}>
                      {t('scan.location')}: {log.location}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
  },
  closeButton: { position: 'absolute', top: 12, right: 12, zIndex: 1 },
  roomId: {
    fontFamily: Fonts.heading,
    fontSize: 25,
    color: Colors.gold,
    textAlign: 'center',
  },
  guestName: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.navy,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  loadingIndicator: { marginTop: 24, marginBottom: 12 },
  emptyText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: '#9a9a9a',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  entry: {
    backgroundColor: '#f6f6f8',
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  entryTitle: {
    fontFamily: Fonts.heading,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.navy,
  },
  entryDate: { fontFamily: Fonts.body, fontSize: 10, color: '#9a9a9a' },
  entryDetail: { fontFamily: Fonts.body, fontSize: 12, color: '#4a4a4a', marginTop: 2 },
});