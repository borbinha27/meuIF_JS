import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Tab from '../components/common/Tab';
import ListItem from '../components/common/ListItem';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppProvider';

const LostFound = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('achados');
  const [lostFoundData, setLostFoundData] = useState({
    achados: [],
    perdidos: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    nomeItem: '',
    localEncontrado: '',
    descricao: ''
  });

  const { userDocument } = useAuth();
  const { listarAchados, criarAchado } = useApp();

  const tabs = [
    { key: 'achados', label: 'Achados' },
    { key: 'perdidos', label: 'Perdidos' }
  ];

  useEffect(() => {
    loadLostFoundItems();
  }, []);

  const loadLostFoundItems = async () => {
    setIsLoading(true);
    try {
      const result = await listarAchados();

      if (result.success && result.data) {
        // Separar achados e perdidos
        const achados = result.data.filter(item => item.status === 'achado') || [];
        const perdidos = result.data.filter(item => item.status === 'perdido') || [];

        setLostFoundData({
          achados: achados,
          perdidos: perdidos
        });
      }
    } catch (error) {
      console.error('Error loading lost and found items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.nomeItem || !formData.localEncontrado) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const achado = {
      nome_item: formData.nomeItem,
      local_encontrado: formData.localEncontrado,
      descricao: formData.descricao,
      status: 'achado',
      reportado_por: userDocument?.matricula || '',
      nome_reportador: userDocument?.nome || userDocument?.display_name || ''
    };

    try {
      const result = await criarAchado(achado);

      if (result.success) {
        Alert.alert('Sucesso', 'Item registrado com sucesso!');
        setModalVisible(false);
        setFormData({
          nomeItem: '',
          localEncontrado: '',
          descricao: ''
        });
        loadLostFoundItems();
      } else {
        Alert.alert('Erro', 'Não foi possível registrar o item');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao registrar o item');
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${day}/${month} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  const getCurrentData = () => {
    return lostFoundData[activeTab] || [];
  };

  const currentData = getCurrentData();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Achados e Perdidos"
        onBack={() => onNavigate('dashboard')}
        backgroundColor="#2f9e41"
      />

      <Tab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Registrar item encontrado</Text>
        </TouchableOpacity>
      </View>

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
                title={item.nome_reportador || 'Desconhecido'}
                subtitle={item.nome_item || 'Item não identificado'}
                date={item.local_encontrado || 'Local não informado'}
                time={formatDate(item.created_at || item.data_criacao)}
                description={false}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>
              {activeTab === 'achados'
                ? 'Nenhum item encontrado'
                : 'Nenhum item perdido registrado'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal for adding new item */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Item Encontrado</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Input
                placeholder="Nome do item *"
                value={formData.nomeItem}
                onChangeText={(text) => setFormData({ ...formData, nomeItem: text })}
              />

              <Input
                placeholder="Local onde foi encontrado *"
                value={formData.localEncontrado}
                onChangeText={(text) => setFormData({ ...formData, localEncontrado: text })}
              />

              <Input
                placeholder="Descrição (opcional)"
                value={formData.descricao}
                onChangeText={(text) => setFormData({ ...formData, descricao: text })}
                multiline={true}
                numberOfLines={4}
              />

              <Button onPress={handleSubmit}>
                Registrar
              </Button>

              <Button
                onPress={() => setModalVisible(false)}
                variant="secondary"
              >
                Cancelar
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2f9e41',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalForm: {
    padding: 20,
  },
});

export default LostFound;
