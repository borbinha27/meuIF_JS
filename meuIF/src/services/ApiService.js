// MESMAS CHAMADAS DE API DO FLUTTER - EXATAMENTE IGUAIS
class ApiService {
  static BASE_URL = 'https://meuif.scriptai.com.br/api';
  static token = null;

  static setToken(token) {
    this.token = token;
  }

  static getToken() {
    return this.token;
  }

  static async makeRequest(endpoint, options = {}) {
    const url = `${this.BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    // Adicionar body se existir, mas não para métodos GET/HEAD
    if (options.body && !['GET', 'HEAD'].includes(options.method?.toUpperCase())) {
      config.body = options.body;
    }

    try {
      const response = await fetch(url, config);
      let data = null;
      
      try {
        data = await response.json();
      } catch (jsonError) {
        // Se não conseguir fazer parse do JSON, usar texto
        data = await response.text();
      }

      return {
        data,
        statusCode: response.status,
        succeeded: response.status >= 200 && response.status < 300,
        headers: Object.fromEntries(response.headers.entries()),
        response,
      };
    } catch (error) {
      return {
        data: null,
        statusCode: -1,
        succeeded: false,
        error: error.message,
        exception: error,
      };
    }
  }

  // ==================== CARDAPIO GROUP ====================
  
  static async criarCardapio(itensList, vigencia = '2025-09-13') {
    const body = {
      itens: itensList || [],
      vigencia: `${vigencia}T00:00:00-03:00`
    };

    return this.makeRequest('/cardapio', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  static async obterCardapio() {
    return this.makeRequest('/cardapio');
  }

  static async listagemDeCardapios() {
    return this.makeRequest('/cardapio/all');
  }

  static async deletarCardapio(cardapioID = '68c894592604e8ce7da85bd3') {
    return this.makeRequest(`/cardapio/${cardapioID}`, {
      method: 'DELETE',
    });
  }

  // ==================== AGENDA GROUP ====================
  
  static async listagemDeEventos() {
    return this.makeRequest('/agenda');
  }

  static async criarEventos(eventoData = {}) {
    const body = {
      colors: "#FF5733",
      created_at: "2023-10-01T12:00:00Z",
      criador: "prof.joao",
      descricao: "Revisão para a prova de matemática",
      fim: "2023-12-01T10:00:00Z",
      id: "6526f58e25a7a7c36a7cd7a1",
      inicio: "2023-12-01T08:00:00Z",
      titulo: "Aula de revisão",
      turma: "1INF",
      ...eventoData
    };

    return this.makeRequest('/agenda', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  static async atualizarEvento(eventoData = {}) {
    return this.makeRequest('/agenda', {
      method: 'PUT',
      body: JSON.stringify(eventoData),
    });
  }

  static async removerEvento(eventoId) {
    return this.makeRequest('/agenda', {
      method: 'DELETE',
      body: JSON.stringify({ id: eventoId }),
    });
  }

  // ==================== AUTORIZACOES GROUP ====================
  
  static async listarAutorizacao(
    startDate = '2025-09-13', 
    endDate = '2025-09-13', 
    matricula = '20233005297'
  ) {
    const params = new URLSearchParams({
      'start-date': startDate,
      'end-date': endDate,
      'matricula': matricula,
    });

    return this.makeRequest(`/autorizacao?${params}`);
  }

  static async criarAutorizacao({
    entradaSaida = '',
    motivo = '',
    autorizador = '',
    aluno = '',
    dataCriacao = ''
  }) {
    const body = {
      created_at: dataCriacao,
      mat_aluno: aluno,
      mat_autorizador: autorizador,
      motivo: motivo,
      type: entradaSaida
    };

    return this.makeRequest('/autorizacao/', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // ==================== USER METHODS ====================
  
  static async adicionarAluno({
    email = 'testesemauth@if.com',
    matricula = '202300123',
    nome = 'João do teste',
    turma = '2A',
    userType = 'aluno'
  }) {
    const body = {
      email,
      matricula,
      nome,
      turma,
      userType
    };

    return this.makeRequest('/users/', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  static async pegarTodos() {
    return this.makeRequest('/users/');
  }

  static async deleteUser(matricula = '') {
    return this.makeRequest('/users/', {
      method: 'DELETE',
      headers: {
        'matricula': matricula,
      },
    });
  }

  static async buscarAluno(matricula = '') {
    return this.makeRequest(`/users/${matricula}`);
  }

  static async updateUser({
    matricula = '',
    email = '',
    idUser = 'auth0|abc123',
    nome = 'João da Silva',
    turma = '2A',
    userType = 'aluno'
  }) {
    const body = {
      email,
      idUser,
      matricula,
      nome,
      turma,
      userType
    };

    return this.makeRequest('/users/', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // ==================== AUTH METHODS ====================
  
  static async registrar({
    email = 'c@l.com',
    password = '123456',
    matricula = '20233005297'
  }) {
    const body = {
      email,
      matricula,
      password
    };

    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // ==================== ENTRADAS ====================
  
  static async entradas({
    matricula = '20233005297',
    startDate = '2025-09-17',
    endDate = '2025-09-17'
  }) {
    const params = new URLSearchParams({
      'start-date': startDate,
      'end-date': endDate,
    });

    return this.makeRequest(`/entrada/${matricula}?${params}`);
  }

  // ==================== HELPER METHODS ====================
  
  // Método para processar lista de strings (como no Flutter)
  static serializeList(list) {
    if (!list || !Array.isArray(list)) return '[]';
    try {
      return JSON.stringify(list);
    } catch (error) {
      console.log("List serialization failed. Returning empty list.");
      return '[]';
    }
  }

  // Método para processar JSON (como no Flutter)
  static serializeJson(jsonVar, isList = false) {
    if (jsonVar === null || jsonVar === undefined) {
      return isList ? '[]' : '{}';
    }
    try {
      return JSON.stringify(jsonVar);
    } catch (error) {
      console.log("Json serialization failed. Returning empty json.");
      return isList ? '[]' : '{}';
    }
  }

  // Método para escapar strings para JSON (como no Flutter)
  static escapeStringForJson(input) {
    if (input === null || input === undefined) {
      return null;
    }
    return input
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t');
  }
}

export default ApiService;