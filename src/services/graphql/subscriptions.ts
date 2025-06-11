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
      history {
        id
        status
        createdAt
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
      history {
        id
        status
        createdAt
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

export const HISTORY_CREATED_SUBSCRIPTION = gql`
  subscription HistoryCreated {
    historyCreated {
      id
      createdAt
      status
      room {
        id
        roomName
        status
      }
    }
  }
`;