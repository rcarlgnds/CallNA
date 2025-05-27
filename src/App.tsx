// src/App.tsx
import {
    MantineProvider,
    ColorSchemeScript,
    createTheme,
    AppShell,
    Text,
    Burger,
    Group,
    ActionIcon,
    useMantineColorScheme,
    rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import YourNavbarComponent from './features/dashboard/DashboardPage';

const theme = createTheme({
    // Cobain Nanti:
    // primaryColor: 'violet',
});

function AppLayout() {
    const [mobileNavOpened, { toggle: toggleMobileNav }] = useDisclosure();
    const { colorScheme, setColorScheme } = useMantineColorScheme();

    const toggleTheme = () => {
        setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <AppShell
            padding="md"
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: {
                    mobile: !mobileNavOpened,
                },
            }}
            header={{ height: 60 }}
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Burger
                        opened={mobileNavOpened}
                        onClick={toggleMobileNav}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Text fw={500}>Call NA</Text>
                    <ActionIcon
                        onClick={toggleTheme}
                        variant="default"
                        size="lg"
                        aria-label="Toggle color scheme"
                    >
                        {colorScheme === 'dark' ? (
                            <IconSun style={{ width: rem(18), height: rem(18) }} />
                        ) : (
                            <IconMoonStars style={{ width: rem(18), height: rem(18) }} />
                        )}
                    </ActionIcon>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <YourNavbarComponent />
            </AppShell.Navbar>

            <AppShell.Main
                style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
                <Text p="md">Main Content</Text>
                <Text p="md">Chat Section</Text>
            </AppShell.Main>
        </AppShell>
    );
}

export default function App() {
    return (
        <>
            <ColorSchemeScript defaultColorScheme="auto" />
            <MantineProvider theme={theme} defaultColorScheme="auto">
                {/* Render AppLayout DI DALAM MantineProvider */}
                <AppLayout />
            </MantineProvider>
        </>
    );
}