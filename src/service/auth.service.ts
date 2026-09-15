import { api } from './api';

export interface LoginRequest {
  username: string;
  password: string;
  deviceId: string;
}

export interface LoginUser {
  id: number;
  username: string;
  role: string;
}

export interface LoginArea {
  ar_name: string;
  en_name: string;
}

export interface LoginResponse {
  accessToken: string;
  user: LoginUser;
  area: LoginArea;
  isTowelManagement: boolean;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  // TODO: اتأكد من الـ endpoint path مطابق للـ API فعلاً
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  return data;
}