import React from 'react';
import { Box, Button, Paper, Stack, Text } from '@mantine/core';
import { QuickMessage } from '../../types';

const adminQuickMessages: QuickMessage[] = [
    {
        id: '1',
        content: 'Satu staff sedang menuju ke ruangan, mohon ditunggu.',
        category: 'On-Site Support',
    },
    {
        id: '2',
        content: 'Untuk matkul ini sudah kami jadwalkan internetnya, jadi tidak perlu request lagi, tetapi kalau masih lambat boleh infokan ya Pak/Bu.',
        category: 'Internet & Bandwidth',
    },
    {
        id: '3',
        content: 'Internetnya sudah kami nyalakan, silakan dicek kembali ya Pak/Bu',
        category: 'Internet & Bandwidth',
    },
    {
        id: '4',
        content: 'Bandwidth internetnya sudah kami tingkatkan, silakan dicek kembali ya Pak/Bu.',
        category: 'Internet & Bandwidth',
    },
    {
        id: '5',
        content: 'Untuk internet sedang berkendala di jaringan lab. Kami akan coba meningkatkan bandwidth internet, tapi mungkin tidak akan terlalu berpengaruh.',
        category: 'Internet & Bandwidth',
    },
    {
        id: '6',
        content: 'Untuk update Zoom sudah kami bantu jalankan, jika terbuka window CMD di komputer pengajar jangan ditutup ya.',
        category: 'Zoom',
    },
];

interface QuickMessagesProps {
    onSelect: (content: string) => void;
    className?: string;
    style?: React.CSSProperties;
}

const QuickMessages: React.FC<QuickMessagesProps> = ({ onSelect, className, style }) => {
    return (
        <Paper
            className={className}
            style={style}
            sx={(theme) => ({
                position: 'absolute',
                bottom: '100%',
                left: 0,
                right: 0,
                border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                zIndex: 5,
                maxHeight: 300,
                overflowY: 'auto',
            })}
            p="md"
            shadow="md"
        >
            <Stack spacing="xs">
                {Object.entries(
                    adminQuickMessages.reduce<Record<string, QuickMessage[]>>((acc, message) => {
                        if (!acc[message.category]) acc[message.category] = [];
                        acc[message.category].push(message);
                        return acc;
                    }, {})
                ).map(([category, messages]) => (
                    <Box key={category}>
                        <Text size="xs" weight={500} color="dimmed" mb={4}>
                            {category}
                        </Text>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {messages.map((message) => (
                                <Button
                                    key={message.id}
                                    variant="light"
                                    size="xs"
                                    onClick={() => onSelect(message.content)}
                                    sx={{
                                        flexShrink: 0,
                                        whiteSpace: 'normal',
                                        maxWidth: '100%',
                                        textAlign: 'left',
                                    }}
                                >
                                    {message.content}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
};

export default QuickMessages;
