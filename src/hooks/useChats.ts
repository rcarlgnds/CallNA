import { useState, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { chatService } from '../services/api/chatService';
import { CHAT_SENDED_SUBSCRIPTION, CHAT_SENDED_ADMIN_SUBSCRIPTION } from '../services/graphql/subscriptions';
import { Chat } from '../services/types';

export const useChats = (roomId?: string, isAdmin = false) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (newChat) {
      const chat = isAdmin ? newChat.chatSendedAdmin : newChat.chatSended;
      if (chat && (!roomId || chat.room.id === roomId)) {
        setChats(prev => {
          const exists = prev.find(c => c.id === chat.id);
          if (exists) return prev;
          return [...prev, chat];
        });
      }
    }
  }, [newChat, roomId, isAdmin]);

  return {
    chats,
    loading,
    error,
    refetch: fetchChats,
  };
};