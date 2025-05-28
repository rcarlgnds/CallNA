import React, { useState, useEffect } from 'react';
import { Box, Stack, Text } from '@mantine/core';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Room } from "../../services/rooms/types.ts";
import { ChatData } from "../../services/chats/types.ts";
import { ChatHistory, Status } from "../../services/histories/types.ts";

interface ChatProps {
  room: Room;
  messages: ChatData[];
  history: ChatHistory;
  onSendMessage: (message: string) => void;
  onUpdateStatus: (status: Status) => void;
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
  const [chatStatus, setChatStatus] = useState<Status>(history.status);

  useEffect(() => {
    if (messages.length === 0) {
      setLastMessageId(null);
      setChatStatus(Status.RESOLVED);
      return;
    }

    const latestMessageId = messages[messages.length - 1].id;

    if (lastMessageId === null) {
      setLastMessageId(latestMessageId);
      setChatStatus(Status.NEW_REQUEST);
    } else if (latestMessageId !== lastMessageId) {
      setLastMessageId(latestMessageId);
      setChatStatus(Status.NEW_REQUEST);
    }
  }, [messages, lastMessageId]);

  const handleFollowUp = () => {
    if (chatStatus !== Status.NEW_REQUEST) return;
    onUpdateStatus(Status.FOLLOWED_UP);
    setChatStatus(Status.FOLLOWED_UP);
  };

  const handleResolve = () => {
    if (chatStatus !== Status.FOLLOWED_UP) return;
    onUpdateStatus(Status.RESOLVED);
    setChatStatus(Status.RESOLVED);
  };

  return (
      <Stack spacing={0} sx={{ height: '100%' }}>
        <ChatHeader room={room} />

        {messages.length === 0 ? (
            <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
            >
              <Text color="dimmed">No messages yet. Start a conversation!</Text>
            </Box>
        ) : (
            <MessageList messages={messages} />
        )}

        <MessageInput
            onSendMessage={onSendMessage}
            onFollowUp={handleFollowUp}
            onResolve={handleResolve}
            hasNewMessages={chatStatus === Status.NEW_REQUEST}
            hasFollowUp={chatStatus === Status.FOLLOWED_UP}
        />
      </Stack>
  );
};

export default Chat;
