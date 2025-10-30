import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppProvider';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Dashboard from './src/pages/Dashboard';
import QRCode from './src/pages/QRCode';
import Settings from './src/pages/Settings';
import LostFound from './src/pages/LostFound';
import Authorizations from './src/pages/Authorizations';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const { isAuthenticated, loading } = useAuth();

  // Auto-navegar para dashboard se usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated && currentPage === 'login') {
      setCurrentPage('dashboard');
    } else if (!isAuthenticated && currentPage !== 'login' && currentPage !== 'register') {
      setCurrentPage('login');
    }
  }, [isAuthenticated]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'register':
        return <Register onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'qrcode':
        return <QRCode onNavigate={setCurrentPage} />;
      case 'settings':
        return <Settings onNavigate={setCurrentPage} />;
      case 'lost-found':
        return <LostFound onNavigate={setCurrentPage} />;
      case 'authorizations':
        return <Authorizations onNavigate={setCurrentPage} />;
      default:
        return <Login onNavigate={setCurrentPage} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {renderPage()}
    </View>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
