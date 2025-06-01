import React, { useState } from 'react';
import { ActionIcon, Box, Group, TextInput, Transition } from '@mantine/core';
import { Smile, Plus, Send } from 'lucide-react';
import QuickMessages from './QuickMessages';
import ChatActions from './ChatActions';
import {RoomStatus} from "../../services/rooms/types.ts";

interface MessageInputProps {
    onSendMessage: (message: string) => void;
    onFollowUp: () => void;
    onResolve: () => void;
    roomStatus: RoomStatus;
}


const MessageInput: React.FC<MessageInputProps> = ({
                                                       onSendMessage,
                                                       onFollowUp,
                                                       onResolve,
                                                       roomStatus,
                                                   }) => {
    const [message, setMessage] = useState('');
    const [showQuickMessages, setShowQuickMessages] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleQuickMessageSelect = (content: string) => {
        onSendMessage(content);
        setShowQuickMessages(false);
    };

    return (
        <Box>
            <ChatActions
                status={roomStatus}
                onFollowUp={onFollowUp}
                onResolve={onResolve}
            />

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={(theme) => ({
                    padding: theme.spacing.md,
                    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                    position: 'relative',
                })}
            >
                <Transition
                    mounted={showQuickMessages}
                    transition="slide-up"
                    duration={200}
                    timingFunction="ease"
                >
                    {(styles) => (
                        <QuickMessages
                            onSelect={handleQuickMessageSelect}
                            className="quick-message-popup"
                            style={styles}
                        />
                    )}
                </Transition>

                <Group position="apart" spacing="xs" noWrap>
                    <ActionIcon
                        size="lg"
                        color="gray"
                        variant="subtle"
                        radius="xl"
                        onClick={() => setShowQuickMessages(!showQuickMessages)}
                    >
                        <Plus size={20} />
                    </ActionIcon>

                    <TextInput
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        sx={{ flex: 1 }}
                        styles={(theme) => ({
                            input: {
                                borderRadius: theme.radius.xl,
                                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
                                border: 'none',
                                '&:focus': {
                                    border: 'none',
                                },
                            },
                            root: {
                                width: '100%',
                            },
                        })}
                    />

                    <Group spacing="xs" noWrap>
                        <ActionIcon size="lg" color="gray" variant="subtle" radius="xl">
                            <Smile size={20} />
                        </ActionIcon>

                        <ActionIcon
                            size="lg"
                            color="green"
                            variant="filled"
                            radius="xl"
                            type="submit"
                            disabled={!message.trim()}
                        >
                            <Send size={18} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Box>
        </Box>
    );
};

export default MessageInput;
