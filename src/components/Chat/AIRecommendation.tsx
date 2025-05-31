import React from 'react';
import { Box, Button, Group, Paper, Text } from '@mantine/core';
import { X } from 'lucide-react';

interface AIRecommendationProps {
  recommendation: string;
  onAccept: (text: string) => void;
  onClose: () => void;
  style?: React.CSSProperties;
}

const AIRecommendation: React.FC<AIRecommendationProps> = ({
  recommendation,
  onAccept,
  onClose,
  style,
}) => {
  return (
    <Paper
      shadow="md"
      p="md"
      style={style}
      sx={(theme) => ({
        position: 'absolute',
        bottom: '100%',
        left: 0,
        right: 0,
        marginBottom: theme.spacing.xs,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        borderRadius: theme.radius.md,
      })}
    >
      <Group position="apart" mb="xs">
        <Text size="sm" weight={500}>AI Recommendation</Text>
        <Button
          variant="subtle"
          color="gray"
          compact
          p={0}
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </Group>
      
      <Text size="sm" mb="md">{recommendation}</Text>
      
      <Group position="right" spacing="xs">
        <Button variant="subtle" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onAccept(recommendation)}>
          Use Suggestion
        </Button>
      </Group>
    </Paper>
  );
};