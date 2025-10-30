import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ 
  title, 
  onBack, 
  showBack = true, 
  backgroundColor = '#10B981' // green-500
}) => {
  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.content}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          {title && (
            <Text style={styles.title}>{title}</Text>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight || 44, // iOS safe area
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
});

export default Header;