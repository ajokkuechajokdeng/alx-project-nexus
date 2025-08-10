import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface PageTransitionProps {
  children: React.ReactNode;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div<{ isVisible: boolean }>`
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  animation: ${fadeIn} 0.5s ease-out;
  width: 100%;
`;

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Reset visibility on unmount for next page transition
    return () => {
      setIsVisible(false);
    };
  }, []);

  return <PageContainer isVisible={isVisible}>{children}</PageContainer>;
};

export default PageTransition;