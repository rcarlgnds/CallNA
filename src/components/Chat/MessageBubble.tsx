import React from 'react';
import { Box, Group, Stack, Text, Image } from '@mantine/core';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from "./MessageList";

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const { isOwn, text, createdAt, isRead, imageUrl } = message;

    return (
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
                        // Tambahan style untuk text dan image agar konsisten
                    })}
                >
                    {/* Render teks kalau ada */}
                    {text && <Text>{text}</Text>}

                    {/* Render gambar kalau ada */}
                    {imageUrl && (
                        <Box mt="xs">
                            <Image
                                src={imageUrl}
                                alt={text ? text : 'Sent image'}
                                radius="md"
                                sx={{ maxWidth: 300, width: '100%', objectFit: 'cover' }}
                            />
                        </Box>
                    )}
                </Box>

                <Group spacing={4} align="center">
                    <Text size="xs" color="dimmed" sx={{ fontSize: '0.7rem' }}>
                        {createdAt
                            ? new Date(createdAt).toLocaleString(undefined, {
                                day: '2-digit',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            })
                            : 'Invalid date'}
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
    );
};

export default MessageBubble;
