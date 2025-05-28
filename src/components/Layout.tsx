import React from 'react';
import { Box, MediaQuery } from '@mantine/core';
import Navbar from './Navbar';

interface LayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  activeConversationId: string | null;
}

const Layout: React.FC<LayoutProps> = ({ sidebar, main, activeConversationId }) => {
  return (
    <Box 
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      })}
    >
      <Navbar />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar - Hide on mobile when conversation is active */}
        <MediaQuery 
          smallerThan="md" 
          styles={{ 
            display: activeConversationId ? 'none' : 'block',
            width: '100%',
          }}
        >
          <Box 
            sx={(theme) => ({
              width: 320,
              borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
              overflow: 'hidden',
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            })}
          >
            {sidebar}
          </Box>
        </MediaQuery>
        
        {/* Main content - Full width on mobile */}
        <MediaQuery 
          smallerThan="md" 
          styles={{ 
            display: activeConversationId ? 'block' : 'none',
            width: '100%',
          }}
        >
          <Box 
            sx={(theme) => ({ 
              flex: 1, 
              overflow: 'hidden',
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            })}
          >
            {main}
          </Box>
        </MediaQuery>
      </Box>
    </Box>
  );
};

export default Layout;