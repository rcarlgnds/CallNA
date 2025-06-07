import React from 'react';
import { Avatar, Badge, Box, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { Room, Status } from '../../services/types';

interface ConversationItemProps {
    conversation: Room;
    isActive: boolean;
    onClick: (id: string) => void;
    unreadCount?: number;
    lastMessage?: string;
    lastMessageTime?: string;
}

const getStatusColor = (status: Status): string => {
  switch (status) {
    case Status.DEFAULT:
      return 'red';
    case Status.FOLLOW_UP:
      return 'green';
    case Status.RESOLVED:
      return 'blue';
    default:
      return 'gray';
  }
};

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

const ConversationItem: React.FC<ConversationItemProps> = ({
    conversation,
    isActive,
    onClick,
    unreadCount = 0,
    lastMessage,
    lastMessageTime,
}) => {
    const { id, roomName, status } = conversation;

    return (
        <UnstyledButton
            sx={(theme) => ({
                padding: theme.spacing.md,
                borderRadius: theme.radius.md,
                width: '100%',
                backgroundColor: isActive 
                    ? theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
                    : 'transparent',
                '&:hover': {
                    backgroundColor: isActive 
                        ? theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
                        : theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
                transition: 'background-color 200ms ease',
            })}
            onClick={() => onClick(id)}
        >
            <Group position="apart" noWrap>
                <Group noWrap spacing="sm">
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${roomName}`}
                            alt={roomName}
                            radius="xl"
                            size="md"
                        />
                        <Box
                            sx={(theme) => ({
                                position: 'absolute',
                                bottom: 2,
                                right: 2,
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: theme.colors[getStatusColor(status)][6],
                                border: `2px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
                            })}
                        />
                    </Box>
                    <Stack spacing={0}>
                        <Text size="sm" weight={500}>
                            {roomName}
                        </Text>
                        <Text size="xs" color="dimmed">
                            {getStatusText(status)}
                        </Text>
                        {lastMessage && (
                            <Text
                                size="xs"
                                color="dimmed"
                                lineClamp={1}
                                sx={{ maxWidth: 180 }}
                            >
                                {lastMessage}
                            </Text>
                        )}
                    </Stack>
                </Group>
                <Stack spacing={5} align="flex-end">
                    {lastMessageTime && (
                        <Text size="xs\" color="dimmed">
                            {lastMessageTime}
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