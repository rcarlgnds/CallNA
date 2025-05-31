import React from 'react';
import { Box, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { QuickMessage } from '../../types';

const quickMessages: QuickMessage[] = [
    { id: '1', content: 'Thank you for contacting us!', category: 'Greetings' },
    { id: '2', content: 'I\'ll check and get back to you shortly.', category: 'Follow-up' },
    { id: '3', content: 'Is there anything else I can help you with?', category: 'Closing' },
    { id: '4', content: 'Could you please provide more details?', category: 'Questions' },
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
            })}
            p="md"
            shadow="md"
        >
            <Stack spacing="xs">
                {Object.entries(
                    quickMessages.reduce<Record<string, QuickMessage[]>>((acc, message) => {
                        if (!acc[message.category]) acc[message.category] = [];
                        acc[message.category].push(message);
                        return acc;
                    }, {})
                ).map(([category, messages]) => (
                    <Box key={category}>
                        <Text size="xs" weight={500} color="dimmed" mb={4}>
                            {category}
                        </Text>
                        <Group spacing="xs" noWrap>
                            {messages.map((message) => (
                                <Button
                                    key={message.id}
                                    variant="light"
                                    size="xs"
                                    onClick={() => onSelect(message.content)}
                                >
                                    {message.content}
                                </Button>
                            ))}
                        </Group>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
};

export default QuickMessages