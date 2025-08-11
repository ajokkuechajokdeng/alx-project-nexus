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
  padding: ${({ theme }) => `${theme.space.xl} ${theme.space.xl}`};
  min-height: calc(100vh - 180px); /* Ensure footer stays at bottom */

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.space.lg} ${theme.space.lg}`};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => `${theme.space.md} ${theme.space.md}`};
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: ${({ theme }) => `${theme.space.xl} ${theme.space.xl}`};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background-color: ${({ theme }) => theme.colors.surfaceLight};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.space.xl};
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.5rem' }}>
                  <a href="/about" style={{ color: 'inherit', fontWeight: 500 }}>About</a>
                  <a href="/privacy" style={{ color: 'inherit', fontWeight: 500 }}>Privacy</a>
                  <a href="/terms" style={{ color: 'inherit', fontWeight: 500 }}>Terms</a>
                  <a href="/contact" style={{ color: 'inherit', fontWeight: 500 }}>Contact</a>
                </div>
                <p>© {new Date().getFullYear()} MovIQ. All rights reserved.</p>
                <p>
                  Powered by{' '}
                  <a
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 500 }}
                  >
                    The Movie Database API
                  </a>
                </p>
              </div>
            </Footer>
          </ErrorBoundary>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default Layout;
