import { useState, useEffect, useRef } from 'react';
import { useSubscription } from '@apollo/client';
import { roomService } from '../services/api/roomService';
import { ROOM_UPDATED_SUBSCRIPTION } from '../services/graphql/subscriptions';
import { Room, Status } from '../services/types';
import { useNotificationSound } from './useNotificationSound';
import { useAuthStore } from '../store/authStore';

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playNotification } = useNotificationSound();
  const { role } = useAuthStore();
  const isAdmin = role === 'admin';
  const previousRoomStatusRef = useRef<Record<string, Status>>({});

  const { data: roomUpdated } = useSubscription(ROOM_UPDATED_SUBSCRIPTION);

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
      
      setRooms(fetchedRooms);
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

  useEffect(() => {
    if (roomUpdated?.roomUpdated && isAdmin) {
      const updatedRoom = roomUpdated.roomUpdated;
      const previousStatus = previousRoomStatusRef.current[updatedRoom.id];
      
      // Play notification sound when room status changes from RESOLVED to DEFAULT
      // This indicates a new chat has come in after the room was resolved
      if (previousStatus === Status.RESOLVED && updatedRoom.status === Status.DEFAULT) {
        playNotification();
      }
      
      // Update the previous status
      previousRoomStatusRef.current[updatedRoom.id] = updatedRoom.status;
      
      setRooms(prev => 
        prev.map(room => 
          room.id === updatedRoom.id 
            ? updatedRoom 
            : room
        )
      );
    } else if (roomUpdated?.roomUpdated && !isAdmin) {
      // For non-admin users, just update the room without sound
      setRooms(prev => 
        prev.map(room => 
          room.id === roomUpdated.roomUpdated.id 
            ? roomUpdated.roomUpdated 
            : room
        )
      );
    }
  }, [roomUpdated, isAdmin, playNotification]);

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
  };
};