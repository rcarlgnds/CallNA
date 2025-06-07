import { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { theme } from './theme/theme';
import { apolloClient } from './services/graphql/client';
import Layout from './components/Layout';
import ConversationList from './components/ConversationList';
import Chat from './components/Chat';
import EmptyState from './components/EmptyState';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/authStore';
import { useRooms } from './hooks/useRooms';
import { useChats } from './hooks/useChats';
import { chatService } from './services/api/chatService';
import { Room, Status, Chat as ChatType, History } from './services/types';

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatMarkers, setChatMarkers] = useState<Record<string, History[]>>({});
  
  const role = useAuthStore((state) => state.role);
  const isAdmin = role === 'admin';

  const { rooms, loading: roomsLoading } = useRooms();
  const { chats, loading: chatsLoading } = useChats(activeConversationId || undefined, isAdmin);

  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    document.documentElement.style.setProperty(
      'transition',
      theme.other.colorSchemeTransition
    );
    setColorScheme(newColorScheme);
    setTimeout(() => {
      document.documentElement.style.removeProperty('transition');
    }, 300);
  };

  useEffect(() => {
    if (role === 'user' && !activeConversationId && rooms.length > 0) {
      setActiveConversationId(rooms[0].id);
    }
  }, [role, activeConversationId, rooms]);

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    
    // Mark room as read when selecting
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

  const activeConversation = rooms.find(conv => conv.id === activeConversationId);
  const activeMarkers = activeConversationId ? chatMarkers[activeConversationId] || [] : [];

  if (!role) {
    return (
      <ApolloProvider client={apolloClient}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
            <LoginPage />
          </MantineProvider>
        </ColorSchemeProvider>
      </ApolloProvider>
    );
  }

  const handleAddMarker = (roomId: string, marker: History) => {
    setChatMarkers(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), marker],
    }));
  };

  const handleUpdateStatus = (newStatus: Status) => {
    // Status updates are handled through GraphQL subscriptions
    // This is just for local state consistency
  };

  return (
    <ApolloProvider client={apolloClient}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
          <Layout
            sidebar={isAdmin && (
              <ConversationList
                conversations={rooms}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
              />
            )}
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
    </ApolloProvider>
  );
}

export default App;