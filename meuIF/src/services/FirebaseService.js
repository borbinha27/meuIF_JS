import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase - MESMA do seu Flutter
const firebaseConfig = {
  apiKey: "AIzaSyBkPe9ZbV0aoWskRR2knRGP5zL2z7UZdVA",
  authDomain: "meu-i-f-a-p-k-ow9qhr.firebaseapp.com",
  projectId: "meu-i-f-a-p-k-ow9qhr",
  storageBucket: "meu-i-f-a-p-k-ow9qhr.firebasestorage.app",
  messagingSenderId: "570389016634",
  appId: "1:570389016634:web:6c664bde54eb27c87ac503"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth com persistência AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const firestore = getFirestore(app);

class FirebaseService {
  static auth = auth;
  static firestore = firestore;

  // AUTH METHODS - MESMOS DO FLUTTER
  static async signInWithEmailAndPassword(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async createUserWithEmailAndPassword(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error('Erro ao fazer logout');
    }
  }

  static getCurrentUser() {
    return auth.currentUser;
  }

  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // FIRESTORE METHODS - MESMOS DO FLUTTER

  // Users Collection
  static async createUserDocument(user, additionalData = {}) {
    if (!user) return null;

    const userRef = doc(firestore, 'users', user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      display_name: user.displayName,
      photo_url: user.photoURL,
      phone_number: user.phoneNumber,
      created_time: Timestamp.now(),
      matricula: additionalData.matricula || '',
      ...additionalData,
    };

    try {
      await setDoc(userRef, userData);
      return userData;
    } catch (error) {
      console.error('Error creating user document:', error);
      return null;
    }
  }

  static async getUserDocument(uid) {
    try {
      const userRef = doc(firestore, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        // Converter Timestamp para Date
        if (data.created_time && data.created_time.toDate) {
          data.created_time = data.created_time.toDate();
        }
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error getting user document:', error);
      return null;
    }
  }

  static async updateUserDocument(uid, updates) {
    try {
      const userRef = doc(firestore, 'users', uid);
      await updateDoc(userRef, updates);
      return await this.getUserDocument(uid);
    } catch (error) {
      console.error('Error updating user document:', error);
      return null;
    }
  }

  // Alunos Collection
  static async createAlunoDocument(alunoData) {
    try {
      const alunosRef = collection(firestore, 'alunos');
      const docRef = await addDoc(alunosRef, {
        ...alunoData,
        created_time: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating aluno document:', error);
      return null;
    }
  }

  static async getAlunoByMatricula(matricula) {
    try {
      const alunosRef = collection(firestore, 'alunos');
      const q = query(alunosRef, where('matricula', '==', matricula));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        if (data.created_time && data.created_time.toDate) {
          data.created_time = data.created_time.toDate();
        }
        return { id: doc.id, ...data };
      }
      return null;
    } catch (error) {
      console.error('Error getting aluno by matricula:', error);
      return null;
    }
  }

  static async updateAlunoDocument(alunoId, updates) {
    try {
      const alunoRef = doc(firestore, 'alunos', alunoId);
      await updateDoc(alunoRef, updates);
      return true;
    } catch (error) {
      console.error('Error updating aluno document:', error);
      return false;
    }
  }

  // Generic Collection Methods
  static async addToCollection(collectionName, data) {
    try {
      const collectionRef = collection(firestore, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        created_time: Timestamp.now(),
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error adding to ${collectionName}:`, error);
      return null;
    }
  }

  static async getFromCollection(collectionName, filters = {}, orderByField = 'created_time') {
    try {
      const collectionRef = collection(firestore, collectionName);
      let q = query(collectionRef);

      // Adicionar filtros
      Object.keys(filters).forEach(field => {
        if (filters[field] !== undefined) {
          q = query(q, where(field, '==', filters[field]));
        }
      });

      // Adicionar ordenação
      if (orderByField) {
        q = query(q, orderBy(orderByField, 'desc'));
      }

      const querySnapshot = await getDocs(q);
      const docs = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Converter Timestamps para Date
        Object.keys(data).forEach(key => {
          if (data[key] && typeof data[key].toDate === 'function') {
            data[key] = data[key].toDate();
          }
        });
        docs.push({ id: doc.id, ...data });
      });

      return docs;
    } catch (error) {
      console.error(`Error getting from ${collectionName}:`, error);
      return [];
    }
  }

  static async updateInCollection(collectionName, id, updates) {
    try {
      const docRef = doc(firestore, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updated_time: Timestamp.now(),
      });
      return true;
    } catch (error) {
      console.error(`Error updating in ${collectionName}:`, error);
      return false;
    }
  }

  static async deleteFromCollection(collectionName, id) {
    try {
      const docRef = doc(firestore, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting from ${collectionName}:`, error);
      return false;
    }
  }

  // Helper para tratar erros do Firebase Auth
  static getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/email-already-in-use': 'Este email já está em uso',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Usuário desabilitado',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
    };

    return errorMessages[errorCode] || 'Erro desconhecido';
  }
}

export default FirebaseService;
