import React, { useState, useRef } from 'react';
import { ActionIcon, Box, Group, TextInput, Transition, Text, Alert } from '@mantine/core';
import { Plus, Send, Image, X } from 'lucide-react';
import QuickMessages from './QuickMessages';
import ChatActions from './ChatActions';
import AIRecommendation from './AIRecommendation';
import { Status } from '../../services/types';

interface MessageInputProps {
  onSendMessage: (message: string, file?: File) => void;
  onFollowUp: () => void;
  onResolve: () => void;
  roomStatus: Status;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (reduced from 10MB)
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const validateFile = (file: File): boolean => {
    setFileError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError('Only image files (JPEG, PNG, GIF, WebP) are allowed');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setFileError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      onSendMessage(message, selectedFile || undefined);
      setMessage('');
      setSelectedFile(null);
      setFileError(null);

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
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFileError(null);
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
              handleFileSelect(file);
            }
          }}
        />

        {fileError && (
          <Alert color="red" mb="xs" onClose={() => setFileError(null)} withCloseButton>
            {fileError}
          </Alert>
        )}

        {selectedFile && (
          <Box
            mb="xs"
            p="xs"
            sx={(theme) => ({
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
            })}
          >
            <Group position="apart">
              <Group spacing="xs">
                <Image size={16} />
                <Text size="sm" truncate sx={{ maxWidth: 200 }}>
                  {selectedFile.name}
                </Text>
                <Text size="xs" color="dimmed">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </Text>
              </Group>
              <ActionIcon size="sm" onClick={removeSelectedFile}>
                <X size={14} />
              </ActionIcon>
            </Group>
          </Box>
        )}

        <Transition mounted={showQuickMessages} transition="slide-up" duration={200}>
          {(styles) => (
            <QuickMessages onSelect={handleQuickMessageSelect} style={styles} />
          )}
        </Transition>

        {isAdmin && (
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
        )}

        <Group position="apart" spacing="xs" noWrap>
          <Group spacing="xs">
            <ActionIcon
              size="lg"
              color="gray"
              variant="subtle"
              radius="xl"
              onClick={() => setShowQuickMessages(!showQuickMessages)}
              sx={(theme) => ({
                transform: showQuickMessages ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              })}
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
            {isAdmin && (
              <ActionIcon
                size="lg"
                color="gray"
                variant="subtle"
                radius="xl"
                onClick={() => setShowAIRecommendation(true)}
              >
                <Plus size={20} />
              </ActionIcon>
            )}

            <ActionIcon
              size="lg"
              color="green"
              variant="filled"
              radius="xl"
              type="submit"
              disabled={!message.trim() && !selectedFile}
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