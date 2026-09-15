import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'login.usernameRequired'),
  password: z.string().min(6, 'login.passwordMinLength'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
