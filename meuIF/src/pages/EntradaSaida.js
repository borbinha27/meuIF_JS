import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import axios from 'axios';

// Simule o estado global (use Context API ou Redux em produção)
const appState = {
  Matricula: '',
  Nome: '',
};

const EntradasSaidas = () => {
  const navigation = useNavigation();
  const [currentApiResponse, setCurrentApiResponse] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState(''); // Substitua com seu token real

  // Função para formatar data no formato yyyy-MM-dd
  const formatDate = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Chamada à API
  const fetchEntradas = async (startDate, endDate) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'YOUR_API_ENDPOINT', // Substitua com seu endpoint
        {
          token: jwtToken,
          startDate: startDate,
          endDate: endDate,
          mat: appState.Matricula,
        }
      );

      if (response.data) {
        setCurrentApiResponse(response.data);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar dados');
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const today = formatDate(new Date());
    fetchEntradas(today, today);
  }, []);

  // Handler para mudança de data no calendário
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    fetchEntradas(day.dateString, day.dateString);
  };

  // Renderizar item da lista
  const renderItem = ({ item, index }) => (
    <Animated.View
      entering={FadeIn.delay(index * 100).duration(600)}
      style={styles.card}
    >
      <View style={styles.cardContent}>
        {/* Nome */}
        <View style={styles.row}>
          <Text style={styles.label}>Nome :</Text>
          <Text style={styles.value}>{appState.Nome}</Text>
        </View>

        <View style={styles.divider} />

        {/* Tipo */}
        <View style={styles.row}>
          <Text style={styles.label}>Tipo :</Text>
          <Text style={styles.value}>{item.type}</Text>
        </View>

        <View style={styles.divider} />

        {/* Horário */}
        <View style={styles.row}>
          <Text style={styles.label}>Horario :</Text>
          <Text style={styles.value}>{item.ts}</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Calendário */}
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#2E7D32',
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#2E7D32',
          todayTextColor: '#2E7D32',
          arrowColor: '#2E7D32',
          monthTextColor: '#000',
          textMonthFontWeight: 'bold',
        }}
      />

      {/* Lista de entradas */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />
        ) : currentApiResponse && currentApiResponse.length > 0 ? (
          <FlatList
            data={currentApiResponse}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.emptyText}>Nenhum registro encontrado</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2E7D32',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#090F13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
    marginRight: 8,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 12,
  },
  loader: {
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
});

export default EntradasSaidas;