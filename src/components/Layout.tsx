import React from 'react';
import { Box, MediaQuery } from '@mantine/core';
import Navbar from './Navbar';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  activeConversationId: string | null;
}

const Layout: React.FC<LayoutProps> = ({ sidebar, main, activeConversationId }) => {
  const { role } = useAuthStore();
  const isAdmin = role === 'admin';

  return (
    <Box 
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.colorScheme === 'dark'
            ? 'radial-gradient(circle at 50% 50%, rgba(25, 113, 194, 0.05) 0%, rgba(25, 113, 194, 0) 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(62, 184, 121, 0.05) 0%, rgba(62, 184, 121, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      })}
    >
      <Navbar />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {/* Only show sidebar for admin users */}
        {isAdmin && (
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
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              })}
            >
              {sidebar}
            </Box>
          </MediaQuery>
        )}
        
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
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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