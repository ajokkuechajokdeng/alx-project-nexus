import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { getMoviePosterUrl } from '@/utils/api';

const FALLBACK_POSTER = '/fallback-poster.png';

interface MovieCardProps {
  movie: Movie;
  onFavoriteToggle?: (movie: Movie) => void;
  isFavorite?: boolean;
}

const Card = styled.div`
  position: relative;
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  border: 1px solid ${({ theme }) => `${theme.colors.border}80`};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.border};
  }

  &:active {
    transform: translateY(-2px);
    transition: ${({ theme }) => theme.transitions.fast};
  }
`;

const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.7) 100%
    );
    opacity: 0.5;
    transition: ${({ theme }) => theme.transitions.default};
  }

  ${Card}:hover &::after {
    opacity: 0.8;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.7) 100%
    );
  }

  img {
    transition: ${({ theme }) => theme.transitions.default};
  }

  ${Card}:hover img {
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  transition: ${({ theme }) => theme.transitions.default};
  border-top: 1px solid ${({ theme }) => `${theme.colors.border}40`};
  background-color: ${({ theme }) => `${theme.colors.surfaceLight}10`};

  ${Card}:hover & {
    background-color: ${({ theme }) => `${theme.colors.surfaceLight}30`};
  }
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.space.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: ${({ theme }) => theme.transitions.default};
  font-weight: 600;
  letter-spacing: -0.01em;

  ${Card}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ReleaseDate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.md};
  transition: ${({ theme }) => theme.transitions.default};
  font-weight: 500;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: ${({ theme }) => theme.transitions.default};
  font-weight: 500;

  ${Card}:hover & {
    color: ${({ theme }) => theme.colors.text};
  }
`;

interface FavoriteButtonProps {
  isFavorite?: boolean;
}

const FavoriteButton = styled.button<FavoriteButtonProps>`
  position: absolute;
  top: ${({ theme }) => theme.space.md};
  right: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.overlay};
  border: 1px solid ${({ theme, isFavorite }) => 
    isFavorite ? theme.colors.primary : 'rgba(255, 255, 255, 0.2)'};
  border-radius: ${({ theme }) => theme.radii.full};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, isFavorite }) => 
    isFavorite ? theme.colors.primary : theme.colors.text};
  z-index: 10;
  transition: ${({ theme }) => theme.transitions.default};
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${({ theme }) => 
      `${theme.colors.background}CC`};
    transform: scale(1.05);
    border-color: ${({ theme, isFavorite }) => 
      isFavorite ? theme.colors.primary : theme.colors.text};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40;
  }
`;

const MovieCard: React.FC<MovieCardProps> = ({ movie, onFavoriteToggle, isFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(movie);
    }
  };

  return (
    <Link href={`/movie/${movie.id}`} passHref>
      <Card>
        <PosterContainer>
          {movie.poster_path ? (
            <Image
              src={getMoviePosterUrl(movie.poster_path)}
              alt={movie.title + ' poster'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{ objectFit: 'cover', background: '#222' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = FALLBACK_POSTER;
              }}
            />
          ) : (
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', color: '#fff', fontSize: '1rem', position: 'absolute', top: 0, left: 0, flexDirection: 'column'}}>
              <img
                src={FALLBACK_POSTER}
                alt="No poster available"
                style={{ width: '48px', height: '48px', marginBottom: '0.5rem', opacity: 0.7 }}
              />
              <span style={{fontWeight: 500}}>No Image</span>
              <span style={{fontSize: '0.8rem', color: '#aaa'}}>TMDB data missing</span>
            </div>
          )}
          {onFavoriteToggle && (
            <FavoriteButton 
              onClick={handleFavoriteClick}
              isFavorite={isFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </FavoriteButton>
          )}
        </PosterContainer>
        <Content>
          <Title>{movie.title}</Title>
          <ReleaseDate>
            {new Date(movie.release_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </ReleaseDate>
          <Rating>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ color: '#FFC107' }}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <span style={{ fontWeight: 600 }}>{movie.vote_average.toFixed(1)}</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>({movie.vote_count.toLocaleString()} votes)</span>
          </Rating>
        </Content>
      </Card>
    </Link>
  );
};

export default MovieCard;
