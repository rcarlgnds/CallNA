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
                transition: 'all 0.3s ease',
            })}
        >
            <Group position="apart" sx={{ height: '100%' }}>
                <Group spacing="md">
                    <Text 
                        size="xl" 
                        weight={700} 
                        sx={(theme) => ({
                            background: theme.colorScheme === 'dark' 
                                ? 'linear-gradient(45deg, #38b2ac, #38a169)'
                                : 'linear-gradient(45deg, #06C755, #38a169)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            transition: 'all 0.3s ease',
                        })}
                    >
                        CallNA
                    </Text>
                </Group>
                <Group spacing="xs">
                    <ActionIcon
                        variant="subtle"
                        onClick={() => toggleColorScheme()}
                        size={36}
                        radius="xl"
                        sx={(theme) => ({
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: theme.colorScheme === 'dark' 
                                    ? theme.colors.dark[5] 
                                    : theme.colors.gray[1],
                                transform: 'scale(1.05)',
                            },
                        })}
                    >
                        {colorScheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </ActionIcon>
                    
                    <Group spacing="xs" sx={{ marginLeft: 8 }}>
                        <Avatar 
                            radius="xl" 
                            color="teal" 
                            size="sm"
                            sx={(theme) => ({
                                transition: 'all 0.3s ease',
                                border: `2px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                            })}
                        >
                            {getInitial()}
                        </Avatar>
                        
                        {username && (
                            <Box>
                                <Text size="sm" weight={500}>
                                    {username}
                                </Text>
                                <Text size="xs" color="dimmed" sx={{ lineHeight: 1 }}>
                                    {role === 'admin' ? 'Administrator' : 'User'}
                                </Text>
                            </Box>
                        )}
                    </Group>
                    
                    <Button
                        variant="subtle"
                        color="red"
                        size="xs"
                        leftIcon={<LogOut size={14} />}
                        onClick={handleLogout}
                        sx={(theme) => ({
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.02)',
                            },
                        })}
                    >
                        Logout
                    </Button>
                </Group>
            </Group>
        </Box>
    );
};

export default Navbar;