// src/features/dashboard/DashboardPage.tsx
// (atau di mana pun kamu meletakkan file untuk konten utama dashboard)

import { Paper, ScrollArea, Text, Stack, Box, Title } from '@mantine/core';

export default function DashboardPage() {
    return (
        <Stack
            gap="md"
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* HEADER PART */}
            <Paper shadow="xs" p="sm" withBorder radius="md">
                <Title order={4}>Selamat Datang, [Nama User]!</Title>
                <Text size="xs" c="dimmed">
                    Ini adalah ringkasan aktivitas terbaru Anda.
                </Text>
            </Paper>

            {/* Bagian Bawah yang Scrollable */}
            <Box
                style={{
                    flexGrow: 1, // Mengambil sisa ruang vertikal
                    overflow: 'hidden', // Mencegah konten meluap sebelum ScrollArea mengambil alih
                    border: '1px solid var(--mantine-color-gray-3)', // Contoh border
                    borderRadius: 'var(--mantine-radius-md)',
                }}
            >
                <ScrollArea
                    style={{ height: '100%' }} // ScrollArea mengisi tinggi Box di atasnya
                    scrollbarSize={8} // Ukuran scrollbar
                    type="auto" // Scrollbar muncul otomatis jika konten meluap
                >
                    {/* Konten utama yang bisa di-scroll diletakkan di sini */}
                    <Paper p="md" bg="transparent"> {/* bg="transparent" agar tidak double background dengan Box */}
                        {[...Array(30)].map((_, index) => (
                            <Paper key={index} p="xs" mb="xs" withBorder radius="sm">
                                Item konten ke-{index + 1}. Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.
                            </Paper>
                        ))}
                    </Paper>
                </ScrollArea>
            </Box>
        </Stack>
    );
}