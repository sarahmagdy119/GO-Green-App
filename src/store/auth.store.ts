import { create } from 'zustand';
import { LoginArea, login as loginRequest, LoginUser } from '../service/auth.service';
import {
  loadPersistedAccessToken,
  loadPersistedAuthData,
  persistAccessToken,
  persistAuthData,
} from './authToken';

interface PersistedAuthData {
  user: LoginUser;
  area: LoginArea;
  isTowelManagement: boolean;
}

interface AuthState {
  accessToken: string | null;
  user: LoginUser | null;
  area: LoginArea | null;
  isTowelManagement: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (username: string, password: string, deviceId: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  area: null,
  isTowelManagement: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  initialize: async () => {
    try {
      const token = await loadPersistedAccessToken();
const data = await loadPersistedAuthData<PersistedAuthData>();
console.log('PERSISTED DATA >>>', data);
      set({
        accessToken: token,
        user: data?.user ?? null,
        area: data?.area ?? null,
        isTowelManagement: data?.isTowelManagement ?? false,
        isInitializing: false,
      });
    } catch {
      set({ accessToken: null, user: null, area: null, isTowelManagement: false, isInitializing: false });
    }
  },

  login: async (username, password, deviceId) => {
    set({ isLoading: true, error: null });
    try {
const response = await loginRequest({ username, password, deviceId });
console.log('RAW LOGIN RESPONSE >>>', JSON.stringify(response));

await persistAccessToken(response.accessToken);
await persistAuthData({
  user: response.user,
  area: response.area,
  isTowelManagement: response.isTowelManagement,
});
console.log('AREA AFTER SET >>>', response.area);

      set({
        accessToken: response.accessToken,
        user: response.user,
        area: response.area,
        isTowelManagement: response.isTowelManagement,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      console.log('LOGIN ERROR >>>', {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      });

      const status = err?.response?.status;
      let error = 'loginFailed';

      if (!err?.response) {
        error = 'network Error , check your internet connection';
      } else if (status === 401 || status === 400) {
        error = 'invalid username or password';
      } else if (status && status >= 500) {
        error = 'server Error';
      }

      set({ isLoading: false, error });
      return false;
    }
  },

  logout: async () => {
    await persistAccessToken(null);
    await persistAuthData(null);
    set({ accessToken: null, user: null, area: null, isTowelManagement: false, error: null });
  },
}));