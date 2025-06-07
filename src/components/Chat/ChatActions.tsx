import React from 'react';
import { Button, Group } from '@mantine/core';
import { CheckCircle2, Flag } from 'lucide-react';
import { Status } from '../../services/types';

interface ChatActionsProps {
    status: Status;
    onFollowUp: () => void;
    onResolve: () => void;
}

const ChatActions: React.FC<ChatActionsProps> = ({ status, onFollowUp, onResolve }) => {
    return (
        <Group
            spacing="xs"
            p="md"
            sx={(theme) => ({
                borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
            })}
        >
            <Button
                variant="light"
                color="green"
                leftIcon={<Flag size={16} />}
                disabled={status !== Status.DEFAULT}
                onClick={onFollowUp}
            >
                Follow Up
            </Button>

            <Button
                variant="light"
                color="blue"
                leftIcon={<CheckCircle2 size={16} />}
                disabled={status !== Status.FOLLOW_UP}
                onClick={onResolve}
            >
                Resolve
            </Button>
        </Group>
    );
};

export default ChatActions;