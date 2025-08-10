import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import styled, { keyframes, css, DefaultTheme } from 'styled-components';

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Toast interface
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Toast context interface
interface ToastContextProps {
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

// Create context
const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Toast animations
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// Styled components
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
`;

interface ToastItemProps {
  type: ToastType;
  exiting: boolean;
}

const getToastColor = (type: ToastType, theme: DefaultTheme) => {
  switch (type) {
    case 'success':
      return theme.colors.success;
    case 'error':
      return theme.colors.error;
    case 'warning':
      return '#F59E0B';
    case 'info':
    default:
      return theme.colors.secondary;
  }
};

const ToastItem = styled.div<ToastItemProps>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-left: 4px solid ${({ type, theme }) => getToastColor(type, theme)};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  animation: ${({ exiting }) =>
    exiting
      ? css`
          ${slideOut} 0.3s ease-out forwards
        `
      : css`
          ${slideIn} 0.3s ease-out
        `};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const ToastIcon = styled.div<{ type: ToastType }>`
  margin-right: ${({ theme }) => theme.space.md};
  color: ${({ type, theme }) => getToastColor(type, theme)};
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

const ToastMessage = styled.div`
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: 0;
  margin-left: ${({ theme }) => theme.space.sm};
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus {
    outline: none;
    color: ${({ theme }) => theme.colors.text};
  }
`;

// Get icon based on toast type
const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
    default:
      return 'ℹ️';
  }
};

// Toast provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<(Toast & { exiting: boolean })[]>([]);

  // Add toast
  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration, exiting: false }]);
  }, []);

  // Start exit animation
  const startExitAnimation = useCallback((id: string) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, exiting: true } : toast
      )
    );

    // Remove toast after animation completes
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 300); // Match animation duration
  }, []);

  // Remove toast
  const removeToast = useCallback((id: string) => {
    startExitAnimation(id);
  }, [startExitAnimation]);

  // Auto-remove toasts after duration
  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toast) => {
      if (toast.exiting) return undefined;

      return setTimeout(() => {
        startExitAnimation(toast.id);
      }, toast.duration);
    });

    return () => {
      timers.forEach((timer) => timer && clearTimeout(timer));
    };
  }, [toasts, startExitAnimation]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer role="alert" aria-live="polite">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} type={toast.type} exiting={toast.exiting}>
            <ToastIcon type={toast.type}>{getToastIcon(toast.type)}</ToastIcon>
            <ToastMessage>{toast.message}</ToastMessage>
            <CloseButton
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              ×
            </CloseButton>
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
