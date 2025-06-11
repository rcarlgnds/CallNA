import { gql } from '@apollo/client';

export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      roomName
      status
    }
  }
`;

export const GET_ROOM = gql`
  query GetRoom($id: String!) {
    room(id: $id) {
      id
      roomName
      status
    }
  }
`;

export const GET_CHATS = gql`
  query GetChats($roomId: String, $skip: Int, $take: Int) {
    chats(roomId: $roomId, skip: $skip, take: $take) {
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

export const GET_HISTORIES = gql`
  query GetHistories {
    histories {
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