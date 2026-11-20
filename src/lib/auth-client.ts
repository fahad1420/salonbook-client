import { createAuthClient } from 'better-auth/react';

const apiBase =
  process.env.NEXT_PUBLIC_API_URL || 'https://salonbook-api.vercel.app/api';
const baseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  (apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase);

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: 'include',
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get('set-auth-token');
      if (authToken) {
        localStorage.setItem('salonbook_token', authToken);
      }
    },
  },
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
