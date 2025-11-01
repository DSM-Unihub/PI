import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TOKEN_KEY = '@resist_token';

export async function saveToken(token: string) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    console.warn('Erro ao salvar token', e);
  }
}

export async function getToken(): Promise<string | null> {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return token;
  } catch (e) {
    console.warn('Erro ao ler token', e);
    return null;
  }
}

export async function removeToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  } catch (e) {
    console.warn('Erro ao remover token', e);
  }
}