import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';
import { useToast } from '@/components/Toast';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const { addToast } = useToast();

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        localStorage.removeItem('favorites');
        addToast('Error loading favorites. Please try again.', 'error');
      }
    }
  }, [addToast]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Add a movie to favorites
  const addFavorite = (movie: Movie) => {
    setFavorites((prevFavorites) => {
      // Check if movie is already in favorites
      if (prevFavorites.some((fav) => fav.id === movie.id)) {
        return prevFavorites;
      }

      // Show success toast
      addToast(`"${movie.title}" added to favorites`, 'success');

      return [...prevFavorites, movie];
    });
  };

  // Remove a movie from favorites
  const removeFavorite = (movieId: number) => {
    // Find the movie title before removing it
    const movieToRemove = favorites.find(movie => movie.id === movieId);

    setFavorites((prevFavorites) => 
      prevFavorites.filter((movie) => movie.id !== movieId)
    );

    // Show info toast if movie was found and removed
    if (movieToRemove) {
      addToast(`"${movieToRemove.title}" removed from favorites`, 'info');
    }
  };

  // Check if a movie is in favorites
  const isFavorite = (movieId: number): boolean => {
    return favorites.some((movie) => movie.id === movieId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
};
