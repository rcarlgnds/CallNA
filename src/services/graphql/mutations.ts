import { gql } from '@apollo/client';

export const CREATE_CHAT = gql`
  mutation CreateChat($createChatInput: CreateChatInput!) {
    createChat(createChatInput: $createChatInput) {
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

export const CREATE_ROOM = gql`
  mutation CreateRoom($createRoomInput: CreateRoomInput!) {
    createRoom(createRoomInput: $createRoomInput) {
      id
      roomName
      status
    }
  }
`;

export const UPDATE_ROOM = gql`
  mutation UpdateRoom($updateRoomInput: UpdateRoomInput!) {
    updateRoom(updateRoomInput: $updateRoomInput) {
      id
      roomName
      status
    }
  }
`;

export const CREATE_HISTORY = gql`
  mutation CreateHistory($createHistoryInput: CreateHistoryInput!) {
    createHistory(createHistoryInput: $createHistoryInput) {
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

export const UPDATE_CHAT_READ_STATUS = gql`
  mutation UpdateChatIsReadInRoom($id: String!) {
    updateChatIsReadInRoom(id: $id) {
      id
      roomName
      status
    }
  }
`;