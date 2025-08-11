import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/movie';
import { searchMovies } from '@/utils/api';
import { useFavorites } from '@/hooks/useFavorites';
import Pagination from '@/components/Pagination';

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
  const { q, page } = router.query;
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Initialize currentPage from URL query parameter
  useEffect(() => {
    if (page) {
      const pageNum = parseInt(page as string, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    } else {
      setCurrentPage(1);
    }
  }, [page]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!q) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await searchMovies(q as string, currentPage);
        setSearchResults(response.results);
        setTotalPages(response.total_pages);
      } catch (err) {
        console.error('Error searching movies:', err);
        setError('Failed to search movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [q, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    // Update URL with new page parameter
    const newQuery = { ...router.query, page: page.toString() };
    router.push({
      pathname: '/search',
      query: newQuery
    }, undefined, { shallow: true });
  };

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
        <>
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

          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );
};

export default SearchPage;
