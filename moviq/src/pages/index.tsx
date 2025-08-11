import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import MovieCard from "@/components/MovieCard";
import { MovieCardSkeleton } from "@/components/SkeletonLoader";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";
import { Movie, MoviesResponse } from "@/types/movie";
import { getRecommendedMovies } from "@/utils/api";
import { useFavorites } from "@/hooks/useFavorites";
import { GENRE_MAPPINGS, GENRE_NAMES, DISCOVERY_TYPES, SORT_OPTIONS } from "@/constants/genres";
import Pagination from "@/components/Pagination";

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
  const router = useRouter();
  const { genre, discover, sort, time_period, page } = router.query;

  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Generate page title based on active filters
  const getPageTitle = () => {
    let title = "Welcome to MovIQ";

    // Add genre if present
    if (genre && genre !== 'all') {
      const genreName = GENRE_NAMES[genre as string] || 'Unknown Genre';
      title = `${genreName} Movies`;
    }

    // Add discover type if present
    if (discover) {
      const discoverName = DISCOVERY_TYPES[discover as string] || '';
      if (discoverName) {
        title = genre ? `${title} - ${discoverName}` : `${discoverName} Movies`;
      }
    }

    // Add time period if present
    if (time_period) {
      let timePeriodText = '';
      if (time_period === 'today') {
        timePeriodText = 'Today';
      } else if (time_period === 'this_week') {
        timePeriodText = 'This Week';
      } else if (time_period === 'this_month') {
        timePeriodText = 'This Month';
      }

      if (timePeriodText) {
        title = `${title} - ${timePeriodText}`;
      }
    }

    // Add sort if present
    if (sort) {
      const sortOption = SORT_OPTIONS.find(option => option.value === sort);
      if (sortOption) {
        title = `${title} (${sortOption.label})`;
      }
    }

    return title;
  };

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

  // Fetch movies based on discover type, sort, and time period
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Build API URL with parameters
        let apiUrl = '';
        const sortParam = sort ? `&sort_by=${sort}` : '';
        let timeWindow = '';
        const pageParam = `&page=${currentPage}`;

        // Set time window based on time_period
        if (time_period === 'today') {
          timeWindow = 'day';
        } else if (time_period === 'this_week') {
          timeWindow = 'week';
        } else {
          timeWindow = 'week'; // Default to week
        }

        // Determine which API endpoint to use based on discover type
        if (discover === "top-rated") {
          apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US${pageParam}${sortParam}`;
        } else if (discover === "upcoming") {
          apiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US${pageParam}${sortParam}`;
        } else if (discover === "now-playing") {
          apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US${pageParam}${sortParam}`;
        } else {
          // Default to trending
          apiUrl = `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US${pageParam}`;
        }

        // Fetch movies
        const res = await fetch(apiUrl);
        const data = await res.json() as MoviesResponse;
        let movies = data.results || [];

        // Update total pages
        setTotalPages(data.total_pages || 1);

        // Apply sorting if not already sorted by API
        if (sort && !apiUrl.includes('sort_by')) {
          const [sortField, sortDirection] = (sort as string).split('.');
          movies = [...movies].sort((a, b) => {
            if (sortField === 'popularity') {
              return sortDirection === 'desc' 
                ? b.popularity - a.popularity 
                : a.popularity - b.popularity;
            } else if (sortField === 'vote_average') {
              return sortDirection === 'desc' 
                ? b.vote_average - a.vote_average 
                : a.vote_average - b.vote_average;
            } else if (sortField === 'release_date') {
              return sortDirection === 'desc' 
                ? new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
                : new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
            } else if (sortField === 'original_title') {
              return sortDirection === 'desc' 
                ? b.title.localeCompare(a.title)
                : a.title.localeCompare(b.title);
            }
            return 0;
          });
        }

        // Filter by genre if needed
        let filtered = movies;
        if (genre && genre !== 'all') {
          // Check if genre is a string ID or a slug
          let genreId: number;
          if (/^\d+$/.test(genre as string)) {
            genreId = Number(genre);
          } else {
            // Convert genre slug to ID using our mappings
            genreId = GENRE_MAPPINGS[genre as string] || 0;
          }

          if (genreId) {
            filtered = movies.filter((movie: Movie) =>
              movie.genre_ids.includes(genreId)
            );
          }
        }

        setTrendingMovies(filtered);

        // Recommended movies (based on first trending movie)
        if (filtered.length > 0) {
          const recommended = await getRecommendedMovies(filtered[0].id);
          setRecommendedMovies(recommended);
        } else {
          setRecommendedMovies([]);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to fetch movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [genre, discover, sort, time_period, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    // Update URL with new page parameter
    const newQuery = { ...router.query, page: page.toString() };
    router.push({
      pathname: '/',
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

  return (
    <>
      <SEO 
        title={getPageTitle()}
        description={`${getPageTitle()} - Find your next favorite film with MovIQ. Browse our collection of movies filtered by your preferences.`}
        url={`/?${new URLSearchParams(router.query as Record<string, string>).toString()}`}
      />

      <PageTransition>
        <PageTitle>{getPageTitle()}</PageTitle>

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
              {trendingMovies.length > 0 ? (
                trendingMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorite={isFavorite(movie.id)}
                  />
                ))
              ) : (
                <LoadingMessage>No movies found for this filter.</LoadingMessage>
              )}
            </MovieGrid>

            {trendingMovies.length > 0 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

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
