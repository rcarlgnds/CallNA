export enum Status {
  DEFAULT = 'DEFAULT',
  FOLLOW_UP = 'FOLLOW_UP',
  RESOLVED = 'RESOLVED',
}

export interface Room {
  id: string;
  roomName: string;
  status: Status;
}

export interface Chat {
  id: string;
  text: string;
  createdAt: string;
  isAdmin: boolean;
  isRead: boolean;
  room: Room;
  file?: {
    id: string;
    name: string;
    dataStream: string;
  };
}

export interface History {
  id: string;
  createdAt: string;
  status: Status;
  room: Room;
}

export interface CreateChatInput {
  roomId: string;
  text: string;
  isAdmin: boolean;
  status?: Status;
  file?: File;
}

export interface CreateRoomInput {
  roomName: string;
}

export interface UpdateRoomInput {
  id: string;
  roomName?: string;
  status: Status;
}

export interface CreateHistoryInput {
  roomId: string;
  status: Status;
}

export interface QuickMessage {
  id: string;
  content: string;
  category: string;
}