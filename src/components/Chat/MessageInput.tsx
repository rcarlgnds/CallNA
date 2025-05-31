import React, { useState } from 'react';
import { ActionIcon, Box, Group, TextInput, Transition } from '@mantine/core';
import { Smile, Plus, Send } from 'lucide-react';
import QuickMessages from './QuickMessages';
import ChatActions from './ChatActions';
import AIRecommendation from './AIRecommendation';
import { RoomStatus } from '../../services/rooms/types';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onFollowUp: () => void;
  onResolve: () => void;
  roomStatus: RoomStatus;
  isAdmin?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onFollowUp,
  onResolve,
  roomStatus,
  isAdmin = true,
}) => {
  const [message, setMessage] = useState('');
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      
      // Show AI recommendation after user sends a message
      if (!isAdmin) {
        setTimeout(() => setShowAIRecommendation(true), 500);
      }
    }
  };

  const handleQuickMessageSelect = (content: string) => {
    onSendMessage(content);
    setShowQuickMessages(false);
  };

  const handleAIRecommendation = (text: string) => {
    setMessage(text);
    setShowAIRecommendation(false);
  };

  return (
    <Box>
      {isAdmin && (
        <ChatActions
          status={roomStatus}
          onFollowUp={onFollowUp}
          onResolve={onResolve}
        />
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={(theme) => ({
          padding: theme.spacing.md,
          borderTop: `1px solid ${theme.colors.gray[2]}`,
          position: 'relative',
        })}
      >
        <Transition
          mounted={showQuickMessages}
          transition="slide-up"
          duration={200}
        >
          {(styles) => (
            <QuickMessages
              onSelect={handleQuickMessageSelect}
              style={styles}
            />
          )}
        </Transition>

        <Transition
          mounted={showAIRecommendation}
          transition="slide-up"
          duration={200}
        >
          {(styles) => (
            <AIRecommendation
              recommendation="Thank you for your message. I understand your concern and I'll help you resolve this issue."
              onAccept={handleAIRecommendation}
              onClose={() => setShowAIRecommendation(false)}
              style={styles}
            />
          )}
        </Transition>

        <Group position="apart" spacing="xs" noWrap>
          <ActionIcon
            size="lg"
            color="gray"
            variant="subtle"
            radius="xl"
            onClick={() => setShowQuickMessages(!showQuickMessages)}
          >
            <Plus size={20} />
          </ActionIcon>

          <TextInput
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ flex: 1 }}
            styles={(theme) => ({
              input: {
                borderRadius: theme.radius.xl,
                backgroundColor: theme.colors.gray[1],
                border: 'none',
                '&:focus': {
                  border: 'none',
                },
              },
              root: {
                width: '100%',
              },
            })}
          />

          <Group spacing="xs" noWrap>
            <ActionIcon
              size="lg"
              color="gray"
              variant="subtle"
              radius="xl"
              onClick={() => setShowAIRecommendation(true)}
            >
              <Smile size={20} />
            </ActionIcon>

            <ActionIcon
              size="lg"
              color="green"
              variant="filled"
              radius="xl"
              type="submit"
              disabled={!message.trim()}
            >
              <Send size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>
    </Box>
  );
};

export default MessageInput;