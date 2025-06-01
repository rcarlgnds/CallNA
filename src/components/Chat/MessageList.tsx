import React, { useEffect, useRef } from 'react';
import { Box, ScrollArea, Text, Divider } from '@mantine/core';
import MessageBubble from './MessageBubble';
import { ChatHistory } from "../../services/histories/types";
import { format } from 'date-fns';

export interface Message {
  id: string;
  createdAt: string | Date;
  text: string;
  isAdmin: boolean;
  isOwn?: boolean;
  isRead?: boolean;
  imageUrl?: string;
}

interface ChatMarker {
  status: ChatHistory['status'];
  createdAt: string | Date;
  id: string;
}

interface MessageListProps {
  messages: Message[];
  markers?: ChatMarker[];
  currentUserIsAdmin: boolean;
}

// Discriminator type for timeline items
type TimelineItem =
    | (Message & { isMarker?: false; type: 'message' })
    | (ChatMarker & { isMarker: true; type: 'marker' });

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

  const getTimestamp = (item: Message | ChatMarker): number => {
    return new Date(item.createdAt).getTime();
  };

  const timeline: TimelineItem[] = [
    ...messages.map(msg => ({
      ...msg,
      isOwn: msg.isAdmin === currentUserIsAdmin,
      createdAt: new Date(msg.createdAt),
      isMarker: false,
      type: 'message' as const,
    })),
    ...markers.map(marker => ({
      ...marker,
      createdAt: new Date(marker.createdAt),
      isMarker: true,
      type: 'marker' as const,
    })),
  ].sort((a, b) => getTimestamp(a) - getTimestamp(b));

  return (
      <ScrollArea sx={{ flex: 1 }} viewportRef={viewport} type="auto">
        <Box sx={{ padding: '20px' }}>
          {timeline.map((item) => {
            if (!item.isMarker) {
              // item is Message here
              return <MessageBubble key={item.id} message={item} />;
            }

            // item is ChatMarker here
            return (
                <Box key={`${item.status}-${item.id}`} my="md">
                  <Divider
                      label={
                        <Text size="xs" color="dimmed" sx={{ whiteSpace: 'nowrap' }}>
                          {item.status === 'FOLLOWED_UP' ? 'Followed-up' : 'Resolved'} at{' '}
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
