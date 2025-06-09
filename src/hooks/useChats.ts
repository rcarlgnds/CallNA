import { useState, useEffect, useRef } from 'react';
import { useSubscription } from '@apollo/client';
import { chatService } from '../services/api/chatService';
import { CHAT_SENDED_SUBSCRIPTION, CHAT_SENDED_ADMIN_SUBSCRIPTION } from '../services/graphql/subscriptions';
import { Chat } from '../services/types';

export const useChats = (roomId?: string, isAdmin = false) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const processedMessageIds = useRef<Set<string>>(new Set());

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
      processedMessageIds.current.clear();
      return;
    }

    try {
      setLoading(true);
      const fetchedChats = await chatService.getChats(roomId);
      setChats(fetchedChats);
      
      // Track existing message IDs to prevent duplicates
      processedMessageIds.current.clear();
      fetchedChats.forEach(chat => {
        processedMessageIds.current.add(chat.id);
      });
      
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
        // Check if we've already processed this message to prevent duplicates
        if (!processedMessageIds.current.has(chat.id)) {
          processedMessageIds.current.add(chat.id);
          
          setChats(prev => {
            // Double-check that the message doesn't already exist
            const exists = prev.find(c => c.id === chat.id);
            if (exists) return prev;
            return [...prev, chat];
          });
        }
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