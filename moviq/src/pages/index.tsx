import { useState, useEffect } from "react";
import styled from "styled-components";
import MovieCard from "@/components/MovieCard";
import { MovieCardSkeleton } from "@/components/SkeletonLoader";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";
import { Movie } from "@/types/movie";
import { getTrendingMovies, getRecommendedMovies } from "@/utils/api";
import { useFavorites } from "@/hooks/useFavorites";

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  margin-bottom: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.xl};
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

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch trending movies
        const trending = await getTrendingMovies();
        setTrendingMovies(trending);

        // Fetch recommended movies based on the first trending movie
        if (trending.length > 0) {
          const recommended = await getRecommendedMovies(trending[0].id);
          setRecommendedMovies(recommended);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to fetch movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleFavoriteToggle = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <>
      <SEO 
        title="Movie Recommendations"
        description="Discover trending and recommended movies from around the world. Find your next favorite film with MovIQ."
        url="/"
      />

      <PageTransition>
        <PageTitle>Welcome to MovIQ</PageTitle>

        {isLoading ? (
          <>
            <SectionTitle>Trending Movies</SectionTitle>
            <MovieGrid>
              {[...Array(8)].map((_, index) => (
                <MovieCardSkeleton key={`trending-skeleton-${index}`} />
              ))}
            </MovieGrid>

            <SectionTitle>Recommended For You</SectionTitle>
            <MovieGrid>
              {[...Array(8)].map((_, index) => (
                <MovieCardSkeleton key={`recommended-skeleton-${index}`} />
              ))}
            </MovieGrid>
          </>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <>
            <SectionTitle>Trending Movies</SectionTitle>
            <MovieGrid>
              {trendingMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onFavoriteToggle={handleFavoriteToggle}
                  isFavorite={isFavorite(movie.id)}
                />
              ))}
            </MovieGrid>

            {recommendedMovies.length > 0 && (
              <>
                <SectionTitle>Recommended For You</SectionTitle>
                <MovieGrid>
                  {recommendedMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onFavoriteToggle={handleFavoriteToggle}
                      isFavorite={isFavorite(movie.id)}
                    />
                  ))}
                </MovieGrid>
              </>
            )}
          </>
        )}
      </PageTransition>
    </>
  );
}
