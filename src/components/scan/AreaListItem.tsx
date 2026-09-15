import { Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { AllowedArea } from '../../types/scan.types';
import { getAreaIcon } from '../../utils/areaIcons';

interface AreaListItemProps {
  area: AllowedArea;
  subtitle?: string;
}

export default function AreaListItem({ area, subtitle }: AreaListItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name={getAreaIcon(area.type)} size={18} color="#c9a25a" />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.name}>{area.name}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.dot} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textWrap: { flex: 1 , },
  name: { fontSize: 13, color: '#1a1a1a', fontFamily: Fonts.body  },
  subtitle: { fontSize: 11, color: '#9a9a9a', marginTop: 2 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#c9a25a' },
});