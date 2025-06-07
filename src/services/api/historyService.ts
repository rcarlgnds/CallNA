import { apolloClient } from '../graphql/client';
import { GET_HISTORIES } from '../graphql/queries';
import { CREATE_HISTORY } from '../graphql/mutations';
import { History, CreateHistoryInput } from '../types';

export const historyService = {
  async getHistories(): Promise<History[]> {
    try {
      const { data } = await apolloClient.query({
        query: GET_HISTORIES,
        fetchPolicy: 'cache-and-network',
      });
      return data.histories;
    } catch (error) {
      console.error('Error fetching histories:', error);
      return [];
    }
  },

  async createHistory(input: CreateHistoryInput): Promise<History | null> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_HISTORY,
        variables: { createHistoryInput: input },
      });
      return data.createHistory;
    } catch (error) {
      console.error('Error creating history:', error);
      return null;
    }
  },
};