import React, {useState} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import {Colors, Fonts, Spacing, Radii} from '@/theme/theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const FormInput: React.FC<Props> = ({label, error, icon, style, onFocus, onBlur, ...props}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isFocused && styles.labelFocused]}>{label}</Text>
      <View style={[
        styles.inputWrapper, 
        isFocused && styles.inputFocused,
        error ? styles.inputError : null
      ]}>
        {icon && <View style={styles.iconWrapper}>
          {React.isValidElement(icon) 
            ? React.cloneElement(icon as any, { 
                color: error ? Colors.error : (isFocused ? Colors.primary : Colors.textMuted) 
              }) 
            : icon}
        </View>}
        <TextInput
          style={[styles.input, icon ? styles.inputWithIcon : null, style]}
          placeholderTextColor={Colors.textMuted}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  labelFocused: {
    color: Colors.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  inputError: {
    borderColor: Colors.error,
  },
  iconWrapper: {
    paddingLeft: Spacing.md,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.base,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    height: 50,
  },
  inputWithIcon: {
    paddingLeft: Spacing.sm,
  },
  errorText: {
    color: Colors.error,
    fontSize: Fonts.sizes.xs,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});

export default FormInput;
