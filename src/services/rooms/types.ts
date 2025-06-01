export enum RoomStatus {
    NEW_REQUEST= 'NEW_REQUEST',
    FOLLOWED_UP = 'FOLLOWED_UP',
    RESOLVED = 'RESOLVED',
}

export const RoomStatusColor: Record<RoomStatus, string> = {
    [RoomStatus.NEW_REQUEST]: 'red',
    [RoomStatus.FOLLOWED_UP]: 'green',
    [RoomStatus.RESOLVED]: 'blue',
};

export interface Room {
    id: string;
    roomName: string;
    status: RoomStatus;
    lastMessage: string;
    lastMessageTimestamp: string;
    unreadCount: number;
    lastMessageSenderId: string;
}