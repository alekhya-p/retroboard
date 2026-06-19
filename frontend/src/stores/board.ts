import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Board, Message } from '@/types';
import { boardApi, messageApi } from '@/services/api';
import { AxiosError } from 'axios';

export const useBoardStore = defineStore('board', () => {
  const boards = ref<Board[]>([]);
  const currentBoard = ref<Board | null>(null);
  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const clearError = () => {
    error.value = null;
  };

  const handleError = (err: unknown, defaultMessage: string) => {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        error.value = 'Your session has expired. Please log in again.';
      } else if (err.response?.status === 403) {
        error.value = 'You do not have permission to perform this action.';
      } else if (err.response?.status === 404) {
        error.value = 'The requested resource was not found.';
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

  const fetchBoards = async () => {
    try {
      loading.value = true;
      clearError();
      const response = await boardApi.getBoards();
      boards.value = response.data;
    } catch (err) {
      handleError(err, 'Failed to fetch boards');
      // Don't update boards on error to prevent stale data
    } finally {
      loading.value = false;
    }
  };

  const fetchBoard = async (id: string) => {
    try {
      loading.value = true;
      clearError();
      const [boardResponse, messagesResponse] = await Promise.all([
        boardApi.getBoard(id),
        messageApi.getBoardMessages(id)
      ]);
      currentBoard.value = boardResponse.data;
      messages.value = messagesResponse.data;
    } catch (err) {
      handleError(err, 'Failed to fetch board');
      // Don't update currentBoard or messages on error
    } finally {
      loading.value = false;
    }
  };

  const fetchBoardById = async (id: string) => {
    try {
      loading.value = true;
      clearError();
      const boardResponse = await boardApi.getBoard(id);
      currentBoard.value = boardResponse.data;
    } catch (err) {
      handleError(err, 'Failed to fetch board');
      // Don't update currentBoard on error
    } finally {
      loading.value = false;
    }
  };

  const fetchBoardMessages = async (boardId: string) => {
    try {
      clearError();
      const response = await messageApi.getBoardMessages(boardId);
      messages.value = response.data;
    } catch (err) {
      handleError(err, 'Failed to fetch messages');
      // Don't update messages on error
    }
  };

  const createBoard = async (boardData: Partial<Board>) => {
    try {
      loading.value = true;
      clearError();
      const response = await boardApi.createBoard(boardData);
      boards.value.push(response.data);
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to create board');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateBoard = async (id: string, boardData: Partial<Board>) => {
    try {
      loading.value = true;
      clearError();
      const response = await boardApi.updateBoard(id, boardData);
      
      // Only update if the API call was successful
      const index = boards.value.findIndex(b => b.id === id);
      if (index !== -1) {
        boards.value[index] = response.data;
      }
      if (currentBoard.value?.id === id) {
        currentBoard.value = response.data;
      }
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to update board');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteBoard = async (id: string) => {
    try {
      loading.value = true;
      clearError();
      await boardApi.deleteBoard(id);
      // Only update state if delete was successful
      boards.value = boards.value.filter(b => b.id !== id);
      if (currentBoard.value?.id === id) {
        currentBoard.value = null;
      }
    } catch (err) {
      handleError(err, 'Failed to delete board');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createMessage = async (messageData: Partial<Message>) => {
    try {
      loading.value = true;
      clearError();
      const response = await messageApi.createMessage(messageData);
      //messages.value.push(response.data);
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to create message');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateMessage = async (messageId: string, messageData: Partial<Message>) => {
    try {
      loading.value = true;
      clearError();
      const response = await messageApi.updateMessage(messageId, messageData);
      const index = messages.value.findIndex(m => m.id === messageId);
      if (index !== -1) {
        messages.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to update message');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleMessageLike = async (messageId: string) => {
    try {
      loading.value = true;
      clearError();
      const response = await messageApi.toggleLike(messageId);
      const index = messages.value.findIndex(m => m.id === messageId);
      if (index !== -1) {
        messages.value[index] = response.data;
      }
    } catch (err) {
      handleError(err, 'Failed to toggle like');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      loading.value = true;
      clearError();
      await messageApi.deleteMessage(messageId);
      //messages.value = messages.value.filter(m => m.id !== messageId);
    } catch (err) {
      handleError(err, 'Failed to delete message');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const generateSummary = async (boardId: string) => {
    try {
      loading.value = true;
      clearError();
      const response = await boardApi.generateSummary(boardId);
      if (currentBoard.value?.id === boardId) {
        currentBoard.value.summary = response.data.summary;
      }
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to generate summary');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    boards,
    currentBoard,
    messages,
    loading,
    error,
    clearError,
    fetchBoards,
    fetchBoard,
    fetchBoardById,
    fetchBoardMessages,
    createBoard,
    updateBoard,
    deleteBoard,
    createMessage,
    updateMessage,
    toggleMessageLike,
    deleteMessage,
    generateSummary,
  };
}); 