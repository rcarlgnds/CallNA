import React, { useState, useEffect } from 'react';
import { Box, Stack, Text } from '@mantine/core';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import {Room, RoomStatus} from "../../services/rooms/types.ts";
import { ChatData } from "../../services/chats/types.ts";
import { ChatHistory } from "../../services/histories/types.ts";

interface ChatProps {
  room: Room;
  messages: ChatData[];
  history: ChatHistory;
  onSendMessage: (message: string) => void;
  onUpdateStatus: (status: RoomStatus) => void;
}

const Chat: React.FC<ChatProps> = ({
                                     room,
                                     messages,
                                     history,
                                     onSendMessage,
                                     onUpdateStatus,
                                   }) => {
  const [lastMessageId, setLastMessageId] = useState<string | null>(
      messages.length > 0 ? messages[messages.length - 1].id : null
  );
  const [chatStatus, setChatStatus] = useState<RoomStatus>(history.status);

  useEffect(() => {
    if (messages.length === 0) {
      setLastMessageId(null);
      setChatStatus(RoomStatus.RESOLVED);
      return;
    }

    const latestMessageId = messages[messages.length - 1].id;

    if (lastMessageId === null) {
      setLastMessageId(latestMessageId);
      setChatStatus(RoomStatus.NEW_REQUEST);
    } else if (latestMessageId !== lastMessageId) {
      setLastMessageId(latestMessageId);
      setChatStatus(RoomStatus.NEW_REQUEST);
    }
  }, [messages, lastMessageId]);

  const handleFollowUp = () => {
    if (chatStatus !== RoomStatus.NEW_REQUEST) return;
    onUpdateStatus(RoomStatus.FOLLOWED_UP);
    setChatStatus(RoomStatus.FOLLOWED_UP);
  };

  const handleResolve = () => {
    if (chatStatus !== RoomStatus.FOLLOWED_UP) return;
    onUpdateStatus(RoomStatus.RESOLVED);
    setChatStatus(RoomStatus.RESOLVED);
  };

    // !!! NANTI HARUS DIUBAH DR BACKEND HEHE
    const currentUserIsAdmin = true;

  return (
      <Stack spacing={0} sx={{ height: '100%' }}>
        <ChatHeader room={room} />
        {messages.length === 0 ? (
            <Box
                sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text color="dimmed">No messages yet. Start a conversation!</Text>
            </Box>
        ) : (
            <MessageList messages={messages} currentUserIsAdmin={currentUserIsAdmin} />
        )}
          <MessageInput
              onSendMessage={onSendMessage}
              onFollowUp={handleFollowUp}
              onResolve={handleResolve}
              roomStatus={chatStatus}
          />

      </Stack>
  );
};

export default Chat;
