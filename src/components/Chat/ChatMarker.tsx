import React from 'react';
import { Box, Text } from '@mantine/core';
import { CheckCircle2, Flag } from 'lucide-react';
import { ChatMarker as ChatMarkerType } from '../../types';

interface ChatMarkerProps {
  marker: ChatMarkerType;
}

const ChatMarker: React.FC<ChatMarkerProps> = ({ marker }) => {
  const isFollowUp = marker.type === 'follow-up';
  
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        padding: '16px 0',
        margin: '8px 0',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          borderTop: `1px solid ${
            isFollowUp 
              ? theme.colors.green[theme.colorScheme === 'dark' ? 7 : 3]
              : theme.colors.blue[theme.colorScheme === 'dark' ? 7 : 3]
          }`,
          zIndex: 0,
        },
      })}
    >
      <Box
        sx={(theme) => ({
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          justifyContent: 'center',
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          padding: '0 16px',
          margin: '0 auto',
          width: 'fit-content',
        })}
      >
        {isFollowUp ? (
          <Flag size={14} color="#06C755" />
        ) : (
          <CheckCircle2 size={14} color="#228BE6" />
        )}
        <Text size="xs" color={isFollowUp ? 'green' : 'blue'}>
          {marker.type === 'follow-up' ? 'Follow Up' : 'Resolved'} - {marker.date} {marker.timestamp}
        </Text>
      </Box>
    </Box>
  );
};

export default ChatMarker;