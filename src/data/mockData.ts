import { Room, RoomStatus } from '../services/rooms/types';
import { ChatData } from '../services/chats/types';
import { ChatHistory } from '../services/histories/types';

const now = new Date();

export const initialRooms: Room[] = [
  {
    id: 'room-600',
    roomName: '600',
    status: RoomStatus.FOLLOWED_UP,
    lastMessage: 'Here is the file you requested.',
    lastMessageTimestamp: '14:00',
    unreadCount: 0,
    lastMessageSenderId: 'user-600',
  },
  {
    id: 'room-611',
    roomName: '611',
    status: RoomStatus.NEW_REQUEST,
    lastMessage: 'Here\'s the file you requested.',
    lastMessageTimestamp: '11:00',
    unreadCount: 2,
    lastMessageSenderId: 'user-611',
  },
  {
    id: 'room-724',
    roomName: '724',
    status: RoomStatus.RESOLVED,
    lastMessage: 'Issue has been resolved.',
    lastMessageTimestamp: '15:00',
    unreadCount: 0,
    lastMessageSenderId: 'admin',
  },
];

const defaultHistory1: ChatHistory = {
  id: 'history-600-1',
  room: initialRooms[0],
  status: RoomStatus.NEW_REQUEST,
  createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
};

const defaultHistory2: ChatHistory = {
  id: 'history-611-1',
  room: initialRooms[1],
  status: RoomStatus.NEW_REQUEST,
  createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
};

const defaultHistory3: ChatHistory = {
  id: 'history-724-1',
  room: initialRooms[2],
  status: RoomStatus.RESOLVED,
  createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
};

export const mockChats: Record<string, ChatData[]> = {
  'room-600': [
    {
      id: 'chat-600-1',
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      text: 'Hello, I need help with my order.',
      isAdmin: false,
      isRead: true,
      room: initialRooms[0],
      history: defaultHistory1,
    },
    {
      id: 'chat-600-2',
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      text: 'Hi, can you share more details?',
      isAdmin: true,
      isRead: true,
      room: initialRooms[0],
      history: defaultHistory1,
    },
    {
      id: 'chat-600-3',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      text: 'Here is the file you requested.',
      isAdmin: false,
      isRead: false,
      room: initialRooms[0],
      history: defaultHistory1,
    },
  ],
  'room-611': [
    {
      id: 'chat-611-1',
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      text: 'Here\'s the file you requested.',
      isAdmin: false,
      isRead: false,
      room: initialRooms[1],
      history: defaultHistory2,
    },
  ],
  'room-724': [
    {
      id: 'chat-724-1',
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      text: 'Issue has been resolved.',
      isAdmin: true,
      isRead: true,
      room: initialRooms[2],
      history: defaultHistory3,
    },
  ],
};

// Notification sound for new messages
export const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');