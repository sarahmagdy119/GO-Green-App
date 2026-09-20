import { Colors, Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from '../../i18n/LanguageContext';
import { TowelSummaryItem } from '../../types/scan.types';

interface Props {
  item: TowelSummaryItem;
  selectionMode: boolean;
  selected: boolean;
  onToggleSelect: (roomId: string) => void;
  onView: (item: TowelSummaryItem) => void;
  onDelete: (roomId: string) => void | Promise<void>;
}

const SWIPE_THRESHOLD = -60;

export default function ActivityLogRow({
  item,
  selectionMode,
  selected,
  onToggleSelect,
  onView,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const translateX = useRef(new Animated.Value(0)).current;
  const [deleting, setDeleting] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        !selectionMode && Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < 0) {
          translateX.setValue(Math.max(gesture.dx, -90));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < SWIPE_THRESHOLD) {
          Animated.spring(translateX, { toValue: -90, useNativeDriver: true }).start();
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const resetSwipe = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
  };

  const handleDelete = async () => {
    if (deleting) return;
    resetSwipe();
    setDeleting(true);
    try {
      await onDelete(item.roomId);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.deleteBackground}>
        <Pressable onPress={handleDelete} style={styles.deleteButton} disabled={deleting}>
          {deleting ? (
            <ActivityIndicator size="small" color="#c0392b" />
          ) : (
            <Ionicons name="trash" size={24} color="#c0392b" />
          )}
        </Pressable>
      </View>

      <Animated.View
        style={[styles.row, { transform: [{ translateX }] }]}
        {...(selectionMode ? {} : panResponder.panHandlers)}
      >
        {selectionMode && (
          <Pressable onPress={() => onToggleSelect(item.roomId)} style={styles.checkbox}>
            <Ionicons
              name={selected ? 'checkbox' : 'square-outline'}
              size={20}
              color={Colors.gold}
            />
          </Pressable>
        )}

        <View style={styles.column}>
          <Text style={styles.label}>{t('scan.roomLabel')}</Text>
          <Text style={styles.roomId}>{item.roomId}</Text>
        </View>

        <View style={[styles.column, styles.guestColumn]}>
          <Text style={styles.label}>{t('scan.guestLabel')}</Text>
          <Text style={styles.guestName}>{item.guestName}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>{t('scan.towelsLabel')}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{item.towelsOut}</Text>
          </View>
        </View>

        {!selectionMode && (
          <View style={styles.column}>
            <Text style={styles.label}>{t('scan.statusLabel')}</Text>
            <Pressable onPress={() => onView(item)} style={styles.viewButton}>
              <Ionicons name="eye-outline" size={16} color={Colors.navy} />
            </Pressable>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  deleteBackground: {
    ...StyleSheet.absoluteFill,
    borderRadius: 12,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  deleteButton: { paddingHorizontal: 24, height: '100%', justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  checkbox: { marginRight: 10 },
  column: { alignItems: 'flex-start', marginRight: 18 },
  guestColumn: { flex: 1 },
  label: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: '#9a9a9a',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  roomId: { fontFamily: Fonts.heading, fontSize: 16, fontWeight: '700', color: Colors.gold },
  guestName: { fontFamily: Fonts.body, fontSize: 13, color: Colors.navy },
  countBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { color: '#ffffff', fontSize: 12, fontFamily: Fonts.body, fontWeight: '600' },
  viewButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
});