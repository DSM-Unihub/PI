import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TOKEN_KEY = '@resist_token';
const USER_KEY = '@resist_user';

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

export async function saveUser(user: any) {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Erro ao salvar usuário', e);
  }
}

export async function getUser(): Promise<any | null> {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Erro ao ler usuário', e);
    return null;
  }
}

export async function removeUser() {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    console.warn('Erro ao remover usuário', e);
  }
}
