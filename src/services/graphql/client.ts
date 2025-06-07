import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = createHttpLink({
    uri: 'http://10.22.77.78:3001/graphql',
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: 'ws://10.22.77.78:3001/graphql',
        retryAttempts: 5,
        connectionParams: async () => {
            return {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            };
        },
    })
);

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink
);

// Apollo Client
export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
        },
        query: {
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});
