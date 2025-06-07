import React, { useState } from 'react';
import { Box, Group, Stack, Text, Image, Modal } from '@mantine/core';
import { Check, CheckCheck } from 'lucide-react';
import { Chat } from '../../services/types';

interface MessageBubbleProps {
    message: Chat & { isOwn?: boolean };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const { isOwn, text, createdAt, isRead, file } = message;
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const imageUrl = file?.dataStream ? `data:image/jpeg;base64,${file.dataStream}` : undefined;

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: isOwn ? 'flex-end' : 'flex-start',
                    marginBottom: 12,
                }}
            >
                <Stack spacing={4} align={isOwn ? 'flex-end' : 'flex-start'}>
                    <Box
                        sx={(theme) => ({
                            display: 'inline-block',
                            padding: '10px 14px',
                            borderRadius: theme.radius.lg,
                            backgroundColor: isOwn
                                ? theme.colors.green[6]
                                : theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                            color: isOwn
                                ? theme.white
                                : theme.colorScheme === 'dark' ? theme.white : theme.black,
                            whiteSpace: 'pre-wrap',
                            maxWidth: '80%',
                        })}
                    >
                        {text && <Text>{text}</Text>}

                        {imageUrl && (
                            <Box 
                                mt="xs" 
                                sx={{ cursor: 'pointer' }}
                                onClick={() => setImageModalOpen(true)}
                            >
                                <Image
                                    src={imageUrl}
                                    alt={text || 'Sent image'}
                                    radius="md"
                                    sx={{ maxWidth: 300, width: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                        )}
                    </Box>

                    <Group spacing={4} align="center">
                        <Text size="xs" color="dimmed" sx={{ fontSize: '0.7rem' }}>
                            {new Date(createdAt).toLocaleString(undefined, {
                                day: '2-digit',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            })}
                        </Text>
                        {isOwn && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {!isRead && <Check size={14} color="#ADB5BD" />}
                                {isRead && <CheckCheck size={14} color="#06C755" />}
                            </Box>
                        )}
                    </Group>
                </Stack>
            </Box>

            <Modal
                opened={imageModalOpen}
                onClose={() => setImageModalOpen(false)}
                size="xl"
                centered
                padding="xs"
            >
                <Image
                    src={imageUrl}
                    alt={text || 'Image preview'}
                    fit="contain"
                    height="80vh"
                />
            </Modal>
        </>
    );
};

export default MessageBubble;