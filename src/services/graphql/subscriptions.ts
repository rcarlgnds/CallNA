import { gql } from '@apollo/client';

export const CHAT_SENDED_SUBSCRIPTION = gql`
  subscription ChatSended($roomId: String!) {
    chatSended(roomId: $roomId) {
      id
      text
      createdAt
      isAdmin
      isRead
      room {
        id
        roomName
        status
      }
      file {
        id
        name
        dataStream
      }
    }
  }
`;

export const CHAT_SENDED_ADMIN_SUBSCRIPTION = gql`
  subscription ChatSendedAdmin {
    chatSendedAdmin {
      id
      text
      createdAt
      isAdmin
      isRead
      room {
        id
        roomName
        status
      }
      file {
        id
        name
        dataStream
      }
    }
  }
`;

export const ROOM_UPDATED_SUBSCRIPTION = gql`
  subscription RoomUpdated {
    roomUpdated {
      id
      roomName
      status
    }
  }
`;