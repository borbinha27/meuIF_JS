import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Dashboard = ({ onNavigate }) => {
  const menuItems = [
    {
      icon: 'qr-code',
      label: 'Carteirinha',
      onPress: () => onNavigate('qrcode')
    },
    {
      icon: 'person',
      label: 'Perfil',
      onPress: () => {}
    },
    {
      icon: 'restaurant',
      label: 'PNAE',
      onPress: () => {}
    },
    {
      icon: 'checkmark-circle',
      label: 'Autorizações',
      onPress: () => onNavigate('authorizations')
    },
    {
      icon: 'location',
      label: 'Achados',
      onPress: () => onNavigate('lost-found')
    },
    {
      icon: 'calendar',
      label: 'Agenda',
      onPress: () => {}
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header com nome do usuário */}
        <View style={styles.header}>
          <Text style={styles.userName}>[Display Name]</Text>
          <View style={styles.placeholder}></View>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon} size={32} color="#374151" />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="home" size={24} color="#10B981" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => onNavigate('settings')}
        >
          <Ionicons name="log-out" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
  },
  placeholder: {
    width: '100%',
    height: 96,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 24,
    justifyContent: 'space-between',
  },
  menuItem: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    marginBottom: 16,
    minHeight: 120,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
    color: '#374151',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 20, // Safe area bottom
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Dashboard;