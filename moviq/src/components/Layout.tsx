import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';
import { ToastProvider } from './Toast';
import { theme, GlobalStyle } from '@/styles/theme';

interface LayoutProps {
  children: React.ReactNode;
}

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.space.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.space.md};
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ToastProvider>
        <div className="app-container">
          <ErrorBoundary>
            <Header />
            <Main>{children}</Main>
            <Footer>
              <p>© {new Date().getFullYear()} MovIQ. All rights reserved.</p>
              <p>
                Powered by{' '}
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Movie Database API
                </a>
              </p>
            </Footer>
          </ErrorBoundary>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default Layout;
