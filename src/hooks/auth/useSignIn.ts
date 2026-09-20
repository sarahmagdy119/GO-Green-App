import { useState } from 'react';
import { loginSchema } from '../../schema/auth.schema';
import { useAuthStore } from '../../store/auth.store';
import { getDeviceId } from '../../utils/device';

export function useSignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const { login, isLoading, error } = useAuthStore();

  const submit = async () => {
    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      const errors: typeof fieldErrors = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === 'username') errors.username = issue.message;
        if (issue.path[0] === 'password') errors.password = issue.message;
      });
      setFieldErrors(errors);
      return false;
    }
    setFieldErrors({});

    const deviceId = await getDeviceId();
    console.log('DEVICE ID >>>', deviceId);
    return login(username, password, deviceId);
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    fieldErrors,
    isLoading,
    apiError: error,
    submit,
  };
}