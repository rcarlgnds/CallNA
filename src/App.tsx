import { useEffect, useState } from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { theme } from './theme/theme';
import Layout from './components/Layout';
import ConversationList from './components/ConversationList';
import Chat from './components/Chat';
import { ChatData } from './services/chats/types';
import { Room, RoomStatus } from './services/rooms/types';
import EmptyState from './components/EmptyState';
import { mockChats, initialRooms } from './data/mockData';
import { ChatHistory } from './services/histories/types';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/authStore';

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatData[]>>(mockChats);
  const [chatMarkers, setChatMarkers] = useState<Record<string, ChatHistory[]>>({});
  const [conversationsState, setConversationsState] = useState<Room[]>(initialRooms);
  
  const role = useAuthStore((state) => state.role);
  const isAdmin = role === 'admin';

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  // For user role, automatically select the first room
  useEffect(() => {
    if (role === 'user' && !activeConversationId && initialRooms.length > 0) {
      setActiveConversationId(initialRooms[0].id);
    }
  }, [role, activeConversationId]);

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);

    if (conversationsState.find(c => c.id === id)?.unreadCount) {
      const updatedConversations = conversationsState.map(conv =>
        conv.id === id ? { ...conv, unreadCount: 0 } : conv
      );
      setConversationsState(updatedConversations);
    }
  };

  const handleSendMessage = (content: string, file?: File) => {
    if (!activeConversationId) return;

    const room = conversationsState.find(c => c.id === activeConversationId);
    if (!room) return;


    let imageUrl: string | undefined;
    if (file) {
      imageUrl = URL.createObjectURL(file);
    }

    const newMessage: ChatData = {
      id: `msg-${Date.now()}`,
      createdAt: new Date(),
      text: content,
      isAdmin,
      isRead: false,
      history: null as any,
      room,
      imageUrl,
    };

    setChatMessages(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage]
    }));

    setTimeout(() => {
      setChatMessages(prev => {
        const updatedMessages = [...(prev[activeConversationId] || [])];
        const lastIndex = updatedMessages.length - 1;
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          isRead: true,
        };
        return {
          ...prev,
          [activeConversationId]: updatedMessages
        };
      });
    }, 1000);

    if (!isAdmin && Math.random() > 0.5) {
      setTimeout(() => {
        const replyMessage: ChatData = {
          id: `msg-reply-${Date.now()}`,
          createdAt: new Date(),
          text: `Thanks for your message: "${content.substring(0, 20)}${content.length > 20 ? '...' : ''}"`,
          isAdmin: true,
          isRead: false,
          history: null as any,
          room,
        };
        setChatMessages(prev => ({
          ...prev,
          [activeConversationId]: [...(prev[activeConversationId] || []), replyMessage]
        }));
      }, 2000 + Math.random() * 2000);
    }
  };

  const activeConversation = conversationsState.find(conv => conv.id === activeConversationId);
  const activeMessages = activeConversationId ? chatMessages[activeConversationId] || [] : [];
  const activeMarkers = activeConversationId ? chatMarkers[activeConversationId] || [] : [];

  const lastHistory = activeMarkers.length > 0 ? activeMarkers[activeMarkers.length - 1] : null;
  const defaultHistory: ChatHistory = {
    id: '',
    createdAt: new Date(),
    room: activeConversation!,
    status: RoomStatus.RESOLVED
  };

  useEffect(() => {
    setConversationsState(prev => {
      return prev.map(room => {
        const messages = chatMessages[room.id] || [];
        const hasNewUserMessages = messages.some(msg => !msg.isRead && !msg.isAdmin);

        if (hasNewUserMessages && room.status === RoomStatus.RESOLVED) {
          return { ...room, status: RoomStatus.NEW_REQUEST };
        }
        return room;
      });
    });
  }, [chatMessages]);

  if (!role) {
    return (
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
          <LoginPage />
        </MantineProvider>
      </ColorSchemeProvider>
    );
  }

  const handleAddMarker = (roomId: string, marker: ChatHistory) => {
    setChatMarkers(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), marker],
    }));
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
        <Layout
          sidebar={isAdmin && (
            <ConversationList
              conversations={conversationsState}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
            />
          )}
          main={
            activeConversation ? (
                <Chat
                    room={activeConversation}
                    messages={activeMessages}
                    history={lastHistory ?? defaultHistory}
                    chatMarkers={activeMarkers}
                    onSendMessage={handleSendMessage}
                    onUpdateStatus={(newStatus) => {
                      if (!activeConversationId) return;

                      const now = new Date();
                      const newMarker: ChatHistory = {
                        id: `marker-${now.getTime()}`,
                        createdAt: now,
                        room: activeConversation,
                        status: newStatus,
                      };

                      // Set marker di state global chatMarkers
                      setChatMarkers(prev => ({
                        ...prev,
                        [activeConversationId]: [...(prev[activeConversationId] || []), newMarker],
                      }));

                      // Update status di conversationsState
                      setConversationsState(prev =>
                          prev.map(conv =>
                              conv.id === activeConversationId
                                  ? { ...conv, status: newStatus }
                                  : conv
                          )
                      );
                    }}
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