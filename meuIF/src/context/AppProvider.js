import React, { createContext, useContext, useState, useCallback } from 'react';
import ApiService from '../services/ApiService';
import FirebaseService from '../services/FirebaseService';
import { useAuth } from './AuthContext';

const AppContext = createContext({});

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user, userDocument } = useAuth();
  
  // Estados gerais da aplicação
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para dados específicos
  const [cardapios, setCardapios] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [autorizacoes, setAutorizacoes] = useState([]);
  const [entradas, setEntradas] = useState([]);

  // Função helper para lidar com erros
  const handleError = useCallback((error) => {
    console.error('App Error:', error);
    setError(error.message || 'Ocorreu um erro');
    setTimeout(() => setError(null), 5000);
  }, []);

  // ==================== CARDAPIO METHODS ====================
  // Usando as MESMAS funções do Flutter

  const obterCardapio = useCallback(async () => {
    try {
      setLoading(true);
      const result = await ApiService.obterCardapio();
      
      if (result.succeeded) {
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao buscar cardápio'));
        return { success: false, error: 'Erro ao buscar cardápio' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const listagemDeCardapios = useCallback(async () => {
    try {
      setLoading(true);
      const result = await ApiService.listagemDeCardapios();
      
      if (result.succeeded) {
        setCardapios(result.data || []);
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao buscar cardápios'));
        return { success: false, error: 'Erro ao buscar cardápios' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const criarCardapio = useCallback(async (itensList, vigencia) => {
    try {
      setLoading(true);
      const result = await ApiService.criarCardapio(itensList, vigencia);
      
      if (result.succeeded) {
        // Recarregar lista de cardápios
        await listagemDeCardapios();
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao criar cardápio'));
        return { success: false, error: 'Erro ao criar cardápio' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError, listagemDeCardapios]);

  const deletarCardapio = useCallback(async (cardapioID) => {
    try {
      setLoading(true);
      const result = await ApiService.deletarCardapio(cardapioID);
      
      if (result.succeeded) {
        // Recarregar lista de cardápios
        await listagemDeCardapios();
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao deletar cardápio'));
        return { success: false, error: 'Erro ao deletar cardápio' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError, listagemDeCardapios]);

  // ==================== AGENDA METHODS ====================
  // Usando as MESMAS funções do Flutter

  const listagemDeEventos = useCallback(async () => {
    try {
      setLoading(true);
      const result = await ApiService.listagemDeEventos();
      
      if (result.succeeded) {
        setEventos(result.data || []);
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao buscar eventos'));
        return { success: false, error: 'Erro ao buscar eventos' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const criarEventos = useCallback(async (eventoData) => {
    try {
      setLoading(true);
      const result = await ApiService.criarEventos(eventoData);
      
      if (result.succeeded) {
        // Recarregar lista de eventos
        await listagemDeEventos();
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao criar evento'));
        return { success: false, error: 'Erro ao criar evento' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError, listagemDeEventos]);

  const atualizarEvento = useCallback(async (eventoData) => {
    try {
      setLoading(true);
      const result = await ApiService.atualizarEvento(eventoData);
      
      if (result.succeeded) {
        // Recarregar lista de eventos
        await listagemDeEventos();
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao atualizar evento'));
        return { success: false, error: 'Erro ao atualizar evento' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError, listagemDeEventos]);

  const removerEvento = useCallback(async (eventoId) => {
    try {
      setLoading(true);
      const result = await ApiService.removerEvento(eventoId);
      
      if (result.succeeded) {
        // Recarregar lista de eventos
        await listagemDeEventos();
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao remover evento'));
        return { success: false, error: 'Erro ao remouter evento' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError, listagemDeEventos]);

  // ==================== AUTORIZACOES METHODS ====================
  // Usando as MESMAS funções do Flutter

  const listarAutorizacao = useCallback(async (startDate, endDate, matricula) => {
    try {
      setLoading(true);
      const mat = matricula || userDocument?.matricula;
      
      if (!mat) {
        throw new Error('Matrícula não encontrada');
      }

      const result = await ApiService.listarAutorizacao(startDate, endDate, mat);
      
      if (result.succeeded) {
        setAutorizacoes(result.data || []);
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao buscar autorizações'));
        return { success: false, error: 'Erro ao buscar autorizações' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError, userDocument]);

  const criarAutorizacao = useCallback(async (autorizacaoData) => {
    try {
      setLoading(true);
      const result = await ApiService.criarAutorizacao(autorizacaoData);
      
      if (result.succeeded) {
        // Recarregar lista de autorizações
        const today = new Date().toISOString().split('T')[0];
        await listarAutorizacao(today, today);
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao criar autorização'));
        return { success: false, error: 'Erro ao criar autorização' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError, listarAutorizacao]);

  // ==================== ENTRADAS METHODS ====================
  // Usando as MESMAS funções do Flutter

  const obterEntradas = useCallback(async (startDate, endDate, matricula) => {
    try {
      setLoading(true);
      const mat = matricula || userDocument?.matricula;
      
      if (!mat) {
        throw new Error('Matrícula não encontrada');
      }

      const result = await ApiService.entradas({
        matricula: mat,
        startDate,
        endDate,
      });
      
      if (result.succeeded) {
        setEntradas(result.data || []);
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao buscar entradas'));
        return { success: false, error: 'Erro ao buscar entradas' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError, userDocument]);

  // ==================== USER METHODS ====================
  // Usando as MESMAS funções do Flutter

  const pegarTodos = useCallback(async () => {
    try {
      setLoading(true);
      const result = await ApiService.pegarTodos();
      
      if (result.succeeded) {
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao buscar usuários'));
        return { success: false, error: 'Erro ao buscar usuários' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const buscarAluno = useCallback(async (matricula) => {
    try {
      setLoading(true);
      const result = await ApiService.buscarAluno(matricula);
      
      if (result.succeeded) {
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao buscar aluno'));
        return { success: false, error: 'Erro ao buscar aluno' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const adicionarAluno = useCallback(async (alunoData) => {
    try {
      setLoading(true);
      const result = await ApiService.adicionarAluno(alunoData);
      
      if (result.succeeded) {
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao adicionar aluno'));
        return { success: false, error: 'Erro ao adicionar aluno' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      const result = await ApiService.updateUser(userData);
      
      if (result.succeeded) {
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao atualizar usuário'));
        return { success: false, error: 'Erro ao atualizar usuário' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const deleteUser = useCallback(async (matricula) => {
    try {
      setLoading(true);
      const result = await ApiService.deleteUser(matricula);
      
      if (result.succeeded) {
        return { success: true, data: result.data };
      } else {
        handleError(new Error('Erro ao deletar usuário'));
        return { success: false, error: 'Erro ao deletar usuário' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // ==================== LOST AND FOUND METHODS ====================
  // Usando Firebase Firestore REAL (mesma estrutura do Flutter)

  const addLostItem = useCallback(async (itemData) => {
    try {
      setLoading(true);
      const data = {
        ...itemData,
        userId: user?.uid,
        matricula: userDocument?.matricula,
        nome: userDocument?.nome || userDocument?.display_name,
        status: 'lost',
      };
      
      const result = await FirebaseService.addToCollection('lost_items', data);
      
      if (result) {
        return { success: true, data: result };
      } else {
        handleError(new Error('Erro ao adicionar item perdido'));
        return { success: false, error: 'Erro ao adicionar item perdido' };
      }
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, userDocument, handleError]);

  const getLostItems = useCallback(async () => {
    try {
      setLoading(true);
      const items = await FirebaseService.getFromCollection('lost_items');
      return { success: true, data: items };
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getUserLostItems = useCallback(async () => {
    try {
      setLoading(true);
      const items = await FirebaseService.getFromCollection('lost_items', {
        userId: user?.uid
      });
      return { success: true, data: items };
    } catch (error) {
      handleError(error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, handleError]);

  const value = {
    // Estados
    loading,
    error,
    cardapios,
    eventos,
    autorizacoes,
    entradas,
    
    // Métodos Cardápio (mesmos nomes do Flutter)
    obterCardapio,
    listagemDeCardapios,
    criarCardapio,
    deletarCardapio,
    
    // Métodos Agenda (mesmos nomes do Flutter)
    listagemDeEventos,
    criarEventos,
    atualizarEvento,
    removerEvento,
    
    // Métodos Autorizações (mesmos nomes do Flutter)
    listarAutorizacao,
    criarAutorizacao,
    
    // Métodos Entradas (mesmos nomes do Flutter)
    entradas: obterEntradas,
    
    // Métodos Users (mesmos nomes do Flutter)
    pegarTodos,
    buscarAluno,
    adicionarAluno,
    updateUser,
    deleteUser,
    
    // Métodos Achados e Perdidos (Firebase)
    addLostItem,
    getLostItems,
    getUserLostItems,
    
    // Utility
    clearError: () => setError(null),
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;