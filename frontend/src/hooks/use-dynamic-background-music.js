import { useRef, useEffect, useState, useCallback } from 'react';

export const useDynamicBackgroundMusic = (options = {}) => {
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
  const [currentSource, setCurrentSource] = useState(null);
  const fadeIntervalRef = useRef(null);

  // Initialize audio element
  const initializeAudio = useCallback((audioSrc) => {
    if (!audioSrc) return;

    // If audio exists and is playing, fade out first
    if (audioRef.current && isPlaying) {
      stop();
    }

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

    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.removeEventListener('canplaythrough', handleCanPlay);
      audioRef.current.removeEventListener('ended', handleEnded);
      audioRef.current.removeEventListener('error', handleError);
      audioRef.current.pause();
    }

    audioRef.current = audio;
    setCurrentSource(audioSrc);
    setIsLoaded(false); // Reset loaded state for new audio
  }, [autoPlay, loop]);

  // Fade functions
  const fadeIn = useCallback((targetVolume = currentVolume) => {
    if (!audioRef.current || fadeIntervalRef.current) return;

    const audio = audioRef.current;
    const steps = 20;
    const stepSize = targetVolume / steps;
    const stepDuration = fadeInDuration / steps;
    let currentStep = 0;

    audio.volume = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(stepSize * currentStep, targetVolume);

      if (currentStep >= steps) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        audio.volume = targetVolume;
      }
    }, stepDuration);
  }, [currentVolume, fadeInDuration]);

  const fadeOut = useCallback(() => {
    if (!audioRef.current || fadeIntervalRef.current) return;

    const audio = audioRef.current;
    const steps = 20;
    const stepSize = audio.volume / steps;
    const stepDuration = fadeOutDuration / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(audio.volume - stepSize, 0);

      if (currentStep >= steps || audio.volume <= 0) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        audio.volume = 0;
        audio.pause();
        setIsPlaying(false);
      }
    }, stepDuration);
  }, [fadeOutDuration]);

  // Control functions
  const play = useCallback((audioSrc = null) => {
    if (audioSrc && audioSrc !== currentSource) {
      initializeAudio(audioSrc);
      // Wait for the audio to load, then play
      setTimeout(() => {
        if (audioRef.current && audioRef.current.readyState >= 2) {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
              fadeIn();
            })
            .catch(error => console.error('Audio play error:', error));
        }
      }, 100);
    } else if (audioRef.current && isLoaded) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          fadeIn();
        })
        .catch(error => console.error('Audio play error:', error));
    }
  }, [currentSource, isLoaded, fadeIn, initializeAudio]);

  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      fadeOut();
    }
  }, [isPlaying, fadeOut]);

  const stop = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0;
    }

    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && !isPlaying && audioRef.current.paused) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          fadeIn();
        })
        .catch(error => console.error('Audio resume error:', error));
    }
  }, [isPlaying, fadeIn]);

  const setVolume = useCallback((newVolume) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setCurrentVolume(vol);
    
    if (audioRef.current && isPlaying) {
      audioRef.current.volume = vol;
    }
  }, [isPlaying]);

  // Switch to a different audio source
  const switchAudio = useCallback((newAudioSrc) => {
    if (newAudioSrc !== currentSource) {
      initializeAudio(newAudioSrc);
    }
  }, [currentSource, initializeAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', () => {});
        audioRef.current.removeEventListener('ended', () => {});
        audioRef.current.removeEventListener('error', () => {});
      }
    };
  }, []);

  return {
    isPlaying,
    isLoaded,
    currentVolume,
    currentSource,
    play,
    pause,
    stop,
    resume,
    setVolume,
    switchAudio,
    initializeAudio
  };
};
