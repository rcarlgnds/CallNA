import React from 'react';
import { Box, Stack, Text } from '@mantine/core';
import { MessageSquare } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <Stack 
      align="center" 
      justify="center" 
      spacing="md"
      sx={{ height: '100%' }}
    >
      <Box 
        sx={(theme) => ({
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: theme.colors.gray[1],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <MessageSquare size={40} color="#ADB5BD" />
      </Box>
      <Text size="lg" weight={500}>Select a conversation</Text>
      <Text size="sm" color="dimmed" align="center" sx={{ maxWidth: 300 }}>
        Choose a room from the list to start chatting
      </Text>
    </Stack>
  );
};

export default EmptyState;