import { create } from 'zustand';
import { LoginArea, login as loginRequest, LoginUser } from '../service/auth.service';
import { setAccessToken } from './authToken';

interface AuthState {
  accessToken: string | null;
  user: LoginUser | null;
  area: LoginArea | null;
  isTowelManagement: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string, deviceId: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  area: null,
  isTowelManagement: false,
  isLoading: false,
  error: null,

  login: async (username, password, deviceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginRequest({ username, password, deviceId });
      setAccessToken(response.accessToken);
      set({
        accessToken: response.accessToken,
        user: response.user,
        area: response.area,
        isTowelManagement: response.isTowelManagement,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      // TODO: شيلي الـ console.log ده بعد ما تتأكدي إن السبب اتحل
      console.log('LOGIN ERROR >>>', {
        message: err?.message,
        stack: err?.stack,
        status: err?.response?.status,
        data: err?.response?.data,
      });

      const status = err?.response?.status;
      let error = 'login.loginFailed';

      if (!err?.response) {
        error = 'login.networkError';
      } else if (status === 401 || status === 400) {
        error = 'login.invalidCredentials';
      } else if (status && status >= 500) {
        error = 'login.serverError';
      }

      set({ isLoading: false, error });
      return false;
    }
  },

  logout: () => {
    setAccessToken(null);
    set({ accessToken: null, user: null, area: null, isTowelManagement: false, error: null });
  },
}));