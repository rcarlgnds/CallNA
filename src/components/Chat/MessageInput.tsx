import React, { useState, useRef } from 'react';
import { ActionIcon, Box, Group, TextInput, Transition, Text } from '@mantine/core';
import { Smile, Plus, Send, Image } from 'lucide-react';
import QuickMessages from './QuickMessages';
import ChatActions from './ChatActions';
import AIRecommendation from './AIRecommendation';
import { RoomStatus } from '../../services/rooms/types';

interface MessageInputProps {
  onSendMessage: (message: string, file?: File) => void;
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent, file?: File) => {
    e.preventDefault();
    if (message.trim() || file) {
      onSendMessage(message, file);
      setMessage('');

      if (!isAdmin) {
        setTimeout(() => setShowAIRecommendation(true), 500);
      }
    }
  };

  const handleQuickMessageSelect = (content: string) => {
    setMessage(content);
    setShowQuickMessages(false);
  };

  const handleAIRecommendation = (text: string) => {
    setMessage(text);
    setShowAIRecommendation(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleSubmit(e, file);
    }
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
        onSubmit={(e) => handleSubmit(e)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={(theme) => ({
          padding: theme.spacing.md,
          borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
          position: 'relative',
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          ...(isDragging && {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
            border: `2px dashed ${theme.colors.blue[5]}`,
          }),
        })}
      >
        {isDragging && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              zIndex: 10,
            }}
          >
            <Text size="sm" weight={500}>Drop image here to send</Text>
          </Box>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleSubmit(new Event('submit') as any, file);
            }
          }}
        />

        <Transition mounted={showQuickMessages} transition="slide-up" duration={200}>
          {(styles) => (
            <QuickMessages onSelect={handleQuickMessageSelect} style={styles} />
          )}
        </Transition>

        <Transition mounted={showAIRecommendation} transition="slide-up" duration={200}>
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
          <Group spacing="xs">
            <ActionIcon
              size="lg"
              color="gray"
              variant="subtle"
              radius="xl"
              onClick={() => setShowQuickMessages(!showQuickMessages)}
            >
              <Plus size={20} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              color="gray"
              variant="subtle"
              radius="xl"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={20} />
            </ActionIcon>
          </Group>

          <TextInput
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ flex: 1 }}
            styles={(theme) => ({
              input: {
                borderRadius: theme.radius.xl,
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
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