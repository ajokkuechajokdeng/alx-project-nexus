// Genre mappings for TMDB API
// These are the standard genre IDs from TMDB API
export const GENRE_MAPPINGS: { [key: string]: number } = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  'science-fiction': 878,
  'sci-fi': 878, // Alias for science fiction
  'tv-movie': 10770,
  thriller: 53,
  war: 10752,
  western: 37,
};

// Genre names with proper capitalization
export const GENRE_NAMES: { [key: string]: string } = {
  action: 'Action',
  adventure: 'Adventure',
  animation: 'Animation',
  comedy: 'Comedy',
  crime: 'Crime',
  documentary: 'Documentary',
  drama: 'Drama',
  family: 'Family',
  fantasy: 'Fantasy',
  history: 'History',
  horror: 'Horror',
  music: 'Music',
  mystery: 'Mystery',
  romance: 'Romance',
  'science-fiction': 'Science Fiction',
  'sci-fi': 'Sci-Fi',
  'tv-movie': 'TV Movie',
  thriller: 'Thriller',
  war: 'War',
  western: 'Western',
};

// Sort options for movies
export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity (High to Low)' },
  { value: 'popularity.asc', label: 'Popularity (Low to High)' },
  { value: 'vote_average.desc', label: 'Rating (High to Low)' },
  { value: 'vote_average.asc', label: 'Rating (Low to High)' },
  { value: 'release_date.desc', label: 'Release Date (Newest)' },
  { value: 'release_date.asc', label: 'Release Date (Oldest)' },
  { value: 'original_title.asc', label: 'Title (A-Z)' },
  { value: 'original_title.desc', label: 'Title (Z-A)' },
];

// Discovery types
export const DISCOVERY_TYPES: { [key: string]: string } = {
  trending: 'Trending',
  'top-rated': 'Top Rated',
  upcoming: 'Upcoming',
  'now-playing': 'Now Playing',
};
