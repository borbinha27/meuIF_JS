import React, { useState } from 'react';
import { View } from 'react-native';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Dashboard from './src/pages/Dashboard';
import QRCode from './src/pages/QRCode';
import Settings from './src/pages/Settings';
import LostFound from './src/pages/LostFound';
import Authorizations from './src/pages/Authorizations';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');

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

export default App;