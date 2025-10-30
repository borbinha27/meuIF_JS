import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCodeSVG from 'react-native-qrcode-svg';
import Header from '../components/common/Header';
import { useAuth } from '../context/AuthContext';

const QRCode = ({ onNavigate }) => {
  const { user, userDocument } = useAuth();
  const [matricula, setMatricula] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatricula();
  }, [user, userDocument]);

  const loadMatricula = () => {
    setIsLoading(true);

    // Obter matrícula do usuário
    const mat = userDocument?.matricula || '';

    console.log('Carregando matrícula para QR Code:', mat);
    console.log('UserDocument completo:', userDocument);

    if (!mat) {
      console.warn('Matrícula não encontrada no userDocument');
    }

    setMatricula(mat);
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Carteirinha Digital"
        onBack={() => onNavigate('dashboard')}
        backgroundColor="#10B981"
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card Container */}
        <View style={styles.card}>
          {/* Header do Card */}
          <View style={styles.cardHeader}>
            <Text style={styles.institutionName}>INSTITUTO FEDERAL</Text>
            <Text style={styles.cardTitle}>Carteirinha de Estudante</Text>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome:</Text>
              <Text style={styles.infoValue}>
                {userDocument?.nome || userDocument?.display_name || 'Não informado'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Matrícula:</Text>
              <Text style={styles.infoValue}>
                {matricula || 'Não informado'}
              </Text>
            </View>

            {userDocument?.turma && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Turma:</Text>
                <Text style={styles.infoValue}>{userDocument.turma}</Text>
              </View>
            )}
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={styles.loadingText}>Carregando...</Text>
              </View>
            ) : matricula ? (
              <>
                <View style={styles.qrCodeContainer}>
                  <QRCodeSVG
                    value={matricula}
                    size={250}
                    backgroundColor="white"
                    color="black"
                  />
                </View>
                <Text style={styles.qrCodeInstructions}>
                  Apresente este QR Code para entrada e saída
                </Text>
              </>
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Matrícula não encontrada. Faça login novamente.
                </Text>
              </View>
            )}
          </View>

          {/* Card Footer */}
          <View style={styles.cardFooter}>
            <Text style={styles.footerText}>
              Documento válido para identificação estudantil
            </Text>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>💡 Como usar</Text>
          <Text style={styles.infoBoxText}>
            • Apresente este QR Code na portaria{'\n'}
            • Use para registrar entrada e saída{'\n'}
            • Mantenha a tela com brilho adequado{'\n'}
            • Não compartilhe seu QR Code
          </Text>
        </View>
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
    padding: 16,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#10B981',
  },
  institutionName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  userInfo: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrCodeContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
  },
  qrCodeInstructions: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
  cardFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});

export default QRCode;
