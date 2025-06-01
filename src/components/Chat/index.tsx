import React, { useState, useEffect } from 'react';
import { Box, Stack, Text } from '@mantine/core';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { RoomStatus, Room } from '../../services/rooms/types';
import { ChatData } from '../../services/chats/types';
import { ChatHistory } from '../../services/histories/types';
import { notificationSound } from '../../data/mockData';

interface ChatProps {
  room: Room;
  messages: ChatData[];
  chatMarkers: ChatHistory[];
  history: ChatHistory;
  onSendMessage: (message: string) => void;
  onUpdateStatus: (status: RoomStatus) => void;
  onAddMarker: (marker: ChatHistory) => void;
  isAdmin?: boolean;
}

const Chat: React.FC<ChatProps> = ({
  room,
  messages,
  chatMarkers,
  history,
  onSendMessage,
  onUpdateStatus,
  onAddMarker,
  isAdmin = true,
}) => {
  const [lastMessageId, setLastMessageId] = useState<string | null>(
    messages.length > 0 ? messages[messages.length - 1].id : null
  );
  const [chatStatus, setChatStatus] = useState<RoomStatus>(room.status);

  useEffect(() => {
    setChatStatus(room.status);
  }, [room.status]);

  useEffect(() => {
    if (messages.length === 0) {
      setLastMessageId(null);
      return;
    }

    const latestMessage = messages[messages.length - 1];
    const latestMessageId = latestMessage.id;

    if (lastMessageId === null || latestMessageId !== lastMessageId) {
      setLastMessageId(latestMessageId);

      if (!latestMessage.isAdmin && chatStatus === RoomStatus.RESOLVED) {
        notificationSound.play().catch(console.error);
        setChatStatus(RoomStatus.NEW_REQUEST);
        onUpdateStatus(RoomStatus.NEW_REQUEST);
      }
    }
  }, [messages, lastMessageId, chatStatus, onUpdateStatus]);

  const combinedList = [
    ...messages.map(msg => ({ ...msg, isMarker: false })),
    ...chatMarkers.map(marker => ({
      id: marker.id,
      createdAt: marker.createdAt,
      isMarker: true,
      status: marker.status,
    })),
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const handleFollowUp = () => {
    if (chatStatus !== RoomStatus.NEW_REQUEST) return;

    const now = new Date();
    const newMarker: ChatHistory = {
      id: `marker-followup-${now.getTime()}`,
      createdAt: now,
      room,
      status: RoomStatus.FOLLOWED_UP,
    };

    onUpdateStatus(RoomStatus.FOLLOWED_UP);
    setChatStatus(RoomStatus.FOLLOWED_UP);
    onAddMarker(newMarker);
  };

  const handleResolve = () => {
    if (chatStatus !== RoomStatus.FOLLOWED_UP) return;

    const now = new Date();
    const newMarker: ChatHistory = {
      id: `marker-resolve-${now.getTime()}`,
      createdAt: now,
      room,
      status: RoomStatus.RESOLVED,
    };

    onUpdateStatus(RoomStatus.RESOLVED);
    setChatStatus(RoomStatus.RESOLVED);
    onAddMarker(newMarker);
  };

  return (
    <Stack spacing={0} sx={{ height: '100%' }}>
      <ChatHeader room={room} />
      {combinedList.length === 0 ? (
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