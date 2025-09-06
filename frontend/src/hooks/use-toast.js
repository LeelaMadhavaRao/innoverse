import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, type = 'default', duration = 3000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, title, description, type };
    
    setToasts((currentToasts) => [...currentToasts, toast]);

    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast
  };
};
