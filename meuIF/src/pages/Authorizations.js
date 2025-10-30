import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppProvider';
import Header from '../components/common/Header';
import Tab from '../components/common/Tab';
import ListItem from '../components/common/ListItem';

const Authorizations = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('entradas');
  const [authorizationData, setAuthorizationData] = useState({
    entradas: [],
    saidas: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const { userDocument } = useAuth();
  const { listarAutorizacao } = useApp(); // Usando função REAL da API

  const tabs = [
    { key: 'entradas', label: 'Entradas' },
    { key: 'saidas', label: 'Saídas' }
  ];

  // Carregar autorizações quando o componente montar
  useEffect(() => {
    loadAuthorizations();
  }, []);

  const loadAuthorizations = async () => {
    if (!userDocument?.matricula) return;

    setIsLoading(true);
    try {
      const today = new Date();
      const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 dias atrás
      const endDate = today;

      // Usar MESMA função da API do Flutter
      const result = await listarAutorizacao(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        userDocument.matricula
      );

      if (result.success && result.data) {
        // Separar entradas e saídas como no Flutter
        const entradas = result.data.filter(auth => auth.type === 'entrada') || [];
        const saidas = result.data.filter(auth => auth.type === 'saida') || [];

        setAuthorizationData({
          entradas: entradas,
          saidas: saidas
        });
      }
    } catch (error) {
      console.error('Error loading authorizations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      const weekday = weekdays[date.getDay()];
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${day}/${month} ${weekday}, ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  const getCurrentData = () => {
    return authorizationData[activeTab] || [];
  };

  const currentData = getCurrentData();

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => onNavigate('dashboard')} backgroundColor="#10B981" />

      <Tab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : currentData.length > 0 ? (
          <View style={styles.listContainer}>
            {currentData.map((item, index) => (
              <ListItem
                key={item.id || index}
                title={item.nome_aluno || userDocument?.nome || 'Nome não encontrado'}
                subtitle={item.motivo || 'Motivo não informado'}
                time={formatDate(item.created_at || item.data_criacao)}
                description={true}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {activeTab === 'entradas'
                ? 'Nenhuma autorização de entrada encontrada'
                : 'Nenhuma autorização de saída encontrada'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default Authorizations;
