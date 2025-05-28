import React from 'react';
import { Box, Text } from '@mantine/core';
import { CheckCircle2, Flag } from 'lucide-react';
import { ChatHistory } from "../../services/histories/types.ts";

interface ChatMarkerProps {
    marker: {
        status: ChatHistory['status'];
        createdAt: Date;

    };
}

const ChatMarker: React.FC<ChatMarkerProps> = ({ marker }) => {
    const isFollowUp = marker.status === 'FOLLOWED_UP';

    const date = marker.createdAt.toLocaleDateString();
    const timestamp = marker.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
                    {/* Tampilkan teks berdasarkan marker.status */}
                    {isFollowUp ? 'Follow Up' : 'Resolved'} - {date} {timestamp}
                </Text>
            </Box>
        </Box>
    );
};

export default ChatMarker;