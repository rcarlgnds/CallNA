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

export interface History {
  id: string;
  createdAt: string;
  status: Status;
  room: Room;
}

export interface Chat {
  id: string;
  text: string;
  createdAt: string;
  isAdmin: boolean;
  isRead: boolean;
  room: Room;
  history?: History;
  file?: {
    id: string;
    name: string;
    dataStream: string;
  };
}

export interface CreateChatInput {
  roomId: string;
  text: string;
  isAdmin: boolean;
  historyId?: string;
  file?: File;
}

export interface CreateFileInput {
  name: string;
  dataStream: string;
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