import { useState, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { roomService } from '../services/api/roomService';
import { ROOM_UPDATED_SUBSCRIPTION } from '../services/graphql/subscriptions';
import { Room } from '../services/types';

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: roomUpdated } = useSubscription(ROOM_UPDATED_SUBSCRIPTION);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const fetchedRooms = await roomService.getRooms();
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
    if (roomUpdated?.roomUpdated) {
      setRooms(prev => 
        prev.map(room => 
          room.id === roomUpdated.roomUpdated.id 
            ? roomUpdated.roomUpdated 
            : room
        )
      );
    }
  }, [roomUpdated]);

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
  };
};