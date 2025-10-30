import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ListItem = ({ title, subtitle, date, time, description }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Nome: </Text>
          <Text style={styles.value}>{title}</Text>
        </View>
        
        {subtitle && (
          <View style={styles.row}>
            <Text style={styles.label}>
              {description ? 'Motivo: ' : 'Nome item: '}
            </Text>
            <Text style={styles.value}>{subtitle}</Text>
          </View>
        )}
        
        {!description && (
          <View style={styles.row}>
            <Text style={styles.label}>Local: </Text>
            <Text style={styles.value}>{date}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.timeText}>
        {description ? `${date} ${time}` : time}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  content: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  value: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#3B82F6', // blue-500
  },
});

export default ListItem;