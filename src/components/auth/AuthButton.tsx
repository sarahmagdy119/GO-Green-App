import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Colors, Fonts, Radius } from '../../constants/theme';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function AuthButton({ title, onPress, loading, disabled }: AuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.navy,
    borderRadius: Radius.lg,
    paddingVertical: 13,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  text: { color: Colors.white, fontSize: 15, fontWeight: '500', fontFamily: Fonts.body },
});