import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorContainer = styled.div`
  padding: ${({ theme }) => theme.space.xl};
  margin: ${({ theme }) => theme.space.xl} auto;
  max-width: 800px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const ErrorTitle = styled.h2`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const ErrorMessage = styled.p`
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const ErrorStack = styled.pre`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: auto;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const ReloadButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.lg}`};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: bold;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}DD`};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}55`};
  }
`;

const DefaultErrorFallback = ({ error }: { error: Error | null }) => (
  <ErrorContainer role="alert" aria-live="assertive">
    <ErrorTitle>Something went wrong</ErrorTitle>
    <ErrorMessage>
      We're sorry, but an unexpected error occurred. Our team has been notified.
    </ErrorMessage>
    {error && process.env.NODE_ENV === 'development' && (
      <>
        <ErrorMessage>Error details (visible in development only):</ErrorMessage>
        <ErrorStack>{error.message}</ErrorStack>
        <ErrorStack>{error.stack}</ErrorStack>
      </>
    )}
    <ReloadButton onClick={() => window.location.reload()}>
      Reload Page
    </ReloadButton>
  </ErrorContainer>
);

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Here you could send the error to an error reporting service
    // like Sentry, LogRocket, etc.
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;