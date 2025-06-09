import { useState, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { historyService } from '../services/api/historyService';
import { HISTORY_CREATED_SUBSCRIPTION } from '../services/graphql/subscriptions';
import { History } from '../services/types';

export const useHistories = () => {
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: newHistory } = useSubscription(HISTORY_CREATED_SUBSCRIPTION);

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const fetchedHistories = await historyService.getHistories();
      setHistories(fetchedHistories);
      setError(null);
    } catch (err) {
      setError('Failed to fetch histories');
      console.error('Error fetching histories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  useEffect(() => {
    if (newHistory?.historyCreated) {
      const history = newHistory.historyCreated;
      setHistories(prev => {
        const exists = prev.find(h => h.id === history.id);
        if (exists) return prev;
        return [...prev, history];
      });
    }
  }, [newHistory]);

  return {
    histories,
    loading,
    error,
    refetch: fetchHistories,
  };
};