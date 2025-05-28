import {Room, RoomStatus} from '../rooms/types';


export interface ChatHistory {
    id: string;
    createdAt: Date;
    room: Room;
    status: RoomStatus;
}
