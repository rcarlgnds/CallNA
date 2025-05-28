// import { History, Status } from './types';
// import { getRoomById } from '../rooms';
//
// // Ambil room yang sudah ada
// const room600 = getRoomById('room-600');
// const room611 = getRoomById('room-611');
// const room724 = getRoomById('room-724');
//
// // Data histories mock
// let histories: History[] = [
//     {
//         id: 'histories-600',
//         createdAt: new Date(),
//         room: room600!,
//         status: Status.NEW_REQUEST,
//     },
//     {
//         id: 'histories-611',
//         createdAt: new Date(),
//         room: room611!,
//         status: Status.FOLLOWED_UP,
//     },
//     {
//         id: 'histories-724',
//         createdAt: new Date(),
//         room: room724!,
//         status: Status.RESOLVED,
//     },
// ];
//
// // Service methods
// export const getHistories = (): History[] => {
//     return histories;
// };
//
// export const getHistoriesByRoomId = (roomId: string): History[] => {
//     return histories.filter(history => history.room.id === roomId);
// };
//
// export const getHistoryById = (id: string): History | undefined => {
//     return histories.find(history => history.id === id);
// };
//
// export const addHistory = (history: History): void => {
//     histories.push(history);
// };
//
// export const updateHistoryStatus = (id: string, status: Status): void => {
//     histories = histories.map(history =>
//         history.id === id ? { ...history, status } : history
//     );
// };
//
// export const resetHistories = (newHistories: History[]): void => {
//     histories = newHistories;
// };
