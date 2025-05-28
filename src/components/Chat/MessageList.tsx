import React, { useEffect, useRef } from 'react';
import { Box, ScrollArea } from '@mantine/core';

import MessageBubble from './MessageBubble';
import ChatMarkerComponent from './ChatMarker';

interface Message {
  id: string;
  timestamp: string | Date;
  content: string;

}

interface ChatMarker {
  type: string;
  timestamp: string;
  date: string;
}

interface MessageListProps {
  messages: Message[];
  markers?: ChatMarker[];
}

const MessageList: React.FC<MessageListProps> = ({ messages, markers = [] }) => {
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
    if ('content' in item) {
      // Kalau timestamp string ISO atau Date object
      return new Date(item.timestamp).getTime();
    }
    if ('date' in item && 'timestamp' in item) {
      // Gabungkan date dan time menjadi Date object
      return new Date(`${item.date} ${item.timestamp}`).getTime();
    }
    return 0;
  };

  const timeline = [...messages, ...markers].sort((a, b) => getDateTime(a) - getDateTime(b));

  return (
      <ScrollArea
          sx={{ flex: 1 }}
          viewportRef={viewport}
          type="auto"
      >
        <Box sx={{ padding: '20px' }}>
          {timeline.map((item) =>
              'content' in item ? (
                  <MessageBubble key={item.id} message={item} />
              ) : (
                  <ChatMarkerComponent key={`${item.type}-${item.timestamp}`} marker={item} />
              )
          )}
        </Box>
      </ScrollArea>
  );
};

export default MessageList;
