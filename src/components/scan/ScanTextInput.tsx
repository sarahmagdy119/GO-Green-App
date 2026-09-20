import { Fonts } from '@/constants/theme';
import { forwardRef } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

const BORDER_COLOR = '#c9a25a';

interface ScanTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  error?: boolean;
}

const ScanTextInput = forwardRef<TextInput, ScanTextInputProps>(
  (
    {
      containerStyle,
      error,
      placeholderTextColor = '#9a9a9a',
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <View
        style={[
          styles.container,
          error && styles.containerError,
          containerStyle,
        ]}
      >
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={placeholderTextColor}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />
      </View>
    );
  }
);

ScanTextInput.displayName = 'ScanTextInput';

export default ScanTextInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 28,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  containerError: {
    borderColor: '#d64545',
  },
  input: {
    height: 52,
    fontSize: 15,
    color: '#1a1a1a',
    fontFamily: Fonts.body,
  },
});
