import React from 'react';
import { ActionIcon, Avatar, Box, Group, Text, useMantineColorScheme, Button } from '@mantine/core';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { role, username, logout } = useAuthStore();

    const getInitial = () => {
        if (!role) return '?';
        if (username) return username.charAt(0).toUpperCase();
        return role.charAt(0).toUpperCase();
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <Box
            sx={(theme) => ({
                height: 60,
                padding: '0 1rem',
                borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            })}
        >
            <Group position="apart" sx={{ height: '100%' }}>
                <Group spacing="md">
                    <Text size="xl" weight={700} color="green.6">
                        CallNA
                    </Text>
                    {username && (
                        <Text size="sm" color="dimmed">
                            Welcome, {username}
                        </Text>
                    )}
                </Group>
                <Group spacing="xs">
                    <ActionIcon
                        variant="default"
                        onClick={() => toggleColorScheme()}
                        size={30}
                        radius="xl"
                    >
                        {colorScheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </ActionIcon>
                    <Avatar radius="xl" color="teal" size="sm">
                        {getInitial()}
                    </Avatar>
                    <Button
                        variant="subtle"
                        color="red"
                        size="xs"
                        leftIcon={<LogOut size={14} />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Group>
            </Group>
        </Box>
    );
};

export default Navbar;