import React, { useState } from 'react';
import { Box, Input, ScrollArea, Stack, Text } from '@mantine/core';
import { Search } from 'lucide-react';
import { Conversation } from '../../types';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations, 
  activeConversationId, 
  onSelectConversation 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conversation =>
    conversation.roomName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Stack spacing={0} sx={{ height: '100%' }}>
      <Box p="md">
        <Input
          placeholder="Search Room"
          icon={<Search size={16} />}
          size="md"
          radius="xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      
      <Text size="xs" weight={500} color="dimmed" px="md" py="xs">
        CHATS
      </Text>
      
      <ScrollArea sx={{ flex: 1 }} type="auto">
        <Stack spacing={0}>
          {filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
              onClick={onSelectConversation}
            />
          ))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

export default ConversationList;