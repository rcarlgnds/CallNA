import {Room} from "../rooms/types.ts";
import {ChatHistory} from "../histories/types.ts";


export interface ChatData {
    id: string;
    createdAt: Date;
    text: string;
    isAdmin: boolean;
    isRead: boolean;
    file?: File;
    history: ChatHistory;
    room: Room;
}
