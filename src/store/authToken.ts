import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'access_token';
const AUTH_DATA_KEY = 'auth_data';

let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export async function persistAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function loadPersistedAccessToken() {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  accessToken = token;
  return token;
}

export async function persistAuthData(data: unknown | null) {
  if (data) {
    await SecureStore.setItemAsync(AUTH_DATA_KEY, JSON.stringify(data));
  } else {
    await SecureStore.deleteItemAsync(AUTH_DATA_KEY);
  }
}

export async function loadPersistedAuthData<T>(): Promise<T | null> {
  const raw = await SecureStore.getItemAsync(AUTH_DATA_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}