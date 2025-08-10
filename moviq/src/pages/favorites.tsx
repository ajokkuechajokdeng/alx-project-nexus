import Head from 'next/head';
import styled from 'styled-components';
import MovieCard from '@/components/MovieCard';
import { useFavorites } from '@/hooks/useFavorites';
import { Movie } from '@/types/movie';

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.text};
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-top: ${({ theme }) => theme.space.xl};
`;

const FavoritesPage = () => {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleFavoriteToggle = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <>
      <Head>
        <title>My Favorites | MovIQ</title>
        <meta name="description" content="Your favorite movies collection" />
      </Head>

      <PageTitle>My Favorites</PageTitle>

      {favorites.length === 0 ? (
        <EmptyState>
          <h2>No favorites yet</h2>
          <p>Start adding movies to your favorites by clicking the heart icon on movie cards.</p>
        </EmptyState>
      ) : (
        <MovieGrid>
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorite={true}
            />
          ))}
        </MovieGrid>
      )}
    </>
  );
};

export default FavoritesPage;
