import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Tab = ({ tabs, activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={[
              styles.tab,
              activeTab === tab.key ? styles.activeTab : styles.inactiveTab
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key ? styles.activeTabText : styles.inactiveTabText
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6', // gray-100
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#059669', // green-600
  },
  inactiveTabText: {
    color: '#6B7280', // gray-500
  },
});

export default Tab;