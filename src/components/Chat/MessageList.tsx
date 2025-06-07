import React, { useEffect, useRef } from 'react';
import { Box, ScrollArea, Text, Divider } from '@mantine/core';
import MessageBubble from './MessageBubble';
import { Chat, History } from '../../services/types';
import { format } from 'date-fns';

interface MessageListProps {
  messages: Chat[];
  markers?: History[];
  currentUserIsAdmin: boolean;
}

type TimelineItem =
    | (Chat & { isOwn?: boolean; type: 'message' })
    | (History & { type: 'marker' });

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

  const timeline: TimelineItem[] = [
    ...messages.map(msg => ({
      ...msg,
      isOwn: msg.isAdmin === currentUserIsAdmin,
      type: 'message' as const,
    })),
    ...markers.map(marker => ({
      ...marker,
      type: 'marker' as const,
    })),
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
      <ScrollArea sx={{ flex: 1 }} viewportRef={viewport} type="auto">
        <Box sx={{ padding: '20px' }}>
          {timeline.map((item) => {
            if (item.type === 'message') {
              return <MessageBubble key={item.id} message={item} />;
            }

            return (
                <Box key={`${item.status}-${item.id}`} my="md">
                  <Divider
                      label={
                        <Text size="xs\" color="dimmed\" sx={{ whiteSpace: 'nowrap' }}>
                          {item.status === 'FOLLOW_UP' ? 'Followed-up' : 'Resolved'} at{' '}
                          {format(new Date(item.createdAt), 'h:mm a')}
                        </Text>
                      }
                      labelPosition="center"
                  />
                </Box>
            );
          })}
        </Box>
      </ScrollArea>
  );
};

export default MessageList;