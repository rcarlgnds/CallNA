import {useEffect, useState} from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { theme } from './theme/theme';
import Layout from './components/Layout';
import ConversationList from './components/ConversationList';
import Chat from './components/Chat';
import { ChatData } from './services/chats/types';
import { Room, RoomStatus } from './services/rooms/types';
import EmptyState from "./components/EmptyState.tsx";
import { mockChats, initialRooms } from "./data/mockData.ts";
import { ChatHistory } from "./services/histories/types.ts";

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatData[]>>(mockChats);
  const [chatMarkers, setChatMarkers] = useState<Record<string, ChatHistory[]>>({});
  const [conversationsState, setConversationsState] = useState<Room[]>(initialRooms);

  const toggleColorScheme = (value?: ColorScheme) =>
      setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);

    if (conversationsState.find(c => c.id === id)?.unreadCount) {
      const updatedConversations = conversationsState.map(conv =>
          conv.id === id ? { ...conv, unreadCount: 0 } : conv
      );
      setConversationsState(updatedConversations);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!activeConversationId) return;

    const room = conversationsState.find(c => c.id === activeConversationId);
    if (!room) return;

    const newMessage: ChatData = {
      id: `msg-${Date.now()}`,
      createdAt: new Date(),
      text: content,
      isAdmin: true, // asumsi current user adalah admin
      isRead: false,
      history: null as any, // sesuaikan jika ada histories
      room,
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

    if (Math.random() > 0.5) {
      setTimeout(() => {
        const replyMessage: ChatData = {
          id: `msg-reply-${Date.now()}`,
          createdAt: new Date(),
          text: `Thanks for your message: "${content.substring(0, 20)}${content.length > 20 ? '...' : ''}"`,
          isAdmin: false,
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


  // Button Logic
  const hasNewUserMessages = (roomId: string) => {
    const messages = chatMessages[roomId] || [];
    return messages.some(msg => !msg.isRead && !msg.isAdmin);
  };

  useEffect(() => {
    setConversationsState(prev => {
      return prev.map(room => {
        if (hasNewUserMessages(room.id)) {
          // Trigger NEW_REQUEST hanya kalau status bukan NEW_REQUEST
          // dan status sebelumnya FOLLOWED_UP / RESOLVED (bukan NEW_REQUEST)
          if (room.status !== RoomStatus.NEW_REQUEST) {
            return { ...room, status: RoomStatus.NEW_REQUEST };
          }
        }
        return room;
      });
    });
  }, [chatMessages]);

  return (
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
          <Layout
              sidebar={
                <ConversationList
                    conversations={conversationsState}
                    activeConversationId={activeConversationId}
                    onSelectConversation={handleSelectConversation}
                />
              }
              main={
                activeConversation ? (
                    <Chat
                        room={activeConversation}
                        messages={activeMessages}
                        history={lastHistory ?? defaultHistory}
                        onSendMessage={handleSendMessage}
                        onUpdateStatus={(newStatus) => {
                          if (!activeConversationId) return;

                          const now = new Date();
                          const newMarker: ChatHistory = {
                            id: `marker-${Date.now()}`,
                            createdAt: now,
                            room: activeConversation,
                            status: newStatus,
                          };

                          setChatMarkers(prev => ({
                            ...prev,
                            [activeConversationId]: [...(prev[activeConversationId] || []), newMarker],
                          }));

                          setConversationsState(prev =>
                              prev.map(conv =>
                                  conv.id === activeConversationId
                                      ? {
                                        ...conv,
                                        status:
                                            newStatus === RoomStatus.FOLLOWED_UP
                                                ? RoomStatus.FOLLOWED_UP
                                                : newStatus === RoomStatus.RESOLVED
                                                    ? RoomStatus.RESOLVED
                                                    : conv.status,
                                      }
                                      : conv
                              )
                          );
                        }}
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
