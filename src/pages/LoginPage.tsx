import React, { useState } from 'react';
import { Box, Button, Container, Paper, Stack, Text, TextInput, useMantineTheme } from '@mantine/core';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const theme = useMantineTheme();
  const setRole = useAuthStore((state) => state.setRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: 'admin' | 'user') => {
    if (!username || !password) return;
    setRole(role);
  };

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
            <TextInput
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            
            <TextInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              size="lg"
              onClick={() => handleLogin('admin')}
              variant="filled"
              color="green"
              fullWidth
              disabled={!username || !password}
            >
              Login as Admin
            </Button>
            
            <Button
              size="lg"
              onClick={() => handleLogin('user')}
              variant="light"
              color="gray"
              fullWidth
              disabled={!username || !password}
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