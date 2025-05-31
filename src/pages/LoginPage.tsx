import React from 'react';
import { Box, Button, Container, Paper, Stack, Text, useMantineTheme } from '@mantine/core';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const theme = useMantineTheme();
  const setRole = useAuthStore((state) => state.setRole);

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
      }}
    >
      <Container size="xs">
        <Paper
          radius="md"
          p="xl"
          withBorder
          sx={{
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          }}
        >
          <Text size="xl" weight={700} align="center" mb="xl" color="green.6">
            CallNA Chat
          </Text>
          
          <Stack spacing="md">
            <Button
              size="lg"
              onClick={() => setRole('admin')}
              variant="filled"
              color="green"
              fullWidth
            >
              Login as Admin
            </Button>
            
            <Button
              size="lg"
              onClick={() => setRole('user')}
              variant="light"
              color="gray"
              fullWidth
            >
              Login as User
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;