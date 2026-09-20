import { Colors, Fonts } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export type ClientDetailRow = {
  label: string;
  value: string;
  highlight?: boolean;
};

type ClientDetailsCardProps = {
  title: string;
  rows: ClientDetailRow[];
};

export default function ClientDetailsCard({ title, rows }: ClientDetailsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {rows.map((row, index) => (
        <DetailRow
          key={row.label}
          label={row.label}
          value={row.value}
          highlight={row.highlight}
          last={index === rows.length - 1}
        />
      ))}
    </View>
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
  card: {
    width: '100%',
    backgroundColor: 'rgba(233, 235, 239, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 19,
    color: Colors.navy,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: Fonts.heading,
    letterSpacing: 1,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#0000001A' },
  rowLabel: { fontSize: 13, color: '#7a7a7a', fontFamily: Fonts.body },
  rowValue: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', fontFamily: Fonts.body },
  rowValueHighlight: { color: '#c9a25a', fontFamily: Fonts.heading, fontSize: 16 },
});