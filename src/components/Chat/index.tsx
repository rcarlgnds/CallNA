import React, { useState, useEffect } from 'react';
import { Box, Stack, Text } from '@mantine/core';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Room, Status, Chat, History } from '../../services/types';
import { chatService } from '../../services/api/chatService';
import { roomService } from '../../services/api/roomService';
import { historyService } from '../../services/api/historyService';

interface ChatProps {
  room: Room;
  messages: Chat[];
  chatMarkers: History[];
  onSendMessage: (message: string, file?: File) => void;
  onUpdateStatus: (status: Status) => void;
  onAddMarker: (marker: History) => void;
  isAdmin?: boolean;
}

const Chat: React.FC<ChatProps> = ({
  room,
  messages,
  chatMarkers,
  onSendMessage,
  onUpdateStatus,
  onAddMarker,
  isAdmin = true,
}) => {
  const [chatStatus, setChatStatus] = useState<Status>(room.status);

  useEffect(() => {
    setChatStatus(room.status);
  }, [room.status]);

  const handleFollowUp = async () => {
    if (chatStatus !== Status.DEFAULT) return;

    try {
      await roomService.updateRoom({
        id: room.id,
        status: Status.FOLLOW_UP,
      });

      const newMarker = await historyService.createHistory({
        roomId: room.id,
        status: Status.FOLLOW_UP,
      });

      if (newMarker) {
        onUpdateStatus(Status.FOLLOW_UP);
        setChatStatus(Status.FOLLOW_UP);
        onAddMarker(newMarker);
      }
    } catch (error) {
      console.error('Error following up:', error);
    }
  };

  const handleResolve = async () => {
    if (chatStatus !== Status.FOLLOW_UP) return;

    try {
      await roomService.updateRoom({
        id: room.id,
        status: Status.RESOLVED,
      });

      const newMarker = await historyService.createHistory({
        roomId: room.id,
        status: Status.RESOLVED,
      });

      if (newMarker) {
        onUpdateStatus(Status.RESOLVED);
        setChatStatus(Status.RESOLVED);
        onAddMarker(newMarker);
      }
    } catch (error) {
      console.error('Error resolving:', error);
    }
  };

  return (
    <Stack spacing={0} sx={{ height: '100%' }}>
      <ChatHeader room={room} />
      {messages.length === 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text color="dimmed">No messages yet. Start a conversation!</Text>
        </Box>
      ) : (
        <MessageList messages={messages} markers={chatMarkers} currentUserIsAdmin={isAdmin} />
      )}
      <MessageInput
        onSendMessage={onSendMessage}
        onFollowUp={handleFollowUp}
        onResolve={handleResolve}
        roomStatus={chatStatus}
        isAdmin={isAdmin}
      />
    </Stack>
  );
};

export default Chat;