import { useRef, useCallback } from 'react';

export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/assets/sound/notification_warning.mp3');
      audioRef.current.preload = 'auto';
      audioRef.current.volume = 0.7;
    }
  }, []);

  const playNotification = useCallback(() => {
    initializeAudio();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.warn('Could not play notification sound:', error);
      });
    }
  }, [initializeAudio]);

  return { playNotification };
};