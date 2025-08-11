import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GENRE_NAMES, SORT_OPTIONS, DISCOVERY_TYPES } from '@/constants/genres';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => `${theme.colors.background}CC`};
  backdrop-filter: blur(10px);
  padding: ${({ theme }) => `${theme.space.md} ${theme.space.xl}`};
  position: sticky;
  top: 0;
  z-index: 1000; /* Increased z-index to ensure it's above other elements */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.space.md} ${theme.space.md}`};
  }
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


const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.03em;
  position: relative;
  padding: ${({ theme }) => theme.space.xs};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  span {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Nav = styled.nav<{ isOpen?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xl};
  margin: 0 ${({ theme }) => theme.space.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    order: 3;
    width: auto;
    margin: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
    padding-top: ${({ theme }) => theme.space.sm};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space.md};
    max-height: ${({ isOpen }) => (isOpen ? '80vh' : '0')};
    overflow-y: auto;
    overflow-x: hidden;
    opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    padding: ${({ isOpen }) => (isOpen ? '1rem' : '0')};
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.radii.md};
    box-shadow: ${({ isOpen }) => (isOpen ? '0 8px 24px rgba(0, 0, 0, 0.3)' : 'none')};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 200;
    transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-10px)')};
  }
`;

const NavItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    transform: none;

    &:hover {
      transform: none;
    }
  }
`;

const MobileMenuButton = styled.button<{ isOpen: boolean }>`
  display: none;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ isOpen, theme }) => 
    isOpen ? theme.colors.primary : `${theme.colors.surfaceLight}40`};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ isOpen, theme }) => 
    isOpen ? theme.colors.primary : theme.colors.border};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1100; /* Increased z-index to be above the mobile menu */
  box-shadow: ${({ isOpen }) => 
    isOpen ? `0 4px 12px rgba(229, 9, 20, 0.3)` : 'none'};
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: ${({ isOpen, theme }) => 
      isOpen ? theme.colors.primary : theme.colors.surfaceLight};
    color: ${({ theme }) => theme.colors.text};
    transform: scale(1.05);

    &:before {
      opacity: 1;
    }
  }

  &:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    margin-left: auto;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 44px;
    height: 44px;
  }
`;

const FilterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 10px;
  font-weight: 600;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-left: ${({ theme }) => theme.space.xs};
  position: relative;
  top: -1px;
`;

const NavLink = styled.a<{ active?: boolean; hasFilters?: boolean; onClick?: () => void }>`
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ active }) => active ? '600' : '500'};
  transition: ${({ theme }) => theme.transitions.default};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  border-radius: ${({ theme }) => theme.radii.md};
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  letter-spacing: 0.01em;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.fontSizes.sm};

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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    padding: ${({ theme }) => `${theme.space.md} ${theme.space.md}`};
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean; isWide?: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: ${({ isWide }) => (isWide ? '280px' : '220px')};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.space.sm};
  z-index: 200;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -6px;
    left: 20px;
    width: 12px;
    height: 12px;
    background-color: ${({ theme }) => theme.colors.surface};
    border-left: 1px solid ${({ theme }) => theme.colors.border};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    transform: rotate(45deg);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: static;
    width: 100%;
    box-shadow: none;
    border: none;
    border-left: 2px solid ${({ theme }) => theme.colors.primary};
    border-radius: 0;
    margin-left: ${({ theme }) => theme.space.md};
    margin-top: ${({ theme }) => theme.space.xs};
    padding-left: ${({ theme }) => theme.space.md};
    background-color: transparent;
    transform: none;
    max-height: ${({ isOpen }) => (isOpen ? '500px' : '0')};
    opacity: 1;
    visibility: visible;
    transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;

    &:before {
      display: none;
    }
  }
`;

const DropdownItem = styled.a<{ active?: boolean }>`
  display: block;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ active }) => active ? '600' : '500'};
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: all 0.2s ease;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  letter-spacing: 0.01em;
  position: relative;
  background-color: ${({ theme, active }) => active ? `${theme.colors.surfaceLight}80` : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.surfaceLight}`};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateX(4px);
  }

  &:not(:last-child) {
    margin-bottom: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};

    &:hover {
      transform: translateX(0);
    }
  }
`;

const DropdownSection = styled.div`
  margin-bottom: ${({ theme }) => theme.space.md};

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding-bottom: ${({ theme }) => theme.space.sm};
  }
`;

const DropdownSectionTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.xs};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  letter-spacing: 0.05em;
`;

const SortOption = styled.label<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ active }) => active ? '600' : '500'};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: all 0.2s ease;
  background-color: ${({ theme, active }) => active ? `${theme.colors.surfaceLight}80` : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.surfaceLight}`};
    color: ${({ theme }) => theme.colors.primary};
  }

  input {
    margin-right: ${({ theme }) => theme.space.sm};
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterOption = styled.label<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ active }) => active ? '600' : '500'};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: all 0.2s ease;
  background-color: ${({ theme, active }) => active ? `${theme.colors.surfaceLight}80` : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.surfaceLight}`};
    color: ${({ theme }) => theme.colors.primary};
  }

  input {
    margin-right: ${({ theme }) => theme.space.sm};
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ChevronIcon = styled.span<{ isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0)')};
`;

const HamburgerIconContainer = styled.div<{ isOpen: boolean }>`
  width: 24px;
  height: 24px;
  position: relative;
  transform: rotate(0deg);
  transition: transform 0.3s ease-in-out;
  cursor: pointer;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: currentColor;
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: all 0.25s ease-in-out;
    transform-origin: center center;

    &:nth-child(1) {
      top: ${({ isOpen }) => (isOpen ? '10px' : '4px')};
      width: ${({ isOpen }) => (isOpen ? '100%' : '100%')};
      transform: ${({ isOpen }) => (isOpen ? 'rotate(45deg)' : 'rotate(0)')};
    }

    &:nth-child(2) {
      top: 10px;
      width: 100%;
      opacity: ${({ isOpen }) => (isOpen ? '0' : '1')};
      transform: ${({ isOpen }) => (isOpen ? 'translateX(20px)' : 'translateX(0)')};
    }

    &:nth-child(3) {
      top: ${({ isOpen }) => (isOpen ? '10px' : '16px')};
      width: ${({ isOpen }) => (isOpen ? '100%' : '100%')};
      transform: ${({ isOpen }) => (isOpen ? 'rotate(-45deg)' : 'rotate(0)')};
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
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.surface};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}30`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
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
  width: 36px;
  height: 36px;
  border-radius: 50%;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => `${theme.colors.surfaceLight}40`};
  }
`;

// Hamburger icon component with animated bars
const HamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <HamburgerIconContainer isOpen={isOpen}>
      <span></span>
      <span></span>
      <span></span>
    </HamburgerIconContainer>
  );
};

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genresOpen, setGenresOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('popularity.desc');
  const router = useRouter();
  const { pathname, query } = router;
  const { genre, discover, sort } = query;
  const genresRef = useRef<HTMLDivElement>(null);
  const discoverRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Set active sort from URL on component mount
  useEffect(() => {
    if (sort) {
      setActiveSort(sort as string);
    }
  }, [sort]);

  // Helper function to navigate with filters
  const navigateWithFilters = (
    params: { 
      genre?: string | null; 
      discover?: string | null; 
      sort?: string | null;
    }, 
    additionalParams: Record<string, string> = {}
  ) => {
    const newQuery = { ...query };

    // Update or remove parameters
    if (params.genre === null) {
      delete newQuery.genre;
    } else if (params.genre) {
      newQuery.genre = params.genre;
    }

    if (params.discover === null) {
      delete newQuery.discover;
    } else if (params.discover) {
      newQuery.discover = params.discover;
    }

    if (params.sort === null) {
      delete newQuery.sort;
    } else if (params.sort) {
      newQuery.sort = params.sort;
    }

    // Add additional parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
      newQuery[key] = value;
    });

    // Navigate to the home page with the updated query parameters
    router.push({
      pathname: '/',
      query: newQuery
    });
  };

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    setActiveSort(sortValue);
    navigateWithFilters({ sort: sortValue });
  };

  // Handle genre selection
  const handleGenreSelect = (genreSlug: string | null) => {
    navigateWithFilters({ genre: genreSlug });
    setGenresOpen(false);
    setMobileMenuOpen(false); // Close mobile menu when a genre is selected
  };

  // Handle discover selection
  const handleDiscoverSelect = (discoverType: string) => {
    navigateWithFilters({ discover: discoverType });
    setDiscoverOpen(false);
    setMobileMenuOpen(false); // Close mobile menu when a discover option is selected
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false); // Close mobile menu when search is performed
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Get the mobile menu button element
      const mobileMenuButton = document.querySelector('[aria-label="Toggle menu"]');

      // Check if the click was on the mobile menu button
      const isClickOnMenuButton = mobileMenuButton && mobileMenuButton.contains(event.target as Node);

      // Check if the click was on a link or button inside the mobile menu
      const isClickOnNavLink = (event.target as Element)?.closest('a, button') !== null;

      // Only close the mobile menu if the click was not on the menu button or the menu itself
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target as Node) && 
          !isClickOnMenuButton) {
        setMobileMenuOpen(false);
      }

      // If the click was on a nav link, close the mobile menu
      if (isClickOnNavLink && mobileMenuOpen) {
        // Use setTimeout to ensure the navigation happens before closing the menu
        setTimeout(() => setMobileMenuOpen(false), 100);
      }

      // Handle genre dropdown
      if (genresRef.current && !genresRef.current.contains(event.target as Node)) {
        setGenresOpen(false);
      }

      // Handle discover dropdown
      if (discoverRef.current && !discoverRef.current.contains(event.target as Node)) {
        setDiscoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <HeaderContainer>
      <HeaderContent>
        <Link href="/" passHref>
          <Logo>
            Mov<span>IQ</span>
          </Logo>
        </Link>

        <MobileMenuButton 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          isOpen={mobileMenuOpen}
          title={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <HamburgerIcon isOpen={mobileMenuOpen} />
        </MobileMenuButton>

        <div ref={mobileMenuRef}>
          <Nav isOpen={mobileMenuOpen}>
            <NavItem>
              <Link href="/" passHref>
                <NavLink 
                  active={pathname === '/'} 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </NavLink>
              </Link>
            </NavItem>

            <NavItem ref={genresRef}>
              <NavLink 
                as="button" 
                onClick={() => setGenresOpen(!genresOpen)}
                active={pathname.startsWith('/genre') || !!genre}
                hasFilters={!!genre || !!sort}
              >
                Genres
                {(!!genre || !!sort) && <FilterBadge>{genre && sort ? '2' : '1'}</FilterBadge>}
                <ChevronIcon isOpen={genresOpen}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </ChevronIcon>
              </NavLink>
              <DropdownMenu isOpen={genresOpen} isWide>
                <DropdownSection>
                  <DropdownSectionTitle>Genres</DropdownSectionTitle>
                  {Object.entries(GENRE_NAMES).map(([slug, name]) => (
                    <DropdownItem 
                      key={slug}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleGenreSelect(slug);
                      }}
                      active={genre === slug}
                    >
                      {name}
                    </DropdownItem>
                  ))}
                  <DropdownItem 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleGenreSelect(null);
                    }}
                    active={!genre}
                  >
                    All Genres
                  </DropdownItem>
                </DropdownSection>

                <DropdownSection>
                  <DropdownSectionTitle>Sort By</DropdownSectionTitle>
                  {SORT_OPTIONS.map((option) => (
                    <SortOption 
                      key={option.value}
                      active={activeSort === option.value}
                    >
                      <input 
                        type="radio" 
                        name="sort" 
                        value={option.value}
                        checked={activeSort === option.value}
                        onChange={() => {
                          handleSortChange(option.value);
                          setMobileMenuOpen(false); // Close mobile menu when sort option is selected
                        }}
                      />
                      {option.label}
                    </SortOption>
                  ))}
                </DropdownSection>
              </DropdownMenu>
            </NavItem>

            <NavItem ref={discoverRef}>
              <NavLink 
                as="button" 
                onClick={() => setDiscoverOpen(!discoverOpen)}
                active={pathname.startsWith('/discover') || !!discover}
                hasFilters={!!discover || !!query.time_period}
              >
                Discover
                {(!!discover || !!query.time_period) && (
                  <FilterBadge>
                    {discover && query.time_period ? '2' : '1'}
                  </FilterBadge>
                )}
                <ChevronIcon isOpen={discoverOpen}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </ChevronIcon>
              </NavLink>
              <DropdownMenu isOpen={discoverOpen} isWide>
                <DropdownSection>
                  <DropdownSectionTitle>Discover</DropdownSectionTitle>
                  {Object.entries(DISCOVERY_TYPES).map(([slug, name]) => (
                    <DropdownItem 
                      key={slug}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDiscoverSelect(slug);
                      }}
                      active={discover === slug}
                    >
                      {name}
                    </DropdownItem>
                  ))}
                </DropdownSection>

                <DropdownSection>
                  <DropdownSectionTitle>Time Period</DropdownSectionTitle>
                  <FilterOption active={!query.time_period || query.time_period === 'all'}>
                    <input 
                      type="radio" 
                      name="time_period" 
                      value="all"
                      checked={!query.time_period || query.time_period === 'all'}
                      onChange={() => {
                        navigateWithFilters({ 
                          discover: discover as string || 'trending',
                          genre: genre as string || null
                        });
                        setMobileMenuOpen(false); // Close mobile menu when filter option is selected
                      }}
                    />
                    All Time
                  </FilterOption>
                  <FilterOption active={query.time_period === 'today'}>
                    <input 
                      type="radio" 
                      name="time_period" 
                      value="today"
                      checked={query.time_period === 'today'}
                      onChange={() => {
                        navigateWithFilters({ 
                          discover: discover as string || 'trending',
                          genre: genre as string || null,
                          sort: sort as string || activeSort
                        }, { time_period: 'today' });
                        setMobileMenuOpen(false); // Close mobile menu when filter option is selected
                      }}
                    />
                    Today
                  </FilterOption>
                  <FilterOption active={query.time_period === 'this_week'}>
                    <input 
                      type="radio" 
                      name="time_period" 
                      value="this_week"
                      checked={query.time_period === 'this_week'}
                      onChange={() => {
                        navigateWithFilters({ 
                          discover: discover as string || 'trending',
                          genre: genre as string || null,
                          sort: sort as string || activeSort
                        }, { time_period: 'this_week' });
                        setMobileMenuOpen(false); // Close mobile menu when filter option is selected
                      }}
                    />
                    This Week
                  </FilterOption>
                  <FilterOption active={query.time_period === 'this_month'}>
                    <input 
                      type="radio" 
                      name="time_period" 
                      value="this_month"
                      checked={query.time_period === 'this_month'}
                      onChange={() => {
                        navigateWithFilters({ 
                          discover: discover as string || 'trending',
                          genre: genre as string || null,
                          sort: sort as string || activeSort
                        }, { time_period: 'this_month' });
                        setMobileMenuOpen(false); // Close mobile menu when filter option is selected
                      }}
                    />
                    This Month
                  </FilterOption>
                </DropdownSection>
              </DropdownMenu>
            </NavItem>

            <NavItem>
              <Link href="/favorites" passHref>
                <NavLink 
                  active={pathname === '/favorites'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Favorites
                </NavLink>
              </Link>
            </NavItem>
          </Nav>
        </div>

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
