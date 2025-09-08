import { useRef, useEffect, useState, useCallback } from 'react';

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

  // Initialize audio element
  useEffect(() => {
    if (!audioSrc) return;

    const audio = new Audio(audioSrc);
    audio.loop = loop;
    audio.volume = 0; // Start with volume 0 for fade-in effect
    audio.preload = 'auto';

    // Set up event listeners
    const handleCanPlay = () => {
      setIsLoaded(true);
      if (autoPlay) {
        play();
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = (error) => {
      console.error('Audio loading error:', error);
      setIsLoaded(false);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplaythrough', handleCanPlay);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [audioSrc, autoPlay, loop]);

  // Fade effect function
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
        audioRef.current.volume = targetVolume;
        setCurrentVolume(targetVolume);
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        if (onComplete) onComplete();
      } else {
        audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
        setCurrentVolume(audioRef.current.volume);
      }
    }, 50);
  }, []);

  // Play function with fade-in
  const play = useCallback(async () => {
    if (!audioRef.current || !isLoaded) return;

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsPlaying(true);
      
      // Fade in
      fadeVolume(volume, fadeInDuration);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }, [isLoaded, volume, fadeInDuration, fadeVolume]);

  // Stop function with fade-out
  const stop = useCallback(() => {
    if (!audioRef.current || !isPlaying) return;

    // Fade out then pause
    fadeVolume(0, fadeOutDuration, () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    });
  }, [isPlaying, fadeOutDuration, fadeVolume]);

  // Pause function with fade-out
  const pause = useCallback(() => {
    if (!audioRef.current || !isPlaying) return;

    fadeVolume(0, fadeOutDuration, () => {
      audioRef.current.pause();
      setIsPlaying(false);
    });
  }, [isPlaying, fadeOutDuration, fadeVolume]);

  // Resume function with fade-in
  const resume = useCallback(async () => {
    if (!audioRef.current || isPlaying) return;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      fadeVolume(volume, fadeInDuration);
    } catch (error) {
      console.error('Error resuming audio:', error);
    }
  }, [isPlaying, volume, fadeInDuration, fadeVolume]);

  // Set volume function
  const setVolume = useCallback((newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
      setCurrentVolume(newVolume);
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
    currentVolume
  };
};
