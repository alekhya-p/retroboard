import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, AuthState } from '@/types';
import { authApi } from '@/services/api';
import { AxiosError } from 'axios';
import router from '@/router';

// Function to parse JWT token
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return null;
  }
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const clearError = () => {
    error.value = null;
  };

  const handleError = (err: unknown, defaultMessage: string) => {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        error.value = 'Authentication failed. Please log in again.';
        clearAuth();
        router.push('/');
      } else if (err.response?.status === 403) {
        error.value = 'You do not have permission to perform this action.';
      } else if (err.response?.data?.message) {
        error.value = err.response.data.message;
      } else {
        error.value = defaultMessage;
      }
    } else {
      error.value = defaultMessage;
    }
    console.error(err);
  };

  const setAuth = (authData: { access_token: string; token_type: string; user: User }) => {
    user.value = authData.user;
    token.value = authData.access_token;
    isAuthenticated.value = true;
    
    if (authData.access_token) {
      localStorage.setItem('token', authData.access_token);
    } else {
      localStorage.removeItem('token');
    }
  };

  const loginWithMicrosoft = async (code: string) => {
    try {
      loading.value = true;
      clearError();
      const response = await authApi.loginWithMicrosoft(code);
      setAuth(response.data);
      return response.data;
    } catch (err) {
      handleError(err, 'Microsoft login failed');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const loginWithGoogle = async (code: string) => {
    try {
      loading.value = true;
      clearError();
      const response = await authApi.loginWithGoogle(code);
      setAuth(response.data);
      return response.data;
    } catch (err) {
      handleError(err, 'Google login failed');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Per-browser guest identities, keyed by lowercased display name.
  // This lets the SAME browser restore a guest's session/history when they
  // re-enter the same name, while a different browser/person always gets a
  // fresh, isolated identity (the backend mints a unique id per login).
  const GUEST_SESSIONS_KEY = 'guestSessions';
  const readGuestSessions = (): Record<string, string> => {
    try {
      return JSON.parse(localStorage.getItem(GUEST_SESSIONS_KEY) || '{}');
    } catch {
      return {};
    }
  };
  const saveGuestSession = (name: string, tok: string) => {
    try {
      const map = readGuestSessions();
      map[name] = tok;
      localStorage.setItem(GUEST_SESSIONS_KEY, JSON.stringify(map));
    } catch {
      /* storage full / blocked - non-fatal, we just lose continuity */
    }
  };
  const userFromClaims = (claims: any): User => ({
    id: claims.id,
    display_name: claims.display_name,
    groups: claims.groups || undefined,
    email: claims.email || undefined,
    user_type: claims.user_type || 'anonymous',
    is_active: true,
  });

  const loginAnonymously = async (displayName: string) => {
    try {
      loading.value = true;
      clearError();
      const key = displayName.trim().toLowerCase();

      // Reuse a still-valid guest identity remembered in THIS browser for this name.
      const cached = key ? readGuestSessions()[key] : null;
      if (cached) {
        const claims = parseJwt(cached);
        const now = Math.floor(Date.now() / 1000);
        if (claims && claims.id && (!claims.exp || claims.exp > now)) {
          const data = { access_token: cached, token_type: 'bearer', user: userFromClaims(claims) };
          setAuth(data);
          return data;
        }
      }

      const response = await authApi.loginAnonymously(displayName);
      setAuth(response.data);
      if (key && response.data?.access_token) {
        saveGuestSession(key, response.data.access_token);
      }
      return response.data;
    } catch (err) {
      handleError(err, 'Anonymous login failed');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Turn an email auth failure into a friendly message WITHOUT the global
  // 401 redirect/clear-auth that handleError does (a wrong password on the
  // login form must stay on the form, not bounce to the home page).
  const setEmailAuthError = (err: unknown, fallback: string): string => {
    let message = fallback;
    if (err instanceof AxiosError) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string' && detail) message = detail;
      else if (!err.response) message = "Couldn't reach the server. Check your connection and try again.";
    }
    error.value = message;
    console.error(err);
    return message;
  };

  const signupWithEmail = async (displayName: string, email: string, password: string) => {
    try {
      loading.value = true;
      clearError();
      const response = await authApi.signup({ display_name: displayName, email, password });
      setAuth(response.data);
      return response.data;
    } catch (err) {
      setEmailAuthError(err, 'Could not create your account. Please try again.');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      loading.value = true;
      clearError();
      const response = await authApi.loginWithEmail({ email, password });
      setAuth(response.data);
      return response.data;
    } catch (err) {
      setEmailAuthError(err, 'Invalid email or password.');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const requestPasswordReset = async (email: string): Promise<string> => {
    try {
      loading.value = true;
      clearError();
      const response = await authApi.forgotPassword({ email });
      return response.data?.message || "If an account exists for that email, we've sent a password reset link.";
    } catch (err) {
      setEmailAuthError(err, 'Could not send the reset email. Please try again.');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      loading.value = true;
      clearError();
      const response = await authApi.resetPassword({ token, password });
      setAuth(response.data);
      return response.data;
    } catch (err) {
      setEmailAuthError(err, 'Could not reset your password. The link may have expired.');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      loading.value = true;
      clearError();
      //await authApi.logout();
      clearAuth();
    } catch (err) {
      handleError(err, 'Logout failed');
      // Still clear auth locally even if the API call fails
      clearAuth();
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
  };

  const validateToken = async (): Promise<boolean> => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      clearAuth();
      return false;
    }

    try {
      loading.value = true;
      clearError();
      
      // Parse the token to get claims
      const tokenClaims = parseJwt(storedToken);
      
      if (!tokenClaims) {
        console.error('Invalid token format');
        clearAuth();
        return false;
      }
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (tokenClaims.exp && tokenClaims.exp < currentTime) {
        console.error('Token has expired');
        clearAuth();
        return false;
      }
      
      // Set token
      token.value = storedToken;
      
      // If we have user info in the token, use it
      if (tokenClaims.id && tokenClaims.display_name) {
        user.value = {
          id: tokenClaims.id,
          display_name: tokenClaims.display_name,
          groups: tokenClaims.groups || undefined,
          email: tokenClaims.email || undefined,
          user_type: tokenClaims.user_type || 'anonymous',
          is_active: true
        };
        isAuthenticated.value = true;
        return true;
      }
      
      // If no user info in token, fetch from API
      const response = await authApi.getMe();
      user.value = response.data;
      isAuthenticated.value = true;
      return true;
    } catch (err) {
      handleError(err, 'Token validation failed');
      clearAuth();
      return false;
    } finally {
      loading.value = false;
    }
  };

  const initializeAuth = async (): Promise<boolean> => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      return await validateToken();
    }
    return false;
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    clearError,
    loginWithMicrosoft,
    loginWithGoogle,
    loginAnonymously,
    signupWithEmail,
    loginWithEmail,
    requestPasswordReset,
    resetPassword,
    logout,
    validateToken,
    initializeAuth,
  };
}); 