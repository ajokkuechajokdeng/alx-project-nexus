import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  margin?: string;
}

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

const SkeletonBase = styled.div<SkeletonProps>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '20px'};
  border-radius: ${({ borderRadius }) => borderRadius || '4px'};
  margin: ${({ margin }) => margin || '0'};
  background: ${({ theme }) => theme.colors.surface};
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 0px,
    ${({ theme }) => `${theme.colors.border}40`} 40px,
    ${({ theme }) => theme.colors.surface} 80px
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

export const Skeleton: React.FC<SkeletonProps> = (props) => {
  return <SkeletonBase {...props} />;
};

export const MovieCardSkeleton: React.FC = () => {
  return (
    <MovieCardSkeletonContainer>
      <Skeleton height="300px" borderRadius="8px" />
      <Skeleton height="24px" width="80%" margin="16px 0 8px 0" />
      <Skeleton height="16px" width="60%" margin="0 0 8px 0" />
      <Skeleton height="16px" width="40%" />
    </MovieCardSkeletonContainer>
  );
};

const MovieCardSkeletonContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const MovieDetailsSkeleton: React.FC = () => {
  return (
    <MovieDetailsSkeletonContainer>
      <Skeleton height="400px" width="100%" margin="0 0 24px 0" />
      
      <MovieDetailsContentSkeleton>
        <Skeleton height="450px" width="300px" borderRadius="8px" />
        
        <MovieDetailsInfoSkeleton>
          <Skeleton height="40px" width="70%" margin="0 0 16px 0" />
          <Skeleton height="24px" width="50%" margin="0 0 24px 0" />
          
          <Skeleton height="16px" width="30%" margin="0 0 16px 0" />
          
          <Skeleton height="24px" width="100%" margin="0 0 8px 0" />
          <Skeleton height="24px" width="100%" margin="0 0 8px 0" />
          <Skeleton height="24px" width="80%" margin="0 0 24px 0" />
          
          <StatsSkeletonContainer>
            <Skeleton height="60px" width="80px" />
            <Skeleton height="60px" width="80px" />
            <Skeleton height="60px" width="80px" />
          </StatsSkeletonContainer>
          
          <Skeleton height="40px" width="200px" margin="24px 0 0 0" />
        </MovieDetailsInfoSkeleton>
      </MovieDetailsContentSkeleton>
    </MovieDetailsSkeletonContainer>
  );
};

const MovieDetailsSkeletonContainer = styled.div`
  width: 100%;
`;

const MovieDetailsContentSkeleton = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
  }
`;

const MovieDetailsInfoSkeleton = styled.div`
  flex: 1;
`;

const StatsSkeletonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xl};
  margin: ${({ theme }) => theme.space.lg} 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

export default Skeleton;