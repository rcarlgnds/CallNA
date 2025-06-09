import { useState, useEffect, useRef } from 'react';
import { useSubscription } from '@apollo/client';
import { chatService } from '../services/api/chatService';
import { CHAT_SENDED_SUBSCRIPTION, CHAT_SENDED_ADMIN_SUBSCRIPTION } from '../services/graphql/subscriptions';
import { Chat, Status } from '../services/types';
import { useNotificationSound } from './useNotificationSound';

export const useChats = (roomId?: string, isAdmin = false) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playNotification } = useNotificationSound();
  const previousRoomStatusRef = useRef<Record<string, Status>>({});

  const { data: newChat } = useSubscription(
    isAdmin ? CHAT_SENDED_ADMIN_SUBSCRIPTION : CHAT_SENDED_SUBSCRIPTION,
    {
      variables: roomId && !isAdmin ? { roomId } : undefined,
      skip: !isAdmin && !roomId,
    }
  );

  const fetchChats = async () => {
    if (!roomId) {
      setChats([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedChats = await chatService.getChats(roomId);
      setChats(fetchedChats);
      setError(null);
    } catch (err) {
      setError('Failed to fetch chats');
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [roomId]);

  useEffect(() => {
    if (newChat && isAdmin) {
      const chat = newChat.chatSendedAdmin;
      if (chat && (!roomId || chat.room.id === roomId)) {
        const currentRoomStatus = chat.room.status;
        const previousRoomStatus = previousRoomStatusRef.current[chat.room.id];
        
        // Play notification sound for admin only in these cases:
        // 1. Room status is DEFAULT (new request)
        // 2. Room status changed from RESOLVED to DEFAULT (new chat after resolution)
        const shouldPlaySound = 
          currentRoomStatus === Status.DEFAULT && 
          (previousRoomStatus === undefined || previousRoomStatus === Status.RESOLVED);

        if (shouldPlaySound) {
          playNotification();
        }

        // Update the previous status
        previousRoomStatusRef.current[chat.room.id] = currentRoomStatus;

        setChats(prev => {
          const exists = prev.find(c => c.id === chat.id);
          if (exists) return prev;
          return [...prev, chat];
        });
      }
    } else if (newChat && !isAdmin) {
      const chat = newChat.chatSended;
      if (chat && (!roomId || chat.room.id === roomId)) {
        setChats(prev => {
          const exists = prev.find(c => c.id === chat.id);
          if (exists) return prev;
          return [...prev, chat];
        });
      }
    }
  }, [newChat, roomId, isAdmin, playNotification]);

  return {
    chats,
    loading,
    error,
    refetch: fetchChats,
  };
};