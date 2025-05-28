import { Room } from '../rooms/types';

export enum Status {
    NEW_REQUEST= 'NEW_REQUEST',
    FOLLOWED_UP = 'FOLLOWED_UP',
    RESOLVED = 'RESOLVED',
}

export interface ChatHistory {
    id: string;
    createdAt: Date;
    room: Room;
    status: Status;
}
