import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Input = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  showPasswordToggle = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style = {}
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={[styles.input, multiline && { height: numberOfLines * 20 + 32 }]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isSecure}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {showPasswordToggle && (
        <TouchableOpacity
          onPress={() => setIsSecure(!isSecure)}
          style={styles.iconButton}
        >
          <Ionicons 
            name={isSecure ? 'eye-off' : 'eye'} 
            size={20} 
            color="#6B7280" 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    borderRadius: 8,
    backgroundColor: '#F9FAFB', // gray-50
    fontSize: 16,
    minHeight: 50,
  },
  iconButton: {
    position: 'absolute',
    right: 16,
    top: 15,
    padding: 4,
  },
});

export default Input;