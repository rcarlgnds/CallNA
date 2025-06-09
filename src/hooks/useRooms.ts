import { useState, useEffect, useRef } from 'react';
import { useSubscription } from '@apollo/client';
import { roomService } from '../services/api/roomService';
import { ROOM_UPDATED_SUBSCRIPTION, CHAT_SENDED_ADMIN_SUBSCRIPTION } from '../services/graphql/subscriptions';
import { Room, Status } from '../services/types';
import { useNotificationSound } from './useNotificationSound';
import { useAuthStore } from '../store/authStore';

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomLastMessageTime, setRoomLastMessageTime] = useState<Record<string, Date>>({});
  const { playNotification } = useNotificationSound();
  const { role } = useAuthStore();
  const isAdmin = role === 'admin';
  const previousRoomStatusRef = useRef<Record<string, Status>>({});

  const { data: roomUpdated } = useSubscription(ROOM_UPDATED_SUBSCRIPTION);
  const { data: newChatAdmin } = useSubscription(CHAT_SENDED_ADMIN_SUBSCRIPTION, {
    skip: !isAdmin,
  });

  const sortRoomsByLastMessage = (roomsToSort: Room[]) => {
    return [...roomsToSort].sort((a, b) => {
      const timeA = roomLastMessageTime[a.id] || new Date(0);
      const timeB = roomLastMessageTime[b.id] || new Date(0);
      return timeB.getTime() - timeA.getTime();
    });
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const fetchedRooms = await roomService.getRooms();
      
      // Initialize previous status tracking
      fetchedRooms.forEach(room => {
        if (previousRoomStatusRef.current[room.id] === undefined) {
          previousRoomStatusRef.current[room.id] = room.status;
        }
      });
      
      setRooms(sortRoomsByLastMessage(fetchedRooms));
      setError(null);
    } catch (err) {
      setError('Failed to fetch rooms');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle new chat messages for admin (for room ordering and notifications)
  useEffect(() => {
    if (newChatAdmin?.chatSendedAdmin && isAdmin) {
      const chat = newChatAdmin.chatSendedAdmin;
      const currentTime = new Date(chat.createdAt);
      
      // Update last message time for room ordering
      setRoomLastMessageTime(prev => ({
        ...prev,
        [chat.room.id]: currentTime,
      }));

      // Sort rooms by last message time
      setRooms(prev => sortRoomsByLastMessage(prev));

      // Play notification sound if room status is DEFAULT (new request)
      if (chat.room.status === Status.DEFAULT) {
        playNotification();
      }
    }
  }, [newChatAdmin, isAdmin, playNotification]);

  useEffect(() => {
    if (roomUpdated?.roomUpdated) {
      const updatedRoom = roomUpdated.roomUpdated;
      const previousStatus = previousRoomStatusRef.current[updatedRoom.id];
      
      // Play notification sound when room status changes from RESOLVED to DEFAULT (admin only)
      if (isAdmin && previousStatus === Status.RESOLVED && updatedRoom.status === Status.DEFAULT) {
        playNotification();
      }
      
      // Update the previous status
      previousRoomStatusRef.current[updatedRoom.id] = updatedRoom.status;
      
      setRooms(prev => 
        sortRoomsByLastMessage(
          prev.map(room => 
            room.id === updatedRoom.id 
              ? updatedRoom 
              : room
          )
        )
      );
    }
  }, [roomUpdated, isAdmin, playNotification]);

  // Re-sort rooms when roomLastMessageTime changes
  useEffect(() => {
    setRooms(prev => sortRoomsByLastMessage(prev));
  }, [roomLastMessageTime]);

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
  };
};