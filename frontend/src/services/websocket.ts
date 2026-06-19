import { ref } from 'vue';

// Define types for WebSocket messages
interface WebSocketMessage {
  type: string;
  action?: string;
  data?: any;
}

type WebSocketCallback = (data: any) => void;

type RoomKind = 'board' | 'game-room';

class WebSocketService {
  private socket: WebSocket | null = null;
  private boardId: string | null = null;
  private roomKind: RoomKind = 'board';
  private callbacks: Map<string, ((data: any) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number | null = null;
  private isConnected = ref(false);

  constructor() {
    // Initialize the service
  }

  connect(boardId: string, kind: RoomKind = 'board') {
    if (this.socket && this.boardId === boardId && this.roomKind === kind) {
      return; // Already connected to this room
    }

    this.disconnect(); // Disconnect from any existing connection
    this.boardId = boardId;
    this.roomKind = kind;
    this.connectWebSocket();
  }

  private connectWebSocket() {
    if (!this.boardId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const defaultBase = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`;
    const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL || defaultBase;
    const path = this.roomKind === 'game-room' ? 'game-rooms' : 'messages';
    const wsUrl = `${wsBaseUrl}/api/v1/${path}/ws/${this.boardId}`;
    
    if (import.meta.env.DEV) console.log(`Connecting to WebSocket: ${wsUrl}`);
    
    this.socket = new WebSocket(wsUrl);
    
    this.socket.onopen = () => {
      if (import.meta.env.DEV) console.log('WebSocket connection established');
      this.isConnected.value = true;
      this.reconnectAttempts = 0;
      
      // Send authentication message
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'auth',
          token: token
        }));
      }
    };
    
    this.socket.onmessage = (event) => {
      this.handleMessage(event);
    };
    
    this.socket.onclose = (event) => {
      if (import.meta.env.DEV) console.log('WebSocket connection closed:', event.code, event.reason);
      this.socket = null;
      this.isConnected.value = false;
      
      // Attempt to reconnect if not a normal closure
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        if (import.meta.env.DEV) console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        
        // Exponential backoff for reconnection
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
        }
        
        this.reconnectTimeout = window.setTimeout(() => {
          this.connectWebSocket();
        }, delay);
      }
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.close(1000, 'Client disconnecting');
      this.socket = null;
    }
    
    this.boardId = null;
    this.roomKind = 'board';
    this.isConnected.value = false;
  }

  private notifyCallbacks(event: string, data: any) {
    const eventCallbacks = this.callbacks.get(event);
    if (eventCallbacks) {
      eventCallbacks.forEach(callback => callback(data));
    }
  }

  public on(event: string, callback: (data: any) => void) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)?.push(callback);
  }

  public off(event: string, callback: (data: any) => void) {
    const eventCallbacks = this.callbacks.get(event);
    if (eventCallbacks) {
      const index = eventCallbacks.indexOf(callback);
      if (index !== -1) {
        eventCallbacks.splice(index, 1);
      }
    }
  }

  public send(payload: Record<string, any>): boolean {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }

  private notify(event: string, data: any) {
    if (!this.callbacks.has(event)) return;
    
    // Process datetime strings if present
    const processedData = this.processDateTimeStrings(data);
    
    this.callbacks.get(event)?.forEach(callback => {
      try {
        callback(processedData);
      } catch (error) {
        console.error(`Error in WebSocket callback for event ${event}:`, error);
      }
    });
  }
  
  private processDateTimeStrings(data: any): any {
    if (!data) return data;
    
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        return data.map(item => this.processDateTimeStrings(item));
      } else {
        const result: Record<string, any> = {};
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            result[key] = this.processDateTimeStrings(data[key]);
          }
        }
        return result;
      }
    } else if (typeof data === 'string') {
      // Check if the string is an ISO datetime format
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
      if (isoDateRegex.test(data)) {
        return new Date(data);
      }
    }
    
    return data;
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  private handleMessage(event: MessageEvent) {
    try {
      const message = JSON.parse(event.data);
      //console.log('WebSocket message received:', message);
      
      if (message.type === 'board_update') {
        // Handle board updates
        if (message.action === 'board_updated' || 
            message.action === 'board_created' || 
            message.action === 'board_deleted' ||
            message.action === 'user_connected' || 
            message.action === 'user_disconnected' ) {
          this.notifyCallbacks(message.action, message.data);
        }
      } else if (message.type === 'message_update') {
        // Handle message updates with specific actions
        this.notifyCallbacks(message.action, message.data);
      }
      else if (message.type === 'initial_data') {
        // Handle message updates with specific actions
        this.notifyCallbacks('initial_data', message);
      }
      else if (message.type === 'game_event') {
        this.notifyCallbacks('game_event', message);
      }
      else if (message.type === 'room_event') {
        this.notifyCallbacks('room_event', message);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();
export default websocketService;