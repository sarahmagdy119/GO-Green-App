import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors, Fonts } from '../../constants/theme';

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  error?: string;
  isRTL?: boolean;
}

export default function AuthInput({
  label,
  value,
  onChangeText,
  icon,
  secureTextEntry,
  error,
  isRTL,
}: AuthInputProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.row, isRTL && styles.rowRTL]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor={Colors.textSecondary}
          secureTextEntry={secureTextEntry}
          style={[styles.input, isRTL && styles.inputRTL]}
        />
        <Ionicons name={icon} size={18} color={Colors.gold} />
      </View>

      <View style={[styles.underlineRow, isRTL && styles.underlineRowRTL]}>
        <View style={styles.dot} />
        <View style={styles.underline} />
      </View>

      {!!error && <Text style={[styles.error, isRTL && styles.errorRTL]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowRTL: { flexDirection: 'row-reverse' },
  input: { flex: 1, fontSize: 14, color: Colors.textPrimary, paddingVertical: 6, fontFamily: Fonts.body },
  inputRTL: { textAlign: 'right' },
  underlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  underlineRowRTL: {
    flexDirection: 'row-reverse',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.gold,
  },
  underline: { flex: 1, height: 1, backgroundColor: Colors.gold },
  error: { color: Colors.error, fontSize: 12, marginTop: 4, fontFamily: Fonts.body },
  errorRTL: { textAlign: 'right' },
});