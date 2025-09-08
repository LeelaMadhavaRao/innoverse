import { useRef, useState, useCallback, useEffect } from 'react';

export const useBackgroundMusic = (audioSrc, options = {}) => {
  const {
    autoPlay = false,
    loop = true,
    volume = 0.5,
    fadeInDuration = 2000,
    fadeOutDuration = 1000
  } = options;

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const fadeIntervalRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Track user interaction for autoplay permission
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Initialize audio element with improved error handling
  useEffect(() => {
    if (!audioSrc) return;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.loop = loop;
    audio.volume = 0; // Start with volume 0 for fade-in effect

    // Set up event listeners
    const handleCanPlay = () => {
      console.log('🎵 Audio can play:', audioSrc);
      setIsLoaded(true);
      
      // Auto-play only if user has interacted and autoPlay is enabled
      if (autoPlay && hasUserInteracted) {
        setTimeout(() => {
          play().catch(error => {
            console.log('🔇 Auto-play prevented by browser policy:', error.message);
          });
        }, 100);
      }
    };

    const handleCanPlayThrough = () => {
      console.log('🎵 Audio fully loaded:', audioSrc);
      setIsLoaded(true);
    };

    const handleEnded = () => {
      console.log('🎵 Audio playback ended');
      setIsPlaying(false);
    };

    const handleError = (error) => {
      console.error('❌ Audio loading error:', error);
      setIsLoaded(false);
      
      // Retry loading with exponential backoff
      const retryDelay = Math.min(1000 * Math.pow(2, retryTimeoutRef.current || 0), 10000);
      retryTimeoutRef.current = (retryTimeoutRef.current || 0) + 1;
      
      setTimeout(() => {
        if (audioRef.current && retryTimeoutRef.current < 3) {
          console.log(`🔄 Retrying audio load (attempt ${retryTimeoutRef.current})...`);
          audio.load();
        }
      }, retryDelay);
    };

    const handleLoadStart = () => {
      console.log('🎵 Loading audio:', audioSrc);
    };

    const handleLoadedData = () => {
      console.log('🎵 Audio data loaded');
      retryTimeoutRef.current = 0; // Reset retry counter on successful load
    };

    // Add all event listeners
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);

    audioRef.current = audio;

    // Start loading the audio
    try {
      audio.src = audioSrc;
      audio.load();
    } catch (error) {
      console.error('❌ Error setting audio source:', error);
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplay', handleCanPlay);
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('loadstart', handleLoadStart);
        audioRef.current.removeEventListener('loadeddata', handleLoadedData);
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [audioSrc, autoPlay, loop, hasUserInteracted]);

  // Improved fade effect function
  const fadeVolume = useCallback((targetVolume, duration, onComplete) => {
    if (!audioRef.current || fadeIntervalRef.current) return;

    const startVolume = audioRef.current.volume;
    const volumeStep = (targetVolume - startVolume) / (duration / 50);
    let currentStep = 0;
    const totalSteps = duration / 50;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const newVolume = startVolume + (volumeStep * currentStep);
      
      if (currentStep >= totalSteps) {
        if (audioRef.current) {
          audioRef.current.volume = Math.max(0, Math.min(1, targetVolume));
          setCurrentVolume(targetVolume);
        }
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        if (onComplete) onComplete();
      } else {
        if (audioRef.current) {
          const clampedVolume = Math.max(0, Math.min(1, newVolume));
          audioRef.current.volume = clampedVolume;
          setCurrentVolume(clampedVolume);
        }
      }
    }, 50);
  }, []);

  // Enhanced play function with better error handling
  const play = useCallback(async () => {
    if (!audioRef.current || !isLoaded) {
      console.log('🔇 Cannot play: audio not ready or not loaded');
      return Promise.reject(new Error('Audio not ready'));
    }

    try {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        console.log('🎵 Audio playing successfully');
        
        // Fade in
        fadeVolume(volume, fadeInDuration);
      }
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      setIsPlaying(false);
      throw error;
    }
  }, [isLoaded, volume, fadeInDuration, fadeVolume]);

  // Enhanced stop function
  const stop = useCallback(() => {
    if (!audioRef.current || !isPlaying) return;

    console.log('🛑 Stopping audio');
    
    // Fade out then pause
    fadeVolume(0, fadeOutDuration, () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    });
  }, [isPlaying, fadeOutDuration, fadeVolume]);

  // Enhanced pause function
  const pause = useCallback(() => {
    if (!audioRef.current || !isPlaying) return;

    console.log('⏸️ Pausing audio');
    
    fadeVolume(0, fadeOutDuration, () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    });
  }, [isPlaying, fadeOutDuration, fadeVolume]);

  // Enhanced resume function
  const resume = useCallback(async () => {
    if (!audioRef.current || isPlaying) return;

    try {
      console.log('▶️ Resuming audio');
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        fadeVolume(volume, fadeInDuration);
      }
    } catch (error) {
      console.error('❌ Error resuming audio:', error);
    }
  }, [isPlaying, volume, fadeInDuration, fadeVolume]);

  // Enhanced set volume function
  const setVolume = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
      setCurrentVolume(clampedVolume);
    }
  }, []);

  return {
    play,
    stop,
    pause,
    resume,
    setVolume,
    isPlaying,
    isLoaded,
    currentVolume,
    hasUserInteracted
  };
};
