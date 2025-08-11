import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => `${theme.colors.background}CC`};
  backdrop-filter: blur(10px);
  padding: ${({ theme }) => `${theme.space.md} ${theme.space.xl}`};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.space.md};
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.03em;

  span {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xl};
  margin: 0 ${({ theme }) => theme.space.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    order: 3;
    width: 100%;
    justify-content: center;
    margin: ${({ theme }) => theme.space.sm} 0 0;
    padding-top: ${({ theme }) => theme.space.sm};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.space.lg};
  }
`;

const NavLink = styled.a<{ active?: boolean }>`
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ active }) => active ? '600' : '500'};
  transition: ${({ theme }) => theme.transitions.default};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.md};
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: ${({ active }) => active ? '100%' : '0'};
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    background-color: ${({ theme }) => `${theme.colors.surfaceLight}40`};

    &:after {
      width: 100%;
    }
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    order: 2;
    flex: 1;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.lg}`};
  padding-right: ${({ theme }) => theme.space['2xl']};
  border-radius: ${({ theme }) => theme.radii.full};
  border: 2px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => `${theme.colors.surface}80`};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
    background-color: ${({ theme }) => theme.colors.surface};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.secondary}30`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.space.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { pathname } = router;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Link href="/" passHref>
          <Logo>
            Mov<span>IQ</span>
          </Logo>
        </Link>

        <Nav>
          <Link href="/" passHref>
            <NavLink active={pathname === '/'}>Home</NavLink>
          </Link>
          <Link href="/favorites" passHref>
            <NavLink active={pathname === '/favorites'}>Favorites</NavLink>
          </Link>
        </Nav>

        <form onSubmit={handleSearch}>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type="submit" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </SearchButton>
          </SearchContainer>
        </form>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
