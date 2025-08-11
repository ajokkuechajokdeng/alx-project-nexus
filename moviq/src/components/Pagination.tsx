import React from 'react';
import styled from 'styled-components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${({ theme }) => theme.space.xl} 0;
  gap: ${({ theme }) => theme.space.sm};
`;

const PageButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, active }) => 
    active ? theme.colors.text : theme.colors.textSecondary};
  border: 1px solid ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.border};
  font-weight: ${({ active }) => active ? '600' : '500'};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme, active }) => 
      active ? theme.colors.primary : theme.colors.surfaceLight};
    color: ${({ theme }) => theme.colors.text};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-width: 36px;
    height: 36px;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const PageInfo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 ${({ theme }) => theme.space.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const PageDots = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 2px;
  padding: 0 ${({ theme }) => theme.space.xs};
`;

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Calculate which page buttons to show
  const renderPageButtons = () => {
    const buttons = [];
    
    // Always show first page
    buttons.push(
      <PageButton 
        key="page-1" 
        active={currentPage === 1} 
        onClick={() => onPageChange(1)}
      >
        1
      </PageButton>
    );

    // Show dots if there are pages between first and current - 1
    if (currentPage > 3) {
      buttons.push(<PageDots key="dots-1">...</PageDots>);
    }

    // Show current page - 1 if it's not the first page or dots
    if (currentPage > 2) {
      buttons.push(
        <PageButton 
          key={`page-${currentPage - 1}`} 
          onClick={() => onPageChange(currentPage - 1)}
        >
          {currentPage - 1}
        </PageButton>
      );
    }

    // Show current page if it's not the first or last page
    if (currentPage !== 1 && currentPage !== totalPages) {
      buttons.push(
        <PageButton 
          key={`page-${currentPage}`} 
          active={true}
        >
          {currentPage}
        </PageButton>
      );
    }

    // Show current page + 1 if it's not the last page or dots
    if (currentPage < totalPages - 1) {
      buttons.push(
        <PageButton 
          key={`page-${currentPage + 1}`} 
          onClick={() => onPageChange(currentPage + 1)}
        >
          {currentPage + 1}
        </PageButton>
      );
    }

    // Show dots if there are pages between current + 1 and last
    if (currentPage < totalPages - 2) {
      buttons.push(<PageDots key="dots-2">...</PageDots>);
    }

    // Always show last page if it's not the first page
    if (totalPages > 1) {
      buttons.push(
        <PageButton 
          key={`page-${totalPages}`} 
          active={currentPage === totalPages} 
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </PageButton>
      );
    }

    return buttons;
  };

  return (
    <PaginationContainer className={className}>
      <PageButton 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </PageButton>

      {renderPageButtons()}

      <PageButton 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </PageButton>

      <PageInfo>
        Page {currentPage} of {totalPages}
      </PageInfo>
    </PaginationContainer>
  );
};

export default Pagination;