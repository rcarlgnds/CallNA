import React from 'react';
import { Avatar, Box, Group, Paper, Text } from '@mantine/core';
import { Room, Status } from '../../services/types';

interface ChatHeaderProps {
  room: Room;
}

const getStatusText = (status: Status): string => {
  switch (status) {
    case Status.DEFAULT:
      return 'New Request';
    case Status.FOLLOW_UP:
      return 'Follow Up';
    case Status.RESOLVED:
      return 'Resolved';
    default:
      return 'Unknown';
  }
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ room }) => {
  return (
      <Paper
          sx={(theme) => ({
            padding: theme.spacing.md,
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
            borderRadius: 0,
          })}
      >
        <Group>
          <Box sx={{ position: 'relative' }}>
            <Avatar
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${room.roomName}`}
                alt={room.roomName}
                radius="xl"
                size="md"
            />
            {room.status === Status.RESOLVED && (
                <Box
                    sx={(theme) => ({
                      position: 'absolute',
                      bottom: 2,
                      right: 2,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: theme.colors.green[6],
                      border: `2px solid ${theme.white}`,
                    })}
                />
            )}
          </Box>
          <Box>
            <Text size="md" weight={500}>
              {room.roomName}
            </Text>
            <Text size="xs" color="dimmed">
              {getStatusText(room.status)}
            </Text>
          </Box>
        </Group>
      </Paper>
  );
};

export default ChatHeader;