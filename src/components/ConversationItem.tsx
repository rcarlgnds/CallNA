import React from 'react';
import { Avatar, Badge, Box, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { Conversation } from '../types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: (id: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ 
  conversation, 
  isActive, 
  onClick 
}) => {
  const { id, user, lastMessage, unreadCount } = conversation;
  
  return (
    <UnstyledButton
      sx={(theme) => ({
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        width: '100%',
        backgroundColor: isActive 
          ? theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1]
          : 'transparent',
        '&:hover': {
          backgroundColor: isActive 
            ? theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1]
            : theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
        transition: 'background-color 200ms ease',
      })}
      onClick={() => onClick(id)}
    >
      <Group position="apart" noWrap>
        <Group noWrap spacing="sm">
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={user.avatar} 
              alt={user.name} 
              radius="xl" 
              size="md"
            />
            {user.status === 'online' && (
              <Box
                sx={(theme) => ({
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: theme.colors.green[6],
                  border: `2px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
                })}
              />
            )}
          </Box>
          <Stack spacing={0}>
            <Text size="sm" weight={500}>
              {user.name}
            </Text>
            {lastMessage && (
              <Text 
                size="xs" 
                color="dimmed" 
                lineClamp={1}
                sx={{ maxWidth: 180 }}
              >
                {lastMessage.content}
              </Text>
            )}
          </Stack>
        </Group>
        <Stack spacing={5} align="flex-end">
          {lastMessage && (
            <Text size="xs\" color="dimmed\" sx={{ fontSize: '0.7rem' }}>
              {lastMessage.timestamp}
            </Text>
          )}
          {unreadCount > 0 && (
            <Badge 
              size="sm" 
              variant="filled" 
              color="green"
              sx={{ minWidth: 20, height: 20 }}
            >
              {unreadCount}
            </Badge>
          )}
        </Stack>
      </Group>
    </UnstyledButton>
  );
};

export default ConversationItem;