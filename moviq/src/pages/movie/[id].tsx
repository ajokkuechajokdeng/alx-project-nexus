import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styled from 'styled-components';
import { Movie, MovieDetails } from '@/types/movie';
import { getMovieDetails, getMoviePosterUrl, getMovieBackdropUrl, getRecommendedMovies } from '@/utils/api';
import { useFavorites } from '@/hooks/useFavorites';
import MovieCard from '@/components/MovieCard';
import { MovieCardSkeleton, MovieDetailsSkeleton } from '@/components/SkeletonLoader';
import PageTransition from '@/components/PageTransition';
import SEO from '@/components/SEO';

const BackdropContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: ${({ theme }) => theme.space.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 300px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 200px;
  }
`;

const BackdropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(20, 20, 20, 0.5), ${({ theme }) => theme.colors.background});
  z-index: 1;
`;

const MovieContainer = styled.div`
  position: relative;
  z-index: 2;
  margin-top: -150px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: -100px;
  }
`;

const MovieContent = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xl};
  margin-bottom: ${({ theme }) => theme.space.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const PosterContainer = styled.div`
  position: relative;
  width: 300px;
  height: 450px;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 200px;
    height: 300px;
  }
`;

const MovieInfo = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const Tagline = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.md};
  font-style: italic;
`;

const ReleaseInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm};
  margin-bottom: ${({ theme }) => theme.space.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const Genre = styled.span`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Overview = styled.div`
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const Stats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xl};
  margin-bottom: ${({ theme }) => theme.space.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FavoriteButton = styled.button<{ isFavorite: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  background-color: ${({ theme, isFavorite }) => 
    isFavorite ? theme.colors.primary : 'transparent'};
  color: ${({ theme, isFavorite }) => 
    isFavorite ? theme.colors.text : theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: bold;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme, isFavorite }) => 
      isFavorite ? theme.colors.primary : `${theme.colors.primary}22`};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin-bottom: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.xl};
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

const MovieDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch movie details
        const movieData = await getMovieDetails(Number(id));
        if (!movieData) {
          setError('Movie not found');
          return;
        }

        setMovie(movieData);

        // Fetch recommended movies
        const recommended = await getRecommendedMovies(Number(id));
        setRecommendedMovies(recommended);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to fetch movie details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!movie) return;

    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <>
        <SEO
          title="Loading..."
          description="Loading movie details..."
        />
        <MovieDetailsSkeleton />
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <SEO
          title="Movie Not Found"
          description="Sorry, the movie you're looking for could not be found."
        />
        <ErrorMessage>{error || 'Movie not found'}</ErrorMessage>
      </>
    );
  }

  const movieIsFavorite = isFavorite(movie.id);

  return (
    <>
      <SEO
        title={movie.title}
        description={movie.overview.length > 160 ? `${movie.overview.substring(0, 157)}...` : movie.overview}
        image={getMovieBackdropUrl(movie.backdrop_path)}
        url={`/movie/${movie.id}`}
        type="article"
      />

      <PageTransition>
        <BackdropContainer>
          <Image
            src={getMovieBackdropUrl(movie.backdrop_path)}
            alt={`${movie.title} backdrop`}
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
          <BackdropOverlay />
        </BackdropContainer>

        <MovieContainer>
          <MovieContent>
            <PosterContainer>
              <Image
                src={getMoviePosterUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </PosterContainer>

            <MovieInfo>
              <Title>{movie.title}</Title>
              {movie.tagline && <Tagline>{movie.tagline}</Tagline>}

              <ReleaseInfo>
                <span>{new Date(movie.release_date).getFullYear()}</span>
                {movie.runtime > 0 && <span>•</span>}
                {movie.runtime > 0 && <span>{formatRuntime(movie.runtime)}</span>}
              </ReleaseInfo>

              <GenreList>
                {movie.genres.map((genre) => (
                  <Genre key={genre.id}>{genre.name}</Genre>
                ))}
              </GenreList>

              <Overview>
                <h3>Overview</h3>
                <p>{movie.overview}</p>
              </Overview>

              <Stats>
                <Stat>
                  <StatValue>{movie.vote_average.toFixed(1)}</StatValue>
                  <StatLabel>User Score</StatLabel>
                </Stat>

                <Stat>
                  <StatValue>{movie.vote_count.toLocaleString()}</StatValue>
                  <StatLabel>Votes</StatLabel>
                </Stat>

                {movie.budget > 0 && (
                  <Stat>
                    <StatValue>${(movie.budget / 1000000).toFixed(1)}M</StatValue>
                    <StatLabel>Budget</StatLabel>
                  </Stat>
                )}

                {movie.revenue > 0 && (
                  <Stat>
                    <StatValue>${(movie.revenue / 1000000).toFixed(1)}M</StatValue>
                    <StatLabel>Revenue</StatLabel>
                  </Stat>
                )}
              </Stats>

              <FavoriteButton 
                onClick={handleFavoriteToggle}
                isFavorite={movieIsFavorite}
              >
                {movieIsFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </FavoriteButton>
            </MovieInfo>
          </MovieContent>

          {recommendedMovies.length > 0 && (
            <>
              <SectionTitle>Recommended Movies</SectionTitle>
              <MovieGrid>
                {recommendedMovies.slice(0, 6).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onFavoriteToggle={(movie) => {
                      if (isFavorite(movie.id)) {
                        removeFavorite(movie.id);
                      } else {
                        addFavorite(movie);
                      }
                    }}
                    isFavorite={isFavorite(movie.id)}
                  />
                ))}
              </MovieGrid>
            </>
          )}
        </MovieContainer>
      </PageTransition>
    </>
  );
};

export default MovieDetailPage;
