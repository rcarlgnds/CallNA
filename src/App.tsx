import { useEffect, useState } from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { theme } from './theme/theme';
import Layout from './components/Layout';
import ConversationList from './components/ConversationList';
import Chat from './components/Chat';
import EmptyState from './components/EmptyState';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/authStore';
import { useRooms } from './hooks/useRooms';
import { useChats } from './hooks/useChats';
import { chatService } from './services/api/chatService';
import { Status, History } from './services/types';

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatMarkers, setChatMarkers] = useState<Record<string, History[]>>({});

  const { role, roomId } = useAuthStore();
  const isAdmin = role === 'admin';

  const { rooms} = useRooms();
  const { chats} = useChats(activeConversationId || undefined, isAdmin);

  console.log("Rooms: ", rooms);
  console.log("Current role:", role);
  console.log("Room ID:", roomId);

  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    document.documentElement.style.setProperty(
        'transition',
        theme.other!.colorSchemeTransition
    );
    setColorScheme(newColorScheme);
    setTimeout(() => {
      document.documentElement.style.removeProperty('transition');
    }, 300);
  };

  useEffect(() => {
    if (role === 'user' && roomId && !activeConversationId) {
      setActiveConversationId(roomId);
    } else if (role === 'admin' && !activeConversationId && rooms.length > 0) {
      setActiveConversationId(rooms[0].id);
    }
  }, [role, roomId, activeConversationId, rooms]);

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    if (isAdmin) {
      await chatService.markRoomAsRead(id);
    }
  };

  const handleSendMessage = async (content: string, file?: File) => {
    if (!activeConversationId) return;
    try {
      await chatService.createChat({
        roomId: activeConversationId,
        text: content,
        isAdmin,
        file,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const activeConversation = rooms.find((conv) => conv.id === activeConversationId);
  const activeMarkers = activeConversationId ? chatMarkers[activeConversationId] || [] : [];

  if (!role) {
    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
            <LoginPage />
          </MantineProvider>
        </ColorSchemeProvider>
    );
  }

  const handleAddMarker = (roomId: string, marker: History) => {
    setChatMarkers((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), marker],
    }));
  };

  const handleUpdateStatus = (newStatus: Status) => {

  };

  const filteredRooms = isAdmin ? rooms : rooms.filter(room => room.id === roomId);

  return (
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
          <Layout
              sidebar={
                  isAdmin && (
                      <ConversationList
                          conversations={filteredRooms}
                          activeConversationId={activeConversationId}
                          onSelectConversation={handleSelectConversation}
                      />
                  )
              }
              main={
                activeConversation ? (
                    <Chat
                        room={activeConversation}
                        messages={chats}
                        chatMarkers={activeMarkers}
                        onSendMessage={handleSendMessage}
                        onUpdateStatus={handleUpdateStatus}
                        onAddMarker={(marker) => handleAddMarker(activeConversationId!, marker)}
                        isAdmin={isAdmin}
                    />
                ) : (
                    <EmptyState />
                )
              }
              activeConversationId={activeConversationId}
          />
        </MantineProvider>
      </ColorSchemeProvider>
  );
}

export default App;