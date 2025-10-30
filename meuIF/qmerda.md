# 🔥 Como eu consertei essa bagaça toda do meuIF

Bro, deixa eu te contar a saga épica de como eu peguei esse app completamente FUDIDO e deixei funcionando

## 😱 O CAOS INICIAL

Cara, quando eu abri esse projeto pela primeira vez, tava um DESASTRE. Tipo assim:

- **3 páginas COMPLETAMENTE VAZIAS** (Settings, LostFound, QRCode)
- Login e Register eram **botões inúteis** que só mudavam de tela sem fazer PORRA NENHUMA
- Context API? **NEM EXISTIA**, os providers tavam faltando
- QR Code? **NÃO GERAVA**
- Matrícula? **NÃO SALVAVA**
- Usuário logado? **ESQUECE**, sempre voltava pro login

Basicamente, o app tava mais quebrado que promessa de político. 💀

---

## 🛠️ A JORNADA DA CORREÇÃO

### 1️⃣ CRIEI AS PÁGINAS DO ZERO (porque tavam VAZIAS)

#### **Settings.js - A página de configurações**

Essa belezinha eu fiz do zero, brother. Adicionei:

```javascript
- Foto do usuário (um ícone bonito)
- Nome, email e matrícula do cara
- Menu com opções tipo Perfil, Notificações, Privacidade, etc
- Botão de LOGOUT que funciona DE VERDADE (com confirmação pra não cagar besteira)
- Integrado com o AuthContext pra pegar os dados
```

**Como funciona:**

```javascript
const { user, userDocument, logout } = useAuth(); // Pego do contexto global

// Mostro as paradas:
userDocument.nome;
userDocument.email;
userDocument.matricula;

// Botão de logout que REALMENTE desconecta:
const handleLogout = async () => {
  const result = await logout(); // Chama a função real do Firebase
  if (result.success) {
    onNavigate("login"); // Manda pro login
  }
};
```

#### **LostFound.js - Achados e Perdidos**

Essa aqui foi divertida. Fiz um sisteminha completo:

```javascript
- Sistema de abas: "Achados" e "Perdidos" (pra separar as paradas)
- Botão grandão pra registrar item novo
- Modal com formulário (nome do item, onde achou, descrição)
- Lista todos os bagulhos com filtro
- Integrado com Firebase Firestore (salvando REAL na nuvem)
```

**A mágica:**

```javascript
const { listarAchados, criarAchado } = useApp(); // Funções do contexto

// Buscar itens:
const items = await listarAchados(); // Puxa do Firebase

// Adicionar novo:
await criarAchado({
  nome_item: "Mochila preta",
  local_encontrado: "Biblioteca",
  status: "achado",
}); // Salva no Firebase automaticamente
```

#### **QRCode.js - A carteirinha digital**

Cara, essa aqui me deu trabalho. Primeiro tentei usar a API do Google Charts e FOI UM FRACASSO TOTAL:

```javascript
// Tentativa 1 (FALHOU MISERAVELMENTE):
const url = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${matricula}`;
// ❌ Problema de CORS
// ❌ Não renderiza no React Native
// ❌ Imagem não carregava
```

Daí eu disse: "FODA-SE, vou usar biblioteca nativa mesmo":

```bash
npm install react-native-qrcode-svg react-native-svg
```

**Solução que FUNCIONA:**

```javascript
import QRCodeSVG from "react-native-qrcode-svg";

// Uso simples e FUNCIONAL:
<QRCodeSVG
  value={matricula} // Só a matrícula mesmo (ex: "20233005297")
  size={250}
  backgroundColor="white"
  color="black"
/>;
```

**Por que essa porra funciona:**

- Gera o QR Code **localmente** no celular (sem depender de internet)
- Renderiza como SVG nativo (performance top)
- Qualquer scanner consegue ler de boa
- Rápido pra caralho

---

### 2️⃣ CONFIGUREI OS CONTEXTS (A PARTE MAIS IMPORTANTE)

#### **App.js - A estrutura que tava FALTANDO**

**ANTES (TUDO QUEBRADO):**

```javascript
const App = () => {
  return <AppContent />; // SEM CONTEXTO NENHUM, QUE MERDA
};
```

**DEPOIS (FUNCIONANDO PRA CARALHO):**

```javascript
const App = () => {
  return (
    <SafeAreaProvider>
      {" "}
      {/* Safe area pro notch do iPhone */}
      <AuthProvider>
        {" "}
        {/* Autenticação GLOBAL */}
        <AppProvider>
          {" "}
          {/* Estado da aplicação */}
          <AppContent /> {/* O app em si */}
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};
```

**Por que isso é CRUCIAL:**

- Agora TODO MUNDO pode usar `useAuth()` e `useApp()`
- Dados compartilhados entre TODAS as páginas
- Sem precisar ficar passando props que nem maluco

#### **Auto-login implementado**

Adicionei essa belezinha no AppContent:

```javascript
const { isAuthenticated, loading } = useAuth();

useEffect(() => {
  if (isAuthenticated && currentPage === "login") {
    setCurrentPage("dashboard"); // Manda direto pro dashboard
  }
}, [isAuthenticated]);
```

**O que essa magia faz:**

- Quando abre o app, verifica se o cara tá logado
- Se sim, vai DIRETO pro dashboard (sem encher o saco)
- Se não, fica no login
- Firebase + AsyncStorage mantém a sessão

---

### 3️⃣ CORRIGI O LOGIN E REGISTRO (tavam COMPLETAMENTE INÚTEIS)

#### **Login.js - Agora AUTENTICA DE VERDADE**

**ANTES (um lixo completo):**

```javascript
<Button onPress={() => onNavigate("dashboard")}>Entrar</Button>
// ❌ Só mudava de tela
// ❌ Não verificava NADA
// ❌ Qualquer um entrava
```

**DEPOIS (seguro e funcional):**

```javascript
const { login } = useAuth(); // Pego a função REAL

const handleLogin = async () => {
  // Validação básica (não sou trouxa)
  if (!email || !password) {
    Alert.alert("Erro", "Preencha tudo aí, porra");
    return;
  }

  setIsLoading(true);
  const result = await login(email, password); // CHAMA O FIREBASE DE VERDADE
  setIsLoading(false);

  if (result.success) {
    onNavigate("dashboard"); // Só entra se autenticar
  } else {
    Alert.alert("Erro", result.error); // Mostra o erro
  }
};

<Button onPress={handleLogin} disabled={isLoading}>
  {isLoading ? <ActivityIndicator /> : "Entrar"}
</Button>;
```

#### **Register.js - Agora SALVA A MATRÍCULA**

**ANTES (não fazia NADA):**

```javascript
<Button onPress={() => onNavigate("dashboard")}>Criar conta</Button>
// ❌ Não salvava PORRA NENHUMA
```

**DEPOIS (salva TUDO certinho):**

```javascript
const { register } = useAuth();

const handleRegister = async () => {
  // Validações (pq eu não sou burro)
  if (!matricula || !email || !password || !confirmPassword) {
    Alert.alert("Erro", "Preenche tudo aí, caralho");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Erro", "As senhas não batem, burro");
    return;
  }

  if (password.length < 6) {
    Alert.alert("Erro", "Senha tem que ter pelo menos 6 caracteres");
    return;
  }

  setIsLoading(true);
  const result = await register(email, password, matricula); // SALVA A MATRÍCULA
  setIsLoading(false);

  if (result.success) {
    Alert.alert("Sucesso", "Conta criada, parabéns!");
    onNavigate("dashboard");
  } else {
    Alert.alert("Erro", result.error);
  }
};
```

---

### 4️⃣ O CORAÇÃO DO SISTEMA - AuthContext.js

Essa função aqui é onde a **MÁGICA ACONTECE**:

```javascript
const register = async (email, password, matricula, additionalData = {}) => {
  try {
    // 1. Crio usuário no Firebase Auth
    const result = await FirebaseService.createUserWithEmailAndPassword(
      email,
      password
    );

    if (result.user) {
      // 2. Salvo a MATRÍCULA no Firestore (collection "users")
      const userDocData = {
        matricula, // ⭐ AQUI QUE SALVA A BENDITA MATRÍCULA
        email,
        ...additionalData,
      };

      const userDoc = await FirebaseService.createUserDocument(
        result.user,
        userDocData
      );
      setUserDocument(userDoc);

      // 3. Tento registrar na API em background (SE FALHAR, FODA-SE)
      try {
        await ApiService.registrar({ email, password, matricula });
      } catch (apiError) {
        console.warn("API falhou, mas tá de boa, conta já foi criada");
      }

      // 4. Salvo na collection "alunos" também (pra compatibilidade)
      const alunoData = {
        email,
        matricula, // ⭐ E AQUI DE NOVO
        nome: additionalData.nome || "",
        turma: additionalData.turma || "",
        uid: result.user.uid,
      };

      await FirebaseService.createAlunoDocument(alunoData);

      return { success: true, user: result.user };
    }
  } catch (error) {
    console.error("Deu ruim:", error);
    return { success: false, error: error.message };
  }
};
```

**Por que essa ordem é GENIAL:**

1. **Firebase primeiro** = Rápido e confiável
2. Se a API falhar, **foda-se**, conta existe no Firebase
3. Matrícula **SEMPRE** salva no Firestore
4. QR Code pega do Firestore

---

### 5️⃣ FIREBASE COM ASYNCSTORAGE (pra manter logado)

No `FirebaseService.js` eu adicionei essa parada:

```javascript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

// Inicializa com persistência (pra não deslogar quando fechar o app)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

**O que essa porra faz:**

- Salva a sessão do usuário no celular
- Fecha o app, abre de novo → **CONTINUA LOGADO**
- Sem encher o saco pedindo login toda hora

---

### 6️⃣ CORRIGI O SafeAreaView (tava dando warning chato)

```
⚠️ WARN: SafeAreaView deprecated, blá blá blá
```

**Solução em TODAS as páginas:**

```javascript
// ANTES (deprecated):
import { SafeAreaView } from "react-native";

// DEPOIS (correto):
import { SafeAreaView } from "react-native-safe-area-context";

// E no App.js, envolvi tudo com:
<SafeAreaProvider>{/* Todo o app */}</SafeAreaProvider>;
```

**Páginas que eu mexi:**

- Settings.js ✅
- LostFound.js ✅
- QRCode.js ✅
- Register.js ✅
- Dashboard.js ✅
- Authorizations.js ✅

---

### 7️⃣ RESOLVI OS ERROS CRÍTICOS

#### **Erro 1: TurboModule 'PlatformConstants' not found**

**O problema:**

- Tinha `expo-router` instalado mas **NÃO CONFIGURADO**
- Conflito com a nova arquitetura do React Native
- App travava antes mesmo de carregar

**Solução:**

```json
// app.json - REMOVI essa merda:
"plugins": ["expo-router"]  // ❌ FORA

// package.json - Atualizei as versões pro Expo 54
```

#### **Erro 2: Firebase Auth não persistia**

**Problema:** Deslogava sempre que fechava o app

**Solução:**

```javascript
// Adicionei AsyncStorage no Firebase Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

#### **Erro 3: Loading infinito no registro/login**

**O problema FUDIDO:**

- Código tentava chamar a API **PRIMEIRO**
- Se a API tivesse offline ou lenta → **TRAVAVA TUDO**
- Ficava em loading infinito

**Solução GENIAL:**

```javascript
// INVERTEI A ORDEM:
// 1. Firebase primeiro (sempre funciona, é rápido)
// 2. API depois em background (se falhar, foda-se)

// ANTES (merda):
const apiResult = await ApiService.registrar(); // Espera API
if (apiResult.success) {
  await FirebaseService.create(); // Só depois cria no Firebase
}

// DEPOIS (inteligente):
await FirebaseService.create(); // Cria logo no Firebase
try {
  await ApiService.registrar(); // Tenta API depois, sem bloquear
} catch {
  console.warn("API falhou, mas foda-se"); // Não quebra
}
```

---

## 📂 ESTRUTURA FINAL (tá linda)

```
App.js ← Aqui que os Providers tão configurados
├── SafeAreaProvider (safe area pro notch)
├── AuthProvider (login, register, logout, etc)
├── AppProvider (achados, autorizações, cardápios)
└── AppContent (navegação entre as páginas)

src/
├── components/common/
│   ├── Button.js ← Botão estilizado
│   ├── Header.js ← Cabeçalho com botão voltar
│   ├── Input.js ← Campo de texto (com toggle de senha)
│   ├── ListItem.js ← Item de lista bonito
│   ├── Logo.js ← Logo do IF
│   └── Tab.js ← Sistema de abas
│
├── context/
│   ├── AuthContext.js ← TODO o sistema de autenticação
│   └── AppProvider.js ← Estado global (achados, etc)
│
├── pages/
│   ├── Login.js ← Login FUNCIONAL
│   ├── Register.js ← Registro que SALVA a matrícula
│   ├── Dashboard.js ← Menu principal
│   ├── QRCode.js ← Carteirinha com QR Code NATIVO
│   ├── Settings.js ← Configurações + Logout
│   ├── LostFound.js ← Achados e perdidos
│   └── Authorizations.js ← Autorizações
│
└── services/
    ├── ApiService.js ← Chamadas pra API REST
    └── FirebaseService.js ← Firebase Auth + Firestore
```

---

## 🎓 CONCEITOS QUE EU USEI

### **Context API (pra não ficar passando props que nem maluco)**

```javascript
// Crio um contexto global:
const AuthContext = createContext();

// Provider envolve o app:
<AuthProvider>{children}</AuthProvider>;

// Qualquer componente filho usa assim:
const { user, login, logout } = useAuth();
```

**Por que é foda:**

- Dados globais acessíveis em QUALQUER lugar
- Sem prop drilling (aquele inferno de ficar passando props)
- Estado compartilhado entre páginas

### **Firebase Auth + Firestore**

```javascript
// Firebase Auth: Sistema de login/registro
createUserWithEmailAndPassword(email, password) // Cria usuário
signInWithEmailAndPassword(email, password)     // Faz login

// Firestore: Banco NoSQL na nuvem
// Collection "users" → um documento por usuário
{
  uid: "abc123",
  email: "alunofilhodaputa@email.com",
  matricula: "20233005297",
  nome: "João Silva Putifero"
}
```

### **AsyncStorage (pra guardar dados no celular)**

```javascript
// Firebase usa automaticamente pra manter o login
persistence: getReactNativePersistence(AsyncStorage);
// Resultado: Fecha app, abre de novo → CONTINUA LOGADO
```

### **QR Code SVG Nativo (porque Google Charts não prestou)**

```javascript
// Biblioteca gera SVG direto no dispositivo
<QRCodeSVG value="20233005297" size={250} />
// Scanner lê a matrícula de boa
```

---

## 🚀 PRA RODAR ESSA BAGAÇA

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o app (com cache limpo)

npx expo start --clear
# 3. Testar tudo!
```

---

## ✅ CHECKLIST DO QUE TÁ FUNCIONANDO

- ✅ Login autêntico (com Firebase Auth)
- ✅ Registro salvando matrícula corretamente
- ✅ QR Code gerando com a matrícula
- ✅ Usuário mantém login (AsyncStorage)
- ✅ Logout funcional
- ✅ Página Settings completa
- ✅ Página LostFound completa
- ✅ Página QRCode completa
- ✅ Auto-login ao abrir app
- ✅ Sem loading infinito
- ✅ Sem erros de TurboModule
- ✅ SafeAreaView atualizado

---

## 💡 DICAS PRO SEU AMIGO

**1. Fluxo de autenticação:**
"Cara, é assim: usuário registra → Firebase cria conta → salva matrícula no Firestore → faz login automático → AsyncStorage mantém sessão. Simples assim, brother."

**2. Por que não trava mais:**
"Antes tentava chamar API primeiro, se falhasse, travava tudo. Agora Firebase primeiro (sempre funciona), API depois em background (se falhar, foda-se)."

**3. QR Code:**
"Google Charts API era uma bosta pra React Native. Agora uso biblioteca nativa que gera SVG localmente. Rápido pra caralho e funciona 100%."

**4. Context API:**
"É tipo variáveis globais, mas feito direito. Todo mundo pode acessar dados de autenticação sem precisar ficar passando props."

**5. Páginas que eu criei do zero:**
"Settings, LostFound e QRCode tavam COMPLETAMENTE VAZIAS. Eu criei tudo: UI, lógica, integração com Firebase. Do zero mesmo."

---

## 🎯 COMANDOS QUE EU USEI

```bash
npm install                                      # Instalar tudo
npx expo start --clear                          # Rodar com cache limpo
npx expo install --fix                          # Corrigir versões
```

---

## 🔥 CONCLUSÃO

**O que era:**

- 3 páginas vazias
- Login fake
- QR Code inexistente
- Matrícula não salvava
- Travamento infinito

**O que ficou:**

- Tudo funcionando (quase sla kkkkk)
- Autenticação real
- QR Code nativo
- Persistência de login
- Zero travamentos

Foi uma jornada épica, mas valeu a pena. Agora esse app tá redondo, mano! 🚀

Se tiver dúvida, é só mandar mensagem. Abraço!

---

**P.S.:** Se alguma coisa quebrar, provavelmente é culpa é sua :)
