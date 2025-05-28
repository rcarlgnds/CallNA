export enum RoomStatus {
    NEW_REQUEST= 'NEW_REQUEST',
    FOLLOWED_UP = 'FOLLOWED_UP',
    RESOLVED = 'RESOLVED',
}

export const RoomStatusColor: Record<RoomStatus, string> = {
    [RoomStatus.NEW_REQUEST]: 'red',
    [RoomStatus.FOLLOWED_UP]: 'yellow',
    [RoomStatus.RESOLVED]: 'green',
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