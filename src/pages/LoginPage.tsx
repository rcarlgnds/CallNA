import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Paper,
    Stack,
    Text,
    TextInput,
    useMantineTheme,
    Title,
    ActionIcon,
} from '@mantine/core';
import { IconUser, IconLock, IconSun, IconMoon } from '@tabler/icons-react';
import { useAuthStore } from '../store/authStore';
import { useMantineColorScheme } from '@mantine/core';

const LoginPage: React.FC = () => {
    const theme = useMantineTheme();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const setRole = useAuthStore((state) => state.setRole);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = () => {
        if (!username || !password) return;

        if (username === 'admin' && password === 'admin') {
            setRole('admin');
        } else if (username === 'user' && password === 'user') {
            setRole('user');
        } else {
            setError('Invalid credentials.');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                    theme.colorScheme === 'dark'
                        ? 'linear-gradient(135deg, #1a1b1e 0%, #2c2e33 100%)'
                        : 'linear-gradient(135deg, #e0f7ec 0%, #ffffff 100%)',
                position: 'relative',
                transition: theme.other.colorSchemeTransition,
            }}
        >
            <ActionIcon
                variant="outline"
                color={colorScheme === 'dark' ? 'yellow' : 'blue'}
                onClick={() => toggleColorScheme()}
                title="Toggle theme"
                sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    transition: theme.other.colorSchemeTransition,
                }}
            >
                {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>

            <Container
                px="md"
                sx={{
                    width: '100%',
                    maxWidth: 500,
                }}
            >
                <Paper
                    sx={(theme) => ({
                        backgroundColor: theme.colorScheme === 'dark'
                            ? theme.colors.dark[7]
                            : theme.white,
                        transition: theme.other.colorSchemeTransition,
                    })}
                    shadow="md"
                    radius="lg"
                    p="xl"
                    withBorder
                >
                    <Stack spacing="md">
                        <Title
                            order={2}
                            align="center"
                            sx={{
                                background: 'linear-gradient(to right, #38b2ac, #38a169)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 800,
                            }}
                        >
                            CallNA
                        </Title>

                        <TextInput
                            label="Username"
                            placeholder="Enter your username"
                            icon={<IconUser size={18} />}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <TextInput
                            label="Password"
                            placeholder="Enter your password"
                            icon={<IconLock size={18} />}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <Text color="red\" size="sm\" align="center">
                                {error}
                            </Text>
                        )}

                        <Button
                            fullWidth
                            size="sm"
                            onClick={handleLogin}
                            variant="gradient"
                            gradient={{ from: 'teal', to: 'green', deg: 120 }}
                            disabled={!username || !password}
                        >
                            Login
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;