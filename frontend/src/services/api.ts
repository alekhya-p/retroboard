import axios, { AxiosError } from 'axios';
import type { Board, GameRoom, Message, User } from '@/types';
import router from '@/router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth state
      localStorage.removeItem('token');
      
      // Redirect to login if not already there
      if (router.currentRoute.value.path !== '/') {
        router.push({
          path: '/',
          query: { redirect: router.currentRoute.value.fullPath }
        });
      }
      return Promise.reject(error);
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      // You might want to show a specific message for forbidden access
      console.error('Access forbidden:', error);
      return Promise.reject(error);
    }

    // Handle 404 Not Found errors
    if (error.response?.status === 404) {
      console.error('Resource not found:', error);
      return Promise.reject(error);
    }

    // Handle 500 Internal Server errors
    if (error.response?.status === 500) {
      console.error('Server error:', error);
      return Promise.reject(error);
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export const boardApi = {
  getBoards: () => api.get<Board[]>('/boards'),
  getBoard: (id: string) => api.get<Board>(`/boards/${id}`),
  createBoard: (data: Partial<Board>) => api.post<Board>('/boards', data),
  updateBoard: (id: string, data: Partial<Board>) => api.patch<Board>(`/boards/${id}`, data),
  deleteBoard: (id: string) => api.delete(`/boards/${id}`),
  generateSummary: (id: string) => api.post(`/ai/boards/${id}/summary`),
  generateIcebreaker: (id: string, avoid: string[] = []) => api.post<{ icebreaker: string }>(`/ai/boards/${id}/icebreaker`, { avoid }),
};

export const messageApi = {
  getBoardMessages: (boardId: string) => api.get<Message[]>(`/messages/board/${boardId}`),
  createMessage: (data: Partial<Message>) => api.post<Message>('/messages', data),
  updateMessage: (id: string, data: Partial<Message>) => api.patch<Message>(`/messages/${id}`, data),
  toggleLike: (messageId: string) => api.post(`/messages/${messageId}/like`),
  deleteMessage: (messageId: string) => api.delete(`/messages/${messageId}`),
};

export const aiApi = {
  generateTemplate: (userInput: string) => api.post('/ai/generate-retro-idea', { user_input: userInput }),
};

export const gameRoomApi = {
  createRoom: (data: { name: string; description?: string }) =>
    api.post<GameRoom>('/game-rooms', data),
  getRooms: () => api.get<GameRoom[]>('/game-rooms'),
  getRoom: (id: string) => api.get<GameRoom>(`/game-rooms/${id}`),
  deleteRoom: (id: string) => api.delete(`/game-rooms/${id}`),
};

export interface TriviaQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface EmojiJudgement {
  winner_index: number;
  winner: string;
  reason: string;
}

export const gamesApi = {
  drawingPrompt: (theme: string = 'general', difficulty: string = 'easy', avoid: string[] = []) =>
    api.post<{ word: string }>('/ai/games/drawing-prompt', { theme, difficulty, avoid }),
  drawingHint: (word: string, previousHints: string[] = []) =>
    api.post<{ hint: string }>('/ai/games/drawing-hint', { word, previous_hints: previousHints }),
  trivia: (category: string = 'general', avoid: string[] = []) =>
    api.post<TriviaQuestion>('/ai/games/trivia', { category, avoid }),
  triviaBatch: (category: string = 'general', count: number = 10, avoid: string[] = []) =>
    api.post<{ questions: TriviaQuestion[] }>('/ai/games/trivia-batch', { category, count, avoid }),
  drawingPrompts: (theme: string = 'general', difficulty: string = 'easy', count: number = 10, avoid: string[] = []) =>
    api.post<{ words: string[] }>('/ai/games/drawing-prompts', { theme, difficulty, count, avoid }),
  judgeEmoji: (prompt: string, entries: { author: string; story: string }[]) =>
    api.post<EmojiJudgement>('/ai/games/judge-emoji', { prompt, entries }),
  lieInspiration: (topic: string = 'general', avoid: string[] = []) =>
    api.post<{ lies: string[] }>('/ai/games/lie-inspiration', { topic, avoid }),
  rouletteQuestions: (numPairs: number, context: string = 'general', roundLabel: string = 'Round 1', avoid: string[] = []) =>
    api.post<{ questions: string[] }>('/ai/games/roulette-questions', {
      num_pairs: numPairs,
      context,
      round_label: roundLabel,
      avoid,
    }),
};

export const authApi = {
  loginWithMicrosoft: (code: string) => api.post(`/auth/microsoft?code=${code}`),
  getMe: () => api.get('/auth/me'),
  loginWithGoogle: (code: string) => api.post(`/auth/google?code=${code}`),
  loginAnonymously: (displayName: string) => api.post('/auth/anonymous', { display_name: displayName }),
  signup: (data: { display_name: string; email: string; password: string }) => api.post('/auth/signup', data),
  loginWithEmail: (data: { email: string; password: string }) => api.post('/auth/login', data),
  forgotPassword: (data: { email: string }) => api.post<{ message: string }>('/auth/forgot-password', data),
  resetPassword: (data: { token: string; password: string }) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
};

export default api; 