import { apolloClient } from '../graphql/client';
import { GET_CHATS } from '../graphql/queries';
import { CREATE_CHAT, UPDATE_CHAT_READ_STATUS, CREATE_FILE } from '../graphql/mutations';
import { Chat, CreateChatInput } from '../types';

export const chatService = {
  async getChats(roomId?: string, skip?: number, take?: number): Promise<Chat[]> {
    try {
      const { data } = await apolloClient.query({
        query: GET_CHATS,
        variables: { roomId, skip, take },
      });
      return data.chats || [];
    } catch (error) {
      console.error('Error fetching chats:', error);
      return [];
    }
  },

  async createChat(input: CreateChatInput): Promise<Chat | null> {
    try {
      let fileId = null;
      
      // Create file first if provided
      if (input.file) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
          };
          reader.readAsDataURL(input.file!);
        });

        const { data: fileData } = await apolloClient.mutate({
          mutation: CREATE_FILE,
          variables: { 
            createFileInput: {
              name: input.file.name,
              dataStream: base64,
            }
          },
        });
        
        if (fileData?.createFile) {
          fileId = fileData.createFile.id;
        }
      }

      const createChatInput: any = {
        roomId: input.roomId,
        text: input.text,
        isAdmin: input.isAdmin,
      };

      if (fileId) {
        createChatInput.fileId = fileId;
      }

      if (input.historyId) {
        createChatInput.historyId = input.historyId;
      }

      const { data } = await apolloClient.mutate({
        mutation: CREATE_CHAT,
        variables: { 
          createChatInput
        },
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