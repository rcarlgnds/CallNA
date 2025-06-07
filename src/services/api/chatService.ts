import { apolloClient } from '../graphql/client';
import { GET_CHATS } from '../graphql/queries';
import { CREATE_CHAT, UPDATE_CHAT_READ_STATUS } from '../graphql/mutations';
import { Chat, CreateChatInput } from '../types';

export const chatService = {
  async getChats(roomId?: string, skip?: number, take?: number): Promise<Chat[]> {
    try {
      const { data } = await apolloClient.query({
        query: GET_CHATS,
        variables: { roomId, skip, take },
        fetchPolicy: 'cache-and-network',
      });
      return data.chats;
    } catch (error) {
      console.error('Error fetching chats:', error);
      return [];
    }
  },

  async createChat(input: CreateChatInput): Promise<Chat | null> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_CHAT,
        variables: { createChatInput: input },
      });
      return data.createChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  },

  async markRoomAsRead(roomId: string): Promise<boolean> {
    try {
      await apolloClient.mutate({
        mutation: UPDATE_CHAT_READ_STATUS,
        variables: { id: roomId },
      });
      return true;
    } catch (error) {
      console.error('Error marking room as read:', error);
      return false;
    }
  },
};