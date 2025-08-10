import axios, { AxiosError, AxiosResponse } from 'axios';
import { Movie, MovieDetails, MoviesResponse } from '@/types/movie';

// Simple in-memory cache
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache: Record<string, CacheItem<any>> = {};
  private readonly maxAge: number; // Cache expiration in milliseconds

  constructor(maxAgeInMinutes = 5) {
    this.maxAge = maxAgeInMinutes * 60 * 1000;
  }

  get<T>(key: string): T | null {
    const item = this.cache[key];
    if (!item) return null;

    // Check if the cache item has expired
    if (Date.now() - item.timestamp > this.maxAge) {
      delete this.cache[key];
      return null;
    }

    return item.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
  }

  clear(): void {
    this.cache = {};
  }
}

// Initialize cache
const apiCache = new ApiCache();

// Custom error class for API errors
export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Utility function to retry API calls
const queryWithRetries = async <T>(
  queryFn: () => Promise<AxiosResponse<T>>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    const response = await queryFn();
    return response.data;
  } catch (error) {
    if (retries <= 0) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        throw new ApiError(
          axiosError.message || 'An error occurred while fetching data',
          axiosError.response?.status
        );
      }
      throw new ApiError('An unexpected error occurred');
    }

    // Wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // Retry with one less retry and increased delay (exponential backoff)
    return queryWithRetries(queryFn, retries - 1, delay * 2);
  }
};

// Use environment variable for API key
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Create an axios instance with common configuration
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
  timeout: 10000, // 10 seconds timeout
});

// Fetch trending movies
export const getTrendingMovies = async (): Promise<Movie[]> => {
  const cacheKey = 'trending-movies';

  // Check cache first
  const cachedData = apiCache.get<Movie[]>(cacheKey);
  if (cachedData) {
    console.log('Using cached trending movies');
    return cachedData;
  }

  try {
    const data = await queryWithRetries<MoviesResponse>(() => 
      api.get<MoviesResponse>('/trending/movie/week')
    );

    // Store in cache
    apiCache.set(cacheKey, data.results);

    return data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    if (error instanceof ApiError) {
      // You could handle specific status codes here
      if (error.status === 429) {
        console.error('Rate limit exceeded. Please try again later.');
      }
    }
    return [];
  }
};

// Fetch movie details
export const getMovieDetails = async (id: number): Promise<MovieDetails | null> => {
  const cacheKey = `movie-details-${id}`;

  // Check cache first
  const cachedData = apiCache.get<MovieDetails>(cacheKey);
  if (cachedData) {
    console.log(`Using cached details for movie ${id}`);
    return cachedData;
  }

  try {
    const data = await queryWithRetries<MovieDetails>(() => 
      api.get<MovieDetails>(`/movie/${id}`)
    );

    // Store in cache
    apiCache.set(cacheKey, data);

    return data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    if (error instanceof ApiError && error.status === 404) {
      console.error(`Movie with ID ${id} not found`);
    }
    return null;
  }
};

// Search for movies
export const searchMovies = async (query: string): Promise<Movie[]> => {
  const cacheKey = `search-${query}`;

  // Check cache first
  const cachedData = apiCache.get<Movie[]>(cacheKey);
  if (cachedData) {
    console.log(`Using cached search results for "${query}"`);
    return cachedData;
  }

  try {
    const data = await queryWithRetries<MoviesResponse>(() => 
      api.get<MoviesResponse>('/search/movie', {
        params: {
          query,
        },
      })
    );

    // Store in cache
    apiCache.set(cacheKey, data.results);

    return data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

// Get recommended movies based on a movie ID
export const getRecommendedMovies = async (id: number): Promise<Movie[]> => {
  const cacheKey = `recommended-movies-${id}`;

  // Check cache first
  const cachedData = apiCache.get<Movie[]>(cacheKey);
  if (cachedData) {
    console.log(`Using cached recommendations for movie ${id}`);
    return cachedData;
  }

  try {
    const data = await queryWithRetries<MoviesResponse>(() => 
      api.get<MoviesResponse>(`/movie/${id}/recommendations`)
    );

    // Store in cache
    apiCache.set(cacheKey, data.results);

    return data.results;
  } catch (error) {
    console.error(`Error fetching recommended movies for ID ${id}:`, error);
    return [];
  }
};

// Get movie poster URL
export const getMoviePosterUrl = (path: string, size: string = 'w500'): string => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Get movie backdrop URL
export const getMovieBackdropUrl = (path: string, size: string = 'original'): string => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
