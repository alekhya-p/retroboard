import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';

// Mock data
let boards = [
  {
    id: '1',
    name: 'Sprint Retrospective',
    description: 'End of sprint review',
    facilitator_id: 'user1',
    block_id: 'BLK01',
    columns: [
      {
        id: 'col1',
        name: 'What Went Well',
        color: '#4CAF50',
        description: 'Things that worked well',
        is_action_column: false
      },
      {
        id: 'col2',
        name: 'What Could Be Improved',
        color: '#FFC107',
        description: 'Areas for improvement',
        is_action_column: false
      },
      {
        id: 'col3',
        name: 'Action Items',
        color: '#2196F3',
        description: 'Tasks to take action on',
        is_action_column: true
      }
    ],
    configurations: {
      show_all_messages: true,
      enable_likes: true
    },
    summary: null,
    created_at: new Date().toISOString()
  }
];

let messages = [
  {
    id: '1',
    retro_id: '1',
    column_id: 'col1',
    text: 'Great team collaboration',
    user_id: 'user1',
    user_display_name: 'John Doe',
    likes: [],
    is_action: false,
    created_at: new Date().toISOString()
  }
];

// Default user for token validation
const defaultUser = {
  id: "user1",
  display_name: "Authenticated User",
  email: "user@example.com",
  user_type: "microsoft",
  is_active: true
};

export const handlers = [
  // Auth endpoints
  http.get('/api/v1/auth/microsoft', ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return new HttpResponse(null, { status: 400 });
    }
    
    return HttpResponse.json({
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFub25fNDk2MTIzMDc3MTQ5MDA0MjI5MSIsImRpc3BsYXlfbmFtZSI6Im5hdmVlbiIsImVtYWlsIjpudWxsLCJ1c2VyX3R5cGUiOiJhbm9ueW1vdXMiLCJpc19hY3RpdmUiOnRydWUsImV4cCI6MTc0NTI0MjAyOX0.980gD3J-wEG69tYbZ1p22yh35PLAf-9Eqknr8RI70Mo",
      token_type: "bearer",
      user: {
        id: "msal_id",
        display_name: "Microsoft User",
        email: "user@example.com",
        user_type: "microsoft",
        is_active: true
      }
    });
  }),

  http.get('/api/v1/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }

    // In a real app, we would validate the token here
    // For our mock, we'll just check if it exists and return the user
    return HttpResponse.json({
      user: defaultUser
    });
  }),

  http.post('/api/v1/auth/anonymous', async ({ request }) => {
    const { display_name } = await request.json();
    return HttpResponse.json({
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFub25fNDk2MTIzMDc3MTQ5MDA0MjI5MSIsImRpc3BsYXlfbmFtZSI6Im5hdmVlbiIsImVtYWlsIjpudWxsLCJ1c2VyX3R5cGUiOiJhbm9ueW1vdXMiLCJpc19hY3RpdmUiOnRydWUsImV4cCI6MTc0NTI0MjAyOX0.980gD3J-wEG69tYbZ1p22yh35PLAf-9Eqknr8RI70Mo",
      token_type: "bearer",
      user: {
        id: uuidv4(),
        display_name: display_name,
        email: null,
        user_type: "anonymous",
        is_active: true
      }
    });
  }),

  http.post('/api/v1/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  // Board endpoints
  http.get('/api/v1/boards', () => {
    return HttpResponse.json(boards);
  }),

  http.get('/api/v1/boards/:id', ({ params }) => {
    const board = boards.find(b => b.id === params.id);
    if (!board) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(board);
  }),

  http.post('/api/v1/boards', async ({ request }) => {
    const boardData = await request.json();
    const newBoard = {
      id: uuidv4(),
      ...boardData,
      summary: null,
      created_at: new Date().toISOString(),
      columns: boardData.columns.map(column => ({
        ...column,
        id: uuidv4()
      }))
    };
    boards.push(newBoard);
    return HttpResponse.json(newBoard);
  }),

  http.patch('/api/v1/boards/:id', async ({ params, request }) => {
    const boardData = await request.json();
    const index = boards.findIndex(b => b.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    boards[index] = { 
      ...boards[index], 
      ...boardData,
      configurations: {
        ...boards[index].configurations,
        ...(boardData.configurations || {})
      }
    };
    
    return HttpResponse.json(boards[index]);
  }),

  http.delete('/api/v1/boards/:id', ({ params }) => {
    const index = boards.findIndex(b => b.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    boards = boards.filter(b => b.id !== params.id);
    messages = messages.filter(m => m.retro_id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  // Message endpoints
  http.get('/api/v1/messages/board/:boardId', ({ params }) => {
    const boardMessages = messages.filter(m => m.retro_id === params.boardId);
    return HttpResponse.json(boardMessages);
  }),

  http.post('/api/v1/messages', async ({ request }) => {
    const messageData = await request.json();
    const newMessage = {
      id: uuidv4(),
      ...messageData,
      likes: [],
      created_at: new Date().toISOString()
    };
    messages.push(newMessage);
    return HttpResponse.json(newMessage);
  }),

  http.patch('/api/v1/messages/:id', async ({ params, request }) => {
    const messageData = await request.json();
    const index = messages.findIndex(m => m.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    messages[index] = { ...messages[index], ...messageData };
    return HttpResponse.json(messages[index]);
  }),

  http.post('/api/v1/messages/:id/like', ({ params }) => {
    const message = messages.find(m => m.id === params.id);
    if (!message) {
      return new HttpResponse(null, { status: 404 });
    }
    // Toggle like for demo purposes
    message.likes = message.likes.length > 0 ? [] : ['user1'];
    return HttpResponse.json(message);
  }),

  http.delete('/api/v1/messages/:id', ({ params }) => {
    const index = messages.findIndex(m => m.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    messages = messages.filter(m => m.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  // AI endpoints
  http.post('/api/v1/ai/boards/:id/summary', ({ params }) => {
    const boardIndex = boards.findIndex(b => b.id === params.id);
    if (boardIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const summary = 'This is a mock AI-generated summary for the retrospective. The team had several successes including good collaboration and meeting deadlines. There were some challenges with communication and technical debt. Action items include improving documentation and scheduling regular check-ins.';
    
    boards[boardIndex].summary = summary;
    
    return HttpResponse.json({ summary });
  })
]; 