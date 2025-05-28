import React from 'react';
import { Avatar, Box, Group, Paper, Text } from '@mantine/core';
import {Room, RoomStatus} from "../../services/rooms/types.ts";

interface ChatHeaderProps {
  room: Room;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ room }) => {
  return (
    <Paper 
      sx={(theme) => ({
        padding: theme.spacing.md,
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
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
          {room.status === RoomStatus.RESOLVED && (
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
            {room.status === RoomStatus.RESOLVED
              ? 'Resolved'
              : room.status === RoomStatus.NEW_REQUEST
                ? 'New Request'
                : 'Followed Up'}
          </Text>
        </Box>
      </Group>
    </Paper>
  );
};

export default ChatHeader;