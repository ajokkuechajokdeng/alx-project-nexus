import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/movie';
import { searchMovies } from '@/utils/api';
import { useFavorites } from '@/hooks/useFavorites';

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const SearchQuery = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.space.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: ${({ theme }) => theme.space.md};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => theme.colors.error};
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-top: ${({ theme }) => theme.space.xl};
`;

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!q) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const results = await searchMovies(q as string);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching movies:', err);
        setError('Failed to search movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [q]);
  
  const handleFavoriteToggle = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };
  
  if (!q) {
    return (
      <>
        <Head>
          <title>Search Movies | MovIQ</title>
          <meta name="description" content="Search for movies" />
        </Head>
        
        <PageTitle>Search Movies</PageTitle>
        <ErrorMessage>Please enter a search query</ErrorMessage>
      </>
    );
  }
  
  return (
    <>
      <Head>
        <title>Search: {q} | MovIQ</title>
        <meta name="description" content={`Search results for ${q}`} />
      </Head>
      
      <PageTitle>
        Search results for <SearchQuery>{q}</SearchQuery>
      </PageTitle>
      
      {isLoading ? (
        <LoadingMessage>Searching movies...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : searchResults.length === 0 ? (
        <NoResultsMessage>
          <h2>No results found</h2>
          <p>Try searching for a different term.</p>
        </NoResultsMessage>
      ) : (
        <MovieGrid>
          {searchResults.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorite={isFavorite(movie.id)}
            />
          ))}
        </MovieGrid>
      )}
    </>
  );
};

export default SearchPage;