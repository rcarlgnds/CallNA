import React, { useState, useEffect } from 'react';
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
    Select,
    Loader,
} from '@mantine/core';
import { IconUser, IconLock, IconSun, IconMoon } from '@tabler/icons-react';
import { useAuthStore } from '../store/authStore';
import { useMantineColorScheme } from '@mantine/core';
import { roomService } from '../services/api/roomService';
import { Room } from '../services/types';

const LoginPage: React.FC = () => {
    const theme = useMantineTheme();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { setRole, setUsername, setRoomId } = useAuthStore();
    const [username, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const fetchedRooms = await roomService.getRooms();
                setRooms(fetchedRooms);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleLogin = () => {
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        setError(null);

        // Admin login
        if (username === 'admin' && password === 'admin') {
            setRole('admin');
            setUsername('admin');
            setRoomId(null);
            return;
        }

        // User login - check if username matches any room name
        const matchingRoom = rooms.find(room => 
            room.roomName.toLowerCase() === username.toLowerCase() && 
            room.roomName.toLowerCase() === password.toLowerCase()
        );

        if (matchingRoom) {
            setRole('user');
            setUsername(username);
            setRoomId(matchingRoom.id);
        } else {
            setError('Invalid credentials. For users, use room name as both username and password.');
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Loader size="lg" />
            </Box>
        );
    }

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

                        <Text size="sm" color="dimmed" align="center">
                            Admin: username=admin, password=admin<br/>
                            User: Use room name as both username and password
                        </Text>

                        {rooms.length > 0 && (
                            <Box>
                                <Text size="sm" weight={500} mb="xs">Available Rooms:</Text>
                                <Text size="xs" color="dimmed">
                                    {rooms.map(room => room.roomName).join(', ')}
                                </Text>
                            </Box>
                        )}

                        <TextInput
                            label="Username"
                            placeholder="Enter your username"
                            icon={<IconUser size={18} />}
                            value={username}
                            onChange={(e) => setUsernameInput(e.target.value)}
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