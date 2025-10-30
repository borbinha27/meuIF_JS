import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import FirebaseService from '../services/FirebaseService';
import ApiService from '../services/ApiService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDocument, setUserDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carregar usuário atual e configurar listener
  useEffect(() => {
    const unsubscribe = FirebaseService.onAuthStateChanged(async (user) => {
      setUser(user);
      setIsAuthenticated(!!user);
      
      if (user) {
        // Obter token do usuário para usar na API
        try {
          const token = await user.getIdToken();
          ApiService.setToken(token);
        } catch (error) {
          console.error('Error getting user token:', error);
        }

        // Carregar documento do usuário do Firestore
        const userDoc = await FirebaseService.getUserDocument(user.uid);
        setUserDocument(userDoc);
      } else {
        setUserDocument(null);
        ApiService.setToken(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      
      // Login com Firebase
      const result = await FirebaseService.signInWithEmailAndPassword(email, password);
      
      if (result.user) {
        // Obter token para API
        const token = await result.user.getIdToken();
        ApiService.setToken(token);
        
        // Carregar documento do usuário
        const userDoc = await FirebaseService.getUserDocument(result.user.uid);
        setUserDocument(userDoc);
        
        return { success: true, user: result.user };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Registro
  const register = useCallback(async (email, password, matricula, additionalData = {}) => {
    try {
      setLoading(true);
      
      // Primeiro, registrar na API
      const apiResult = await ApiService.registrar({
        email,
        password,
        matricula,
      });
      
      if (apiResult.succeeded) {
        // Criar usuário no Firebase Auth
        const result = await FirebaseService.createUserWithEmailAndPassword(email, password);
        
        if (result.user) {
          // Obter token para API
          const token = await result.user.getIdToken();
          ApiService.setToken(token);
          
          // Criar documento do usuário no Firestore
          const userDocData = {
            matricula,
            email,
            ...additionalData,
          };
          
          const userDoc = await FirebaseService.createUserDocument(result.user, userDocData);
          setUserDocument(userDoc);
          
          // Também criar documento na collection alunos (para compatibilidade)
          const alunoData = {
            email,
            matricula,
            nome: additionalData.nome || '',
            turma: additionalData.turma || '',
            userType: 'aluno',
            uid: result.user.uid,
            display_name: result.user.displayName,
            photo_url: result.user.photoURL,
            phone_number: result.user.phoneNumber,
          };
          
          await FirebaseService.createAlunoDocument(alunoData);
          
          return { success: true, user: result.user };
        }
      } else {
        return { success: false, error: apiResult.error || 'Erro ao registrar na API' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await FirebaseService.signOut();
      setUser(null);
      setUserDocument(null);
      setIsAuthenticated(false);
      ApiService.setToken(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar documento do usuário
  const updateUserDocument = useCallback(async (updates) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };
    
    try {
      const updatedDoc = await FirebaseService.updateUserDocument(user.uid, updates);
      if (updatedDoc) {
        setUserDocument(updatedDoc);
        return { success: true, userDocument: updatedDoc };
      }
      return { success: false, error: 'Erro ao atualizar documento' };
    } catch (error) {
      console.error('Update user document error:', error);
      return { success: false, error: error.message };
    }
  }, [user]);

  // Obter dados do usuário da API
  const getUserData = useCallback(async (matricula) => {
    try {
      const result = await ApiService.buscarAluno(matricula);
      return result;
    } catch (error) {
      console.error('Get user data error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Função para sincronizar dados do usuário entre Firebase e API
  const syncUserData = useCallback(async () => {
    if (!userDocument?.matricula) return;
    
    try {
      // Buscar dados atuais da API
      const apiResult = await ApiService.buscarAluno(userDocument.matricula);
      
      if (apiResult.succeeded && apiResult.data) {
        // Atualizar documento local se necessário
        const apiData = apiResult.data;
        const updates = {};
        
        if (apiData.nome && apiData.nome !== userDocument.nome) {
          updates.nome = apiData.nome;
        }
        if (apiData.turma && apiData.turma !== userDocument.turma) {
          updates.turma = apiData.turma;
        }
        if (apiData.email && apiData.email !== userDocument.email) {
          updates.email = apiData.email;
        }
        
        if (Object.keys(updates).length > 0) {
          await updateUserDocument(updates);
        }
      }
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  }, [userDocument, updateUserDocument]);

  // Sincronizar dados periodicamente
  useEffect(() => {
    if (isAuthenticated && userDocument?.matricula) {
      syncUserData();
      // Sincronizar a cada 5 minutos
      const interval = setInterval(syncUserData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userDocument?.matricula, syncUserData]);

  const value = {
    // Estado
    user,
    userDocument,
    loading,
    isAuthenticated,
    
    // Métodos
    login,
    register,
    logout,
    updateUserDocument,
    getUserData,
    syncUserData,
    
    // Informações derivadas
    displayName: userDocument?.display_name || userDocument?.nome || user?.displayName || user?.email || 'Usuário',
    matricula: userDocument?.matricula || '',
    email: user?.email || userDocument?.email || '',
    turma: userDocument?.turma || '',
    nome: userDocument?.nome || userDocument?.display_name || '',
    uid: user?.uid || '',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;