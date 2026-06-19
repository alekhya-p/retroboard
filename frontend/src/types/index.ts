export interface Column {
  id: string;
  name: string;
  color: string;
  description: string;
  is_action_column: boolean;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  facilitator_id: string;
  block_id: string;
  columns: Column[];
  configurations: {
    show_all_messages: boolean;
    enable_likes: boolean;
    max_votes_per_user: number;
  };
  openai_key?: string;
  openai_endpoint?: string;
  summary?: string;
  created_at: string;
  end_time?: string;
  timer_ends_at?: string;
}

export interface GameRoom {
  id: string;
  name: string;
  description?: string;
  facilitator_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  retro_id: string;
  column_id: string;
  text: string;
  user_id: string | null;
  user_display_name: string;
  likes: string[];
  is_action: boolean;
  is_anonymous: boolean;
  created_at: string;
}

export interface User {
  id: string;
  display_name: string;
  email?: string;
  user_type: 'microsoft' | 'google' | 'email' | 'anonymous';
  is_active: boolean;
  groups?:  string[]
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
} 