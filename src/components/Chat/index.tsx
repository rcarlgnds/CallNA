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
  chatMarkers: ChatHistory[];       // marker history
  history: ChatHistory;
  onSendMessage: (message: string) => void;
  onUpdateStatus: (status: RoomStatus) => void;
  onAddMarker: (marker: ChatHistory) => void;  // handler tambah marker
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
  const [chatStatus, setChatStatus] = useState<RoomStatus>(history.status);

  // Update chatStatus kalau history berubah
  useEffect(() => {
    setChatStatus(history.status);
  }, [history.status]);

  useEffect(() => {
    if (messages.length === 0) {
      setLastMessageId(null);
      setChatStatus(RoomStatus.RESOLVED);
      return;
    }

    const latestMessage = messages[messages.length - 1];
    const latestMessageId = latestMessage.id;

    if (lastMessageId === null || latestMessageId !== lastMessageId) {
      setLastMessageId(latestMessageId);

      // Play notification sound dan update status untuk pesan user baru
      if (!latestMessage.isAdmin && chatStatus === RoomStatus.RESOLVED) {
        notificationSound.play().catch(console.error);
        setChatStatus(RoomStatus.NEW_REQUEST);
        onUpdateStatus(RoomStatus.NEW_REQUEST);
      }
    }
  }, [messages, lastMessageId, chatStatus, onUpdateStatus]);

  // Gabungkan messages dan markers lalu urut berdasarkan waktu
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

    onUpdateStatus(RoomStatus.FOLLOWED_UP);
    setChatStatus(RoomStatus.FOLLOWED_UP);

    // Tambah marker khusus "Followed up at ..."
    const now = new Date();
    const newMarker: ChatHistory = {
      id: `marker-followup-${now.getTime()}`,
      createdAt: now,
      room,
      status: RoomStatus.FOLLOWED_UP,
    };
    onAddMarker(newMarker);
  };

  const handleResolve = () => {
    if (chatStatus !== RoomStatus.FOLLOWED_UP) return;
    onUpdateStatus(RoomStatus.RESOLVED);
    setChatStatus(RoomStatus.RESOLVED);
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
