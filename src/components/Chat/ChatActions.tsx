import React from 'react';
import { Button, Group } from '@mantine/core';
import { CheckCircle2, Flag } from 'lucide-react';

interface ChatActionsProps {
  onFollowUp: () => void;
  onResolve: () => void;
  hasNewMessages: boolean;
  hasFollowUp: boolean;
}

const ChatActions: React.FC<ChatActionsProps> = ({
  onFollowUp,
  onResolve,
  hasNewMessages,
  hasFollowUp,
}) => {
  return (
    <Group spacing="xs" p="md" sx={(theme) => ({
      borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    })}>
      <Button
        variant="light"
        color="green"
        leftIcon={<Flag size={16} />}
        disabled={!hasNewMessages}
        onClick={onFollowUp}
      >
        Follow Up
      </Button>
      <Button
        variant="light"
        color="blue"
        leftIcon={<CheckCircle2 size={16} />}
        disabled={!hasFollowUp}
        onClick={onResolve}
      >
        Resolve
      </Button>
    </Group>
  );
};

export default ChatActions;