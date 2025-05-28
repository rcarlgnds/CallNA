// import { Room, RoomStatus } from './types';
//
// let rooms: Room[] = [
//     {
//         id: 'room-600',
//         roomName: '600',
//         status: RoomStatus.NEW_REQUEST,
//     },
//     {
//         id: 'room-611',
//         roomName: '611',
//         status: RoomStatus.NEW_REQUEST,
//     },
//     {
//         id: 'room-724',
//         roomName: '724',
//         status: RoomStatus.NEW_REQUEST,
//     },
// ];
//
// // Get all rooms
// export const getRooms = (): Room[] => {
//     return rooms;
// };
//
// // Get room by ID
// export const getRoomById = (id: string): Room | undefined => {
//     return rooms.find(room => room.id === id);
// };
//
// // Update room status
// export const updateRoomStatus = (id: string, status: RoomStatus): void => {
//     rooms = rooms.map(room =>
//         room.id === id ? { ...room, status } : room
//     );
// };
//
// // Reset room data (useful for tests/dev)
// export const resetRooms = (newRooms: Room[]): void => {
//     rooms = newRooms;
// };
