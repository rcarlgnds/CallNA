import React from 'react';
import { ActionIcon, Avatar, Box, Group, Text, useMantineColorScheme } from '@mantine/core';
import { Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const role = useAuthStore((state) => state.role);

    const getInitial = () => {
        if (!role) return '?';
        return role.charAt(0).toUpperCase();
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
                <Text size="xl" weight={700} color="green.6">
                    CallNA
                </Text>
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
                </Group>
            </Group>
        </Box>
    );
};

export default Navbar;
