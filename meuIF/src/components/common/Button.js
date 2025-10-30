import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ 
  children, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  style = {}
}) => {
  const buttonStyle = [
    styles.base,
    variant === 'primary' ? styles.primary : styles.secondary,
    disabled && styles.disabled,
    style
  ];

  const textStyle = [
    styles.text,
    variant === 'primary' ? styles.primaryText : styles.secondaryText,
    disabled && styles.disabledText
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={buttonStyle}
      activeOpacity={disabled ? 1 : 0.8}
    >
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: {
    backgroundColor: '#10B981', // green-500
  },
  secondary: {
    backgroundColor: '#E5E7EB', // gray-200
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#1F2937', // gray-800
  },
  disabledText: {
    opacity: 0.7,
  },
});

export default Button;