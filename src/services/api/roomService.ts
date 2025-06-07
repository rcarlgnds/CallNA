import { apolloClient } from '../graphql/client';
import { GET_ROOMS, GET_ROOM } from '../graphql/queries';
import { CREATE_ROOM, UPDATE_ROOM } from '../graphql/mutations';
import { Room, CreateRoomInput, UpdateRoomInput } from '../types';

export const roomService = {
  async getRooms(): Promise<Room[]> {
    try {
      const { data } = await apolloClient.query({
        query: GET_ROOMS,
      });
      return data.rooms;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  },

  async getRoom(id: string): Promise<Room | null> {
    try {
      const { data } = await apolloClient.query({
        query: GET_ROOM,
        variables: { id },
      });
      return data.room;
    } catch (error) {
      console.error('Error fetching room:', error);
      return null;
    }
  },

  async createRoom(input: CreateRoomInput): Promise<Room | null> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_ROOM,
        variables: { createRoomInput: input },
      });
      return data.createRoom;
    } catch (error) {
      console.error('Error creating room:', error);
      return null;
    }
  },

  async updateRoom(input: UpdateRoomInput): Promise<Room | null> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_ROOM,
        variables: { updateRoomInput: input },
      });
      return data.updateRoom;
    } catch (error) {
      console.error('Error updating room:', error);
      return null;
    }
  },
};