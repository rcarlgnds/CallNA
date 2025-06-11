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
        // Compress image before sending
        const compressedFile = await this.compressImage(input.file);
        
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
          };
          reader.readAsDataURL(compressedFile);
        });

        console.log('Creating file with size:', base64.length);

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
          console.log('File created with ID:', fileId);
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

      console.log('Creating chat with input:', createChatInput);

      const { data } = await apolloClient.mutate({
        mutation: CREATE_CHAT,
        variables: { 
          createChatInput
        },
      });

      console.log('Chat creation response:', data);
      return data?.createChat || null;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  },

  async compressImage(file: File, maxWidth: number = 800, quality: number = 0.7): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback to original file
          }
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
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