// // chat/index.ts
//
// import { getRoomById } from '../rooms';
// import {Status} from "../histories/types.ts";
// import {Chat} from "./types.ts";
//
// const room600 = getRoomById('room-600');
// const room611 = getRoomById('room-611');
//
// // Mock histories object
// const historyMock = {
//     id: 'histories-123',
//     createdAt: new Date(),
//     room: room600!,
//     status: Status.NEW_REQUEST,
// };
//
//
// // Mock data
// let chats: Chat[] = [
//     {
//         id: 'chat-1',
//         text: 'Hello, I need help.',
//         createdAt: new Date(),
//         isAdmin: false,
//         isRead: false,
//         room: room600!,
//         history: historyMock,
//     },
//     {
//         id: 'chat-2',
//         text: 'Hi, can you share more details?',
//         createdAt: new Date(),
//         isAdmin: true,
//         isRead: true,
//         room: room600!,
//         history: historyMock,
//     },
//     {
//         id: 'chat-3',
//         text: 'Here’s the file.',
//         createdAt: new Date(),
//         isAdmin: false,
//         isRead: true,
//         room: room611!,
//         history: historyMock,
//     },
// ];
//
// // ==== FUNGSI ====
//
// export const getChatsByRoomId = (roomId: string): Chat[] => {
//     return chats.filter(chat => chat.room.id === roomId);
// };
//
// export const getChatById = (id: string): Chat | undefined => {
//     return chats.find(chat => chat.id === id);
// };
//
// export const addChat = (chat: Chat): void => {
//     chats.push(chat);
// };
//
// export const markChatAsRead = (id: string): void => {
//     chats = chats.map(chat => chat.id === id ? { ...chat, isRead: true } : chat);
// };
//
// export const resetChats = (newChats: Chat[]): void => {
//     chats = newChats;
// };
