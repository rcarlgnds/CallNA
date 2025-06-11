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
import { useHistories } from './hooks/useHistories';
import { chatService } from './services/api/chatService';
import { Status } from './services/types';

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const { role, roomId } = useAuthStore();
  const isAdmin = role === 'admin';

  const { rooms} = useRooms();
  const { chats} = useChats(activeConversationId || undefined, isAdmin);
  const { histories } = useHistories();

  console.log("Rooms: ", rooms);
  console.log("Current role:", role);
  console.log("Room ID:", roomId);
  console.log("Active Conversation ID:", activeConversationId);

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
    console.log("Selecting conversation:", id);
    setActiveConversationId(id);
    if (isAdmin) {
      await chatService.markRoomAsRead(id);
    }
  };

  const handleSendMessage = async (content: string, file?: File) => {
    if (!activeConversationId) {
      console.error("No active conversation ID");
      return;
    }
    
    console.log("Sending message to room:", activeConversationId);
    
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
  
  // Get markers for the active conversation
  const activeMarkers = activeConversationId 
    ? histories.filter(history => history.room.id === activeConversationId)
    : [];

  if (!role) {
    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
            <LoginPage />
          </MantineProvider>
        </ColorSchemeProvider>
    );
  }

  const handleUpdateStatus = (newStatus: Status) => {
    // This will be handled by the room subscription
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