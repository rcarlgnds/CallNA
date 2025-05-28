import React, { useEffect, useRef } from 'react';
import { Box, ScrollArea } from '@mantine/core';
import MessageBubble from './MessageBubble';
import ChatMarkerComponent from './ChatMarker';
import { ChatHistory } from "../../services/histories/types.ts";

export interface Message {
  id: string;
  createdAt: string | Date;
  text: string;
  isAdmin: boolean;
  isOwn?: boolean;
  isRead?: boolean;
}

interface ChatMarker {
  status: ChatHistory['status'];
  createdAt: string | Date;
}

interface MessageListProps {
  messages: Message[];
  markers?: ChatMarker[];
  currentUserIsAdmin: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, markers = [], currentUserIsAdmin }) => {
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, markers]);

  const getDateTime = (item: any): number => {
    if ('text' in item) {
      return new Date(item.createdAt).getTime();
    }
    if ('createdAt' in item) {
      return new Date(item.createdAt).getTime();
    }
    return 0;
  };

  const timeline = [...messages, ...markers]
      .map(item => {
        if ('text' in item) {
          return {
            ...item,
            isOwn: item.isAdmin === currentUserIsAdmin,
            createdAt: new Date(item.createdAt),
          };
        }
        return {
          ...item,
          createdAt: new Date(item.createdAt),
        };
      })
      .sort((a, b) => getDateTime(a) - getDateTime(b));


  return (
      <ScrollArea sx={{ flex: 1 }} viewportRef={viewport} type="auto">
        <Box sx={{ padding: '20px' }}>
          {timeline.map(item =>
              'text' in item ? (
                  <MessageBubble key={item.id} message={item} />
              ) : (
                  <ChatMarkerComponent
                      key={`${item.status}-${new Date(item.createdAt).getTime()}`}
                      marker={item}
                  />
              )
          )}
        </Box>
      </ScrollArea>
  );
};

export default MessageList;
